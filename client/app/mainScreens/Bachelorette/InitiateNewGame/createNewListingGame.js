import React, { Fragment, useState } from "react";
import { View, Image, ScrollView, Dimensions, TextInput as CustomTextInput } from 'react-native'
import Toast from "react-native-toast-message";
import styles from "./createNewListingGameStyles.js";
import { Text, Header, Icon, Button, TextInput } from "@components";
import { useTheme } from '@config';
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import Markdown from 'react-native-showdown';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from "react-redux";
import DatePicker from 'react-native-modern-datepicker';
import axios from "axios";
import { BASE_URL } from "@env";


const { width, height } = Dimensions.get("window");

const css = `body {
    font-family: Helvetica, arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: white;
    padding: 30px;
    color: #333;
  }
  
  body > *:first-child {
    margin-top: 0 !important;
  }
  
  body > *:last-child {
    margin-bottom: 0 !important;
  }
  
  a {
    color: #4183C4;
    text-decoration: none;
  }
  
  a.absent {
    color: #cc0000;
  }
  
  a.anchor {
    display: block;
    padding-left: 30px;
    margin-left: -30px;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 20px 0 10px;
    padding: 0;
    font-weight: bold;
    -webkit-font-smoothing: antialiased;
    cursor: text;
    position: relative;
  }
  
  h2:first-child, h1:first-child, h1:first-child + h2, h3:first-child, h4:first-child, h5:first-child, h6:first-child {
    margin-top: 0;
    padding-top: 0;
  }
  
  h1:hover a.anchor, h2:hover a.anchor, h3:hover a.anchor, h4:hover a.anchor, h5:hover a.anchor, h6:hover a.anchor {
    text-decoration: none;
  }
  
  h1 tt, h1 code {
    font-size: inherit;
  }
  
  h2 tt, h2 code {
    font-size: inherit;
  }
  
  h3 tt, h3 code {
    font-size: inherit;
  }
  
  h4 tt, h4 code {
    font-size: inherit;
  }
  
  h5 tt, h5 code {
    font-size: inherit;
  }
  
  h6 tt, h6 code {
    font-size: inherit;
  }
  
  h1 {
    font-size: 28px;
    color: black;
  }
  
  h2 {
    font-size: 24px;
    border-bottom: 1px solid #cccccc;
    color: black;
  }
  
  h3 {
    font-size: 18px;
  }
  
  h4 {
    font-size: 16px;
  }
  
  h5 {
    font-size: 14px;
  }
  
  h6 {
    color: #777777;
    font-size: 14px;
  }
  
  p, blockquote, ul, ol, dl, li, table, pre {
    margin: 15px 0;
  }
  
  hr {
    border: 0 none;
    color: #cccccc;
    height: 4px;
    padding: 0;
  }
  
  body > h2:first-child {
    margin-top: 0;
    padding-top: 0;
  }
  
  body > h1:first-child {
    margin-top: 0;
    padding-top: 0;
  }
  
  body > h1:first-child + h2 {
    margin-top: 0;
    padding-top: 0;
  }
  
  body > h3:first-child, body > h4:first-child, body > h5:first-child, body > h6:first-child {
    margin-top: 0;
    padding-top: 0;
  }
  
  a:first-child h1, a:first-child h2, a:first-child h3, a:first-child h4, a:first-child h5, a:first-child h6 {
    margin-top: 0;
    padding-top: 0;
  }
  
  h1 p, h2 p, h3 p, h4 p, h5 p, h6 p {
    margin-top: 0;
  }
  
  li p.first {
    display: inline-block;
  }
  
  ul, ol {
    padding-left: 30px;
  }
  
  ul :first-child, ol :first-child {
    margin-top: 0;
  }
  
  ul :last-child, ol :last-child {
    margin-bottom: 0;
  }
  
  dl {
    padding: 0;
  }
  
  dl dt {
    font-size: 14px;
    font-weight: bold;
    font-style: italic;
    padding: 0;
    margin: 15px 0 5px;
  }
  
  dl dt:first-child {
    padding: 0;
  }
  
  dl dt > :first-child {
    margin-top: 0;
  }
  
  dl dt > :last-child {
    margin-bottom: 0;
  }
  
  dl dd {
    margin: 0 0 15px;
    padding: 0 15px;
  }
  
  dl dd > :first-child {
    margin-top: 0;
  }
  
  dl dd > :last-child {
    margin-bottom: 0;
  }
  
  blockquote {
    border-left: 4px solid #dddddd;
    padding: 0 15px;
    color: #777777;
  }
  
  blockquote > :first-child {
    margin-top: 0;
  }
  
  blockquote > :last-child {
    margin-bottom: 0;
  }
  
  table {
    padding: 0;
  }
  table tr {
    border-top: 1px solid #cccccc;
    background-color: white;
    margin: 0;
    padding: 0;
  }
  
  table tr:nth-child(2n) {
    background-color: #f8f8f8;
  }
  
  table tr th {
    font-weight: bold;
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
  }
  
  table tr td {
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
  }
  
  table tr th :first-child, table tr td :first-child {
    margin-top: 0;
  }
  
  table tr th :last-child, table tr td :last-child {
    margin-bottom: 0;
  }
  
  img {
    max-width: 100%;
  }
  
  span.frame {
    display: block;
    overflow: hidden;
  }
  
  span.frame > span {
    border: 1px solid #dddddd;
    display: block;
    float: left;
    overflow: hidden;
    margin: 13px 0 0;
    padding: 7px;
    width: auto;
  }
  
  span.frame span img {
    display: block;
    float: left;
  }
  
  span.frame span span {
    clear: both;
    color: #333333;
    display: block;
    padding: 5px 0 0;
  }
  
  span.align-center {
    display: block;
    overflow: hidden;
    clear: both;
  }
  
  span.align-center > span {
    display: block;
    overflow: hidden;
    margin: 13px auto 0;
    text-align: center;
  }
  
  span.align-center span img {
    margin: 0 auto;
    text-align: center;
  }
  
  span.align-right {
    display: block;
    overflow: hidden;
    clear: both;
  }
  
  span.align-right > span {
    display: block;
    overflow: hidden;
    margin: 13px 0 0;
    text-align: right;
  }
  
  span.align-right span img {
    margin: 0;
    text-align: right;
  }
  
  span.float-left {
    display: block;
    margin-right: 13px;
    overflow: hidden;
    float: left;
  }
  
  span.float-left span {
    margin: 13px 0 0;
  }
  
  span.float-right {
    display: block;
    margin-left: 13px;
    overflow: hidden;
    float: right;
  }
  
  span.float-right > span {
    display: block;
    overflow: hidden;
    margin: 13px auto 0;
    text-align: right;
  }
  
  code, tt {
    margin: 0 2px;
    padding: 0 5px;
    white-space: nowrap;
    border: 1px solid #eaeaea;
    background-color: #f8f8f8;
    border-radius: 3px;
  }
  
  pre code {
    margin: 0;
    padding: 0;
    white-space: pre;
    border: none;
    background: transparent;
  }
  
  .highlight pre {
    background-color: #f8f8f8;
    border: 1px solid #cccccc;
    font-size: 13px;
    line-height: 19px;
    overflow: auto;
    padding: 6px 10px;
    border-radius: 3px;
  }
  
  pre {
    background-color: #f8f8f8;
    border: 1px solid #cccccc;
    font-size: 13px;
    line-height: 19px;
    overflow: auto;
    padding: 6px 10px;
    border-radius: 3px;
  }
  
  pre code, pre tt {
    background-color: transparent;
    border: none;
}`

