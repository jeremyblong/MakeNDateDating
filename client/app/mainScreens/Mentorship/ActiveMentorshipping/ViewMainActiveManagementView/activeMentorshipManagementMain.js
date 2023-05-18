import React, { Fragment, useCallback, useState } from "react";
import { View, ScrollView, FlatList, Image } from "react-native";
import { Text, Header, Button, Icon } from "@components";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTheme} from '@config';
import styles from "./activeMentorshipManagementMainStyles.js";
import axios from "axios";
import { BASE_URL } from "@env";
import _ from "lodash";
import { connect } from "react-redux";
import Markdown from 'react-native-showdown';

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

const ManageActiveAppointsmentsMentorship = ({ authData }) => {

    const navigation = useNavigation();
    
    const { colors } = useTheme();
    const [ state, setState ] = useState({
        acceptedMentorshipRequests: []
    })

    useFocusEffect(
        useCallback(() => {
            axios.get(`${BASE_URL}/gather/active/mentorship/contracts`, {
                params: {
                    uniqueId: authData.uniqueId,
                    accountType: authData.accountType
                } 
            }).then((res) => {
                if (res.data.message === "Gathered list!") {
                    console.log("Gathered list!", res.data);
        
                    const { acceptedMentorshipRequests } = res.data;
        
                    setState(prevState => {
                        return {
                            ...prevState,
                            acceptedMentorshipRequests: typeof acceptedMentorshipRequests !== "undefined" && acceptedMentorshipRequests.length > 0 ? acceptedMentorshipRequests : []
                        }
                    })
                } else {
                    console.log("Err", res.data);
                }
            }).catch((err) => {
                console.log(err.message);
            })
    }, []));

    const { acceptedMentorshipRequests } = state;

    console.log("acceptedMentorshipRequests", acceptedMentorshipRequests);

    const renderItem = ({ item, index }) => {
        return (
            <Fragment key={index}>
                <View style={[styles.contain, {backgroundColor: colors.card, marginTop: 17.75 }]}>
                    <View style={styles.packageTitleContent}>
                        <Text title2 semibold>
                            {item.requestedBy === authData.uniqueId ? `${item.requestedTherapistName} ~ @${item.requestedTherapistUsername}` : `${item.requesterName} ~ @${item.requesterUsername}`}
                        </Text>
                    </View>
                    <View style={styles.contentPrice}>
                        <Text title1 primaryColor semibold style={{ marginBottom: 12.25 }}>
                            {`${item.meetingsPerMonth} Session(s) at $${item.monthlyEarnings}`}
                        </Text>
                        <Text
                            footnote
                            accentColor
                            style={{
                                marginLeft: 10,
                                fontSize: 13.25,
                                alignSelf: 'flex-end',
                                position: "absolute",
                                bottom: 10,
                                right: 0
                            }}
                        >
                            Meetings are at: {item.hourSet} each meeting day..
                        </Text>
                    </View>
                    <ScrollView contentContainerStyle={{ height: 150, flex: 1 }} style={{ height: 150, flex: 1 }}>
                        <Markdown markdown={item.initialMarkdownMessage} css={css} />
                    </ScrollView>
                    <View
                        key={item.name}
                        style={[{borderTopColor: colors.border}]}
                    >
                        <Text headline accentColor style={{marginBottom: 6, textAlign: "left", float: "left", marginTop: 10}}>
                            Problem's user is wanting to address
                        </Text>
                        <Text body2 grayColor>{item.problemsText.slice(0, 240)}{typeof item.problemsText !== "undefined" && item.problemsText.length >= 240 ? "..." : ""}</Text>
                        <Text headline accentColor style={{marginBottom: 6, textAlign: "left", float: "left", marginTop: 10}}>
                            Expectations
                        </Text>
                        <Text body2 grayColor>{item.whatYouExpectFromTherapist.slice(0, 240)}{typeof item.whatYouExpectFromTherapist !== "undefined" && item.whatYouExpectFromTherapist.length >= 240 ? "..." : ""}</Text>
                    </View>
                    <Button full style={{marginTop: 10}} onPress={() => navigation.navigate("ViewIndividualContractMentorshipManagement", { data: item })}>
                        View Detail(s) & More Info
                    </Button>
                </View>
            </Fragment>
        );
    }

    const renderEmptyData = () => {
        return (
            <Fragment>
                <View style={styles.centered}>
                    <Text style={styles.topImageText}>No results could be found - you do NOT have any active mentoring contracts or have not hired a therapist yet...</Text>
                    <Image source={require("../../../../assets/images/mentoring.jpg")} style={styles.noResultsIllustration} />
                 </View>
            </Fragment>
        );
    }
    return (
        <Fragment>
            <Header
                title={"Viewing Request(s)"}
                subTitle="Requests for mentorship..."
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
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={styles.centeredList}
                    data={acceptedMentorshipRequests}
                    style={{ flexGrow: 1, flex: 1 }}
                    keyExtractor={(item, index) => `index-${index}`}
                    ListHeaderComponent={null}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmptyData}
                    ListFooterComponent={null}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {  })(ManageActiveAppointsmentsMentorship);