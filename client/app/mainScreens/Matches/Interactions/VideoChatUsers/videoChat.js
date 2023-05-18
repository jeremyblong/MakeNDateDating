import React, { Component } from "react";
import {Header, SafeAreaView, Text, Button } from '@components';
import styles from './videoChatStyles.js';
import { VONAGE_API_KEY, BASE_URL } from "@env";
import { connect } from "react-redux";
import _ from "lodash";
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import axios from "axios";
import Toast from "react-native-toast-message";
import {
  Image,
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  PermissionsAndroid
} from 'react-native';
import {
  OT,
  OTSession,
  OTPublisher,
  OTSubscriber,
  OTSubscriberView,
} from 'opentok-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigation } from "react-navigation";

const { width, height } = Dimensions.get("window");

const mainSubscribersResolution = { width: 1280, height: 720 };
const secondarySubscribersResolution = { width: 352, height: 288 };

class ViewIndividualStartLiveStreamChatBetweenUsers extends Component {
  constructor(props) {
    super(props);

    this.apiKey = VONAGE_API_KEY;
    this.sessionId =  this.props.route.params.data.redirectedNotifications === true ? this.props.route.params.data.sessionID : this.props.authData.vonageTokenSession.sessionId;
    this.token = this.props.route.params.data.redirectedNotifications === true ? this.props.route.params.data.token : this.props.authData.vonageTokenSession.token;
    this.state = {
        subscriberIds: [], // Array for storing subscribers
        localPublishAudio: true, // Local Audio state
        localPublishVideo: true, // Local Video state
        joinCall: false, // State variable for storing success
        streamProperties: {}, // Handle individual stream properties,
        mainSubscriberStreamId: null,
        broadcast: null,
        videoURL: null,
        setPlayingState: null,
        streamID: this.props.route.params.data.redirectedNotifications === true ? this.props.route.params.data.generatedStreamID : null,
        intervalID: null,
        currentCount: 30
    };

        this.sessionEventHandlers = {
            streamCreated: (event) => {
                const streamProperties = {
                    ...this.state.streamProperties,
                    [event.streamId]: {
                        subscribeToAudio: true,
                        subscribeToVideo: true,
                    },
                };
                this.setState({
                    streamProperties,
                    subscriberIds: [...this.state.subscriberIds, event.streamId],
                });
                console.log('streamCreated', this.state);
            },
            streamDestroyed: (event) => {
                const indexToRemove = this.state.subscriberIds.indexOf(event.streamId);
                const newSubscriberIds = this.state.subscriberIds;
                const streamProperties = {...this.state.streamProperties};
                if (indexToRemove !== -1) {
                    delete streamProperties[event.streamId];
                    newSubscriberIds.splice(indexToRemove, 1);
                    this.setState({subscriberIds: newSubscriberIds});
                }
            },
            error: (error) => {
                console.log('session error:', error);
            },
            otrnError: (error) => {
                console.log('Session otrnError error:', error);
            },
            sessionDisconnected: () => {
                this.setState({
                    streamProperties: {},
                    subscriberIds: [],
                });
            },
        };

        this.publisherEventHandlers = {
            streamCreated: (event) => {
                console.log('Publisher stream created!', event);

                if (event.sessionId === this.props.authData.vonageTokenSession.sessionId) {
                    this.handleStart(event.sessionId, event.streamId);
                }
            },
            streamDestroyed: (event) => {
                console.log('Publisher stream destroyed!', event);
            },
            audioLevel: (event) => {
                /* console.log('AudioLevel', typeof event); */
            },
        };

        this.subscriberEventHandlers = {
            connected: () => {
                console.log('[subscriberEventHandlers - connected]');
            },
            disconnected: () => {
                console.log('[subscriberEventHandlers - disconnected]');
            },
            error: (error) => {
                console.log('subscriberEventHandlers error:', error);
            },
        };

        this.publisherProperties = {
            cameraPosition: 'front',
        };
    }

    toggleAudio = () => {
        let publishAudio = this.state.localPublishAudio;
        this.publisherProperties = {
        ...this.publisherProperties,
            publishAudio: !publishAudio,
        };
        this.setState({
            localPublishAudio: !publishAudio,
        });
    };