const optionsSelect = [
    { "label": "1 User's (Max)", "value": 1},
    { "label": "2 User's (Max)", "value": 2},
    { "label": "3 User's (Max)", "value": 3},
    { "label": "4 User's (Max)", "value": 4},
    { "label": "5 User's (Max)", "value": 5},
    { "label": "6 User's (Max)", "value": 6},
    { "label": "7 User's (Max)", "value": 7},
    { "label": "8 User's (Max)", "value": 8},
    { "label": "9 User's (Max)", "value": 9},
    { "label": "10 User's (Max)", "value": 10},
    { "label": "11 User's (Max)", "value": 11},
    { "label": "12 User's (Max)", "value": 12},
    { "label": "13 User's (Max)", "value": 13},
    { "label": "14 User's (Max)", "value": 14},
    { "label": "15 User's (Max)", "value": 15},
    { "label": "16 User's (Max)", "value": 16},
    { "label": "17 User's (Max)", "value": 17},
    { "label": "18 User's (Max)", "value": 18},
    { "label": "19 User's (Max)", "value": 19},
    { "label": "20 User's (Max)", "value": 20},
    { "label": "21 User's (Max)", "value": 21},
    { "label": "22 User's (Max)", "value": 22},
    { "label": "23 User's (Max)", "value": 23},
    { "label": "24 User's (Max)", "value": 24},
    { "label": "25 User's (Max)", "value": 25},
    { "label": "26 User's (Max)", "value": 26},
    { "label": "27 User's (Max)", "value": 27},
    { "label": "28 User's (Max)", "value": 28},
    { "label": "29 User's (Max)", "value": 29},
    { "label": "30 User's (Max)", "value": 30}
];

