import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image
} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import { CometChat } from "@cometchat-pro/react-native-chat";
import { GiftedChat, Composer, Bubble } from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import moment from 'moment';
import Dialog from "react-native-dialog";
import _ from "lodash";
import { connect } from "react-redux";
import { Button } from "@rneui/themed";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ActionSheet from 'react-native-actionsheet';
import { launchImageLibrary } from 'react-native-image-picker';
import RBSheet from "react-native-raw-bottom-sheet";
import axios from "axios";
import { BASE_URL } from "@env";
import ConfettiCannon from 'react-native-confetti-cannon';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get("window");

const Messages = ({navigation, route, unique_id, authData}) => {
    const {t} = useTranslation();
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const RBSheetRef = useRef(null);
    const actionSheetRef = useRef(null);
    const messageSpecificRef = useRef(null);
    const moderationRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [ isTyping, setTyping ] = useState(false);
    const [ isVisible, setInvisible ] = useState(false);
    const [ message, setMessage ] = useState("");
    const [ mediaMsg, setMediaMessage ] = useState(null);
    const [ selected, setSelected ] = useState(null);
    const [ showConfetti, setConfettiState ] = useState(false);
    const [ selectPressEvent, setPressEventState ] = useState(null);
    const [ authedUser, setAuthedUser ] = useState(null);

    useEffect(() => {
        const { conversation } = route.params;

        const config = {
            params: {
                uniqueId: unique_id,
                accountType: authData.accountType
            }
        }

        axios.get(`${BASE_URL}/gather/user/profile`, config).then((res) => {
            if (res.data.message === "Successfully gathered profile!") {
                console.log(res.data);

                const { user } = res.data;

                setAuthedUser(user);
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })

        const listenerID = conversation.conversationWith.uid;

        CometChat.addMessageListener(
            listenerID,
            new CometChat.MessageListener({
                onTextMessageReceived: textMessage => {
                    console.log("Text message received successfully", textMessage);
                    // Handle text message

                    const UID = conversation.conversationWith.uid;
                    const limit = 50;

                    const messagesRequest = new CometChat.MessagesRequestBuilder().setLimit(limit).setUID(UID).build();

                    messagesRequest.fetchPrevious().then(
                        messages => {
                            console.log("Message list fetched:", messages);
                            // Handle the list of messages

                            const messageArray = [];

                            const reversed = (typeof messages !== "undefined" && messages.length > 0) ? messages.reverse() : messages;

                            for (let index = 0; index < reversed.length; index++) {
                                const message = reversed[index];

                                console.log("messssssssssssssssssage :", message);

                                if (message.type === "text") {
                                    if (message.sender.uid !== unique_id) {

                                        let customName = message.sender.name.replace(" ", "+");
                                        // this is the other user 
                                        messageArray.push({
                                            _id: uuid.v4(),
                                            text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>{message.text}</Text>,
                                            createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                            user: {
                                                _id: message.sender.uid,
                                                name: message.sender.name,
                                                avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                            },
                                        })
                                    } else {
                                        let customName = message.sender.name.replace(" ", "+");
                                        // this is the logged in user
                                        messageArray.push({
                                            _id: uuid.v4(),
                                            text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }} onPress={() => {
                                            setInvisible(prevState => !prevState);
                                            setSelected(message.id);
                                            }}>{message.text}</Text>,
                                            createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                            user: {
                                                _id: unique_id,
                                                name: message.sender.name,
                                                avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                            },
                                        })
                                    }
                                } else if (message.type === "file") {
                                    console.log("message is a file", message);

                                    if (message.sender.uid !== unique_id) {

                                        let customName = message.sender.name.replace(" ", "+");
                                        // this is the logged in user
                                        messageArray.push({
                                            _id: uuid.v4(),
                                            image: message.data.url,
                                            createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                            user: {
                                            _id: message.sender.uid,
                                            name: message.sender.name,
                                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                            },
                                        })
                                    } else {
                                        let customName = message.sender.name.replace(" ", "+");
                                        // this is the logged in user
                                        messageArray.push({
                                            _id: uuid.v4(),
                                            image: message.data.url,
                                            createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                            user: {
                                            _id: unique_id,
                                            name: message.sender.name,
                                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                            },
                                        })
                                    }
                                }
                            }

                            setMessages(messageArray);
                        },
                        error => {
                            console.log("Message fetching failed with error:", error);
                        }
                    );
                },
                onMediaMessageReceived: mediaMessage => {
                    console.log("Media message received successfully", mediaMessage);
                    // Handle media message

                    const UID = conversation.conversationWith.uid;
                    const limit = 50;

                    const messagesRequest = new CometChat.MessagesRequestBuilder().setLimit(limit).setUID(UID).build();

                    messagesRequest.fetchPrevious().then(
                        messages => {
                            console.log("Message list fetched:", messages);
                            // Handle the list of messages

                            const messageArray = [];

                            const reversed = messages.reverse();

                            for (let index = 0; index < reversed.length; index++) {
                                const message = reversed[index];

                                console.log(message);
                                if (message.type === "text") {
                                    if (message.sender.uid !== unique_id) {

                                        let customName = message.sender.name.replace(" ", "+");
                                        // this is the other user 
                                        messageArray.push({
                                            _id: uuid.v4(),
                                            text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>{message.text}</Text>,
                                            createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                            user: {
                                            _id: message.sender.uid,
                                            name: message.sender.name,
                                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                            },
                                        })
                                    } else {
                                        let customName = message.sender.name.replace(" ", "+");
                                        // this is the logged in user
                                        messageArray.push({
                                            _id: uuid.v4(),
                                            text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }} onPress={() => {
                                            setInvisible(prevState => !prevState);
                                            setSelected(message.id);
                                            }}>{message.text}</Text>,
                                            createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                            user: {
                                            _id: unique_id,
                                            name: message.sender.name,
                                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                            },
                                        })
                                    }
                                } else if (message.type === "file") {
                                    console.log("message is a file", message);

                                    if (message.sender.uid !== unique_id) {

                                        let customName = message.sender.name.replace(" ", "+");
                                        // this is the logged in user
                                        messageArray.push({
                                            _id: uuid.v4(),
                                            image: message.data.url,
                                            createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                            user: {
                                            _id: message.sender.uid,
                                            name: message.sender.name,
                                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                            },
                                        })
                                    } else {
                                        let customName = message.sender.name.replace(" ", "+");
                                        // this is the logged in user
                                        messageArray.push({
                                            _id: uuid.v4(),
                                            image: message.data.url,
                                            createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                            user: {
                                            _id: unique_id,
                                            name: message.sender.name,
                                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                            },
                                        })
                                    }
                                }
                            }

                            setMessages(messageArray);
                        },
                        error => {
                            console.log("Message fetching failed with error:", error);
                        }
                    );
                },
                onCustomMessageReceived: customMessage => {
                    console.log("Custom message received successfully", customMessage);
                    // Handle custom message
                },
                onMessageDeleted: message => {
                    console.log("Deleted Message", message);

                    const UID = conversation.conversationWith.uid;
                    const limit = 50;

                    const messagesRequest = new CometChat.MessagesRequestBuilder().setLimit(limit).setUID(UID).build();

                    messagesRequest.fetchPrevious().then(
                        messages => {
                            console.log("Message list fetched:", messages);
                            // Handle the list of messages

                            const messageArray = [];

                            const reversed = messages.reverse();

                            for (let index = 0; index < reversed.length; index++) {
                                const message = reversed[index];

                                console.log(message);
                                if (message.type === "text") {
                                    if (message.sender.uid !== unique_id) {

                                        let customName = message.sender.name.replace(" ", "+");
                                        // this is the other user 
                                        messageArray.push({
                                            _id: uuid.v4(),
                                            text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>{message.text}</Text>,
                                            createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                            user: {
                                            _id: message.sender.uid,
                                            name: message.sender.name,
                                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                            },
                                        })
                                    } else {
                                        let customName = message.sender.name.replace(" ", "+");
                                        // this is the logged in user
                                        messageArray.push({
                                            _id: uuid.v4(),
                                            text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }} onPress={() => {
                                            setInvisible(prevState => !prevState);
                                            setSelected(message.id);
                                            }}>{message.text}</Text>,
                                            createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                            user: {
                                            _id: unique_id,
                                            name: message.sender.name,
                                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                            },
                                        })
                                    }
                                } else if (message.type === "file") {
                                    console.log("message is a file", message);

                                    if (message.sender.uid !== unique_id) {

                                        let customName = message.sender.name.replace(" ", "+");
                                        // this is the logged in user
                                        messageArray.push({
                                            _id: uuid.v4(),
                                            image: message.data.url,
                                            createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                            user: {
                                            _id: message.sender.uid,
                                            name: message.sender.name,
                                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                            },
                                        })
                                    } else {
                                        let customName = message.sender.name.replace(" ", "+");
                                        // this is the logged in user
                                        messageArray.push({
                                            _id: uuid.v4(),
                                            image: message.data.url,
                                            createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                            user: {
                                            _id: unique_id,
                                            name: message.sender.name,
                                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                            },
                                        })
                                    }
                                }
                            }

                            setMessages(messageArray);
                        },
                        error => {
                            console.log("Message fetching failed with error:", error);
                        }
                    );
                },
                onTypingStarted: typingIndicator => {
                    console.log("Typing started :", typingIndicator);

                    if (typeof message !== "undefined" && message.length > 0) {

                    setTyping(true);
                    }
                },
                onTypingEnded: typingIndicator => {
                    console.log("Typing ended :", typingIndicator);

                    setTyping(false);
                }
            })
        );

        const UID = conversation.conversationWith.uid;
        const limit = 50;

        const messagesRequest = new CometChat.MessagesRequestBuilder()
        .setLimit(limit)
        .setUID(UID)
        .build();

        messagesRequest.fetchPrevious().then(
            messages => {
                console.log("Message list fetched:", messages);
                // Handle the list of messages

                const messageArray = [];

                const reversed = messages.reverse();

                for (let index = 0; index < reversed.length; index++) {
                    const message = reversed[index];

                    console.log("Messageeeeeeee ITERATED...: ", message);

                    if (message.type === "text") {
                    
                        if (message.sender.uid !== unique_id) {

                            console.log("Thisssssssssssssssssss ONE!");

                            let customName = message.sender.name.replace(" ", "+");
                            // this is the other user 
                            messageArray.push({
                                _id: uuid.v4(),
                                text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>{message.text}</Text>,
                                createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                user: {
                                _id: message.sender.uid,
                                name: message.sender.name,
                                avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                },
                            })
                        } else {

                            console.log("Thisssssssssssssssssss TWO!");

                            let customName = message.sender.name.replace(" ", "+");
                            // this is the logged in user
                            messageArray.push({
                                _id: uuid.v4(),
                                text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }} onPress={() => {
                                setInvisible(prevState => !prevState);
                                setSelected(message.id);
                                }}>{message.text}</Text>,
                                createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                user: {
                                _id: unique_id,
                                name: message.sender.name,
                                avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                },
                            })
                        }
                    } else if (message.type === "file") {
                        console.log("message is a file", message);

                        if (message.sender.uid !== unique_id) {

                            let customName = message.sender.name.replace(" ", "+");
                            // this is the logged in user
                            messageArray.push({
                                _id: uuid.v4(),
                                image: message.data.url,
                                createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                user: {
                                _id: message.sender.uid,
                                name: message.sender.name,
                                avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                },
                            })
                        } else {
                            let customName = message.sender.name.replace(" ", "+");
                            // this is the logged in user
                            messageArray.push({
                                _id: uuid.v4(),
                                image: message.data.url,
                                createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                user: {
                                _id: unique_id,
                                name: message.sender.name,
                                avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                },
                            })
                        }
                    }
                }

                setMessages(messageArray);
            },
            error => {
                console.log("Message fetching failed with error:", error);
            }
        );
    }, []);

    const handleMessageSend = (message) => {
        const { conversation } = route.params;

        const receiverID = conversation.conversationWith.uid;
        const messageText = message;
        const receiverType = CometChat.RECEIVER_TYPE.USER;
        const textMessage = new CometChat.TextMessage(
            receiverID,
            messageText,
            receiverType
        );

        CometChat.sendMessage(textMessage).then(
            message => {
                console.log("Message sent successfully:", message);

                const UID = conversation.conversationWith.uid;
                const limit = 50;
        
                const messagesRequest = new CometChat.MessagesRequestBuilder()
                .setLimit(limit)
                .setUID(UID)
                .build();

                messagesRequest.fetchPrevious().then(
                    messages => {
                        console.log("Message list fetched:", messages);
                        // Handle the list of messages
        
                        const messageArray = [];
        
                        const reversed = messages.reverse();
        
                        for (let index = 0; index < reversed.length; index++) {
                            const message = reversed[index];
        
                            console.log(message);
                            
                            if (message.type === "text") {
                                if (message.sender.uid !== unique_id) {
        
                                    let customName = message.sender.name.replace(" ", "+");
                                    // this is the other user 
                                    messageArray.push({
                                        _id: uuid.v4(),
                                        text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>{message.text}</Text>,
                                        createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                        user: {
                                        _id: message.sender.uid,
                                        name: message.sender.name,
                                        avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                        },
                                    })
                                } else {
                                    let customName = message.sender.name.replace(" ", "+");
                                    // this is the logged in user
                                    messageArray.push({
                                        _id: uuid.v4(),
                                        text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }} onPress={() => {
                                        setInvisible(prevState => !prevState);
                                        setSelected(message.id);
                                        }}>{message.text}</Text>,
                                        createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                        user: {
                                        _id: unique_id,
                                        name: message.sender.name,
                                        avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                        },
                                    })
                                }
                            } else if (message.type === "file") {
                                console.log("message is a file", message);

                                if (message.sender.uid !== unique_id) {

                                    let customName = message.sender.name.replace(" ", "+");
                                    // this is the logged in user
                                    messageArray.push({
                                        _id: uuid.v4(),
                                        image: message.data.url,
                                        createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                        user: {
                                        _id: message.sender.uid,
                                        name: message.sender.name,
                                        avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                        },
                                    })
                                } else {
                                    let customName = message.sender.name.replace(" ", "+");
                                    // this is the logged in user
                                    messageArray.push({
                                        _id: uuid.v4(),
                                        image: message.data.url,
                                        createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                        user: {
                                        _id: unique_id,
                                        name: message.sender.name,
                                        avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                        },
                                    })
                                }
                            }
                        }
                        setMessages(messageArray);
                        setMessage("");
                    },
                    error => {
                        console.log("Message fetching failed with error:", error);
                    }
                );
            },
            error => {
                console.log("Message sending failed with error:", error);
            }
        );

        const configurationCustom = {
            receiverID,
            message,
            authedUniqueId: unique_id,
            accountType: authData.accountType
        }

        axios.post(`${BASE_URL}/send/push/notification`, configurationCustom).then((res) => {
            if (res.data.message === "Submitted sent push notification!") {
                console.log("Submitted sent push notification!", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully submitted sent push notification!`,
                    text2: `We've notified this user of your new message via a push notification.`,
                    visibilityTime: 3500,
                    position: "bottom"
                });
            } else {
                console.log("res.data", res.data);
            }
        }).catch((err) => {
            console.log("res.data ERROR. Main. :", err);
        })
    }

    const renderFooter = () => {
        if (isTyping === true && typeof messages !== "undefined" && messages.length > 0) {
        return (
            <View style={styles.footerContainer}>
                <View style={styles.rightTyping}>
                    <Image source={require("../../assets/icons/typing.png")} style={{ minWidth: 40, minHeight: 40, maxWidth: 40, maxHeight: 40 }} />
                </View>
            </View>
        );
        } else {
            return null;
        }
    }
    const getMimeType = (ext) => {
        console.log("Ext:", ext);

        switch (ext) {
            case "jpg":
                return "image/jpg";
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            default: 
                return "";
        }
    }
    const imageCallback = (response) => {
        if (response.didCancel) {
            console.log('User cancelled photo picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            console.log('ImagePicker Response: ', response);

            const concatted = response.assets[0];

            if (Platform.OS === 'ios') {
                const ext = concatted.fileName.split('.')[1].toLowerCase();
                const type = getMimeType(ext);
                const name = concatted.fileName;

                const file = {
                    name: Platform.OS === "android" ? concatted.fileName : name,
                    type: Platform.OS === "android" ? concatted.type : type,
                    uri: Platform.OS === "android" ? concatted.uri : concatted.uri.replace("file://", ""),
                }
                console.log('file: ', file);

                setMediaMessage(file);
                RBSheetRef.current.open();
            } else {
                const type = concatted.type;
                const name = 'Camera_001.jpeg';

                const file = {
                    name: Platform.OS === "android" ? concatted.fileName : name,
                    type: Platform.OS === "android" ? concatted.type : type,
                    uri: Platform.OS === "android" ? concatted.uri : concatted.uri.replace("file://", ""),
                }
                console.log('file: ', file);

                setMediaMessage(file);
                RBSheetRef.current.open();
            }
        }
    }
    const pickPicture = () => {
        const options = {
            mediaType: "photo",
            quality: 1
        };
        launchImageLibrary(options, imageCallback);
    }
    const renderComposer = props => {
        const { conversation } = route.params;
        const userID = conversation.conversationWith.uid;
        return (
            <View style={Platform.OS === "ios" ? { flexDirection: 'row' } : { flexDirection: 'row' }}>
                {_.has(authedUser, "enabledSendPicturesViaMessages") && authedUser.enabledSendPicturesViaMessages.includes(userID) ? <TouchableOpacity style={styles.centered} onPress={() => {
                    pickPicture();
                }}>
                    <Image source={require("../../assets/icons/attach.png")} style={{ maxHeight: 27.25, height: 27.25, maxWidth: 27.25, width: 27.25, marginLeft: 11.25, justifyContent: 'center' }} />
                </TouchableOpacity> : null}
                <Composer {...props} />
                <Button onPress={() => {
                    handleMessageSend(message);
                }} type="clear" title={"Send!"}></Button>
            </View>
        );
    };
    const deleteMessage = () => {
        console.log("delete", selected);

        const { conversation } = route.params;

        CometChat.deleteMessage(selected).then(
            message => {
                console.log("Message deleted", message);

                const UID = conversation.conversationWith.uid;
                const limit = 50;

                const messagesRequest = new CometChat.MessagesRequestBuilder().setLimit(limit).setUID(UID).build();

                messagesRequest.fetchPrevious().then(
                    messages => {
                        console.log("Message list fetched:", messages);
                        // Handle the list of messages

                        const messageArray = [];

                        const reversed = messages.reverse();

                        for (let index = 0; index < reversed.length; index++) {
                            const message = reversed[index];

                            console.log(message);

                            if (message.type === "text") {
                                
                                if (message.sender.uid !== unique_id) {

                                    let customName = message.sender.name.replace(" ", "+");
                                    // this is the other user 
                                    messageArray.push({
                                        _id: uuid.v4(),
                                        text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>{message.text}</Text>,
                                        createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                        user: {
                                            _id: message.sender.uid,
                                            name: message.sender.name,
                                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                        },
                                    })
                                } else {
                                    let customName = message.sender.name.replace(" ", "+");
                                    // this is the logged in user
                                    messageArray.push({
                                        _id: uuid.v4(),
                                        text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }} onPress={() => {
                                            setInvisible(prevState => !prevState);
                                            setSelected(message.id);
                                        }}>{message.text}</Text>,
                                        createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                        user: {
                                            _id: unique_id,
                                            name: message.sender.name,
                                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                        },
                                    })
                                }
                            } else if (message.type === "file") {
                                console.log("message is a file", message);

                                if (message.sender.uid !== unique_id) {

                                    let customName = message.sender.name.replace(" ", "+");
                                    // this is the logged in user
                                    messageArray.push({
                                        _id: uuid.v4(),
                                        image: message.data.url,
                                        createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                        user: {
                                        _id: message.sender.uid,
                                        name: message.sender.name,
                                        avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                        },
                                    })
                                } else {
                                    let customName = message.sender.name.replace(" ", "+");
                                    // this is the logged in user
                                    messageArray.push({
                                        _id: uuid.v4(),
                                        image: message.data.url,
                                        createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                        user: {
                                        _id: unique_id,
                                        name: message.sender.name,
                                        avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                        },
                                    })
                                }
                            }
                        }

                        setMessages(messageArray);
                    },
                    error => {
                        console.log("Message fetching failed with error:", error);
                    }
                );
            },
            error => {
                console.log("Message delete failed with error:", error);
            }
        );
    }

    const sendMediaMessage = () => {
        const { conversation } = route.params;

        const receiverID = conversation.conversationWith.uid;

        const messageType = CometChat.MESSAGE_TYPE.FILE;
        const receiverType = CometChat.RECEIVER_TYPE.USER;

        const mediaMessage = new CometChat.MediaMessage(
            receiverID,
            mediaMsg,
            messageType,
            receiverType
        );

        CometChat.sendMediaMessage(mediaMessage).then(
            message => {
                // Message sent successfully.
                console.log("Media message sent successfully", message);

                RBSheetRef.current.close();

                const UID = conversation.conversationWith.uid;
                const limit = 50;
        
                const messagesRequest = new CometChat.MessagesRequestBuilder()
                .setLimit(limit)
                .setUID(UID)
                .build();

                messagesRequest.fetchPrevious().then(
                    messages => {
                        console.log("Message list fetched:", messages);
                        // Handle the list of messages
        
                        const messageArray = [];
        
                        const reversed = messages.reverse();
        
                        for (let index = 0; index < reversed.length; index++) {
                            const message = reversed[index];
        
                            console.log(message);
                            
                            if (message.type === "text") {
                                if (message.sender.uid !== unique_id) {
        
                                    let customName = message.sender.name.replace(" ", "+");
                                    // this is the other user 
                                    messageArray.push({
                                        _id: uuid.v4(),
                                        text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>{message.text}</Text>,
                                        createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                        user: {
                                        _id: message.sender.uid,
                                        name: message.sender.name,
                                        avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                        },
                                    })
                                } else {
                                    let customName = message.sender.name.replace(" ", "+");
                                    // this is the logged in user
                                    messageArray.push({
                                        _id: uuid.v4(),
                                        text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }} onPress={() => {
                                            setInvisible(prevState => !prevState);
                                            setSelected(message.id);
                                        }}>{message.text}</Text>,
                                        createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                        user: {
                                        _id: unique_id,
                                        name: message.sender.name,
                                        avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                        },
                                    })
                                }
                            } else if (message.type === "file") {
                                console.log("message is a file", message);

                                if (message.sender.uid !== unique_id) {

                                    let customName = message.sender.name.replace(" ", "+");
                                    // this is the logged in user
                                    messageArray.push({
                                        _id: uuid.v4(),
                                        image: message.data.url,
                                        createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                        user: {
                                        _id: message.sender.uid,
                                        name: message.sender.name,
                                        avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                        },
                                    })
                                } else {
                                    let customName = message.sender.name.replace(" ", "+");
                                    // this is the logged in user
                                    messageArray.push({
                                        _id: uuid.v4(),
                                        image: message.data.url,
                                        createdAt: moment(new Date(message.sentAt * 1000)).format(),
                                        user: {
                                        _id: unique_id,
                                        name: message.sender.name,
                                        avatar: `https://ui-avatars.com/api/?name=${customName}`,
                                        },
                                    })
                                }
                            }
                        }
                        setMessages(messageArray);
                        setMessage("");
                    },
                    error => {
                        console.log("Message fetching failed with error:", error);
                    }
                );
            },
            error => {
                console.log("Media message sending failed with error", error);
                // Handle exception.
            }
        );
    }
    const isCurrentlyTyping = (value) => {
        const { conversation } = route.params;

        console.log("typing:", value);

        setMessage(value);


        let receiverId = conversation.conversationWith.uid;
        let receiverType = CometChat.RECEIVER_TYPE.USER;

        let typingNotification = new CometChat.TypingIndicator(
            receiverId,
            receiverType
        );
        CometChat.startTyping(typingNotification);
    }
    const renderBubble = props => (
        <Bubble
            onPress={(data) => {
                console.log("clicked", props.currentMessage);

                setPressEventState(props.currentMessage);

                actionSheetRef.current.show();
            }}
            {...props}
            wrapperStyle={{
                left: {
                    backgroundColor: colorSchemeDark ? BaseColor.greenColor : BaseColor.greenColor,
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

    const reportPositiveBehavior = () => {
        console.log("reportPositiveBehavior clicked/ran...", selectPressEvent.user);

        const config = {
            otherUserID: selectPressEvent.user._id,
            responsePositive: true,
            points: 10,
            authedUniqueId: unique_id
        }
        axios.post(`${BASE_URL}/react/feedback/score`, config).then((res) => {
            if (res.data.message === "Submitted feedback successfully!") {
                console.log("res.data", res.data);

                setConfettiState(true);

                Toast.show({
                    type: 'success',
                    text1: `Successfully submitted your feedback!`,
                    text2: `We've successfully submitted your feedback on this user, you may only react or give 'credit/props' or negative feedback UP-TO three times...`,
                    visibilityTime: 4250,
                    position: "bottom",
                    onHide: () => {
                        setConfettiState(false);
                    }
                });
            } else if (res.data.message === "You've already reacted to this user too many times!") {
                Toast.show({
                    type: 'error',
                    text1: `Already reacted to this user too many times!`,
                    text2: `You've already reacted 3 times to this user, no more postitive/negative reactions can be made...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            } else {
            console.log("res.data", res.data);

            Toast.show({
                type: 'error',
                text1: `An error occurred while submitting feedback...`,
                text2: `We've encountered an error while attempting to submit your desired feedback, please try to load the page again or contact support if the problem persists...`,
                visibilityTime: 3250,
                position: "bottom"
            });
            }
        }).catch((err) => {
            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while submitting feedback...`,
            //     text2: `We've encountered an error while attempting to submit your desired feedback, please try to load the page again or contact support if the problem persists...`,
            //     visibilityTime: 3250,
            //     position: "bottom"
            // });
        })
    }

    const reportNegativeBehavior = () => {
        console.log("reportNegativeBehavior clicked/ran...");

        const config = {
            otherUserID: selectPressEvent.user._id,
            responsePositive: false,
            points: 10,
            authedUniqueId: unique_id
        }
        axios.post(`${BASE_URL}/react/feedback/score`, config).then((res) => {
            if (res.data.message === "Submitted feedback successfully!") {
                console.log("res.data", res.data);

                setConfettiState(true);

                Toast.show({
                    type: 'success',
                    text1: `Successfully submitted your feedback!`,
                    text2: `We've successfully submitted your feedback on this user, you may only react or give 'credit/props' or negative feedback UP-TO three times...`,
                    visibilityTime: 3500,
                    position: "bottom",
                    onHide: () => {
                        setConfettiState(false);
                    }
                });
            } else if (res.data.message === "You've already reacted to this user too many times!") {
                Toast.show({
                    type: 'error',
                    text1: `Already reacted to this user too many times!`,
                    text2: `You've already reacted 3 times to this user, no more postitive/negative reactions can be made...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            } else {
                console.log("res.data", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while submitting feedback...`,
                    text2: `We've encountered an error while attempting to submit your desired feedback, please try to load the page again or contact support if the problem persists...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while submitting feedback...`,
            //     text2: `We've encountered an error while attempting to submit your desired feedback, please try to load the page again or contact support if the problem persists...`,
            //     visibilityTime: 3250,
            //     position: "bottom"
            // });
        })
    }

    const giveSuperProps = () => {
        console.log("giveSuperProps clicked/ran...");

        const config = {
            otherUserID: selectPressEvent.user._id,
            authedUniqueId: unique_id
        }
        axios.post(`${BASE_URL}/react/feedback/score/double`, config).then((res) => {
            if (res.data.message === "Submitted feedback successfully!") {
                console.log("res.data", res.data);

                setConfettiState(true);

                Toast.show({
                    type: 'success',
                    text1: `Successfully submitted your feedback!`,
                    text2: `We've successfully submitted your feedback on this user, you may only react or give 'credit/props' or negative feedback UP-TO three times...`,
                    visibilityTime: 3500,
                    position: "bottom",
                    onHide: () => {
                    setConfettiState(false);
                    }
                });
            } else if (res.data.message === "You've already reacted to this user too many times!") {
                Toast.show({
                    type: 'error',
                    text1: `Already reacted to this user too many times!`,
                    text2: `You've already reacted 3 times to this user, no more postitive/negative reactions can be made...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            } else {
                console.log("res.data", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while submitting feedback...`,
                    text2: `We've encountered an error while attempting to submit your desired feedback, please try to load the page again or contact support if the problem persists...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while submitting feedback...`,
            //     text2: `We've encountered an error while attempting to submit your desired feedback, please try to load the page again or contact support if the problem persists...`,
            //     visibilityTime: 3250,
            //     position: "bottom"
            // });
        })
    }

    const videoChatSkypeWithUser = () => {
        console.log("videoChatSkypeWithUser clicked/ran...");
    }

    const enableSendingPicturesViaMessaging = () => {
        console.log("enableSendingPicturesViaMessaging clicked/ran...");

        const { conversation } = route.params;

        const otherUserID = conversation.conversationWith.uid;

        const config = {
            otherUserID: otherUserID,
            authedUniqueId: unique_id
        };

        axios.post(`${BASE_URL}/request/sending/images/via/messaging/with/user`, config).then((res) => {
            if (res.data.message === "Submitted request!") {
                console.log("res.data", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully sent notification to other user!`,
                    text2: `We've sent the request to the other user to enable images/pictures via messaging...`,
                    visibilityTime: 3500,
                    position: "bottom"
                });
            } else if (res.data.message === "NOT a standard user account type - this user is likely a mentor in which picture enabling is disabled.") {
                Toast.show({
                    type: 'info',
                    text1: `Can't enable pictures w/mentors or guides...`,
                    text2: res.data.message,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            } else {
                console.log("res.data", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while enabling images...`,
                    text2: `We've encountered an error while attempting enable sending pictures/images, please try again or contact support if the problem persists...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while enabling images...`,
            //     text2: `We've encountered an error while attempting enable sending pictures/images, please try again or contact support if the problem persists...`,
            //     visibilityTime: 3250,
            //     position: "bottom"
            // });
        })
    }

    const handleReportingBehavior = (passedType) => {

        const { conversation } = route.params;

        const otherUserID = conversation.conversationWith.uid;

        const config = {
            passedType,
            authedUniqueId: authData.uniqueId,
            accountType: authData.accountType,
            otherUserID
        };
        // api request logic
        axios.post(`${BASE_URL}/suport/unacceptable/dangerous/behavior`, config).then((res) => {
            if (res.data.message === "Submitted request!") {
                console.log("res.data", res.data);

                const usersList = [otherUserID];

                CometChat.blockUsers(usersList).then(
                    list => {
                        console.log("users list blocked", { list });
                    }, error => {
                        console.log("Blocking user fails with error", error);
                    }
                );

                Toast.show({
                    type: 'success',
                    text1: `Successfully submitted report & blocked user!`,
                    text2: `We've successfully submitted your report & it will be reviewed shortly with swiftness.`,
                    visibilityTime: 3750,
                    position: "bottom",
                    onHide: () => {
                        navigation.replace("BottomTabNavigator", { screen: "Home" });
                    }
                });
            } else {
                console.log("res.data", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while submitting/processing your request!`,
                    text2: `We've encountered an error while attempting to submit your request/submission, please try again or contact support if the problem persists...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while submitting/processing your request!`,
            //     text2: `We've encountered an error while attempting to submit your request/submission, please try again or contact support if the problem persists...`,
            //     visibilityTime: 3250,
            //     position: "bottom"
            // });
        });
    }

    return (
        <View style={{flex: 1}}>
        <RBSheet
            ref={RBSheetRef}
            closeOnDragDown={true}
            height={height * 0.40}
            openDuration={250}
            customStyles={{
                container: {
                    width
                },
                draggableIcon: {
                    borderBottomColor: "grey",
                    borderBottomWidth: 2,
                    width: 200
                }
            }}
        >
            <View style={styles.centered}>
                {mediaMsg !== null ? <Image source={{ uri: mediaMsg.uri }} style={styles.previewImage} /> : null}
            </View>
            <View style={styles.bottomButton}>
                <Button onPress={sendMediaMessage} style={{marginTop: 10, marginBottom: 20 }} title={"Submit & Send Message!"}></Button>
            </View>
        </RBSheet>
        <Header
            title={t('messages')}
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
        <View>
            <Dialog.Container visible={isVisible}>
            <Dialog.Title>Delete Message?</Dialog.Title>
            <Dialog.Description>
                Are you sure you want to delete this message? You cannot undo this action.
            </Dialog.Description>
            <Dialog.Button onPress={() => {
                setInvisible(false);
            }} label="Cancel" />
            <Dialog.Button onPress={() => {
                setInvisible(false);
                deleteMessage();
            }} label="Delete" />
            </Dialog.Container>
        </View>
        <ActionSheet
            ref={messageSpecificRef}
            title={`Select specific action's to interact with this specific user...`}
            options={['Report This User (Innapropriate Behavior)', 'Enable Picture/Image Messaging', "Cancel/Close Pane"]}
            cancelButtonIndex={2}
            destructiveButtonIndex={2}
            onPress={(index) => {
                switch (index) {
                    case 0:
                        videoChatSkypeWithUser();
                        break;
                    case 1:
                        enableSendingPicturesViaMessaging();
                        break;
                    default: 
                        break;
                }
            }}
        />
        <ActionSheet
            ref={actionSheetRef}
            title={`Take actions against this particular message/user...`}
            options={['Feedback for POSITIVE behavior', 'Feedback for NEGATIVE behavior', "Give a SUPER-props! (Double Point's)", "Report dangerous/unsafe behavior", "Cancel/Close Pane"]}
            cancelButtonIndex={4}
            destructiveButtonIndex={4}
            onPress={(index) => {
                switch (index) {
                    case 0:
                        reportPositiveBehavior();
                        break;
                    case 1:
                        reportNegativeBehavior();
                        break;
                    case 2:
                        giveSuperProps();
                        break;
                    case 3:
                        // actionSheetRef.current.hide();

                        setTimeout(() => {
                            moderationRef.current.show();
                        }, 1250)
                        break;
                    default: 
                        break;
                }
            }}
        />
        <ActionSheet
            ref={moderationRef}
            title={`What would you like to report (We take these very seriously)?`}
            options={['Report Racism, Sexism Or Other Extremism', 'Report dangerous situation/user', "Unmatch & report general behavior", "Report physical safety concerns", "Report bullying/harassment", "Cancel/Close Pane"]}
            cancelButtonIndex={5}
            destructiveButtonIndex={5}
            onPress={(index) => {
                switch (index) {
                    case 0:
                        console.log("0 ran.");
                        handleReportingBehavior('Report Racism, Sexism Or Other Extremism');
                        break;
                    case 1:
                        console.log("1 ran.");
                        handleReportingBehavior('Report dangerous situation/user');
                        break;
                    case 2:
                        console.log("2 ran.");
                        handleReportingBehavior("Unmatch & report general behavior");
                        break;
                    case 3:
                        console.log("3 ran.");
                        handleReportingBehavior("Report physical safety concerns");
                        break;
                    case 4:
                        console.log("3 ran.");
                        handleReportingBehavior("Report bullying/harassment");
                        break;
                    default: 
                        break;
                }
            }}
        />
        <SafeAreaView
            style={BaseStyle.safeAreaView}
            edges={['right', 'left', 'bottom']}>
            <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps='always'>
            <View style={Platform.OS === "ios" ? { flex: 1, minHeight: height * 0.8925 } : { flex: 1, height: height * 0.925 }}>
                <GiftedChat 
                    onInputTextChanged={(value) => {
                        isCurrentlyTyping(value);
                    }}
                    textInputProps={{ color: "#000" }}
                    renderBubble={renderBubble}
                    renderComposer={renderComposer}
                    infiniteScroll
                    messages={messages}
                    textStyle={{ color: "#000", fontWeight: "bold" }}
                    style={{ color: "#000" }}
                    onSend={messages => {
                        console.log("messages", messages);

                        handleMessageSend(messages[0]);
                    }}
                    user={{
                        _id: unique_id,
                    }}
                    messagesContainerStyle={styles.messageContainer}
                    renderFooter={renderFooter}
                    text={message}
                />
                <TouchableOpacity onPress={() => messageSpecificRef.current.show()} style={styles.topRightPositioned}>
                    <Image source={require("../../assets/icons/viewmore.png")} style={{ minWidth: 40, minHeight: 40, maxWidth: 40, maxHeight: 40 }} />
                </TouchableOpacity>
            </View>
            </KeyboardAwareScrollView>
            {showConfetti ? <ConfettiCannon count={250} origin={{x: -10, y: 0}} /> : null}
        </SafeAreaView>
        </View>
    );
}

const mapStateToProps = (state) => {
  return {
      unique_id: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData.uniqueId : null,
      authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
  }
}
export default connect(mapStateToProps, { })(Messages);