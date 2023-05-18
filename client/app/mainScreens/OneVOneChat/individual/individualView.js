import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Text, Header, Icon, SafeAreaView, Button } from "@components";
import { useNavigation } from "@react-navigation/native";
import { useTheme} from '@config';
import { useColorScheme, View, FlatList, Image, TouchableOpacity, Platform } from "react-native";
import styles from "./individualViewStyles.js";
import { connect } from "react-redux";
import _ from "lodash";
import axios from "axios";
import { BASE_URL } from "@env";
import { GiftedChat, Composer, Bubble } from 'react-native-gifted-chat';
import { Button as ThemedButton } from "@rneui/themed";
import io from 'socket.io-client';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import ActionSheet from 'react-native-actionsheet';
import Spinner from 'react-native-loading-spinner-overlay';

const newSocket = io(BASE_URL);

const OneVOneChatRandomizedIndividualView = (props) => {

    const authData = props.authData;
    const passedParams = props.route.params.data;
    const { colors, theme } = useTheme();
    const messageSpecificRef = useRef(null);
    const colorSchemeDark = theme.dark;
    const navigation = useNavigation();
    const [ state, setState ] = useState({
        messages: [],
        message: "",
        isTyping: false,
        chatStreamID: uuid.v4(),
        loading: false,
        recieverID: "",
        senderID: ""
    })

    const isCurrentlyTyping = (value) => {
        console.log("currently typing...!");
    }

    const fetchNewUser = () => {
        console.log("fetchNewUser clicked/ran...");

        setState(prevState => {
            return {
                ...prevState,
                loading: true
            }
        })

        const configuration = {
            params: {
                data: passedParams
            }
        };

        axios.get(`${BASE_URL}/gather/new/random/user`, configuration).then((res) => {
            if (res.data.message === "Successfully gathered user!") {
                console.log("Successfully gathered user!", res.data);
    
                const { user } = res.data;

                const joined = {
                    ...user[0],
                    chatStreamID: state.chatStreamID,
                    senderID: authData.uniqueId
                }
                

                newSocket.emit('fetchAndJoinUserBoth', joined);

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        chatStarted: true,
                        recieverID: user[0].uniqueId
                    }
                })
    
            } else {
                console.log("Err", res.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while attempting to fetch user details!`,
                    text2: "We encountered an error while attempting to fetch this specific user's account details...",
                    visibilityTime: 2375,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);

            setState(prevState => {
                return {
                    ...prevState,
                    loading: false
                }
            })

            Toast.show({
                type: 'error',
                text1: `An error occurred while attempting to fetch user details!`,
                text2: "We encountered an error while attempting to fetch this specific user's account details...",
                visibilityTime: 2375,
                position: "bottom"
            });
        });
    }

    useEffect(() => {
        
        newSocket.on("newChatRandomMessage", (data) => {
            console.log("newChatRandomMessage data", data, state.messages.some(iteration => iteration.id === data.id) === false);
            //  data.reciever === authData.uniqueId || authData.uniqueId === data.sender
            if (state.messages.some(iteration => iteration.id === data.id) === false) {
                console.log("ran!");

                const newData =  {
                    _id: data.id,
                    text: data.message,
                    createdAt: new Date(),
                    user: {
                      _id: data.sender,
                      name: data.nameUsername,
                      avatar: `https://ui-avatars.com/api/?name=${data.firstName}`
                    },
                };

                setState(prevState => {
                    return {
                        ...prevState,
                        messages: [...prevState.messages, newData]
                    }
                })
            }
        })

        newSocket.on("randomChatEndedSession", (data) => {
            console.log("randomChatEndedSession data ----- !", data);

            if (data.userID === authData.uniqueId) {
                console.log("redirect on randomChatEndedSession....");

                navigation.navigate("OneVOneChatRandom");

                Toast.show({
                    type: 'info',
                    text1: "User left the chat!",
                    text2: `User has left the chat! You we're ejected from the conversation.`,
                    visibilityTime: 2375,
                    position: "bottom"
                });
            }
        });

        newSocket.on("fetchAndJoinUserBoth", (data) => {
            console.log("fetchAndJoinUserBoth data ----- !", data);

            if (data.uniqueId === authData.uniqueId) {
                console.log("this ran......::::");
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        chatStarted: true,
                        recieverID: data.uniqueId,
                        chatStreamID: data.chatStreamID,
                        senderID: data.senderID
                    }
                })
            }
        });
    }, []);

    const handleMessageSend = (value) => {
        console.log("handleMessageSend clicked/ran...");
        
        const { message, chatStreamID } = state;

        if (typeof message !== "undefined" && message.length > 0) {

            const newDataObj = {
                sender: authData.uniqueId,
                message,
                chatStreamID,
                firstName: authData.firstName,
                nameUsername: `${authData.firstName} ~ @${authData.username}`,
                reciever: state.recieverID,
                id: uuid.v4()
            }

            newSocket.emit('newChatRandomMessage', newDataObj);

            setState(prevState => {
                return {
                    ...prevState,
                    message: ""
                }
            })
        } else {
            Toast.show({
                type: 'info',
                text1: `Enter some text before attempting to send...`,
                visibilityTime: 2375,
                position: "bottom"
            });
        }
    }

    const renderComposer = props => {
        // const { conversation } = route.params;
        // const userID = conversation.conversationWith.uid;
        return (
            <View style={Platform.OS === "ios" ? { flexDirection: 'row', paddingBottom: 30 } : { flexDirection: 'row' }}>
                <Composer {...props} textInputProps={{
                    onChangeText: (text) => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                message: text
                            }
                        })
                    }
                }} />
                <ThemedButton onPress={() => {
                    handleMessageSend(state.message);
                }} type="clear" title={"Send!"}></ThemedButton>
            </View>
        );
    };

    const renderFooter = () => {
        if (state.isTyping === true && typeof state.messages !== "undefined" && state.messages.length > 0) {
        return (
            <View style={styles.footerContainer}>
                <View style={styles.rightTyping}>
                    <Image source={require("../../../assets/icons/typing.png")} style={{ minWidth: 40, minHeight: 40, maxWidth: 40, maxHeight: 40 }} />
                </View>
            </View>
        );
        } else {
            return null;
        }
    }

    const renderBubble = props => (
        <Bubble
            onPress={(data) => {
                console.log("clicked", props.currentMessage);

                setPressEventState(props.currentMessage);

                messageSpecificRef.current.show();
            }}
            {...props}
            wrapperStyle={{
                left: {
                    backgroundColor: "#000",
                },
                right: {
                    backgroundColor: colorSchemeDark ? colors.primary : colors.primary,
                },
            }}
            textProps={{
                style: {
                    color: colorSchemeDark ? props.position === 'left' ? '#fff' : '#fff' : props.position === 'left' ? '#fff' : '#fff'
                },
            }}
            textStyle={{
                left: {
                    color: '#fff',
                },
                right: {
                    color: '#000',
                },
            }}
        /> 
    )

    const renderPrior = () => {
        return (
            <Fragment>
                <View style={styles.centered}>
                    <Text style={styles.informationalText}>You may receive an error if there are no other user's in the chat queue. This is expected if there are no other user's waiting in queue - please try back at a later time when its possibly busier...</Text>
                    <Image source={require("../../../assets/images/initialize-chat.jpg")} style={styles.loaderImage} />
                </View>
                <TouchableOpacity onPress={() => fetchNewUser()} style={styles.renderPriorButton}>
                    <Text style={styles.initiateText}>Initiate/Start Chat!</Text>
                </TouchableOpacity>
            </Fragment>
        );
    }

    const reportThisUser = () => {
        console.log("reportThisUser clicked/ran...");
    }

    const fetchUserAndRedirect = () => {
        console.log("fetchUserAndRedirect clicked/ran...");

        const configuration = {
            params: {
                postedByID: authData.uniqueId === state.recieverID ? state.senderID : state.recieverID
            }
        };

        axios.get(`${BASE_URL}/gather/one/user/restricted/data`, configuration).then((res) => {
            if (res.data.message === "Submitted gathered user's info!") {
                console.log("Submitted gathered user's info!", res.data);
    
                const { user } = res.data;
    
                navigation.navigate('Profile1', { user });
            } else {
                console.log("Err", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while attempting to fetch user details!`,
                    text2: "We encountered an error while attempting to fetch this specific user's account details...",
                    visibilityTime: 2375,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);

            Toast.show({
                type: 'error',
                text1: `An error occurred while attempting to fetch user details!`,
                text2: "We encountered an error while attempting to fetch this specific user's account details...",
                visibilityTime: 2375,
                position: "bottom"
            });
        });
    }

    return (
        <Fragment>
            <Spinner
                visible={state.loading}
                textContent={'Waiting To Connect...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor={"rgba(0, 0, 0, 0.725)"}
            />
            <Header
                title="Individual Chat(s)"
                subtitle="Individual Random Chat!"
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

                    const currentChatUser = {
                        userID: authData.uniqueId === state.recieverID ? state.senderID : state.recieverID
                    }

                    newSocket.emit('randomChatEndedSession', currentChatUser);

                    navigation.goBack();
                }}
            />
            <ActionSheet
                ref={messageSpecificRef}
                title={`Quick actions you can take regarding this user...`}
                options={[`Leave Chat & View User's Profile!`, 'Report This User!', "Cancel/Close Pane"]}
                cancelButtonIndex={2}
                destructiveButtonIndex={2}
                onPress={(index) => {
                    switch (index) {
                        case 0:
                            fetchUserAndRedirect();
                            break;
                        case 1:
                            reportThisUser()
                            break;
                        default: 
                            break;
                    }
                }}
            />
            <SafeAreaView style={colorSchemeDark ? {flex: 1, backgroundColor: "#000" } : { flex: 1 }} edges={['right', 'left', 'bottom']}>
                {/* <View style={styles.topContainer}>
                    <Button
                        style={{ margin: 7.25, backgroundColor: colors.accent }}
                        onPress={() => skipToNextChatPerson()}>
                        {"Skip To Next Person/Chat"}
                    </Button>
                </View> */}
                {typeof state.recieverID !== "undefined" && state.recieverID.length > 0 ? <TouchableOpacity onPress={() => messageSpecificRef.current.show()} style={styles.topRightPositioned}>
                    <Image source={require("../../../assets/icons/view-more.png")} style={{ minWidth: 40, minHeight: 40, maxWidth: 40, maxHeight: 40 }} />
                </TouchableOpacity> : null}
                <View style={styles.maxedHeight}>
                    {state.chatStarted === true ? <GiftedChat 
                        onInputTextChanged={(value) => {
                            isCurrentlyTyping(value);
                        }}
                        textInputProps={{ color: "#000" }}
                        renderBubble={renderBubble}
                        renderComposer={renderComposer}
                        infiniteScroll
                        messages={state.messages}
                        textStyle={{ color: "#000", fontWeight: "bold" }}
                        style={{ color: "#000" }}
                        onSend={messages => {
                            console.log("messages", state.messages);

                            handleMessageSend(messages[0]);
                        }}
                        user={{
                            _id: authData.uniqueId,
                        }}
                        inverted={false}
                        messagesContainerStyle={styles.messageContainer}
                        renderFooter={renderFooter}
                        text={state.message}
                    /> : renderPrior()}
                </View>
            </SafeAreaView>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {  })(OneVOneChatRandomizedIndividualView);