const mostRelevantDatingTypeOptions = [
    { "label": "Monogamy", "value": "monogamy" },
    { "label": "Polygamy", "value": "polygamy" },
    { "label": "Polyamory", "value": "polyamory" },
    { "label": "Open relationship", "value": "open_relationship" },
    { "label": "Casual dating", "value": "casual_dating" },
    { "label": "Friends with benefits", "value": "friends_with_benefits" },
    { "label": "Long-distance relationship", "value": "long_distance_relationship" },
    { "label": "LGBTQ+ relationship", "value": "LGBTQ+" },
    { "label": "Asexual relationship", "value": "asexual_relationship" },
    { "label": "Interracial relationship", "value": "interracial_relationship" }
];

const CreateNewBacheloretteListingGame = ({ authData }) => {

    const { colors, theme } = useTheme();
    const navigation = useNavigation();
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        title: "",
        subtitle: "",
        prescreeningOne: "",
        desiredGoal: null,
        prescreeningTwo: "",
        canidateCount: null,
        relationshipType: null,
        rewardCountTokens: 0,
        showModal: false,
        startDate: "",
        endDate: "",
        currentDate: null
    });

    console.log("sdtateeeeee", state);

    const calculationDisabled = () => {

        const {
            title,
            subtitle,
            prescreeningOne,
            desiredGoal,
            prescreeningTwo,
            canidateCount,
            relationshipType,
            rewardCountTokens,
            startDate,
            endDate
        } = state;

        if ((typeof title !== "undefined" && title.length > 0) && (typeof subtitle !== "undefined" && subtitle.length > 0) && (typeof prescreeningOne !== "undefined" && prescreeningOne.length > 0) && (typeof prescreeningTwo !== "undefined" && prescreeningTwo.length > 0) && (desiredGoal !== null) && (canidateCount !== null) && (relationshipType !== null) && (rewardCountTokens !== 0) && (typeof startDate !== "undefined" && startDate !== "" && startDate !== state.currentDate) && (typeof endDate !== "undefined" && endDate !== "" && endDate !== state.currentDate)) {
            return false;
        } else {
            return true;
        }
    }

    const handleFinalSubmission = () => {
        console.log("handleFinalSubmission clicked/ran...");

        const {
            title,
            subtitle,
            prescreeningOne,
            desiredGoal,
            prescreeningTwo,
            canidateCount,
            relationshipType,
            rewardCountTokens,
            startDate,
            endDate,
        } = state;

        const config = {
            uniqueId: authData.uniqueId,
            accountType: authData.accountType,
            formData: {
                title,
                subtitle,
                prescreeningOne,
                desiredGoal,
                prescreeningTwo,
                canidateCount,
                relationshipType,
                rewardCountTokens,
                startDate: startDate.split(" ")[0],
                endDate: endDate.split(" ")[0]
            }
        };

        axios.post(`${BASE_URL}/submit/bachelorette/game/initalize`, config).then((res) => {
            if (res.data.message === "Successfully initialized game!") {
                console.log("Successfully initialized game!", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully initialized the competition/game!`,
                    text2: `We've successfully posted your competition/game - check out the details on the following page...`,
                    visibilityTime: 2750,
                    position: "bottom",
                    onHide: () => {
                        navigation.replace("BacheloretteConfirmationAboutPage");
                    }
                });
            } else if (res.data.message === "You do NOT have enough tokens to purchase this item!") {
                Toast.show({
                    type: 'error',
                    text1: `Not enough coins in your account to purchase!`,
                    text2: `You need to buy more tokens to buy start this competition...`,
                    visibilityTime: 2750,
                    position: "bottom"
                });
            } else {
                console.log("Err", res.data);

                Toast.show({
                    type: 'error',
                    text1: `Error attempting list your competition/game!`,
                    text2: `An error occurred while attempting list your competition/game - please try again or report to support if persists...`,
                    visibilityTime: 2750,
                    position: "bottom"
                });
            }
        }).catch((err) => {

            // Toast.show({
            //     type: 'error',
            //     text1: `Error attempting list your competition/game!`,
            //     text2: `An error occurred while attempting list your competition/game - please try again or report to support if persists...`,
            //     visibilityTime: 2750,
            //     position: "bottom"
            // });

            console.log(err.message);
        })
    }

    return (
        <Fragment>
            <Modal
                isVisible={state.showModal}
                backdropColor="rgba(0, 0, 0, 0.5)"
                backdropOpacity={1}
                animationIn="fadeIn"
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
            >
                <View style={[{ backgroundColor: "#fff", borderRadius: 12.25, borderWidth: 2, borderColor: "#000", minHeight: height * 0.875 }]}>
                    <Markdown markdown={`###Some of the typical questions that contestants may be asked during the casting process may include (we'll ask these questions for you):

1. Questions about their dating history and relationship experience
2. Questions about their career, hobbies, and interests
3. Questions about their family and upbringing
4. Questions about their beliefs, values, and goals in life
5. Questions about their personality traits, strengths, and weaknesses
6. Questions about their views on love, commitment, and marriage
7. Questions about their willingness to participate in the show's activities and follow the rules`} css={css} />
                    <View style={styles.hr} />
                    <Button style={{ width: "100%" }} outline onPress={() => setState(prevState => {
                        return {
                            ...prevState,
                            showModal: false
                        }
                    })}>
                        {"Cancel/Close Modal"}
                    </Button>
                </View>
            </Modal>
            <Header
                title={"Bachelorette Games"}
                subTitle="Join a new bachelorette group..."
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
                            name="info"
                            size={20}
                            color={colors.primary}
                            enableRTL={true}
                        />
                    );
                }}
                onPressRight={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            showModal: true
                        }
                    })
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 75 }} style={styles.container}>
                <KeyboardAwareScrollView style={{ margin: 12.25 }} keyboardShouldPersistTaps='always'>
                    <View style={styles.centered}>
                        <Image source={require("../../../assets/images/realitytv.jpeg")} style={styles.realitytvImage} />
                    </View>
                    <Text style={[styles.mainHeaderText, { color: colors.accent }]}>Some of these questions are answered during the first/initial round of the 4-step competition/game process... Anyone can apply/join but they will need to be approved by you which they will then answer the provided data/questions created below...</Text>
                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>Enter your title for the game/competition</Text>
                        <TextInput
                            placeholder="Enter your title..."
                            placeholderTextColor={"darkgrey"}
                            style={styles.textInputCustom}
                            secureTextEntry={false}
                            value={state.title}
                            onChangeText={(value) => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        title: value
                                    }
                                })
                            }}
                        />
                    </View>
                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>Enter your sub-title for the game/competition</Text>
                        <TextInput
                            placeholder="Enter your subtitle..."
                            placeholderTextColor={"darkgrey"}
                            style={styles.textInputCustom}
                            secureTextEntry={false}
                            value={state.subtitle}
                            onChangeText={(value) => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        subtitle: value
                                    }
                                })
                            }}
                        />
                    </View>
                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>Enter a custom prescreening question for user's to answer (first question)</Text>
                        <CustomTextInput
                            maxLength={750}
                            multiline={true}
                            numberOfLines={5}
                            style={colorSchemeDark ? { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 150, height: 150, padding: 7.25, marginTop: 12.25, color: "#fff" } : { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 150, height: 150, padding: 7.25, marginTop: 12.25, color: "#000" }}
                            secureTextEntry={false}
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    prescreeningOne: text
                                }
                            })}
                            placeholder={`Enter your prescreening question (One)... \n\nUser's will answer these questions which you'll be able to reject/accept based on their responses ensuring a good candiate pool...`}
                            value={state.prescreeningOne}
                            placeholderTextColor={colorSchemeDark ? "darkgrey" : "darkgrey"}
                        />
                    </View>
                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>Enter a custom prescreening question for user's to answer (second question)</Text>
                        <CustomTextInput
                            maxLength={750}
                            multiline={true}
                            numberOfLines={5}
                            style={colorSchemeDark ? { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 150, height: 150, padding: 7.25, marginTop: 12.25, color: "#fff" } : { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 150, height: 150, padding: 7.25, marginTop: 12.25, color: "#000" }}
                            secureTextEntry={false}
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    prescreeningTwo: text
                                }
                            })}
                            placeholder={`Enter your prescreening question (Two)... \n\nUser's will answer these questions which you'll be able to reject/accept based on their responses ensuring a good candiate pool...`}
                            value={state.prescreeningTwo}
                            placeholderTextColor={colorSchemeDark ? "darkgrey" : "darkgrey"}
                        />
                    </View>
                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>Select how many user's you'd like to allow to join the canidate pool</Text>
                        <RNPickerSelect 
                            onValueChange={(value) => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        canidateCount: value
                                    }
                                })
                            }}
                            textInputProps={colorSchemeDark ? { color: "#fff", minHeight: 62.25 } : { color: "grey", minHeight: 62.25 }}
                            value={state.canidateCount}
                            placeholderTextColor={colorSchemeDark ? { color: "#fff" } : { color: "grey" }}
                            contentContainerStyle={styles.centered}
                            useNativeAndroidPickerStyle={false}
                            items={optionsSelect}
                        />
                    </View>
                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>Select the 'dating type' you most resonate with or align with...</Text>
                        <RNPickerSelect 
                            onValueChange={(value) => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        relationshipType: value
                                    }
                                })
                            }}
                            textInputProps={colorSchemeDark ? { color: "#fff", minHeight: 62.25 } : { color: "grey", minHeight: 62.25 }}
                            value={state.relationshipType}
                            placeholderTextColor={colorSchemeDark ? { color: "#fff" } : { color: "grey" }}
                            contentContainerStyle={styles.centered}
                            useNativeAndroidPickerStyle={false}
                            items={mostRelevantDatingTypeOptions}
                        />
                    </View>
                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>What are you most interested in achieving with this competition/game?</Text>
                        <CustomTextInput
                            maxLength={750}
                            multiline={true}
                            numberOfLines={5}
                            style={colorSchemeDark ? { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 150, height: 150, padding: 7.25, marginTop: 12.25, color: "#fff" } : { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 150, height: 150, padding: 7.25, marginTop: 12.25, color: "#000" }}
                            secureTextEntry={false}
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    desiredGoal: text
                                }
                            })}
                            placeholder={`Please elaborate on what you'd like to achieve with this contest... Please be detailed, thourough & explantory in your response.`}
                            value={state.desiredGoal}
                            placeholderTextColor={colorSchemeDark ? "darkgrey" : "darkgrey"}
                        />
                    </View>
                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>Enter the token's you'd like to reward the winner with! We will split the cost with you so <Text style={{ color: colors.primary }}>you will ONLY be charged half of this number (125 tokens max ~ Equivalent of $25.00 USD)</Text>...</Text>
                        <TextInput
                            placeholder="Enter your token reward count..."
                            placeholderTextColor={"darkgrey"}
                            style={styles.textInputCustom}
                            secureTextEntry={false}
                            keyboardType={"number-pad"}
                            value={state.rewardCountTokens}
                            onChangeText={(value) => {
                                if (Number(value) <= 125) {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            rewardCountTokens: Number(value)
                                        }
                                    })
                                }
                            }}
                        />
                    </View>
                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>Select the <Text style={{ color: colors.accent }}>MINIMUM</Text> particpating birthdate for contestants (the youngest you're comfortable with)...</Text>
                        <DatePicker
                            mode="monthYear"
                            style={{ marginTop: 22.25 }}
                            selected={state.startDate}
                            current={moment(new Date(moment(new Date()).subtract(18, 'Y'))).format("YYYY/MM/DD")}
                            maximumDate={(new Date().getFullYear()) - 18}
                            minimumDate={1970}
                            onMonthYearChange={selectedDate => setState(prevState => {
                                return {
                                    ...prevState,
                                    startDate: selectedDate
                                }
                            })}
                        />
                    </View>
                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>Select the <Text style={{ color: colors.accent }}>MAXIMUM</Text> particpating birthdate for contestants (the oldest you're comfortable with)...</Text>
                        <DatePicker
                            mode="monthYear"
                            style={{ marginTop: 22.25 }}
                            selected={state.endDate}
                            maximumDate={(new Date().getFullYear()) - 18}
                            minimumDate={1970}
                            current={moment(new Date(moment(new Date()).subtract(18, 'Y'))).format("YYYY/MM/DD")}
                            onMonthYearChange={selectedDate => setState(prevState => {
                                return {
                                    ...prevState,
                                    endDate: selectedDate
                                }
                            })}
                        />
                    </View>
                    <View style={styles.hr} />
                    <View style={styles.spacerContainer}>
                        <Button disabled={calculationDisabled()} style={calculationDisabled() ? { width: "100%", backgroundColor: "lightgrey" } : { width: "100%" }} outline onPress={() => handleFinalSubmission()}>
                            {"Submit & Post Competition!"}
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
            </ScrollView>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
	return {
		authData: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, {  })(CreateNewBacheloretteListingGame);