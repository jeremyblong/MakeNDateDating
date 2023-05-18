import React, { Fragment, useRef, useState, useEffect } from "react";
import { Text, Header, Icon } from "@components";
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import styles from "./manageRoundThreeStyles.js";
import { useTheme, BaseColor } from '@config';
import { useNavigation } from "@react-navigation/native";
import {
    OT,
    OTSession,
    OTPublisher,
    OTSubscriber,
    OTSubscriberView,
} from 'opentok-react-native';
import { VONAGE_API_KEY, BASE_URL } from "@env";
import { connect } from "react-redux";
import _ from "lodash";
import Toast from "react-native-toast-message";
import axios from "axios";
import SoundPlayer from 'react-native-sound-player'

const { width, height } = Dimensions.get("window");

const InAppGameVideoCallingHelper = (props) => {

    const authData = props.authData;
    const params = props.route.params.user;
    const fromNotifications =  _.has(props.route.params, "fromNotifications") ? props.route.params.fromNotifications : false;
    const notificationPassed = _.has(props.route.params, "notification") ? props.route.params.notification : false;
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const navigation = useNavigation();

    const [ state, setState ] = useState({
        calling: !fromNotifications ? false : true,
        currentCount: 30,
        streamId: null,
        useIntervalState: false,
        streamProperties: {
            [_.has(notificationPassed, "data") && _.has(notificationPassed.data, "data") && _.has(notificationPassed.data.data, "streamId") ? notificationPassed.data.data.streamId : ""]: {
                subscribeToAudio: true,
                subscribeToVideo: true,
            },
        }
    });

    const onStartPlay = async () => {
        console.log('onStartPlay');

        SoundPlayer.playUrl("https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/calling.wav");
    };
    
    const onStopPlay = async () => {
        console.log('onStopPlay');

        SoundPlayer.stop();
    };

    useEffect( () => () => {
        console.log("unmount");

        setState(prevState => {
            return {
                ...prevState,
                useIntervalState: false
            }
        })
        onStopPlay();
    }, []);

    console.log("state.streamId", state.streamId);

    const publisherProperties = {
        cameraPosition: 'front',
    };

    const sessionEventHandlers = {
        streamCreated: (event) => {
            const streamProperties = {
            ...state.streamProperties,
                [event.streamId]: {
                    subscribeToAudio: true,
                    subscribeToVideo: true,
                }
            };
            setState(prevState => {
                return {
                    ...prevState,
                    streamProperties
                }
            })
            console.log('streamCreated', this.state);
        },
        streamDestroyed: (event) => {
            console.log("destroyed...", event);
        },
        error: (error) => {
            console.log('session error:', error);
        },
        otrnError: (error) => {
            console.log('Session otrnError error:', error);
        },
        sessionDisconnected: () => {
            console.log("disconnected");
        },
    };

    const publisherEventHandlers = {
        streamCreated: event => {
            console.log('Publisher stream created!', event.sessionId);

            if (event.sessionId === authData.vonageTokenSession.sessionId && (!fromNotifications && fromNotifications !== true)) {
                const configuration = {
                    uniqueId: authData.uniqueId,
                    otherUserID: params.uniqueId,
                    accountType: authData.accountType,
                    streamId: event.streamId,
                    sessionId: event.sessionId,
                    token: authData.vonageTokenSession.token
                };
                // notifiy user through backend (fcm push notification)...
                axios.post(`${BASE_URL}/call/other/user/competition/round`, configuration).then((res) => {
                    if (res.data.message === "Successfully started!") {
                        console.log("res.dataaaaaaaa", res.data);
                    } else {
                        console.log("api error", res.data);
                    }
                }).catch((error) => {
                    console.log("error", error);
                });
                
                setState(prevState => {
                    return {
                        ...prevState,
                        streamId: event.streamId,
                        sessionId: event.sessionId
                    }
                })
            }
        },
        streamDestroyed: event => {
            console.log('Publisher stream destroyed!', event);
        }
    };

    const subscriberEventHandlers = {
        error: (error) => {
            console.log(`There was an error with the subscriber: ${error}`);
        },
        audioNetworkStats: event => {
            console.log('audioNetworkStats', event);
            // { timeStamp: 1643203644833, audioPacketsLost: 0, audioPacketsReceived: 64, audioBytesReceived: 5574 }
        },
        videoNetworkStats: event => {
            console.log('videoNetworkStats', event);
            // videoBytesReceived: 706635, videoPacketsLost: 0, timeStamp: 1643203644724, videoPacketsReceived: 656 }
        },
    };

    const renderStartStop = () => {
        if (!fromNotifications) {
            return (
                <Fragment>
                    {state.calling === false ? <Fragment>
                        <TouchableOpacity onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    calling: true,
                                    useIntervalState: true
                                }
                            })
                            onStartPlay();
                        }} style={[styles.controlButton, styles.startCallButton]}>
                            <Text style={{ color: "#fff" }}>Start Call</Text>
                        </TouchableOpacity>
                    </Fragment> : <Fragment>
                        <TouchableOpacity onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    calling: false,
                                    useIntervalState: false
                                }
                            })
                            onStopPlay();
                        }} style={[styles.controlButton, styles.endCallButton]}>
                            <Text style={{ color: "#fff" }}>End Call</Text>
                        </TouchableOpacity>
                    </Fragment>}
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    
                </Fragment>
            );
        }
    }

    return (
        <View style={styles.container}>
            <Header
                title={"Video Interview Chat"}
                subTitle={"Select/Remove User"}
                renderLeft={() => {
                    return (
                        <Icon
                            name="arrow-left"
                            size={20}
                            color={colors.primary}
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}
            />
            <View style={styles.opponentContainer}>
                <OTSession
                    apiKey={VONAGE_API_KEY}
                    sessionId={_.has(notificationPassed, "data") && _.has(notificationPassed.data, "data") && _.has(notificationPassed.data.data, "sessionID") ? notificationPassed.data.data.sessionID : authData.vonageTokenSession.sessionId}
                    token={_.has(notificationPassed, "data") && _.has(notificationPassed.data, "data") && _.has(notificationPassed.data.data, "token") ? notificationPassed.data.data.token : authData.vonageTokenSession.token}
                    eventHandlers={sessionEventHandlers}
                >
                    {state.calling === true ? <Fragment>
                        {fromNotifications === true ? <OTSubscriber
                            style={{ height: height * 0.825, width: width, minWidth: width, minHeight: height * 0.825, zIndex: 5 }}
                            eventHandlers={subscriberEventHandlers}
                            streamProperties={state.streamProperties}
                        >
                        {/* {renderSubscribers} */}
                        </OTSubscriber> : null}
                        {!fromNotifications ? <OTPublisher
                            properties={publisherProperties}
                            eventHandlers={publisherEventHandlers}
                            style={styles.opponentVideo}
                        /> : null}
                    </Fragment> : <Fragment>
                        <Image
                            source={require("../../../../assets/images/gradient-7.jpg")}
                            style={styles.opponentVideo}
                            resizeMode='stretch'
                        />
                    </Fragment>}
                </OTSession>
            </View>
            <View style={styles.currentContainer}>
            {fromNotifications === true && notificationPassed.data.data.streamId ? <OTSubscriberView
                    streamId={notificationPassed.data.data.streamId}
                    style={styles.currentUser}
                    resizeMode='cover'
                /> : null}
            {!fromNotifications && !state.streamId ? null : <OTSubscriberView
                streamId={state.streamId}
                style={styles.currentUser}
                resizeMode='cover'
            />}
            </View>
            {!fromNotifications ? <View style={styles.controlsContainer}>
                <View style={styles.controls}>
                    {!fromNotifications ? <Fragment>
                        <TouchableOpacity style={[styles.controlButton, { backgroundColor: colors.primary }]}>
                            <Text style={{ color: "#fff" }}>Select Candiate!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.controlButton, { backgroundColor: colors.accent }]}>
                            <Text style={{ color: "#fff" }}>Eliminate Canidate</Text>
                        </TouchableOpacity>
                    </Fragment> : null}
                    {renderStartStop()}
                </View>
            </View> : null}
        </View>
    );
};

const mapStateToProps = (state) => {
	return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
	}
}
export default connect(mapStateToProps, { })(InAppGameVideoCallingHelper);