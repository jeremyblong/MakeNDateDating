import React, { Fragment, useRef, useState, useEffect } from "react";
import { Text, Header, Icon, TextInput, Button as CustomButton } from "@components";
import {
    View,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Image,
    Platform, 
    ScrollView
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useTheme, BaseColor } from '@config';
import SearchBar from 'react-native-search-bar';
import helpers from "./options.js";
import styles from "./initiateChatStyles.js";
import _ from "lodash";
import { BASE_URL } from "@env";
import { connect } from "react-redux";
import { Button } from "@rneui/themed";
import { GiftedChat, Composer, Bubble, InputToolbar } from 'react-native-gifted-chat';
import uuid from 'react-native-uuid';
import moment from "moment";
import { CometChat } from "@cometchat-pro/react-native-chat";
import RBSheet from "react-native-raw-bottom-sheet";
import ActionSheet from 'react-native-actionsheet';
import Toast from "react-native-toast-message";
import axios from "axios";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get("window");

const { optionsFirst } = helpers;

const InitiateIndividualGroupChatCategorical = ({ route, unique_id, authData }) => {
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const actionSheetRef = useRef(null);
    const createGroupRef = useRef(null);
    const textInputRef = useRef(null);
    const [ selectPressEvent, setPressEventState ] = useState(null);
    const navigation = useNavigation();

    const [ state, setState ] = useState({
        data: optionsFirst,
        page: 1,
        chatChannel: null,
        messages: [],
        isTyping: false,
        message: "",
        groupName: "",
        groups: [],
        longtermGroups: [],
        selectedChat: null,
        searchTerm: "",
        typed: false
    })

    console.log("state.groups", state.groups);

    const searchbarRef = useRef(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (state.typed === true) {
                if (typeof state.searchTerm !== "undefined" && state.searchTerm.length > 0) {
                    setState(prevState => {
                        return {
                            ...prevState,
                            groups: prevState.groups.filter(item => item.name.toLowerCase().includes(state.searchTerm.toLowerCase()))
                        }
                    })
                } else {
                    setState(prevState => {
                        return {
                            ...prevState,
                            groups: state.longtermGroups
                        }
                    })
                }
            }
        }, 1750)
    
        return () => clearTimeout(delayDebounceFn)
    }, [state.searchTerm])

    useEffect(() => {
        const limit = 50;
        const groupsRequest = new CometChat.GroupsRequestBuilder().setLimit(limit).build();   

        groupsRequest.fetchNext().then(
            groupList => {
                console.log("Groups list fetched successfully", groupList);

                setState(prevState => {
                    return {
                        ...prevState,
                        groups: groupList,
                        longtermGroups: groupList
                    }
                })
            }, error => {
                console.log("Groups list fetching failed with error", error);
            }
        );
    }, [])

    useEffect(() => {
        if (state.page === 2) {
            console.log("page two changed/running...");
            
            const listenerID = state.chatChannel.guid;

            console.log("listenerID", listenerID);

            CometChat.addMessageListener(
                listenerID,
                new CometChat.MessageListener({
                    onTextMessageReceived: textMessage => {
                        console.log("Text message received successfully", textMessage);
                        // Handle text message

                        const UID = state.chatChannel.guid;
                        const limit = 50;

                        const messagesRequest = new CometChat.MessagesRequestBuilder().setGUID(listenerID).setLimit(limit).build();

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

                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        messages: messageArray
                                    }
                                })
                            },
                            error => {
                                console.log("Message fetching failed with error:", error);
                            }
                        );
                    },
                    onMediaMessageReceived: mediaMessage => {
                        console.log("Media message received successfully", mediaMessage);
                        // Handle media message

                        const UID = state.chatChannel.guid;
                        const limit = 50;

                        const messagesRequest = new CometChat.MessagesRequestBuilder().setGUID(listenerID).setLimit(limit).setGUID(UID).build();

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

                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        messages: messageArray
                                    }
                                })
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

                        const UID = state.chatChannel.guid;
                        const limit = 50;

                        const messagesRequest = new CometChat.MessagesRequestBuilder().setGUID(listenerID).setLimit(limit).setGUID(UID).build();

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

                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        messages: messageArray
                                    }
                                })
                            },
                            error => {
                                console.log("Message fetching failed with error:", error);
                            }
                        );
                    },
                    onTypingStarted: typingIndicator => {
                        console.log("Typing started :", typingIndicator);

                        if (typeof message !== "undefined" && message.length > 0) {

                            setState(prevState => {
                                return {
                                    ...prevState,
                                    isTyping: true
                                }
                            })
                        }
                    },
                    onTypingEnded: typingIndicator => {
                        console.log("Typing ended :", typingIndicator);

                        setState(prevState => {
                            return {
                                ...prevState,
                                isTyping: false
                            }
                        })
                    }
                })
            );

            const UID = state.chatChannel.guid;
            const limit = 50;

            const messagesRequest = new CometChat.MessagesRequestBuilder()
            .setLimit(limit)
            .setGUID(UID)
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

                    setState(prevState => {
                        return {
                            ...prevState,
                            messages: messageArray
                        }
                    })
                },
                error => {
                    console.log("Message fetching failed with error:", error);
                }
            );
        }
    }, [state.page]);

    const handleSearch = (value) => {
        console.log("handleSearch clicked/ran...");

        if (typeof value !== "undefined" && value.length > 0) {
            setState(prevState => {
                return {
                    ...prevState,
                    data: optionsFirst.filter(item => item.title.toLowerCase().includes(value.toLowerCase()))
                }
            })
        } else {
            setState(prevState => {
                return {
                    ...prevState,
                    data: optionsFirst
                }
            })
        }

        searchbarRef.current.unFocus();
    }

    const renderBubble = props => (
        <Bubble
            onPress={(data) => {
                console.log("clicked", props.currentMessage);

                setPressEventState(props.currentMessage);

                setState(prevState => {
                    return {
                        ...prevState,
                        selectedChat: props.currentMessage
                    }
                })

                setTimeout(() => {
                    actionSheetRef.current.show();
                }, 375);
            }}
            {...props}
            wrapperStyle={{
                left: {
                    backgroundColor: colorSchemeDark ? "#000" : '#fff',
                },
                right: {
                    backgroundColor: colorSchemeDark ? colors.primary : BaseColor.greenColor,
                },
            }}
            textProps={{
                style: {
                    color: props.position === 'left' ? '#000' : '#fff'
                },
            }}
            textStyle={{
                left: {
                    color: '#fff',
                },
                right: {
                    color: '#fff',
                },
            }}
        /> 
    )

    const renderFooter = () => {
        if (state.isTyping === true && typeof state.messages !== "undefined" && state.messages.length > 0) {
        return (
            <View style={styles.footerContainer}>
                <View style={styles.rightTyping}>
                    <Image source={require("../../assets/icons/typing.png")} style={{ minWidth: 40, minHeight: 40, maxWidth: 40, maxHeight: 40, paddingBottom: 12.25 }} />
                </View>
            </View>
        );
        } else {
            return null;
        }
    }
    
    const handleContinuation = (item) => {
        console.log("handleContinuation clicked/ran...", item);

        const GUID = item.guid;
        const password = "";
        const groupType = CometChat.GROUP_TYPE.PUBLIC;

        CometChat.joinGroup(GUID, groupType, password).then(
            group => {
                console.log("Group joined successfully:", group);

                setState(prevState => {
                    return {
                        ...prevState,
                        page: 2,
                        chatChannel: group
                    }
                })
            }, error => {
                console.log("Group joining failed with exception:", error);

                if (error.code === "ERR_ALREADY_JOINED") {
                    setState(prevState => {
                        return {
                            ...prevState,
                            page: 2,
                            chatChannel: item
                        }
                    })
                }
            }
        );
    }

    console.log("state.chatChannel", state.chatChannel)

    const handleMessageSend = (message) => {

        console.log("state.chatChannel", state.chatChannel, state.chatChannel.guid);

        const receiverID = state.chatChannel.guid;
        const messageText = message;
        const receiverType = CometChat.RECEIVER_TYPE.GROUP;
        const textMessage = new CometChat.TextMessage(
            receiverID,
            messageText,
            receiverType
        );

        CometChat.sendMessage(textMessage).then(
            message => {
                console.log("Message sent successfully:", message);

                const UID = state.chatChannel.guid;
                const limit = 50;
        
                const messagesRequest = new CometChat.MessagesRequestBuilder()
                .setLimit(limit)
                .setGUID(UID)
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
                        setState(prevState => {
                            return {
                                ...prevState,
                                messages: messageArray,
                                message: ""
                            }
                        })
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
    }

    const handleCancellation = () => {
        console.log("handleCancellation clicked/ran...");

        setState(prevState => {
            return {
                ...prevState,
                data: optionsFirst
            }
        })

        searchbarRef.current.unFocus();
    }

    const isCurrentlyTyping = (value) => {

        setState(prevState => {
            return {
                ...prevState,
                // isTyping: true,
                message: value
            }
        })
    }

    const renderComposer = props => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Composer {...props} />
                <Button onPress={() => {
                    handleMessageSend(state.message);
                }} type="clear" title={"Send!"}></Button>
            </View>
        );
    };

    const customtInputToolbar = (props) => {
        return (
            <View style={{ top: 0 }}>
                <InputToolbar
                    {...props}
                    ref={textInputRef}
                    placeholder="Enter your message..."
                />
            </View>
        );
    }

    const renderPagesContent = () => {
        if (state.page === 1) {
            return (
                <Fragment>
                    <View style={{ margin: 10 }}>
                        <SearchBar
                            ref={searchbarRef}
                            textFieldBackgroundColor={colorSchemeDark ? null : null}
                            style={{ minHeight: 50 }}
                            placeholder="Search for chat channel name..."
                            onChangeText={(value) => {
                                if (typeof value !== "undefined" && value.length > 0) {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            searchTerm: value,
                                            typed: true
                                        }
                                    })
                                } else {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            searchTerm: "",
                                            typed: true
                                        }
                                    })
                                }
                            }}
                            onSearchButtonPress={handleSearch}
                            onCancelButtonPress={handleCancellation}
                        />
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={state.groups} // state.data
                        keyExtractor={(item, index) => item.title}
                        renderItem={({item, index}) => {
                            return (
                                <TouchableOpacity onLongPress={() => handleContinuation(item)} style={styles.serviceItemBlock} key={'block' + index}>
                                    <Text
                                        overline
                                        grayColor
                                        style={styles.textInner}
                                        numberOfLines={1}
                                    >
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </Fragment>
            );
        } else {
            return (
                <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 75, height: "100%" }} keyboardShouldPersistTaps='always'>
                    <View style={Platform.OS === "ios" ? { backgroundColor: "#fff", height: "100%", width } : { backgroundColor: "#fff", height: "100%", width }}>
                        <GiftedChat 
                            onInputTextChanged={(value) => {
                                isCurrentlyTyping(value);
                            }}
                            textInputProps={{ color: "#000" }}
                            renderBubble={renderBubble}
                            renderComposer={renderComposer}
                            infiniteScroll // message.data.entities.sender.entity.uid
                            messages={state.messages}
                            textStyle={{ color: "#000", fontWeight: "bold" }}
                            style={{ color: "#000" }}
                            onSend={messages => {
                                console.log("messages", messages);

                                handleMessageSend(messages[0]);
                            }}
                            user={{
                                _id: authData.uniqueId,
                            }}
                            renderInputToolbar={props => customtInputToolbar(props)}
                            messagesContainerStyle={Platform.OS === "ios" ? { backgroundColor: "#eee", top: -50 } : { backgroundColor: "#eee", height: height * 0.9125, top: -30 }}
                            renderFooter={renderFooter}
                            text={state.message}
                        />
                        {/* <TouchableOpacity onPress={() => {}} style={styles.topRightPositioned}>
                            <Image source={require("../../assets/icons/viewmore.png")} style={{ minWidth: 40, minHeight: 40, maxWidth: 40, maxHeight: 40 }} />
                        </TouchableOpacity> */}
                    </View>
                </KeyboardAwareScrollView>
            );
        }
    }

    const calculateDisabled = () => {
        if (state.groupName !== "undefined" && state.groupName.length >= 10) {
            return false;
        } else {
            return true;
        }
    }

    const handleGroupCreation = () => {
        console.log("handleGroupCreation clicked/ran...");

        const GUID = uuid.v4();
        const groupName = state.groupName;
        const groupType = CometChat.GROUP_TYPE.PUBLIC;
        const password = "";

        const group = new CometChat.Group(GUID, groupName, groupType, password);

        CometChat.createGroup(group).then(
            group => {
                console.log("Group created successfully:", group);

                const limit = 50;
                const groupsRequest = new CometChat.GroupsRequestBuilder().setLimit(limit).build();   

                groupsRequest.fetchNext().then(
                    groupList => {
                        console.log("Groups list fetched successfully", groupList);

                        setState(prevState => {
                            return {
                                ...prevState,
                                groups: groupList
                            }
                        })
                    }, error => {
                        console.log("Groups list fetching failed with error", error);
                    }
                );

                createGroupRef.current.close();
            }, error => {
                console.log("Group creation failed with exception:", error);
            }
        );
    }

    const handleProfileView = () => {
        console.log("handleProfileView clicked/ran...", state.selectedChat.user._id);

        const userID = state.selectedChat.user._id;

        const configuration = {
            params: {
                postedByID: userID
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

            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while attempting to fetch user details!`,
            //     text2: "We encountered an error while attempting to fetch this specific user's account details...",
            //     visibilityTime: 2375,
            //     position: "bottom"
            // });
        });
    }

    return (
        <Fragment>
            <ActionSheet
                ref={actionSheetRef}
                title={`Select an action to take towards this specific user`}
                options={[`View User's Profile!`, "Cancel/Close Pane"]}
                cancelButtonIndex={1}
                destructiveButtonIndex={1}
                onPress={(index) => {
                    switch (index) {
                        case 0:
                            handleProfileView();
                            break;
                        default: 
                            break;
                    }
                }}
            />
            <Header
                title="Category Selection (Chat)"
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
                renderRight={() => {
                    return (
                        <Icon
                            name="group"
                            size={20}
                            color={colors.primary}
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.pop();
                }}
                onPressRight={() => {
                    createGroupRef.current.open();
                }}
            />
            <View>
                {renderPagesContent()}
            </View>
            <RBSheet
                ref={createGroupRef}
                closeOnDragDown={false}
                closeOnPressMask={true}
                dragFromTopOnly={true}
                height={height}
                closeDuration={35}
                openDuration={35}
                customStyles={{
                    container: {
                        paddingHorizontal: 10 * 2.0,
                        backgroundColor: colorSchemeDark ? "#000" : "#fff"
                    },
                    draggableIcon: {
                        width: width * 0.725
                    }
                }}
            >
                <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 225 }} keyboardShouldPersistTaps='always'>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={Platform.OS === "ios" ? { paddingBottom: 30, paddingTop: 50, flexGrow: 1 } : { paddingBottom: 30, paddingTop: 10, flexGrow: 1 }}>
                        <Header
                            title="Create a new group!"
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
                                createGroupRef.current.close();
                            }}
                        />
                        <View style={styles.container}>
                            <Text style={colorSchemeDark ? [styles.label, { color: "#fff" }] : [styles.label, { color: "#000" }]}>Enter your new group title/name...</Text>
                            <TextInput
                                style={styles.customTextInput}
                                secureTextEntry={false}
                                value={state.groupName}
                                placeholder={"Enter a new GROUP NAME (10 Charectors Min)..."}
                                onChangeText={(value) => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            groupName: value
                                        }
                                    })
                                }}
                            />
                            <View style={styles.hr} />
                            <CustomButton style={calculateDisabled() ? { backgroundColor: "lightgrey" } : {}} disabled={calculateDisabled()} full outline onPress={() => handleGroupCreation()}>
                                {"Submit New Group!"}
                            </CustomButton>
                            <View style={styles.hr} />
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
            </RBSheet>
        </Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        unique_id: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData.uniqueId : null,
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, { })(InitiateIndividualGroupChatCategorical);