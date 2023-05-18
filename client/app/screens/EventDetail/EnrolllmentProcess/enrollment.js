import React, { Fragment, useState } from "react";
import { Text, Icon, Header, SafeAreaView, Button } from "@components";
import styles from "./enrollmentStyles.js";
import { View, useColorScheme, TextInput as CustomTextInput, ScrollView, Image, Dimensions, TouchableOpacity } from "react-native";
import { BaseColor, Images, useTheme } from '@config';
import Markdown from 'react-native-showdown';
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import CalendarStrip from 'react-native-calendar-strip';
import moment from "moment";
import DatePicker from 'react-native-modern-datepicker';
import MultiSelect from 'react-native-multiple-select';
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@env";
import _ from "lodash";
import Toast from "react-native-toast-message";
import Spinner from 'react-native-loading-spinner-overlay';

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
const instructionText = `1. Reflective listening \n\n  
Reflective listening is a specific type of couples therapy that can be beneficial for partners who want to work on their communication skills. By being in a healthy, safe environment where each person takes a turn being an active listener, giving the other partner an opportunity to speak freely, communication can be greatly enhanced. Read our guide on communication exercises for couples to learn more. 

When we rephrase our statements using “I” phrases instead of “you” statements, a more productive conversation can be had. 

For example, rather than saying “you hurt my feelings when you’re late,” you could express your feelings more productively by saying something more along the lines of “I feel hurt when you are late.”

> “Reflective listening is a skill that we have to practice because, for most of us, it doesn’t come naturally. A lot of couples are focused on winning a conversation, which puts our focus on our counter argument rather than putting our focus on how well we understand our partners. In couple’s counseling, it is less important about what content is exchanged and way more important to focus on how it is exchanged.

2. Emotion focussed therapy \n\n 

Emotion focused therapy (EFT) is an effective couples counseling technique. EFT can help identify destructive patterns in a relationship that begin to interfere with attachments, ultimately preventing two people from bonding. By focusing on those patterns and behaviors that create a disconnect in the relationship, two people can begin healing and bonding in a more positive manner.

The American Psychological Association (APA) states that EFT is effective and helpful for about 75% of couples who use it.

3. Narrative Therapy \n\n 

Narrative therapy is a very specific therapy technique that involves both partners describing their relationship problems in narrative form. They’re then encouraged to rewrite their stories. The goal of narrative therapy is to help couples see that one single story on its own can’t truly encompass an entire experience together.

Narrative therapy is typically helpful when both people feel they’re to blame for the demise of a relationship. It can be a great form of therapy when each partner has the mindset that they’re a failure, and thus, they deserve a failing relationship.

4. Solution-focussed Therapy \n\n 

Solution-focused therapy works best for couples who have a specific issue they want to work on in their relationship. The approach is helpful when working towards a short-term relationship goal. It helps couples create a solution to relationship issues they’re having instead of sitting in the same place and dwelling on the same problems.

5. Gottman method \n\n 

The Gottman method can help couples create a deeper understanding of each other even during times of conflict in their relationship. The method aims to give couples specific problem-solving skills that enhance intimacy and friendship between partners. 

While traditionally it utilizes live workshops and homework in the form of take-home training materials, many therapists have trained to use adapted techniques of the Gottman method with couples in a private setting during therapy sessions. 

6. Imago relationship therapy (IRT) \n\n 

Imago relationship therapy (IRT) helps couples identify childhood experiences that have created an impact on adult relationships. For example, imago therapy can help you uncover the reason for commitment issues or relationship anxiety. Through an extensive exploration of childhood trauma, couples can become more understanding and empathetic towards one another.
`;

const options = [{
    label: "Nothing Specific - General",
    value: "Nothing Specific - General"
}, {
    label: "Reflective listening",
    value: "reflective-listening"
}, {
    label: "Emotion focused therapy",
    value: "emotion-focused-therapy"
}, {
    label: "Narrative therapy",
    value: "narrative-therapy"
}, {
    label: "Solution-focused therapy",
    value: "solution-focused-therapy"
}, {
    label: "Gottman method",
    value: "gottman-method"
}, {
    label: "Imago relationship therapy (IRT)",
    value: "imago-relationship-therapy(irt)"
}]

