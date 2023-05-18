import React, { Fragment, useState } from "react";
import {
    View,
    FlatList,
    TextInput as CustomTextInput
  } from 'react-native'
import styles from "./testMainStyles.js";
import { Text, Header, Icon, Button } from "@components";
import { useTheme, BaseColor } from '@config';
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@env";
import Toast from "react-native-toast-message";
import _ from "lodash";

const questionsQuestionare = [{
    label: "What was the best part of you day?",
    value: "What was the best part of you day?"
}, {
    label: "What were you for Halloween this year?",
    value: "What were you for Halloween this year?"
}, {
    label: "Do you like to read?",
    value: "Do you like to read?"
}, {
    label: "Do you go out a lot?",
    value: "Do you go out a lot?"
}, {
    label: "Go-to Karaoke song?",
    value: "Go-to Karaoke song?"
}, {
    label: "Mountains or beach?",
    value: "Mountains or beach?"
}, {
    label: "Do you talk to your family often?",
    value: "Do you talk to your family often?"
}, {
    label: "Do you find food places online and read reviews, or do you walk around until you find something?",
    value: "Do you find food places online and read reviews, or do you walk around until you find something?"
}, {
    label: "What's the worst job you've ever had?",
    value: "What's the worst job you've ever had?"
}, {
    label: "Are you super techie?",
    value: "Are you super techie?"
}, {
    label: "What's your favorite season to dress for?",
    value: "What's your favorite season to dress for?"
}, {
    label: "Are you into routines?",
    value: "Are you into routines?"
}, {
    label: "Do you think about celebrities a lot?",
    value: "Do you think about celebrities a lot?"
}, {
    label: "Do you like to make things?",
    value: "Do you like to make things?"
}, {
    label: "How did you meet your best friend?",
    value: "How did you meet your best friend?"
}, {
    label: "Are you a food sharer?",
    value: "Are you a food sharer?"
}, {
    label: "Do you clean before you have company over?",
    value: "Do you clean before you have company over?"
}, {
    label: "How long have you lived here?",
    value: "How long have you lived here?"
}, {
    label: `What are your "Treat Yo' Self" items?`,
    value: `What are your "Treat Yo' Self" items?`
}, {
    label: "Are you into sports?",
    value: "Are you into sports?"
}, {
    label: "What's your tipping vibe?",
    value: "What's your tipping vibe?"
}];

