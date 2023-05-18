import React, { Fragment, useState, useCallback } from "react";
import { View, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, useColorScheme, TextInput as CustomTextInput } from "react-native";
import { BASE_URL } from "@env";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from "axios";
import Dialog from "react-native-dialog";
import { CometChat } from "@cometchat-pro/react-native-chat";
import styles from "./boostedPaneStyles.js";
import {
    Image,
    Text,
    Button,
    Icon,
    TextInput
} from '@components';
import { useTranslation } from 'react-i18next';
import { useTheme, BaseStyle, BaseColor } from '@config';
import { connect } from "react-redux";
import _ from "lodash";
import Toast from "react-native-toast-message";
import { useFocusEffect } from '@react-navigation/native';
import { Switch } from 'react-native-switch';
                        

const { height, width } = Dimensions.get("window");

const SendPrivateMessageBoostedPane = ({ otherUser, authData, sendPrivateMessageRef }) => {
    const {colors, theme} = useTheme();
    const {t} = useTranslation();
    const [ tokenCount, setTokenCount ] = useState(15);
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        activityLoading: false, 
        modalState: false,
        message: "",
        user: null,
        subject: "",
        useCredit: false
    });

    useFocusEffect(
        useCallback(() => {
            // load user data to check credit count
            const config = {
                params: {
                    uniqueId: authData.uniqueId,
                    accountType: authData.accountType,
                    returnTokens: false
                }
            }

            axios.get(`${BASE_URL}/gather/user/profile`, config).then((res) => {
                if (res.data.message === "Successfully gathered profile!") {
                    console.log(res.data);

                    const { user } = res.data;

                    setState(prevState => {
                        return {
                            ...prevState,
                            user
                        }
                    })
                } else {
                    console.log("Err", res.data);
                }
            }).catch((err) => {
                console.log(err.message);
            })
    }, []));

    
    const sendPrivateMessage = () => {

        const { subject, message } = state;
        
        console.log("sendPrivateMessage clicked/ran...!", otherUser.uniqueId);

        const metadata = { promoted: true }

        const receiverID = otherUser.uniqueId;
        const messageText = `${message} \n\nThis user also attached ${tokenCount} tokens/coins of in-app currency as a token of appreciation!`;
        const receiverType = CometChat.RECEIVER_TYPE.USER;
        const textMessage = new CometChat.TextMessage(
            receiverID,
            messageText,
            receiverType
        );
        textMessage.setMetadata(metadata);

        axios.post(`${BASE_URL}/start/conversation/save/tokens/promoted`, {
            other_user: otherUser.uniqueId,
            user: authData.uniqueId,
            message,
            subject,
            coins: tokenCount,
            fullName: `${authData.firstName} ~ @${authData.username}`,
            uniqueId: authData.uniqueId,
            useCredit: state.useCredit
        }).then((res) => {
            if (res.data.message === "Sent notification and message!") {

                console.log(res.data);

                CometChat.sendMessage(textMessage).then(messageeee => {
                        console.log("Message sent successfully:", messageeee);

                        setState(prevState => {
                            return {
                                ...prevState,
                                message: "",
                                subject: ""
                            }
                        })
        
                        setTimeout(() => {
                            sendPrivateMessageRef.current.close();
        
                            Toast.show({
                                type: 'success',
                                text1: `Successfully sent message with tip!`,
                                text2: "We've successfully processed your request and sent your message as well as any attached tokens...",
                                visibilityTime: 3250,
                                position: "bottom"
                            });
                        }, 1275);

                    }, error => {
                        console.log("Message sending failed with error:", error);
                    }
                );
            } else if (res.data.message === "You do NOT have enough in-app tokens/coins to send to this user, please try this action again after buying tokens...") {
                sendPrivateMessageRef.current.close();

                Toast.show({
                    type: 'error',
                    text1: `You do NOT have enough tokens/coins to send this amount!`,
                    text2: res.data.message,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            } else {
                console.log("Err", res.data);

                sendPrivateMessageRef.current.close();

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while attempting to process your request...`,
                    text2: "We've encountered an error while processing your request, please try this action again or contact support if the problem persists.",
                    visibilityTime: 3250,
                    position: "bottom"
                });
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
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, height: height * 1.225 }}>
                        <View style={styles.flexedTopContainer}>
                            <Text style={colorSchemeDark ? [styles.labelTextInput, { marginBottom: 16.25, color: "#fff" }] : [styles.labelTextInput, { marginBottom: 16.25, color: "#000" }]}>Enter your <Text style={{ fontWeight: "bold", textDecorationLine: "underline", color: "blue" }}>subject</Text> to {otherUser.firstName} for your message...</Text>
                            <Text style={colorSchemeDark ? [styles.labelTextInput, { color: "#fff" }] : [styles.labelTextInput, { color: "#000" }]}>Enter a 'subject' (min 10 charecters)...</Text>
                            <TextInput
                                style={colorSchemeDark ? [BaseStyle.textInput, { marginTop: 12.25, color: "#fff" }] : [BaseStyle.textInput, { marginTop: 12.25 }]}
                                autoCorrect={false}
                                placeholder={"Enter your 'tagline/subject'"}
                                placeholderTextColor={BaseColor.grayColor}
                                value={state.subject}
                                onChangeText={(value) => {
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
                                style={colorSchemeDark ? [BaseStyle.textInput, { marginTop: 12.25, minHeight: 125, backgroundColor: colors.card, textAlignVertical: "top", color: "#fff", paddingTop: 10 }] : [BaseStyle.textInput, { marginTop: 12.25, minHeight: 125, backgroundColor: colors.card, color: "#000", textAlignVertical: "top", paddingTop: 10 }]}
                                autoCorrect={false}
                                placeholder={"Enter your 'private message' to send to ONLY this user... (Enter BETWEEN 40-275 Characters ~ this message is only viewable between both interacting parties)"}
                                placeholderTextColor={BaseColor.grayColor}
                                value={state.message}
                                onChangeText={value => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            message: value
                                        }
                                    })
                                }}
                                onSubmitEditing={() => null}
                                blurOnSubmit={true}
                                multiline={true}
                                numberOfLines={10}
                                selectionColor={colors.primary}
                            />
                            {renderRemainingCharCountCheck()}
                            <View style={styles.hrLine} />
                            <Text title3 semibold style={colorSchemeDark ? { marginTop: 10, marginBottom: 5, color: "#fff" } : { marginTop: 10, marginBottom: 5, color: "#000" }}>
                                Add Token's to prioritize your message!
                            </Text>
                            <View style={[styles.itemPrice, {borderColor: colors.border}]}>
                                <Text headline semibold style={{ color: "#000" }}>
                                    Add tokens to show appreciation to this user
                                </Text>
                                <Text body2 grayColor style={{marginVertical: 5}}>
                                    You can send tokens to this user to prioritize your message to be seen/responded to first. This goes DIRECTLY to the other user entirely which encourages them to respond to YOU FIRST!
                                </Text>
                                {state.useCredit === false ? <View style={styles.linePrice}>
                                    <Text title3 accentColor semibold>
                                        {tokenCount} token(s)
                                    </Text>
                                    <View style={styles.iconRight}>
                                        <TouchableOpacity onPress={() => tokenCount !== 0 ? setTokenCount(prevState => prevState >= 20 ? prevState -= 5 : prevState) : {}}>
                                            <Icon
                                                name="minus-circle"
                                                size={24}
                                                color={colors.accent}
                                            />
                                        </TouchableOpacity>
                                        <Text title1 style={colorSchemeDark ? { paddingHorizontal: 10, color: "#fff" } : { paddingHorizontal: 10, color: "#000" }}>
                                            {tokenCount}
                                        </Text>
                                        <TouchableOpacity onPress={() => setTokenCount(prevState => prevState += 5)}>
                                            <Icon name="plus-circle" size={24} color={colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>: null}
                                <View style={styles.hr} />
                                <View style={styles.linePrice}>
                                    <Text title3 primaryColor semibold>
                                        {state.user !== null && _.has(state.user, "superMessageCount") ? `${state.user.superMessageCount} credit(s)` : `Not Available`} 
                                    </Text>
                                    <View style={[styles.iconRight, { marginRight: 7.25 }]}>
                                        <Switch
                                            value={state.useCredit}
                                            onValueChange={(val) => setState(prevState => {
                                                return {
                                                    ...prevState,
                                                    useCredit: val
                                                }
                                            })}
                                            disabled={false}
                                            activeText={'Use 1 Credit!'}
                                            inActiveText={`Don't use credit`}
                                            circleSize={25}
                                            barHeight={25}
                                            circleBorderWidth={3}
                                            backgroundActive={"#000"}
                                            backgroundInactive={'gray'}
                                            circleActiveColor={BaseColor.greenColor}
                                            circleInActiveColor={colors.primary}
                                            changeValueImmediately={true}
                                            innerCircleStyle={{ alignItems: "center", justifyContent: "center", marginRight: 0 }}
                                            outerCircleStyle={{}}
                                            renderActiveText={true}
                                            renderInActiveText={true}
                                            switchLeftPx={2}
                                            switchRightPx={2}
                                            switchWidthMultiplier={5}
                                            switchBorderRadius={30}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.hrLine} />
                            <Button onPress={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        modalState: true
                                    }
                                })
                            }} style={{ backgroundColor: colors.primary }} disabled={calculateDisabledButton()}>
                                {t('Submit Private Boosted Message!')}
                            </Button>
                            <View style={styles.hrLine} />
                            <Button onPress={() => {
                                sendPrivateMessageRef.current.close();
                            }} style={{ backgroundColor: colors.accent }}>
                                {"Close Pane/Panel"}
                            </Button>
                            <View style={styles.hrLine} />
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
export default connect(mapStateToProps, { })(SendPrivateMessageBoostedPane);