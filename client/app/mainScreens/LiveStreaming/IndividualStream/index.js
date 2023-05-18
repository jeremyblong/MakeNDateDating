import React, { Fragment, Component } from "react";
import { TouchableOpacity, Dimensions, Image, TextInput, FlatList, View, ScrollView } from "react-native";
import { Header, Icon, Text, SafeAreaView } from "@components";
import styles from "./indexStyles.js";
import { withNavigation } from "react-navigation";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL, VONAGE_API_KEY } from "@env";
import _ from "lodash";
import { connect } from "react-redux";
import moment from "moment";
import { OTSession, OTPublisher, OTSubscriber, OTSubscriberView } from 'opentok-react-native';
import uuid from "react-native-uuid";
import io from 'socket.io-client';
import Video from 'react-native-video';
import RBSheet from "react-native-raw-bottom-sheet";

const { width, height } = Dimensions.get("window");

const newSocket = io(BASE_URL);

class ViewIndividualStartLiveStream extends Component {
constructor (props) {
    super(props)

    this.state = {
        setPlayingState: false,
        message: "",
        sessionId: this.props.authData.vonageTokenSession.sessionId,
        token: this.props.authData.vonageTokenSession.token,
        chatlog: [],
        subscriberIds: [], // Array for storing subscribers
        localPublishAudio: true, // Local Audio state
        localPublishVideo: true, // Local Video state
        joinCall: false, // State variable used to start the call
        streamProperties: {}, // Handle individual stream properties,
        mainSubscriberStreamId: null,
        showMessages: true,
        videoURL: null,
        broadcast: null
    };

    this.sheetRef = React.createRef(null);

    this.publisherProperties = {
        publishAudio: true,
        publishVideo: true,
        cameraPosition: 'front'
    }

    this.publisherEventHandlers = {
        streamCreated: event => {
            console.log('Publisher stream created!', event);
        },
        streamDestroyed: event => {
            console.log('Publisher stream destroyed!', event);
        }
    };

    this.subscriberEventHandlers = {
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
      
    this.sessionEventHandlers = {
        streamCreated: (event) => {
            console.log("streamCreated ran....", event);
        //   const streamProperties = {
        //     ...this.state.streamProperties,
        //     [event.streamId]: {
        //       subscribeToAudio: true,
        //       subscribeToVideo: true,
        //     },
        //   };
        //   this.setState({
        //     streamProperties,
        //     subscriberIds: [...this.state.subscriberIds, event.streamId],
        //   });
        },
        streamDestroyed: (event) => {
            console.log("streamDestroyed ran....", event);

        //   const indexToRemove = this.state.subscriberIds.indexOf(event.streamId);
        //   const newSubscriberIds = this.state.subscriberIds;
        //   const streamProperties = { ...this.state.streamProperties };
        //   if (indexToRemove !== -1) {
        //     delete streamProperties[event.streamId];
        //     newSubscriberIds.splice(indexToRemove, 1);
        //     this.setState({ subscriberIds: newSubscriberIds });
        //   }
        }
    }  
}

    componentWillUnmount () {
        if (this.state.broadcast !== null && this.state.broadcast.sessionId === this.props.authData.vonageTokenSession.sessionId) {
            this.stopStream();
        }
    }
    
    async componentDidMount () {

        // if (this.state.broadcast === null || this.state.broadcast.sessionId !== this.props.authData.vonageTokenSession.sessionId) {
        //     console.log("A new broadcast subscriber joined the feed...!");

        //     this.setState({
        //         sessionId: this.state.broadcast.sessionId, 
        //         token: this.props.authData.vonageTokenSession.token
        //     })
        // }

        newSocket.on("newStreamMessage", (data) => {
            console.log("newStreamMessage data", data);

            if ((this.state.broadcast !== null && this.state.broadcast.id === data.broadcastID) || (this.props.authData.vonageTokenSession.sessionId === data.sessionID)) {
                console.log("ran!");

                const copy = [...this.state.chatlog];
                copy.push(data);

                this.setState({
                    chatlog: copy
                })
            }
        })
    }
    renderItem = ({ item, index }) => {
        return (
            <Fragment key={uuid.v4()}>
                <TouchableOpacity
                    style={[styles.contain]}
                    onPress={() => {}}
                    activeOpacity={0.9}>
                    <View style={[styles.contentLeft]}>
                        <Image source={{ uri: `${BASE_ASSET_URL}/${item.profilePic.link}` }} style={[styles.thumb]} />
                        <View>
                            <Text headline whiteColor semibold numberOfLines={1}>
                                {item.from}
                            </Text>
                            <Text footnote whiteColor numberOfLines={1}>
                                {(item.message).slice(0, 50)}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.contentRight]}>
                        <Text caption2 whiteColor numberOfLines={1}>
                            {`${moment(item.date).fromNow(true)}`}
                        </Text>
                    </View>
                </TouchableOpacity>
            </Fragment>
        );
    }

    sendMessage = () => {
        console.log("sendMessage clicked/ran...", this.state.broadcast);

        const { message } = this.state;

        const newDataObj = {
            message,
            from: `${this.props.authData.firstName} ~ @${this.props.authData.username}`,
            fromID: this.props.authData.uniqueId,
            date: new Date(),
            profilePic: this.props.authData.profilePictures[this.props.authData.profilePictures.length - 1],
            sessionID:  _.has(this.props.route.params.streamData, "sessionID") ? this.props.route.params.streamData.sessionID : this.props.authData.vonageTokenSession.sessionId,
            broadcastID: this.state.broadcast !== null ? this.state.broadcast.id : null
        }

        newSocket.emit('newStreamMessage', newDataObj);

        this.setState({
            message: ""
        })
    }

    toggleAudio = () => {
        let publishAudio = this.state.localPublishAudio;
        publisherProperties = { ...publisherProperties, publishAudio: !publishAudio };

        this.setState({ localPublishAudio: !publishAudio });
    };
    
    toggleVideo = () => {
        let publishVideo = state.localPublishVideo;
        publisherProperties = { ...publisherProperties, publishVideo: !publishVideo };

        this.setState({ localPublishVideo: !publishVideo });
    };
    
    joinCall = () => {
        const { joinCall } = this.state;
        if (!joinCall) {
            this.setState({ joinCall: true });
        }
    };
    
    endCall = () => {
        const { joinCall } = this.state;
        if (joinCall) {
            this.setState({ joinCall: !joinCall });
        }
    };
    renderSubscribers = (subscribers) => {
        console.log("subscribers", subscribers);

        // if (this.state.mainSubscriberStreamId) {
        //     subscribers = subscribers.filter(sub => sub !== this.state.mainSubscriberStreamId);
        //     subscribers.unshift(this.state.mainSubscriberStreamId);
        // }
        return typeof subscribers !== "undefined" && subscribers.length > 0 ? (<Text style={styles.bottomSlightlyAbove}>{subscribers.length} people connected/watching</Text>) : (<Text style={styles.bottomSlightlyAbove}>No one connected</Text>)
    };  
    hideShowMessages = () => {
        this.setState({
            showMessages: !this.state.showMessages
        })
    }
    stopStream = () => {
        console.log("stopStream clicked/ran...");

        axios.post(`${BASE_URL}/stop/live/stream/broadcast`, {
            broadcastID: this.state.broadcast.id
        }).then((res) => {
            if (res.data.message === "Successfully stopped!") {
                console.log("res.ddata", res.data);

                this.setState({
                    setPlayingState: false
                })
            } else {
                console.log("api error", res.data);
            }
        }).catch((error) => {
            console.log("error", error);
        })
    }
    handleStart = () => {
        console.log("start....");

        const configuration = {
            sessionID: this.props.authData.vonageTokenSession.sessionId,
            uniqueId: this.props.authData.uniqueId,
            streamTitle: this.props.route.params.streamData.streamTitle
        };

        axios.post(`${BASE_URL}/start/live/stream/broadcast`, configuration).then((res) => {
            if (res.data.message === "Successfully started!") {
                console.log("res.ddata", res.data);

                const { videoLink, broadcast } = res.data;

                this.setState({
                    videoURL: videoLink,
                    broadcast,
                    setPlayingState: true
                })
            } else {
                console.log("api error", res.data);
            }
        }).catch((error) => {
            console.log("error", error);
        })
    }
    renderPlayerOptions = () => {
        if (!_.has(this.props.route.params.streamData, "sessionID")) {
            return (
                <Fragment>
                    {/* <TouchableOpacity onPress={() => {
                        this.sheetRef.current.open();
                    }} style={styles.leftButtonTouchable}>
                        <Image resizeMode="cover" source={require("../../../assets/icons/FinancialBot.png")} style={styles.touchableIconCustom} />
                    </TouchableOpacity> */}
                    {!this.state.setPlayingState ? <TouchableOpacity onPress={() => this.handleStart()} style={styles.centeredMiddleBottom}>
                        <Image source={require("../../../assets/icons/startstream.png")} style={styles.touchableIcon} />
                    </TouchableOpacity> : <TouchableOpacity onPress={() => this.stopStream()} style={styles.centeredMiddleBottom}>
                        <Image source={require("../../../assets/icons/stopstream.png")} style={styles.touchableIconUntinted} />
                    </TouchableOpacity>}
                    {/* <TouchableOpacity onPress={() => this.hideShowMessages()} style={styles.rightButtonTouchable}>
                        <Image source={require("../../../assets/icons/messaging.png")} style={styles.touchableIconUntinted} />
                    </TouchableOpacity> */}
                </Fragment>
            );
        }
    }

    render () {
        return (
            <Fragment>
                <SafeAreaView style={{flex: 1, backgroundColor: "#fff" }} edges={['right', 'left', 'bottom']}>
                    <Header
                        title={`Individual Stream`}
                        subTitle="Start your individual live-stream.."
                        renderLeft={() => {
                            return (
                                <Icon
                                    name="arrow-left"
                                    size={20}
                                    color={"#000"}
                                    enableRTL={true}
                                    style={{ zIndex: 999999999999 }}
                                />
                            );
                        }}
                        onPressLeft={() => {
                            this.props.navigation.goBack();
                        }}
                    />
                    <RBSheet 
                        ref={this.sheetRef}
                        height={height * 0.375}
                        openDuration={250}
                        closeOnDragDown={false}
                        closeOnPressMask={false}
                        customStyles={{
                            draggableIcon: {
                                minWidth: width * 0.625
                            },
                            container: {
                                
                            }
                        }}
                    >
                        <View style={{ margin: 12.25 }}>

                        </View>
                    </RBSheet>
                   <FlatList
                        contentContainerStyle={styles.messagingList}
                        data={this.state.chatlog.slice(-6)}
                        style={{ flexGrow: 1 }}
                        keyExtractor={(item) => item}
                        renderItem={this.renderItem}
                        horizontal={false}
                        showsVerticalScrollIndicator={true}
                    />
                    <OTSession
                        apiKey={VONAGE_API_KEY}
                        streamCreated={() => console.log("streamCreated")}
                        sessionId={this.state.sessionId}
                        token={this.state.token}
                        eventHandlers={this.sessionEventHandlers}
                        style={styles.nodeCameraViewWrapper}>
                        {/* <OTSubscriber 
                            style={styles.nodeCameraView}
                            eventHandlers={this.subscriberEventHandlers}
                            streamProperties={this.state.streamProperties}
                            onSubscribeStart={() => { console.log("onSubscribeStart")}}
                            onSubscribeStop={() => { console.log('onSubscribeStop')}}
                            onSubscribeError={() => { console.log('onSubscribeError')}}
                        /> */}
                        
                        {_.has(this.props.route.params.streamData, "sessionID") ? null : <OTPublisher
                            onPublishStart={() => { console.log('Streaming Started')}}
                            onPublishStop={() => { console.log('Streaming Stopped')}}
                            onPublishError={() => { console.log('Streaming Error')}}
                            properties={this.publisherProperties}
                            eventHandlers={this.publisherEventHandlers}
                            style={styles.nodeCameraView}
                        />}
                        {_.has(this.props.route.params.streamData, "broadcastURL") ? <Video 
                            source={{ uri: this.props.route.params.streamData.broadcastURL }}
                            paused={false}
                            onLoadStart={() => console.log("on load started!")}
                            resizeMode={"cover"}
                            onReadyForDisplay={() => console.log("ready to display")}
                            onBuffer={() => console.log("buffering...")}
                            onError={(err) => console.log("load err...:", err)}
                            style={styles.nodeCameraView} 
                        /> : null}
                    </OTSession>
                    <View style={styles.typingSec}>
                        <TextInput
                            onChangeText={text => this.setState({
                                message: text
                            })}
                            placeholderTextColor={"#000"}
                            secureTextEntry={false}
                            placeholder="Enter your message to the chat..."
                            value={this.state.message}
                            style={styles.messageTyper}
                        />
                        <TouchableOpacity hitSlop={17.25} onPress={() => this.sendMessage()} style={styles.touchableIconUntintedSmaller} >
                            <Image source={require("../../../assets/icons/email.png")} style={styles.touchableIconUntintedSmaller} />
                        </TouchableOpacity>
                    </View>
                    {this.renderPlayerOptions()}
                </SafeAreaView>
            </Fragment>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
  
export default connect(mapStateToProps, {  })(withNavigation(ViewIndividualStartLiveStream));