const RoundPersonalityQuestionareTestHelper = (props) => {

    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const navigation = useNavigation();
    const passedFromNotificaitonsTab = _.has(props, "route") && _.has(props.route, "params") && _.has(props.route.params, "notificationNav") ? props.route.params.notificationNav : null;
    const notificationPassed =  _.has(props, "route") && _.has(props.route, "params") && _.has(props.route.params, "notificationPassed") ? props.route.params.notificationPassed : null;
    const listing = _.has(props, "route") && _.has(props.route, "params") && _.has(props.route.params, "listing") ? props.route.params.listing : null;
    const authData = props.authData;

    console.log("listing", notificationPassed);

    const [ state, setState ] = useState({
        responses: {
            customOne: "",
            customTwo: "",
            question1: null,
            question2: null,
            question3: null,
            question4: null,
            question5: null,
            question6: null,
            question7: null,
            question8: null,
            question9: null,
            question10: null,
            question11: null,
            question12: null,
            question13: null,
            question14: null,
            question15: null,
            question16: null,
            question17: null,
            question18: null,
            question19: null,
            question20: null,
            question21: null
        }
    });

    const calculateDisabled = () => {
        const { customOne, customTwo, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, question11, question12, question13, question14, question15, question16, question17, question18, question19, question20, question21 } = state.responses;

        if ((typeof customOne !== "undefined" && customOne.length > 0) && (typeof customTwo !== "undefined" && customTwo.length > 0) && question1 !== null && question2 !== null && question3 !== null && question4 !== null && question5 !== null && question6 !== null && question7 !== null && question8 !== null && question9 !== null && question10 !== null && question11 !== null && question12 !== null && question13 !== null && question14 !== null && question15 !== null && question16 !== null && question17 !== null && question18 !== null && question19 !== null && question20 !== null && question21 !== null) {
            return false;
        } else {
            return true;
        }
    }

    const renderHeaderQuestions = React.useMemo(() => {
        return (
            <Fragment>
                <Button
                    style={calculateDisabled() ? { backgroundColor: "lightgrey" } : { backgroundColor: BaseColor.greenColor }}
                    onPress={() => handleFinalSubmission()}
                    disabled={calculateDisabled()}
                >
                    {"Submit Results To Main Organizer"}
                </Button>
                <View style={styles.mediumHR} />
                {passedFromNotificaitonsTab === true ? <Text style={styles.customScreeningQuestionText}>Please answer the following 23 questions. These will be relayed/sent to the the game facilitator of the compeition you're a part of, you can be as elaborate or as short with your responses as you'd like...</Text> : null}
                <View style={[styles.fullwidthTextContainerBlue, { backgroundColor: colors.primary }]}>
                    <Text style={styles.innerTextCustom}>{typeof props.questionOne !== "undefined" ? props.questionOne : listing.listingData.prescreeningOne}</Text>
                    {passedFromNotificaitonsTab === true ? <Fragment>
                        <View style={styles.mediumHR} />
                        <Text style={styles.labeled}>Enter your response below...</Text>
                        <CustomTextInput
                            maxLength={575}
                            multiline={true}
                            numberOfLines={3}
                            style={colorSchemeDark ? { backgroundColor: colors.card, borderRadius: 12.25, textAlignVertical: 'top', minHeight: 80, height: 80, padding: 7.25, marginTop: 12.25, color: "#fff", width: "87.25%" } : { backgroundColor: colors.card, borderRadius: 12.25, textAlignVertical: 'top', minHeight: 80, height: 80, padding: 7.25, marginTop: 12.25, color: "#000", width: "87.25%" }}
                            secureTextEntry={false}
                            onChangeText={text => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        responses: {
                                            ...prevState.responses,
                                            customOne: text
                                        }
                                    }
                                })
                            }}
                            placeholder={`Your response here... (you must complete every response before continuing or submitting)`}
                            value={state.responses.customOne}
                            placeholderTextColor={colorSchemeDark ? "darkgrey" : "darkgrey"}
                        />
                    </Fragment> : null}
                </View>
                <View style={[styles.fullwidthTextContainerBlue, { backgroundColor: colors.primary }]}>
                    <Text style={styles.innerTextCustom}>{typeof props.questionTwo !== "undefined" ? props.questionTwo : listing.listingData.prescreeningTwo}</Text>
                    {passedFromNotificaitonsTab === true ? <Fragment>
                        <View style={styles.mediumHR} />
                        <Text style={styles.labeled}>Enter your response below...</Text>
                        <CustomTextInput
                            maxLength={575}
                            multiline={true}
                            numberOfLines={3}
                            style={colorSchemeDark ? { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 80, height: 80, padding: 7.25, marginTop: 12.25, color: "#fff", width: "87.25%" } : { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 80, height: 80, padding: 7.25, marginTop: 12.25, color: "#000", width: "87.25%" }}
                            secureTextEntry={false}
                            onChangeText={text => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        responses: {
                                            ...prevState.responses,
                                            customTwo: text
                                        }
                                    }
                                })
                            }}
                            placeholder={`Your response here... (you must complete every response before continuing or submitting)`}
                            value={state.responses.customTwo}
                            placeholderTextColor={colorSchemeDark ? "darkgrey" : "darkgrey"}
                        />
                    </Fragment> : null}
                </View>
            </Fragment>
        );
    });

    const renderItem = ({ item, index }) => {
        return (
            <Fragment>
                <View style={styles.fullwidthTextContainer}>
                    <Text style={styles.innerTextCustom}>{item.label}</Text>
                    {passedFromNotificaitonsTab === true ? <Fragment>
                        <View style={styles.mediumHR} />
                        <Text style={styles.labeled}>Enter your response below...</Text>
                        <CustomTextInput
                            maxLength={575}
                            multiline={true}
                            numberOfLines={3}
                            style={colorSchemeDark ? { backgroundColor: colors.card, borderRadius: 12.25, textAlignVertical: 'top', minHeight: 80, height: 80, padding: 7.25, marginTop: 12.25, color: "#fff", width: "87.25%" } : { backgroundColor: colors.card, borderRadius: 12.25, textAlignVertical: 'top', minHeight: 80, height: 80, padding: 7.25, marginTop: 12.25, color: "#000", width: "87.25%" }}
                            secureTextEntry={false}
                            onChangeText={text => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        responses: {
                                            ...prevState.responses,
                                            [`question${index + 1}`]: {
                                                label: item.label,
                                                value: text
                                            }
                                        }
                                    }
                                })
                            }}
                            placeholder={`Your response here... (you must complete every response before continuing or submitting)`}
                            value={state.responses[`question${index + 1}`] !== null ? state.responses[`question${index + 1}`].value : ""}
                            placeholderTextColor={colorSchemeDark ? "darkgrey" : "darkgrey"}
                        />
                    </Fragment> : null}
                </View>
            </Fragment>
        );
    }

    const handleFinalSubmission = () => {
        console.log("handleFinalSubmission clicked/ran...");

        const config = {
            uniqueId: authData.uniqueId,
            accountType: authData.accountType,
            responses: state.responses,
            listingID: listing.id,
            otherUserID: listing.postedByID,
            notificationID: notificationPassed.id
        };

        axios.post(`${BASE_URL}/submit/results/data/round/one/game/compeitition`, config).then((res) => {
            if (res.data.message === "Successfully submitted results/data!") {
                console.log("Successfully submitted results/data!", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully submitted your results for round one!`,
                    text2: `Stay tuned for updates about your questionare. You will be accepted or declined based on the answers you've provided in this questionare...`,
                    visibilityTime: 3250,
                    position: "bottom",
                    onHide: () => {
                        navigation.replace("BottomTabNavigator", { screen: "Home" });
                    }
                });
            } else {
                console.log("Err", res.data);

                Toast.show({
                    type: 'error',
                    text1: `Error attempting submit your questionare/form-data!`,
                    text2: `An error occurred while attempting to submit your questionare/form-data - please try again or report to support if persists...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            }
        }).catch((err) => {

            // Toast.show({
            //     type: 'error',
            //     text1: `Error attempting submit your questionare/form-data!`,
            //     text2: `An error occurred while attempting to submit your questionare/form-data - please try again or report to support if persists...`,
            //     visibilityTime: 3250,
            //     position: "bottom"
            // });

            console.log(err.message);
        })
    }

    const renderFooterHelper = () => {
        return (
            <Fragment>
                <View style={styles.mediumHR} />
                <Button
                    style={calculateDisabled() ? { backgroundColor: "lightgrey" } : { backgroundColor: BaseColor.greenColor }}
                    onPress={() => handleFinalSubmission()}
                    disabled={calculateDisabled()}
                >
                    {"Submit Results To Main Organizer"}
                </Button>
                <View style={styles.mediumHR} />
            </Fragment>
        );
    };

    return (
        <View style={styles.container}>
            {passedFromNotificaitonsTab === true ? <Header
                title={"Game Questionare/Questions"}
                subTitle={"Answer these game questions..."}
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
            /> : null}
            <View style={passedFromNotificaitonsTab === true ? {} : { paddingBottom: 275 }}>
                <FlatList
                    contentContainerStyle={styles.selectableList}
                    data={questionsQuestionare}
                    style={{ flexGrow: 1 }}
                    ListHeaderComponent={passedFromNotificaitonsTab === true ? renderHeaderQuestions : null}
                    keyExtractor={(item) => `${item.label}`}
                    renderItem={renderItem}
                    ListFooterComponent={passedFromNotificaitonsTab === true ? renderFooterHelper : null}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
	return {
		authData: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, {  })(RoundPersonalityQuestionareTestHelper);