const EnrollmentStartProcess = (props) => {
    console.log("props", props.route.params.data);

    const authData = props.authData;
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;

    console.log("colorSchemeDark", colorSchemeDark);

    const navigation = useNavigation();

    const [ state, setState ] = useState({
        markdownText: "### Click the top right Icon to see 'markdown' functionality or 'how-to' \n\n # This is a heading-1 \n\n ## This is a heading-2 \n\n ### This is a heading-3 \n\n **this is bold** \n\n 1. list item \n\n 2. second list item",
        modalVisible: false,
        tierSelected: props.route.params.data,
        otherUser: props.route.params.userData,
        therapyTypesModal: false,
        page: 1,
        showMap: false,
        time: null,
        selectedDate: {
            dateOne: null,
            dateTwo: null,
            dateThree: null
        },
        problemsText: "",
        description: "",
        selectedImprovement: [],
        scrollable: true
    })

    const renderMainContent = () => {
        if (state.page === 1) {
            return (
                <Fragment>
                    {renderSelected()}
                    <View style={styles.hr} />
                    <Text style={styles.label}>Send your initial message to this mentor/companion user so they can get to know you, this can contain anything about you</Text>
                    <View style={{ flex: 1 }}>
                        <CustomTextInput
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    markdownText: text
                                }
                            })}
                            onFocus={() => {
                                if (state.markdownText === "### Click the top right Icon to see 'markdown' functionality or 'how-to' \n\n # This is a heading-1 \n\n ## This is a heading-2 \n\n ### This is a heading-3 \n\n **this is bold** \n\n 1. list item \n\n 2. second list item") {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            markdownText: ""
                                        }
                                    })
                                }
                            }}
                            multiline={true}
                            numberOfLines={state.markdownText === "### Click the top right Icon to see 'markdown' functionality or 'how-to' \n\n # This is a heading-1 \n\n ## This is a heading-2 \n\n ### This is a heading-3 \n\n **this is bold** \n\n 1. list item \n\n 2. second list item" ? 9 : 5}
                            style={colorSchemeDark ? { backgroundColor: colors.card, textAlignVertical: 'top', color: "#fff", minHeight: 300 } : { backgroundColor: colors.card, textAlignVertical: 'top', color: "#000", minHeight: 300 }}
                            secureTextEntry={false}
                            placeholder="Enter your message to the counselor/mentor so they can get to know ya...!"
                            value={state.markdownText}
                        />
                        <Text style={styles.label}>This is your message converted to 'markdown'</Text>
                        <ScrollView onTouchStart={(ev) => { 
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    scrollable: false
                                }
                            })
                        }}
                        onTouchEnd={(ev) => { 
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    scrollable: true
                                }
                            })
                        }} contentContainerStyle={{ height: 425, flex: 1 }} style={{ height: 425, flex: 1 }}>
                            <Markdown markdown={state.markdownText} css={css} />
                        </ScrollView>
                    </View>
                </Fragment>
            );
        } else if (state.page === 2) {

            const calculateWhichTier = () => {
                const { tierSelected } = state;

                if (tierSelected === "tier-1") {
                    return (
                        <Fragment>
                            <CalendarStrip
                                scrollable
                                style={{ height: 125, paddingVertical: 10 }}
                                calendarColor={colors.accent}
                                calendarHeaderStyle={{ color: 'white' }}
                                dateNumberStyle={{ color: 'white' }}
                                dateNameStyle={{ color: 'white' }}
                                iconContainer={{ flex: 0.1 }}
                                startingDate={moment(new Date()).add(2, "weeks")}
                                minDate={moment(new Date()).add(2, "weeks")}
                                onDateSelected={(date) => setState(prevState => {
                                    return {
                                        ...prevState,
                                        selectedDate: {
                                            ...prevState.selectedDate,
                                            dateOne: date
                                        }
                                    }
                                })}
                            />
                            <Text style={[styles.label, { textAlign: "left" }]}>Select your recurring (if applicable) date/day to continuously meet on</Text>
                            <View style={styles.hr} />
                            <Text style={styles.label}>Select the 'time' you'd like to have your appointment meetings on</Text>
                            <DatePicker
                                mode="time"
                                minuteInterval={15}
                                onTimeChange={selectedTime => setState(prevState => {
                                    console.log("selectedTime", selectedTime);
                                    return {
                                        ...prevState,
                                        time: selectedTime
                                    }
                                })}
                            />
                            <View style={styles.hr} />
                            {state.selectedDate.dateOne !== null ? <Text style={{ marginBottom: 7.25, fontSize: 24.25, fontWeight: "400", textAlign: "center", marginTop: 10, color: colors.accent }}>Day: {moment(state.selectedDate.dateOne).format("YYYY-MM-DD")}</Text> : <Text style={{ color: colors.primary, textAlign: "center", fontSize: 21.25, fontWeight: "400" }}>Still need to select date ONE date</Text>}
                            <View style={styles.hr} />
                            <Text style={[styles.timezoneText, { color: colors.accent }]}>This time is CENTRAL TIMEZONE selection so please calculate accordingly to your timezone.</Text>
                            <TouchableOpacity onPress={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        showMap: true
                                    }
                                })
                            }}>
                                <Text style={{ fontWeight: "bold", paddingBottom: 22.25, textAlign: "center", marginTop: 22.25 }}>View timezone's map/sheet..</Text>
                            </TouchableOpacity>
                            {state.time !== null ? <Text style={{ fontSize: 24.25, fontWeight: "400", textAlign: "center", marginTop: 10, color: colors.accent }}>Time: {state.time}</Text> : <Text style={{ color: colors.primary, textAlign: "center", fontSize: 21.25, fontWeight: "400" }}>Still need to select a meeting TIME</Text>}
                        </Fragment>
                    );
                } else if (tierSelected === "tier-2") {
                    return (
                        <Fragment>
                            <Text style={[styles.label, { textAlign: "left" }]}>First monthly meeting date</Text>
                            <CalendarStrip
                                scrollable
                                style={{ height: 125, paddingVertical: 10 }}
                                calendarColor={colors.accent}
                                calendarHeaderStyle={{ color: 'white' }}
                                dateNumberStyle={{ color: 'white' }}
                                dateNameStyle={{ color: 'white' }}
                                iconContainer={{ flex: 0.1 }}
                                maxDate={moment(new Date()).add(4, "weeks")}
                                minDate={new Date()}
                                onDateSelected={(date) => {
                                    if (date > new Date()) {
                                        setState(prevState => {
                                            return {
                                                ...prevState,
                                                selectedDate: {
                                                    ...prevState.selectedDate,
                                                    dateOne: date
                                                }
                                            }
                                        })
                                    } else {
                                        Toast.show({
                                            type: "error",
                                            position: "bottom",
                                            text1: "MUST select a date in the future...",
                                            text2: "Select a day that is NOT is the past"
                                        })
                                    }
                                }}
                            />
                            <Text style={[styles.label, { textAlign: "left" }]}>Second monthly meeting date</Text>
                            <CalendarStrip
                                scrollable
                                style={{ height: 125, paddingVertical: 10 }}
                                calendarColor={colors.accent}
                                calendarHeaderStyle={{ color: 'white' }}
                                dateNumberStyle={{ color: 'white' }}
                                dateNameStyle={{ color: 'white' }}
                                iconContainer={{ flex: 0.1 }}
                                maxDate={moment(new Date()).add(4, "weeks")}
                                minDate={new Date()}
                                onDateSelected={(date) => {
                                    if (date > new Date()) {
                                        setState(prevState => {
                                            return {
                                                ...prevState,
                                                selectedDate: {
                                                    ...prevState.selectedDate,
                                                    dateTwo: date
                                                }
                                            }
                                        })
                                    } else {
                                        Toast.show({
                                            type: "error",
                                            position: "bottom",
                                            text1: "MUST select a date in the future...",
                                            text2: "Select a day that is NOT is the past"
                                        })
                                    }
                                }}
                            />
                            <View style={styles.hr} />
                            <Text style={styles.label}>Select the 'time' you'd like to have your appointment on for this specific day {"\n"}{"\n"}These WILL BE REPEATING until cancelled so please make sure you pick dates that work well with you - if the mentor/therapist confirms... You'll be set on these dates/times unless the therapist suggests alternatives.</Text>
                            <View style={styles.hr} />
                            {state.selectedDate.dateOne !== null ? <Text style={{ marginBottom: 7.25, fontSize: 24.25, fontWeight: "400", textAlign: "center", marginTop: 10, color: colors.accent }}>Day: {moment(state.selectedDate.dateOne).format("YYYY-MM-DD")}</Text> : <Text style={{ color: colors.primary, textAlign: "center", fontSize: 21.25, fontWeight: "400" }}>Still need to select date ONE date</Text>}
                            <View style={styles.hr} />
                            {state.selectedDate.dateTwo !== null ? <Text style={{ marginBottom: 7.25, fontSize: 24.25, fontWeight: "400", textAlign: "center", marginTop: 10, color: colors.accent }}>Day: {moment(state.selectedDate.dateTwo).format("YYYY-MM-DD")}</Text> : <Text style={{ color: colors.primary, textAlign: "center", fontSize: 21.25, fontWeight: "400" }}>Still need to select date TWO date</Text>}
                            <View style={styles.hr} />
                            <Text style={[styles.timezoneText, { color: colors.accent }]}>This time is CENTRAL TIMEZONE selection so please calculate accordingly to your timezone.</Text>
                            <TouchableOpacity onPress={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        showMap: true
                                    }
                                })
                            }}>
                                <Text style={{ fontWeight: "bold", paddingBottom: 22.25, textAlign: "center", marginTop: 22.25 }}>View timezone's map/sheet..</Text>
                            </TouchableOpacity>
                            <DatePicker
                                mode="time"
                                minuteInterval={15}
                                onTimeChange={selectedTime => setState(prevState => {
                                    console.log("selectedTime", selectedTime);
                                    return {
                                        ...prevState,
                                        time: selectedTime
                                    }
                                })}
                            />
                            <View style={styles.hr} />
                            {state.time !== null ? <Text style={{ marginTop: 7.25, fontSize: 24.25, fontWeight: "400", textAlign: "center", marginTop: 10, color: colors.accent }}>Time: {state.time}</Text> : <Text style={{  marginTop: 7.25, color: colors.primary, textAlign: "center", fontSize: 21.25, fontWeight: "400" }}>Still need to select a meeting TIME</Text>}
                        </Fragment>
                    );
                } else {
                    return (
                        <Fragment>
                            <Text style={[styles.label, { textAlign: "left" }]}>First monthly meeting date</Text>
                            <CalendarStrip
                                scrollable
                                style={{ height: 125, paddingVertical: 10 }}
                                calendarColor={colors.accent}
                                calendarHeaderStyle={{ color: 'white' }}
                                dateNumberStyle={{ color: 'white' }}
                                dateNameStyle={{ color: 'white' }}
                                iconContainer={{ flex: 0.1 }}
                                maxDate={moment(new Date()).add(4, "weeks")}
                                minDate={new Date()}
                                onDateSelected={(date) => {
                                    if (date > new Date()) {
                                        setState(prevState => {
                                            return {
                                                ...prevState,
                                                selectedDate: {
                                                    ...prevState.selectedDate,
                                                    dateOne: date
                                                }
                                            }
                                        })
                                    } else {
                                        Toast.show({
                                            type: "error",
                                            position: "bottom",
                                            text1: "MUST select a date in the future...",
                                            text2: "Select a day that is NOT is the past"
                                        })
                                    }
                                }}
                            />
                            <Text style={[styles.label, { textAlign: "left" }]}>Second monthly meeting date</Text>
                            <CalendarStrip
                                scrollable
                                style={{ height: 125, paddingVertical: 10 }}
                                calendarColor={colors.accent}
                                calendarHeaderStyle={{ color: 'white' }}
                                dateNumberStyle={{ color: 'white' }}
                                dateNameStyle={{ color: 'white' }}
                                iconContainer={{ flex: 0.1 }}
                                maxDate={moment(new Date()).add(4, "weeks")}
                                minDate={new Date()}
                                onDateSelected={(date) => {
                                    if (date > new Date()) {
                                        setState(prevState => {
                                            return {
                                                ...prevState,
                                                selectedDate: {
                                                    ...prevState.selectedDate,
                                                    dateTwo: date
                                                }
                                            }
                                        })
                                    } else {
                                        Toast.show({
                                            type: "error",
                                            position: "bottom",
                                            text1: "MUST select a date in the future...",
                                            text2: "Select a day that is NOT is the past"
                                        })
                                    }
                                }}
                            />
                            <Text style={[styles.label, { textAlign: "left" }]}>Third monthly meeting date</Text>
                            <CalendarStrip
                                scrollable
                                style={{ height: 125, paddingVertical: 10 }}
                                calendarColor={colors.accent}
                                calendarHeaderStyle={{ color: 'white' }}
                                dateNumberStyle={{ color: 'white' }}
                                dateNameStyle={{ color: 'white' }}
                                iconContainer={{ flex: 0.1 }}
                                maxDate={moment(new Date()).add(4, "weeks")}
                                minDate={new Date()}
                                onDateSelected={(date) => {
                                    if (date > new Date()) {
                                        setState(prevState => {
                                            return {
                                                ...prevState,
                                                selectedDate: {
                                                    ...prevState.selectedDate,
                                                    dateThree: date
                                                }
                                            }
                                        })
                                    } else {
                                        Toast.show({
                                            type: "error",
                                            position: "bottom",
                                            text1: "MUST select a date in the future...",
                                            text2: "Select a day that is NOT is the past"
                                        })
                                    }
                                }}
                            />
                            <View style={styles.hr} />
                            <Text style={styles.label}>Select the 'time' you'd like to have your appointment on for this specific day {"\n"}{"\n"}These WILL BE REPEATING until cancelled so please make sure you pick dates that work well with you - if the mentor/therapist confirms... You'll be set on these dates/times unless the therapist suggests alternatives.</Text>
                            <DatePicker
                                mode="time"
                                minuteInterval={15}
                                onTimeChange={selectedTime => setState(prevState => {
                                    console.log("selectedTime", selectedTime);
                                    return {
                                        ...prevState,
                                        time: selectedTime
                                    }
                                })}
                            />
                            <View style={styles.hr} />
                            {state.selectedDate.dateOne !== null ? <Text style={{ marginBottom: 7.25, fontSize: 24.25, fontWeight: "400", textAlign: "center", marginTop: 10, color: colors.accent }}>Day: {moment(state.selectedDate.dateOne).format("YYYY-MM-DD")}</Text> : <Text style={{ color: colors.primary, textAlign: "center", fontSize: 21.25, fontWeight: "400" }}>Still need to select date ONE date</Text>}
                            <View style={styles.hr} />
                            {state.selectedDate.dateTwo !== null ? <Text style={{ marginBottom: 7.25, fontSize: 24.25, fontWeight: "400", textAlign: "center", marginTop: 10, color: colors.accent }}>Day: {moment(state.selectedDate.dateTwo).format("YYYY-MM-DD")}</Text> : <Text style={{ color: colors.primary, textAlign: "center", fontSize: 21.25, fontWeight: "400" }}>Still need to select date TWO date</Text>}
                            <View style={styles.hr} />
                            {state.selectedDate.dateThree !== null ? <Text style={{ fontSize: 24.25, fontWeight: "400", textAlign: "center", marginTop: 10, color: colors.accent }}>Day: {moment(state.selectedDate.dateThree).format("YYYY-MM-DD")}</Text> : <Text style={{ color: colors.primary, textAlign: "center", fontSize: 21.25, fontWeight: "400" }}>Still need to select date THREE date</Text>}
                            <View style={styles.hr} />
                            <Text style={[styles.timezoneText, { color: colors.accent }]}>This time is CENTRAL TIMEZONE selection so please calculate accordingly to your timezone.</Text>
                            <TouchableOpacity onPress={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        showMap: true
                                    }
                                })
                            }}>
                                <Text style={{ fontWeight: "bold", paddingBottom: 22.25, textAlign: "center", marginTop: 22.25 }}>View timezone's map/sheet..</Text>
                            </TouchableOpacity>
                            {state.time !== null ? <Text style={{ fontSize: 24.25, fontWeight: "400", textAlign: "center", marginTop: 10, color: colors.accent }}>Time: {state.time}</Text> : <Text style={{ color: colors.primary, textAlign: "center", fontSize: 21.25, fontWeight: "400" }}>Still need to select a meeting TIME</Text>}
                        </Fragment>
                    );
                }
            }
            return (
                <Fragment>
                    {calculateWhichTier()}
                    <View style={[styles.hr, { marginTop: 30 }]} />
                    <Text style={styles.label}>Elaborate on what you expect from your companion/mentorship guide (200+ Char.)</Text>
                    <CustomTextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                description: text
                            }
                        })}
                        multiline={true}
                        numberOfLines={10}
                        style={colorSchemeDark ? { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 200, color: "#fff" } : { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 200, color: "#000" }}
                        secureTextEntry={false}
                        placeholderTextColor={theme.dark ? "lightgrey" : "#000"}
                        placeholder={`Please be very descriptive as to what you'd like to work on with your therapist so we can match you appropriately...\n\n\n MIN 200 CHARACTERS to proceed/continue...`}
                        value={state.description}
                    />
                    <View style={[styles.hr, { marginTop: 30 }]} />
                    <Text style={styles.label}>What problems are you struggling with regarding dating/relationships?</Text>
                    <CustomTextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                problemsText: text
                            }
                        })}
                        multiline={true}
                        numberOfLines={10}
                        placeholderTextColor={theme.dark ? "lightgrey" : "#000"}
                        style={colorSchemeDark ? { backgroundColor: colors.card, minHeight: 200, textAlignVertical: 'top', color: "#fff" } : { backgroundColor: colors.card, minHeight: 200, textAlignVertical: 'top', color: "#000" }}
                        secureTextEntry={false}
                        placeholder={`Please elaborate on what you're experiencing and what you're looking to improve upon or fix...`}
                        value={state.problemsText}
                    />
                    <View style={[styles.hr, { marginTop: 30 }]} />
                    <View style={{ minHeight: 82.25, flexDirection: "row", display: "flex" }}>
                        <Text style={styles.label}>Select the therapy types you wish to use or work on with your mentor</Text>
                        <TouchableOpacity hitSlop={15} style={styles.rightBelowIconPositioned} onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    therapyTypesModal: true
                                }
                            })
                        }}>
                            <Icon name="info" size={20} color={BaseColor.whiteColor} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 7.25 }}>
                        <MultiSelect
                            items={options}
                            uniqueKey="label"
                            onSelectedItemsChange={(items) => setState(prevState => {
                                return {
                                    ...prevState,
                                    selectedImprovement: items
                                }
                            })}
                            selectedItems={state.selectedImprovement}
                            selectText="Select therapy type's..."
                            searchInputPlaceholderText="Search for item's..."
                            onChangeInput={(text)=> console.log(text)}
                            selectedItemTextColor="#000"
                            displayKey="label"
                            searchInputStyle={{ color: '#CCC' }}
                            submitButtonColor={colors.primary}
                            submitButtonText="Submit"
                        />
                    </View>
                    <View style={{ margin: 7.25 }}>
                        <Text style={[styles.importantNoteText, { color: "green" }]}>We WILL collect the required fee's/costs associated with hiring this mentor but will not immediately give the funds to the therapist/mentor - you must both agree that the transaction was completed in which the funds will be released.</Text>
                    </View>
                </Fragment>
            );
        }
    }

    const handleSubmission = () => {
        console.log("handleSubmission clicked/ran...");

        setState(prevState => {
            return {
                ...prevState,
                loading: true
            }
        })

        const { markdownText, selectedDate, problemsText, description, time, selectedImprovement, otherUser, tierSelected } = state;

        const config = {
            id: authData.uniqueId,
            requesterName: authData.firstName,
            otherUser,
            requesterUsername: authData.username,
            markdownText, 
            selectedDate, 
            description, 
            time, 
            problemsText,
            selectedImprovement,
            tierSelected,
            requestedTherapistUsername: otherUser.username,
            requestedTherapistName: otherUser.firstName,
            otherUserID: otherUser.uniqueId,
            accountType: authData.accountType,
            uniqueId: authData.uniqueId
        }
    
        axios.post(`${BASE_URL}/send/request/new/mentorship/request`, config).then((res) => {
            if (res.data.message === "Submitted request!") {
                console.log("res.data", res.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })

                Toast.show({
                    type: 'success',
                    text1: `Successfully sent your proposal/request!`,
                    text2: `We've successfully sent the invite to the mentor/therapist - please wait for a response.`,
                    visibilityTime: 2750,
                    position: "bottom",
                    onHide: () => {
                        navigation.replace("BottomTabNavigator", { screen: "Home" });
                    }
                });
            } else if (res.data.message === "You do NOT have enough tokens to deposit for this purchase - please buy more tokens and try again...") {
                console.log("errrorrrrrr...", res.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })

                Toast.show({
                    type: 'error',
                    text1: `You account is LOW ON FUNDS/TOKENS! No action taken.`,
                    text2: res.data.message,
                    visibilityTime: 2750,
                    position: "bottom"
                });
            } else {
                console.log("errrorrrrrr...", res.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })

                Toast.show({
                    type: 'error',
                    text1: `We could NOT process your request successfully...`,
                    text2: `We encountered an error while processing your request - please try this action again or contact support if the problem persists!`,
                    visibilityTime: 2750,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log("Critical err", err);

            setState(prevState => {
                return {
                    ...prevState,
                    loading: false
                }
            })

            // Toast.show({
            //     type: 'error',
            //     text1: `We could NOT process your request successfully...`,
            //     text2: `We encountered an error while processing your request - please try this action again or contact support if the problem persists!`,
            //     visibilityTime: 2750,
            //     position: "bottom"
            // });
        })
    }
    const calculateDisabled = () => {
        const { markdownText, selectedDate, description, time, selectedImprovement, problemsText, tierSelected } = state;
        if (state.page === 2) {
            if (tierSelected === "tier-1") {
                if ((typeof markdownText !== "undefined" && markdownText.length > 0) && (typeof problemsText !== "undefined" && problemsText.length > 0) && (selectedDate.dateOne !== null) && (typeof description !== "undefined" && description.length >= 200) && (typeof time !== "undefined" && time.length > 0) && (typeof selectedImprovement !== "undefined" && selectedImprovement.length > 0)) {
                    return false;
                } else {
                    return true;
                }
            } else if (tierSelected === "tier-2") {
                if ((typeof markdownText !== "undefined" && markdownText.length > 0) && (typeof problemsText !== "undefined" && problemsText.length > 0) && (selectedDate.dateOne !== null) && (selectedDate.dateTwo !== null) && (typeof description !== "undefined" && description.length >= 200) && (typeof time !== "undefined" && time.length > 0) && (typeof selectedImprovement !== "undefined" && selectedImprovement.length > 0)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                if ((typeof markdownText !== "undefined" && markdownText.length > 0) && (typeof problemsText !== "undefined" && problemsText.length > 0) && (selectedDate.dateOne !== null) && (selectedDate.dateTwo !== null) && (selectedDate.dateThree !== null) && (typeof description !== "undefined" && description.length >= 200) && (typeof time !== "undefined" && time.length > 0) && (typeof selectedImprovement !== "undefined" && selectedImprovement.length > 0)) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            return false;
        }
    }
    const renderSelected = () => {
        switch (props.route.params.data) {
            case "tier-1":
                return (
                    <Fragment>
                        <Text style={styles.selectedText}>You've selected the option for ONE meeting a MONTH (30-min/each) at the cost of <Text style={{ color: colors.accent, textDecorationLine: "underline" }}>$34.99</Text></Text>
                    </Fragment>
                );
                break;
            case "tier-2":
                return (
                    <Fragment>
                        <Text style={styles.selectedText}>You've selected the option for TWO meetings a MONTH (30-min/each) at the cost of <Text style={{ color: colors.accent, textDecorationLine: "underline" }}>$64.99</Text></Text>
                    </Fragment>
                );
                break;
            case "tier-3":
                return (
                    <Fragment>
                        <Text style={styles.selectedText}>You've selected the option for THREE meetings a MONTH (30-min/each) at the cost of <Text style={{ color: colors.accent, textDecorationLine: "underline" }}>$99.99</Text></Text>
                    </Fragment>
                );
                break;
            default:
                break;
        }
    }
    const renderSelectedOnlyDigits = () => {
        switch (props.route.params.data) {
            case "tier-1":
                return "$34.99";
                break;
            case "tier-2":
                return "$64.99";
                break;
            case "tier-3":
                return "$99.99";
                break;
            default:
                break;
        }
    }
    return (
        <Fragment>
            <Modal
                isVisible={state.showMap}
                backdropColor="rgba(0, 0, 0, 0.5)"
                backdropOpacity={1}
                animationIn="fadeIn"
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
            >
                <View style={[styles.centered, { backgroundColor: "#fff", borderRadius: 12.25, borderWidth: 2, borderColor: "#000" }]}>
                    <Image source={require("../../../assets/images/timezones.png")} style={{ width: "100%", height: height * 0.4625 }} resizeMode={"contain"} />
                    <View style={styles.hr} />
                    <Button style={{ width: "100%" }} outline onPress={() => setState(prevState => {
                        return {
                            ...prevState,
                            showMap: false
                        }
                    })}>
                        {"Cancel/Close Modal"}
                    </Button>
                </View>
            </Modal>
            <Spinner
                visible={state.loading}
                textContent={'Sending Request...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor={"rgba(0, 0, 0, 0.725)"}
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 62.25 }}>
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps='always'>
                    <Header
                        title="Start Enrollment"
                        subTitle={"Enrollment initiation!"}
                        renderLeft={() => {
                            return (
                                <Icon
                                    name="arrow-left"
                                    size={20}
                                    color={colors.accent}
                                    enableRTL={true}
                                />
                            );
                        }}
                        renderRight={() => {
                            if (state.page === 1) {
                                return <Icon name="info" size={20} color={colors.accent} />;
                            } else {
                                return null;
                            }
                        }}
                        onPressLeft={() => {
                            if (state.page === 1) {
                                navigation.goBack();
                            } else {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })
                            }
                        }}
                        onPressRight={() => {
                            if (state.page === 1) {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        modalVisible: !prevState.modalVisible
                                    }
                                })
                            } else {
                                return null;
                            }
                        }}
                    />
                <Modal
                    isVisible={state.modalVisible}
                    backdropColor="rgba(0, 0, 0, 0.5)"
                    backdropOpacity={1}
                    animationIn="fadeIn"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}
                >
                    <View style={styles.centered}>
                        <Image source={require("../../../assets/images/custom/markdown-cheatsheet.png")} style={{ width: "100%", height: height * 0.625 }} resizeMode={"contain"} />
                        <Button style={{ width: "100%", top: -7.25 }} outline onPress={() => setState(prevState => {
                                return {
                                    ...prevState,
                                    modalVisible: false
                                }
                            })}>
                            {"Cancel/Close Modal"}
                        </Button>
                    </View>
                </Modal>
                <Modal
                    isVisible={state.therapyTypesModal}
                    backdropColor="rgba(0, 0, 0, 0.5)"
                    backdropOpacity={1}
                    animationIn="fadeIn"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 22.25 }}>
                        <View style={{  flex: 1, backgroundColor: "#fff" }}>
                            <Markdown markdown={instructionText} css={css} />
                        </View>
                        <Button style={{ width: "100%", top: -7.25 }} outline onPress={() => setState(prevState => {
                                return {
                                    ...prevState,
                                    therapyTypesModal: false
                                }
                            })}>
                            {"Cancel/Close Modal"}
                        </Button>
                    </ScrollView>
                </Modal>
                <SafeAreaView style={{ flex: 1 }} edges={['right', 'left', 'bottom']}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container}>
                        {renderMainContent()}
                    </ScrollView>
                </SafeAreaView>
                </KeyboardAwareScrollView>
            </ScrollView>
            <View
            style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
            <View>
                <Text caption1 semibold grayColor>
                    {"Currently Selected Tier"}
                </Text>
                <Text title1 accentColor semibold>
                    {renderSelectedOnlyDigits()}
                </Text>
            </View>
                <Button disabled={calculateDisabled()} style={calculateDisabled() ? { backgroundColor: "lightgrey" } : { marginTop: 22.25 }} outline onPress={() => {
                    if (state.page === 2) {
                        handleSubmission();
                    } else {
                        setState(prevState => {
                            return {
                                ...prevState,
                                page: prevState.page + 1
                            }
                        })
                    }
                }}>
                    {"Submit & Continue"}
                </Button>
            </View>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {  })(EnrollmentStartProcess);