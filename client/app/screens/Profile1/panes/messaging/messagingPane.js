import React, { Fragment, useState } from "react";
import { View, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, useColorScheme, TextInput as CustomTextInput } from "react-native";
import { BASE_URL } from "@env";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from "axios";
import Dialog from "react-native-dialog";
import { CometChat } from "@cometchat-pro/react-native-chat";
import styles from "./messagingPaneStyles.js";
import {
    Image,
    Text,
    Button,
    TextInput
} from '@components';
import {useTranslation} from 'react-i18next';
import {BaseStyle, useTheme} from '@config';
import { connect } from "react-redux";
import _ from "lodash";


const { height, width } = Dimensions.get("window");

const SendPrivateMessagePaneIndividualProfile = ({ otherUser, authData, setStateOutter, sendPrivateMessageRef }) => {
    
    const {colors, theme} = useTheme();
    const {t} = useTranslation();
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        activityLoading: false, 
        modalState: false,
        message: "",
        subject: ""
    });

    const sendPrivateMessage = () => {

        const { subject, message } = state;
        
        console.log("sendPrivateMessage clicked/ran...!", otherUser.uniqueId);

        const receiverID = otherUser.uniqueId;
        const messageText = message;
        const receiverType = CometChat.RECEIVER_TYPE.USER;
        const textMessage = new CometChat.TextMessage(
            receiverID,
            messageText,
            receiverType
        );

        CometChat.sendMessage(textMessage).then(messageeee => {
                console.log("Message sent successfully:", messageeee);

                axios.post(`${BASE_URL}/start/conversation/save`, {
                    other_user: otherUser.uniqueId,
                    user: authData.uniqueId,
                    message,
                    subject,
                    fullName: `${authData.firstName} ~ @${authData.username}`
                }).then((res) => {
                    if (res.data.message === "Sent notification and message!") {

                        console.log(res.data);

                        setState(prevState => {
                            return {
                                ...prevState,
                                message: "",
                                subject: ""
                            }
                        })
        
                        setTimeout(() => {
                            sendPrivateMessageRef.current.close();
                        }, 1275);
                    } else {
                        console.log("Err", res.data);

                        sendPrivateMessageRef.current.close();
                    }
                }).catch((err) => {
                    console.log(err.message);
                })
            }, error => {
                console.log("Message sending failed with error:", error);
            }
        );
    }
    
    const renderCommentConfirmationDialog = () => {
        return (
            <Dialog.Container visible={state.modalState}
                contentStyle={styles.dialogContainerStyle}
            >
                <View style={{ alignItems: 'center', }}>
                    <Text style={{ paddingBottom: 15.0, fontSize: 17.25, color: "#000" }}>
                        Are you sure you'd like to send this private message? This is a PRIVATE message (only visible between you and the other user), please click continue if you're ready to send your message...
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
            return <Text style={colorSchemeDark ? [styles.charLengthCheckText, { color: "#fff" }] : [styles.charLengthCheckText, { color: "#000" }]}>You still must enter another <Text style={{ fontWeight: "bold", textDecorationLine: "underline", color: "red" }}>{minChar - message.length}</Text> characters before sending...</Text>;
        } 
    }

    const calculateDisabledButton = () => {
        const { message, subject } = state;

        if ((typeof message !== "undefined" && message.length >= 40) && (typeof subject !== "undefined" && subject.length >= 10)) {
            return false;
        } else {
            return true;
        }
    }
    // return pane logic/JSX data...
    return (
        <Fragment>
            <View style={styles.mainWrapper}>
                {renderCommentConfirmationDialog()}
                {state.activityLoading === true ? <ActivityIndicator size="large" style={styles.activityPostingToDB} color="#fff" /> : null}
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' contentContainerStyle={{ paddingBottom: 125 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, minHeight: height * 1.075 }}>
                        <View style={styles.flexedTopContainer}>
                            <Text style={colorSchemeDark ? [styles.labelTextInput, { marginBottom: 16.25, color: "#fff" }] : [styles.labelTextInput, { marginBottom: 16.25, color: "#000" }]}>Enter your <Text style={{ fontWeight: "bold", textDecorationLine: "underline", color: "blue" }}>subject</Text> to {otherUser.firstName} for your message...</Text>
                            <TextInput
                                style={[BaseStyle.textInput, { backgroundColor: colors.card }]}
                                placeholder={"Enter your 'tagline/subject'"}
                                placeholderTextColor={"#909090"}
                                maxLength={50}
                                value={state.subject}
                                onChangeText={value => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            subject: value
                                        }
                                    })
                                }}
                                selectionColor={colors.primary}
                            />
                            <View style={[styles.hrLineTopPortion, { marginBottom: 13.25, marginTop: 23.25 }]} />
                            <Text style={colorSchemeDark ? [styles.labelTextInput, { color: "#fff" }] : [styles.labelTextInput, { color: "#000" }]}>Enter your message to be sent <Text style={{ fontWeight: "bold", textDecorationLine: "underline", color: "blue" }}>privately</Text> to {otherUser.firstName} A.K.A. {otherUser.username}</Text>
                            <CustomTextInput
                                style={colorSchemeDark ? [BaseStyle.textInput, { backgroundColor: colors.card, color: "#fff", minHeight: 325, marginTop: 12.25, textAlignVertical: "top", paddingTop: 12.25 }] : [BaseStyle.textInput, { backgroundColor: colors.card, minHeight: 325, color: "#000", marginTop: 12.25, textAlignVertical: "top", paddingTop: 12.25 }]}
                                placeholder={"Enter your 'private message' to send to ONLY this user... (Enter BETWEEN 40-275 Characters ~ this message is only viewable between both interacting parties)"}
                                placeholderTextColor={"#909090"}
                                maxLength={275}
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
                            }} style={{ backgroundColor: colors.primary }} disabled={calculateDisabledButton()}>
                                {t('Submit Private Message!')}
                            </Button>
                            <View style={styles.hrLine} />
                            <Button onPress={() => sendPrivateMessageRef.current.close()} style={{ backgroundColor: colors.accent }}>
                                {"Cancel/Close Pane"}
                            </Button>
                        </View>
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
export default connect(mapStateToProps, { })(SendPrivateMessagePaneIndividualProfile);