    toggleVideo = () => {
        let publishVideo = this.state.localPublishVideo;
        this.publisherProperties = {
        ...this.publisherProperties,
        publishVideo: !publishVideo,
        };
        this.setState({
        localPublishVideo: !publishVideo,
        });
        console.log('Video toggle', this.publisherProperties);
    };

    joinCall = () => {
        const {joinCall} = this.state;
        if (!joinCall) {
            this.setState({
                joinCall: true
            })
        }
    };

    endCall = () => {
        const {joinCall} = this.state;
        if (joinCall) {
        this.setState({joinCall: !joinCall});
        }
    };

    timer = () => {
        // setState method is used to update the state
        const configuration = {
            uniqueId: this.props.authData.uniqueId,
            otherUserID: this.props.route.params.data.otherUserID,
            accountType: this.props.authData.accountType
        };

        if (this.state.currentCount <= 0) {
            clearInterval(this.state.intervalID);
        } else {
            this.setState({ currentCount: this.state.currentCount - 3 }, () => {
                // notifiy user through backend (fcm push notification)...
                axios.post(`${BASE_URL}/notify/only/other/user/calling`, configuration).then((res) => {
                    if (res.data.message === "Successfully notified of calling!") {
                        console.log("res.ddata", res.data);
        
                        Toast.show({
                            type: 'info',
                            text1: `Successfully notifying user of your video session!`,
                            text2: `We're notifying the user of your video call - please wait for them to join.`,
                            visibilityTime: 2375,
                            position: "bottom"
                        });
                    } else {
                        console.log("api error", res.data);
                    }
                }).catch((error) => {
                    console.log("error", error);
                })
            });
        }
    };

    handleSubscriberSelection = (subscribers, streamId) => {
        console.log('handleSubscriberSelection', streamId);
        let subscriberToSwap = subscribers.indexOf(streamId);
        let currentSubscribers = subscribers;
        let temp = currentSubscribers[subscriberToSwap];
        currentSubscribers[subscriberToSwap] = currentSubscribers[0];
        currentSubscribers[0] = temp;
        this.setState((prevState) => {
        const newStreamProps = {...prevState.streamProperties};
        for (let i = 0; i < currentSubscribers.length; i += 1) {
            if (i === 0) {
            newStreamProps[currentSubscribers[i]] = {
                ...prevState.streamProperties[currentSubscribers[i]],
            };
            newStreamProps[
                currentSubscribers[i]
            ].preferredResolution = mainSubscribersResolution;
            } else {
            newStreamProps[currentSubscribers[i]] = {
                ...prevState.streamProperties[currentSubscribers[i]],
            };
            newStreamProps[
                currentSubscribers[i]
            ].preferredResolution = secondarySubscribersResolution;
            }
        }
        console.log('mainSubscriberStreamId', streamId);
        console.log('streamProperties#2', newStreamProps);
        return {
            mainSubscriberStreamId: streamId,
            streamProperties: newStreamProps,
        };
        });
    };

    handleScrollEnd = (event, subscribers) => {
        console.log('handleScrollEnd', event.nativeEvent); // event.nativeEvent.contentOffset.x
        console.log('handleScrollEnd - events', event.target); // event.nativeEvent.contentOffset.x
        let firstVisibleIndex;
        if (
        event &&
        event.nativeEvent &&
        !isNaN(event.nativeEvent.contentOffset.x)
        ) {
        firstVisibleIndex = parseInt(
            event.nativeEvent.contentOffset.x / (width / 2),
            10,
        );
        console.log('firstVisibleIndex', firstVisibleIndex);
        }
        this.setState((prevState) => {
        const newStreamProps = {...prevState.streamProperties};
        if (firstVisibleIndex !== undefined && !isNaN(firstVisibleIndex)) {
            for (let i = 0; i < subscribers.length; i += 1) {
            if (i === firstVisibleIndex || i === firstVisibleIndex + 1) {
                newStreamProps[subscribers[i]] = {
                ...prevState.streamProperties[subscribers[i]],
                };
                newStreamProps[subscribers[i]].subscribeToVideo = true;
            } else {
                newStreamProps[subscribers[i]] = {
                ...prevState.streamProperties[subscribers[i]],
                };
                newStreamProps[subscribers[i]].subscribeToVideo = false;
            }
            }
        }
        return {streamProperties: newStreamProps};
        });
    };

