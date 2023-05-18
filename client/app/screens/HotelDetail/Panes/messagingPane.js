import React, { Fragment, useState } from "react";
import { View, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, Platform, TextInput as CustomTextInput } from "react-native";
import { BASE_URL } from "@env";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from "axios";
import Dialog from "react-native-dialog";
import styles from "./messagingPaneStyles.js";
import {
    Text,
    Button,
    TextInput
} from '@components';
import {BaseStyle, useTheme} from '@config';
import { connect } from "react-redux";
import _ from "lodash";


const { height, width } = Dimensions.get("window");

const SendPrivateMessagePane = ({ meetingData, authData, setComments, sendCommentRef }) => {
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        activityLoading: false, 
        modalState: false,
        message: "",
        subject: ""
    });

    const sendPrivateMessage = () => {

        const { subject, message } = state;
        
        console.log("submit comment clicked/ran...!");

        const configuration = {
            meetingID: meetingData.id,
            userID: authData.uniqueId,
            message,
            subject,
            username: authData.username,
            nameUsername: `${authData.firstName} ~ @${authData.username}`
        };

        axios.post(`${BASE_URL}/submit/comment/meetup/group/new`, configuration).then((res) => {
            if (res.data.message === "Posted new comment on meetup!") {

                console.log(res.data);

                const { newComment } = res.data;

                setState(prevState => {
                    return {
                        ...prevState,
                        message: "",
                        subject: ""
                    }
                })

                const config = {
                    params: {
                        postedByID: newComment.postedByID
                    }
                };

                axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((ressssssss) => {
                    if (ressssssss.data.message === "Submitted gathered user's picture/file!") {

                        const { user } = ressssssss.data; 

                        newComment["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;

                        setComments(prevState => [...prevState, newComment])
                    } else {
                        newComment["lastProfilePic"] = null;

                        setComments(prevState => [...prevState, newComment])
                    }
                }).catch((err) => {
                    newComment["lastProfilePic"] = null;

                    setComments(prevState => [...prevState, newComment])
                })

                setTimeout(() => {
                    sendCommentRef.current.close();
                }, 1275);
            } else {
                console.log("Err", res.data);

                sendCommentRef.current.close();
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }
    
    const renderCommentConfirmationDialog = () => {
        return (
            <Dialog.Container visible={state.modalState}
                contentStyle={styles.dialogContainerStyle}
            >
                <View style={{ alignItems: 'center', }}>
                    <Text style={colorSchemeDark ? { paddingBottom: 15.0, fontSize: 17.25, color: "#fff" } : { paddingBottom: 15.0, fontSize: 17.25, color: "#000" }}>
                        Are you sure you'd like to post this comment? This is a comment on the 'meeting' selected, please click continue if you're ready to post your message...
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
                            <Text style={{ textAlign: "center", fontWeight: "bold", color: "#fff" }}>Post Message!</Text>
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
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, minHeight: height * 1.25 }}>
                        {Platform.OS === "ios" ? <View style={{ paddingTop: 22.25 }} /> : null}
                        <Text style={colorSchemeDark ? [styles.labelTextInput, { marginBottom: 16.25, color: "#000" }] : [styles.labelTextInput, { marginBottom: 16.25 }]}>Enter your <Text style={{ fontWeight: "400", textDecorationLine: "underline", color: "blue" }}>subject</Text> for your new group/meetup comment...</Text>
                        <Text style={[styles.label, { color: "#000" }]}>Enter a 'subject' (min 10 charecters)...</Text>
                        <TextInput
                            style={colorSchemeDark ? [BaseStyle.textInput, { backgroundColor: colors.card, color: "#fff" }] : [BaseStyle.textInput, { backgroundColor: colors.card, color: "#000" }]}
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
                        <Text style={colorSchemeDark ? [styles.labelTextInput, { color: "#000" }] : styles.labelTextInput}>Enter your <Text style={{ fontWeight: "400", textDecorationLine: "underline", color: "blue" }}>message</Text> to the group/meetup post comment's...</Text>
                        <CustomTextInput
                            style={colorSchemeDark ? [BaseStyle.textInput, { backgroundColor: colors.card, color: "#fff", minHeight: 325, marginTop: 12.25, textAlignVertical: "top", paddingTop: 12.25 }] : [BaseStyle.textInput, { backgroundColor: colors.card, color: "#000", minHeight: 325, marginTop: 12.25, textAlignVertical: "top", paddingTop: 12.25 }]}
                            placeholder={"Enter your meetup/group comment to be posted on the desired/selected meetup (Enter between 40-275 characters - min/max)"}
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
                            {"Submit New Comment"}
                        </Button>
                        <View style={styles.hrLine} />
                        <Button onPress={() => {
                            sendCommentRef.current.close();
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