import React, { Fragment, useState } from "react";
import { View, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, useColorScheme, TextInput as CustomTextInput, Platform } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Dialog from "react-native-dialog";
import styles from "./sendPrivateMessageStyles.js";
import {
    Text,
    Button,
    TextInput
} from '@components';
import {BaseStyle, useTheme} from '@config';
import { connect } from "react-redux";
import _ from "lodash";
import Toast from "react-native-toast-message";
import { CometChat } from "@cometchat-pro/react-native-chat";

const { height, width } = Dimensions.get("window");

const SendPrivateMessagePane = ({ otherUser, sendMessageRef }) => {
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        activityLoading: false, 
        modalState: false,
        message: ""
    });

    const sendPrivateMessage = () => {

        const { message } = state;
        
        console.log("sendPrivateMessage clicked/ran...!", otherUser);

        const receiverID = otherUser;
        const messageText = message;
        const receiverType = CometChat.RECEIVER_TYPE.USER;
        const textMessage = new CometChat.TextMessage(
            receiverID,
            messageText,
            receiverType
        );

        console.log("submit comment clicked/ran...!");

        CometChat.sendMessage(textMessage).then(messageeee => {
                console.log("Message sent successfully:", messageeee);

                setState(prevState => {
                    return {
                        ...prevState,
                        message: ""
                    }
                })

                setTimeout(() => {
                    sendMessageRef.current.close();

                    Toast.show({
                        type: 'success',
                        text1: `Successfully sent message!`,
                        text2: "We've successfully processed your request and sent your message...",
                        visibilityTime: 3250,
                        position: "bottom"
                    });
                }, 1275);
            }, error => {
                console.log("Message sending failed with error:", error);
            }
        );
    }
    
    const renderMessageConfirmationDialog = () => {
        return (
            <Dialog.Container visible={state.modalState}
                contentStyle={styles.dialogContainerStyle}
            >
                <View style={{ alignItems: 'center', }}>
                    <Text style={{ paddingBottom: 15.0, fontSize: 17.25 }}>
                        Are you sure you'd like to send this message?
                    </Text>
                    <View style={styles.modalHrLine} />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 20
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        modalState: false
                                    }
                                })
                            }}
                            style={styles.cancelButtonStyle}
                        >
                            <Text style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Cancel.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9}
                            onPress={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        modalState: false,
                                        activityLoading: true
                                    }
                                })
                                setTimeout(() => {
                                    sendPrivateMessage();
                                },  375);
                            }}
                            style={styles.logOutButtonStyle}
                        >
                            <Text style={{ textAlign: "center", fontWeight: "bold", color: "#fff" }}>Send Message!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog.Container>
        )
    }
    const renderRemainingCharCountCheck = () => {
        const { message } = state;
        const minChar = 40;

        if (typeof message !== "undefined" && message.length <= 40) {
            return <Text style={colorSchemeDark ? [styles.charLengthCheckText, { color: "#000" }] : styles.charLengthCheckText}>You still must enter another <Text style={{ fontWeight: "bold", textDecorationLine: "underline", color: "red" }}>{minChar - message.length}</Text> characters before sending...</Text>;
        } 
    }

    const calculateDisabledButton = () => {
        const { message } = state;

        if ((typeof message !== "undefined" && message.length >= 40)) {
            return false;
        } else {
            return true;
        }
    }
    // return pane logic/JSX data...
    return (
        <Fragment>
            <View style={styles.mainWrapper}>
                {renderMessageConfirmationDialog()}
                {state.activityLoading === true ? <ActivityIndicator size="large" style={styles.activityPostingToDB} color="#fff" /> : null}
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' contentContainerStyle={{ paddingBottom: 125 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={Platform.OS === "ios" ? { flexGrow: 1, minHeight: height * 1.25, paddingTop: 50 } : { flexGrow: 1, minHeight: height * 1.25 }}>
                        <Text style={colorSchemeDark ? [styles.labelTextInput, { color: "#000" }] : styles.labelTextInput}>Enter your <Text style={{ fontWeight: "400", textDecorationLine: "underline", color: "blue" }}>message</Text> to the mentor you're working with...</Text>
                        <CustomTextInput
                            style={colorSchemeDark ? [BaseStyle.textInput, { backgroundColor: colors.card, color: "#fff", minHeight: 325, marginTop: 12.25, textAlignVertical: "top", paddingTop: 12.25 }] : [BaseStyle.textInput, { backgroundColor: colors.card, color: "#000", minHeight: 325, marginTop: 12.25, textAlignVertical: "top", paddingTop: 12.25 }]}
                            placeholder={"Enter your comment/message to your mentor/companion-guide (Enter between 40-275 characters - min/max)"}
                            placeholderTextColor={"#909090"}
                            maxLength={375}
                            value={state.message}
                            onChangeText={(value) => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        message: value
                                    }
                                })
                            }}
                            selectionColor={colors.primary}
                            onSubmitEditing={() => null}
                            blurOnSubmit={true}
                            multiline={true}
                            numberOfLines={10}
                        />
                        {renderRemainingCharCountCheck()}
                        <View style={styles.hrLine} />
                        <Button onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    modalState: true
                                }
                            })
                        }} style={calculateDisabledButton() ? { backgroundColor: "lightgrey" } : { backgroundColor: colors.primary }} disabled={calculateDisabledButton()}>
                            {"Send New Message"}
                        </Button>
                        <View style={styles.hrLine} />
                        <Button onPress={() => {
                            sendMessageRef.current.close();
                        }} style={{ backgroundColor: colors.accent }}>
                            {"Cancel/Close Pane"}
                        </Button>
                        <View style={styles.hrLine} />
                    </ScrollView>
                </KeyboardAwareScrollView>
            </View>
        </Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, { })(SendPrivateMessagePane);