    componentDidMount () { // 

        if (typeof this.state.subscriberIds !== "undefined" && this.state.subscriberIds.length > 0 && this.state.intervalID !== null) {

            clearInterval(this.state.intervalID);

            if (Platform.OS === "android") {
                const requestCameraPermission = async () => {
                    try {
                    await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
                        {
                          title: "We need to access these permissions to stream your live-content.",
                          message:
                            "Our app needs permission so we can live-stream " +
                            "your content to other users! You MUST accept this to continue...",
                          buttonNeutral: "Ask Me Later",
                          buttonNegative: "Cancel",
                          buttonPositive: "OK"
                        }
                    ).then((passed) => {
                        if (passed["android.permission.CAMERA"] !== "granted" || passed["android.permission.RECORD_AUDIO"] !== "granted") {
                            this.props.navigation.goBack();
                        } 
                    });
                    } catch (err) {
                      console.warn(err);
        
                      this.props.navigation.goBack();
                    }
                }
                requestCameraPermission();
            } else {
                requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]).then((statuses) => {
                    console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
                    console.log('FaceID', statuses[PERMISSIONS.IOS.MICROPHONE]);
                });
            }
        } else {
            if (Platform.OS === "android") {
                const requestCameraPermission = async () => {
                    try {
                    await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
                        {
                          title: "We need to access these permissions to stream your live-content.",
                          message:
                            "Our app needs permission so we can live-stream " +
                            "your content to other users! You MUST accept this to continue...",
                          buttonNeutral: "Ask Me Later",
                          buttonNegative: "Cancel",
                          buttonPositive: "OK"
                        }
                    ).then((passed) => {
                        if (passed["android.permission.CAMERA"] !== "granted" || passed["android.permission.RECORD_AUDIO"] !== "granted") {
                            this.props.navigation.goBack();
                        } 
                    });
                    } catch (err) {
                      console.warn(err);
        
                      this.props.navigation.goBack();
                    }
                }
                requestCameraPermission();
            } else {
                requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]).then((statuses) => {
                    console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
                    console.log('FaceID', statuses[PERMISSIONS.IOS.MICROPHONE]);
                });
            }
        }
    }

    componentWillUnmount () {

        clearInterval(this.state.intervalID);

        if (this.state.broadcast !== null && this.state.broadcast.sessionId === this.props.authData.vonageTokenSession.sessionId) {
            this.stopStream();
        }
    }

    handleStart = (sessionId, streamId) => {
        console.log("start....", this.props.authData.vonageTokenSession.token);

        const configuration = {
            sessionID: this.props.authData.vonageTokenSession.sessionId,
            uniqueId: this.props.authData.uniqueId,
            otherUserID: this.props.route.params.data.otherUserID,
            sessionId, 
            streamId,
            token: this.props.authData.vonageTokenSession.token
        };

        axios.post(`${BASE_URL}/start/live/stream/broadcast/send/notification/alert/personal/match/stream`, configuration).then((res) => {
            if (res.data.message === "Successfully started!") {
                console.log("res.ddata", res.data);
                // const { videoLink, broadcast, generatedStreamID } = res.data;
                const intervalID = setInterval(this.timer, 3000);
                // store intervalId in the state so it can be accessed later:
                this.setState({ intervalID });

                Toast.show({
                    type: 'success',
                    text1: `Successfully notifying user of your video session!`,
                    text2: `We're notifying the user of your video call - please wait for them to join.`,
                    visibilityTime: 2375,
                    position: "bottom"
                });

            } else {
                console.log("api error", res.data);
            }
        }).catch((error) => {
            console.log("error", error);
        })
    }

  renderSubscribers = (subscribers) => {
    console.log('renderSubscribers', subscribers);
    console.log('this.state.subscriberIds', this.state.subscriberIds);
    console.log(
      'this.state.mainSubscriberStreamId',
      this.state.mainSubscriberStreamId,
    );
    if (this.state.mainSubscriberStreamId) {
      subscribers = subscribers.filter(
        (sub) => sub !== this.state.mainSubscriberStreamId,
      );
      subscribers.unshift(this.state.mainSubscriberStreamId);
    }
    console.log('renderSubscribers - sorted', subscribers);
    return subscribers.length > 1 ? (
      <>
        <View style={styles.mainSubscriberStyle}>
          <TouchableOpacity
            onPress={() =>
              this.handleSubscriberSelection(subscribers, subscribers[0])
            }
            key={subscribers[0]}>
            <OTSubscriberView
              streamId={subscribers[0]}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.secondarySubscribers}>
          <ScrollView
            horizontal={true}
            decelerationRate={0}
            snapToInterval={width / 2}
            snapToAlignment={'center'}
            onScrollEndDrag={(e) =>
              this.handleScrollEnd(e, subscribers.slice(1))
            }
            style={{
              width: width,
              height: height / 4,
            }}>
            {subscribers.slice(1).map((streamId) => (
              <TouchableOpacity
                onPress={() =>
                  this.handleSubscriberSelection(subscribers, streamId)
                }
                style={{
                  width: width / 2,
                  height: height / 4,
                }}
                key={streamId}>
                <OTSubscriberView
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  key={streamId}
                  streamId={streamId}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </>
    ) : subscribers.length > 0 ? (
      <TouchableOpacity style={styles.fullView}>
        <OTSubscriberView
          streamId={subscribers[0]}
          key={subscribers[0]}
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>
    ) : (
      <View style={styles.centered}>
        <Text style={{ textAlign: "center", fontSize: 35.25, fontWeight: "400", textDecorationLine: "underline", color: '#D81159', marginTop: height * 0.425 }}>No one is connected</Text>
      </View>
    );
  };
  

  videoView = () => {
    return (
      <>
        <View style={styles.fullView}>
          <OTSession
            apiKey={this.apiKey}
            sessionId={this.sessionId}
            token={this.props.route.params.data.redirectedNotifications === true ? this.props.route.params.data.token : this.props.authData.vonageTokenSession.token}
            eventHandlers={this.sessionEventHandlers}>
            <OTSubscriber
              style={{height: height, width: width, zIndex: 5, }}
              eventHandlers={this.subscriberEventHandlers}
              streamProperties={this.state.streamProperties}>
              {this.renderSubscribers}
            </OTSubscriber>
            <OTPublisher
              properties={this.publisherProperties}
              eventHandlers={this.publisherEventHandlers}
              style={styles.publisherStyle}
            />
          </OTSession>
          <View style={styles.buttonView}>
            <Icon.Button
                style={styles.iconStyle}
                backgroundColor="#131415"
                name={this.state.localPublishAudio ? 'mic' : 'mic-off'}
                onPress={this.toggleAudio}
            />
            <Icon.Button
                style={styles.iconStyle}
                backgroundColor="#131415"
                name="call-end"
                onPress={this.endCall}
            />
            <Icon.Button
                style={styles.iconStyle}
                backgroundColor="#131415"
                name={this.state.localPublishVideo ? 'videocam' : 'videocam-off'}
                onPress={this.toggleVideo}
            />
            </View>
        </View>
      </>
    );
  };

  joinVideoCall = () => {
    return (
      <SafeAreaView style={styles.fullView}>
        <Header
            title="Start Video Conference"
            renderLeft={() => {
                return (
                    <Icon
                        name="arrow-left"
                        size={25}
                        color={"lightblue"}
                        enableRTL={true}
                    />
                );
            }}
            onPressLeft={() => {
                this.props.navigation.goBack();
            }}
        />
        <Text style={styles.headerText}>You're about to start a video conference with this user - this will send a notification to them to alert them that you're calling...</Text>
        <View style={styles.hr} />
        <Text style={styles.subbedText}>This will notify the user, just give them some time while we notify/call them alerting them of your phone call so please be patient while they work on joining the meeting. We suggest calling/waiting for about 30 seconds before hanging up if no answer.</Text>
        <View style={styles.centered}>
            <Image source={require("../../../../assets/images/play.png")} style={styles.playimage} />
        </View>
        <View style={styles.hr} />
            <View style={{ margin: 12.25 }}>
                <Button full outline onPress={this.joinCall}>
                    {"Initialize/Join Call"}
                </Button>
            </View>
        <View style={styles.hr} />
      </SafeAreaView>
    );
  };

  render() {
    return this.props.route.params.data.redirectedNotifications === true ? this.videoView() : this.state.joinCall ? this.videoView() : this.joinVideoCall();
  }
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, { })(withNavigation(ViewIndividualStartLiveStreamChatBetweenUsers));