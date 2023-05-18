import React, { Fragment, useState } from "react";
import { Text, Header, Icon } from "@components";
import styles from "./mainChatSuggestionsViewStyles.js";
import { useNavigation } from "@react-navigation/native";
import { useTheme, BaseColor } from '@config'; 
import { Platform, View, Dimensions, Image, ScrollView } from "react-native";
import { GiftedChat, Composer, Bubble } from 'react-native-gifted-chat';
import { connect } from "react-redux";
import Toast from "react-native-toast-message";   
import _ from "lodash";    
import { Button as ThemedButton } from "@rneui/themed";
import uuid from "react-native-uuid";
import { BASE_URL } from "@env";
import axios from "axios";
import moment from "moment";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get("window");

const ChatGPTSuggestionsMainView = ({ authData }) => {

    const navigation = useNavigation();

    const [ state, setState ] = useState({
        message: "",
        messages: []
    })

    const { colors, theme } = useTheme();

    const colorSchemeDark = theme.dark;

    const handleMessageSend = (value) => {
        console.log("handleMessageSend clicked/ran...");
        
        const { message, chatStreamID } = state;

        if (typeof message !== "undefined" && message.length > 0) {

            const configurationCustom = {
                message
            };

            const newMessagesArr = [...state.messages];

            let customName = `${authData.firstName.charAt(0).toUpperCase()}+${authData.lastName.charAt(0).toUpperCase()}`

            newMessagesArr.push({
                _id: uuid.v4(),
                text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>{message}</Text>,
                createdAt: moment(new Date()).format(),
                user: {
                    _id: authData.uniqueId,
                    name: authData.firstName,
                    avatar: `https://ui-avatars.com/api/?name=${customName}`,
                },
            });

            axios.post(`${BASE_URL}/search/chatgpt/response`, configurationCustom).then((res) => {
                if (res.data.message === "Successfully generated/submitted response!") {
                    console.log("Successfully generated/submitted response!", res.data);
        
                    const { text } = res.data;

                    newMessagesArr.push({
                        _id: uuid.v4(),
                        text: <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>{text}</Text>,
                        createdAt: moment(new Date()).format(),
                        user: {
                            _id: "system-response",
                            name: "System Response",
                            avatar: `https://ui-avatars.com/api/?name=${customName}`,
                        },
                    });

                    setState(prevState => {
                        return {
                            ...prevState,
                            message: "",
                            messages: newMessagesArr
                        }
                    })
                } else {
                    console.log("Err", res.data);
    
                    Toast.show({
                        type: 'error',
                        text1: `An error occurred while processing the desired request.`,
                        text2: "We encountered an error while attempting process your desired request - please try again or contact support if the problem persists!",
                        visibilityTime: 2375,
                        position: "bottom"
                    });
                }
            }).catch((err) => {
                console.log(err.message);
    
                // Toast.show({
                //     type: 'error',
                //     text1: `An error occurred while processing the desired request.`,
                //     text2: "We encountered an error while attempting process your desired request - please try again or contact support if the problem persists!",
                //     visibilityTime: 2375,
                //     position: "bottom"
                // });
            });
        } else {
            Toast.show({
                type: 'error',
                text1: `An error occurred while processing the desired request.`,
                text2: "We encountered an error while attempting process your desired request - please try again or contact support if the problem persists!",
                visibilityTime: 2375,
                position: "bottom"
            });
        }
    }

    const renderComposer = props => {
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

    const isCurrentlyTyping = (value) => {
        setState(prevState => {
            return {
                ...prevState,
                isTyping: true,
                message: value
            }
        })
    }

    const renderBubble = props => (
        <Bubble
            onPress={(data) => {
                console.log("clicked", props.currentMessage);

                // setPressEventState(props.currentMessage);

                // messageSpecificRef.current.show();
            }}
            {...props}
            wrapperStyle={{
                left: {
                    backgroundColor: BaseColor.greenColor,
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

    return (
        <Fragment>
            <Header
                title="Chat Suggestions"
                subTitle={"Get Suggestions What To Say"}
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
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 0, maxHeight: height - 50, height: height - 50 }}>
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='always'>
            {typeof state.messages !== "undefined" && state.messages.length === 0 ? <Fragment>
                <Text style={styles.toppedText}>Type a request to ask our chatbot to anything you'd like! You can ask for an example response to a private message you've received or anything you'd like...{"\n"}{"\n"}The best results come from being specific and detailed with your questions/prompts...</Text>
                
                <View style={styles.containerFlex}>
                    <View style={{ marginTop: 4.25 }} />
                    <View style={styles.contentContainerFlex}>
                        <View style={styles.examplePrompt}>
                            <Text style={{ color: colors.accent }}>Write me a pickup line for a redheaded woman!</Text>
                        </View>
                        <View style={styles.examplePrompt}>
                            <Text style={{ color: colors.accent }}>Tell me a funny 'opener joke' that I can use to strike up conversation...</Text>
                        </View>
                        <View style={styles.examplePrompt}>
                            <Text style={{ color: colors.accent }}>How much could the wood chuck chuck if the woodchuck could chuck wood?</Text>
                        </View>
                        <View style={styles.footer}>
                            <Image resizeMode={"contain"} source={require("../../../assets/images/romantic-chat.jpg")} style={{ height: "100%", width: null, maxHeight: "100%", margin: 13.25, borderRadius: 13.25 }} />
                        </View>
                    </View>

                </View>
            </Fragment> : null}
            <GiftedChat 
                onInputTextChanged={(value) => {
                    isCurrentlyTyping(value);
                }}
                forceGetKeyboardHeight
                textInputProps={{ color: "#000" }}
                renderBubble={renderBubble}
                renderComposer={renderComposer}
                infiniteScroll 
                placeholder="Ask the chat a question...!"
                messages={state.messages}
                textStyle={{ color: "#000", fontWeight: "bold" }}
                style={{ color: "#000" }}
                onSend={messages => {
                    console.log("messages", state.messages);

                    handleMessageSend(messages[0]);
                }}
                bottomOffset={75}
                user={{
                    _id: authData.uniqueId,
                }}
                inverted={false}
                messagesContainerStyle={styles.messageContainer}
                text={state.message}
            />
            </KeyboardAwareScrollView>
            </ScrollView>
        </Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, { })(ChatGPTSuggestionsMainView);