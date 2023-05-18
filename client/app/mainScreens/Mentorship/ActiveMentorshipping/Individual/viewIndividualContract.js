import React, { useState, Fragment, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Tag,
  Image,
  Button
} from '@components';
import SendPrivateMessagePane from "./Panes/Messaging/sendPrivateMessage.js";
import * as Utils from '@utils';
import styles from './viewIndividualContractStyles.js';
import { useNavigation } from '@react-navigation/native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";
import _ from "lodash";
import moment from 'moment';
import Markdown from 'react-native-showdown';
import { Calendar } from 'react-native-calendars'
import ActionSheet from 'react-native-actionsheet';
import { BASE_ASSET_URL, BASE_URL } from "@env";
import axios from "axios";
import LeaveAReviewForMentorActiveOnly from "../../ReviewRelated/leaveAReview.js";
import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from "react-redux";
import SendConfirmationRequestHelper from "./Panes/ConfirmationRequest/sendNewConfirmRequest.js";
import Dialog from "react-native-dialog";
import Toast from "react-native-toast-message";


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

const { width, height } = Dimensions.get("window");

const IndividualViewContractDetails = (props) => {
    const authData = props.authenticatedData;
    const rbsheetLeaveReviewRef = useRef(null);
    const actionSheetRef = useRef(null);
    const sendMessageRef = useRef(null);
    const sendConfirmationRequestRef = useRef(null);
    const navigation = useNavigation();
    const deltaY = new Animated.Value(0);
    const { colors, theme } = useTheme();
    const colorSchemeDark = theme.dark;
    const [ showConfirmation, setConfirmationState ] = useState(false);
    const [ scrollEnabled, setScrollEnabled ] = useState(true);
    const [ requestData, setRequestData ] = useState(props.route.params.data);
    const [ ready, setReady ] = useState(true);
    const [ heightHeader, setHeightHeader ] = useState(Utils.heightHeader());
    const [ alreadyReacted, setAlreadyReacted ] = useState(false);

    const loopAndDetermine = () => {
        return {
            [moment(requestData.formattedDates.dateOne).format("YYYY-MM-DD")]: { selected: true, marked: true, selectedColor: colors.accent },
            [moment(requestData.formattedDates.dateTwo).format("YYYY-MM-DD")]: { selected: true, marked: true, selectedColor: colors.accent },
            [moment(requestData.formattedDates.dateThree).format("YYYY-MM-DD")]: {selected: true, marked: true, selectedColor: colors.accent }
        }
    }

    useEffect(() => {
        const config = {
            params: {
              requestedBy: requestData.requestedBy === authData.uniqueId ? requestData.designatedTargetUserID : requestData.requestedBy
            }
        };

        let newCopy = {
          ...requestData,
          lastProfilePic: null
        };

        axios.get(`${BASE_URL}/gather/only/profile/picture/with/id/and/account/id`, config).then((res) => {
            if (res.data.message === "Successfully fetched!") {
                console.log("this one", res.data);
                const { user } = res.data; 

                newCopy["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
                newCopy["firstName"] = user.firstName;
                newCopy["username"] = user.username;

                setRequestData(newCopy);
                setAlreadyReacted(typeof user.reviewsOfMentor !== "undefined" && user.reviewsOfMentor.findIndex(item => item.reviewerID === authData.uniqueId) !== -1 ? true : false);
            } else {
              console.log("this two", res.data);
                newCopy["lastProfilePic"] = null;

                setRequestData(newCopy);
            }
        }).catch((err) => {

          console.log("this three", err);

            newCopy["lastProfilePic"] = null;

            setRequestData(newCopy);
        })
    }, []);

    console.log("requestData", requestData);

    const renderMainContent = () => {
        if (ready) {
          return (
            <Fragment>
                <Header
                    title="Manage/View Contracts"
                    subTitle="Viewing Individual Data"
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
                    onPressRight={() => {
                    //   rbSheetRef.current.open();
                    }}
                />
                <View style={{ height: heightHeader }} />
                <View
                    style={{
                        paddingHorizontal: 20,
                        marginBottom: 20
                    }}>
                    <View style={[styles.topContainer, { borderBottomColor: colors.accent }]}>
                        <View style={styles.columnOne}>
                            {_.has(requestData, "lastProfilePic") && _.has(requestData.lastProfilePic, "link") ? <Image source={{ uri: `${BASE_ASSET_URL}/${requestData.lastProfilePic.link}` }} style={{ minWidth: 100, minHeight: 100, width: 100, height: 100, borderRadius: 75 }} /> : null}
                        </View>
                        <View style={styles.columnTwo}>
                            <Text style={styles.nameHeader}>{requestData.firstName}</Text>
                            <View style={styles.hr} />
                            <Text style={styles.nameSubheader}>@{requestData.username}</Text>
                            <View style={styles.hr} />
                        </View>
                    </View>
                    <Text title1 semibold numberOfLines={1} style={{marginBottom: 10}}>
                    {`${requestData.meetingsPerMonth} meetings at `}<Text style={{ color: colors.accent, fontWeight: "500" }}>${requestData.monthlyEarnings}</Text>
                    </Text>
                    <Text body2 semibold style={{marginBottom: 10, marginTop: 22.25 }}>
                        {"Initial Introduction Message"}
                    </Text>
                    <ScrollView 
                        onTouchStart={(ev) => { 
                            setScrollEnabled(false);
                        }}
                        onTouchEnd={(ev) => { 
                            setScrollEnabled(true);
                        }}
                        onMomentumScrollEnd={(e) => console.log("ran")}
                        onScrollEndDrag={(e) => console.log("ran")} 
                        contentContainerStyle={{ height: 350, flex: 1, width, left: -15 }} 
                        style={{ height: 350, flex: 1, width, left: -15 }}
                    >
                        <Markdown markdown={requestData.initialMarkdownMessage} css={css} />
                    </ScrollView>
                    <View style={{ flexDirection: "row", display: "flex" }}>
                    <View style={styles.halfSized}>
                        <Text body2 semibold style={{ marginTop: 20 }}>
                        {"Meetings will occur at this hour if accepted"}
                        </Text>
                        <Text body2 accentColor style={{marginVertical: 10}}>
                        {requestData.hourSet} (Central Timezone)
                        </Text>
                    </View>
                    <View style={styles.halfSized}>
                        <Text body2 semibold style={{ marginTop: 20 }}>
                        {"Day this meeting will occur on..."}
                        </Text>
                        <Text body2 accentColor style={{marginVertical: 10}}>
                          Date One: {typeof requestData.formattedDates.dateOne !== "undefined" && requestData.formattedDates.dateOne !== null ? moment(requestData.formattedDates.dateOne).format("YYYY-MM-DD") : "N/A"}
                        </Text>
                        <Text body2 accentColor style={{marginVertical: 10}}>
                          Date Two: {typeof requestData.formattedDates.dateTwo !== "undefined" && requestData.formattedDates.dateTwo !== null ? moment(requestData.formattedDates.dateTwo).format("YYYY-MM-DD") : "N/A"}
                        </Text>
                        <Text body2 accentColor style={{marginVertical: 10, marginBottom: 22.25 }}>
                          Date Three: {typeof requestData.formattedDates.dateThree !== "undefined" && requestData.formattedDates.dateThree !== null ? moment(requestData.formattedDates.dateThree).format("YYYY-MM-DD") : "N/A"}
                        </Text>
                    </View>
                    </View>
                    <View style={{ flexDirection: "row", display: "flex" }}>
                    <View style={styles.fullSized}>
                        <Text body2 semibold style={{marginBottom: 10}}>
                        {"Expectation from therapist/mentor (described by user upon submission)"}
                        </Text>
                        <Text body2 grayColor style={{marginVertical: 10}}>
                        {requestData.whatYouExpectFromTherapist}
                        </Text>
                    </View>
                    </View>
                    <View style={{ flexDirection: "row", display: "flex", marginBottom: 15 }}>
                    <View style={styles.fullSized}>
                        <Text body2 semibold style={{marginBottom: 10}}>
                        {"Cheif Complaints/Problems (as described by user upon submission)"}
                        </Text>
                        <Text body2 grayColor style={{marginVertical: 10}}>
                        {requestData.problemsText}
                        </Text>
                    </View>
                    </View>
                    <Text body2 semibold style={{marginBottom: 10, marginTop: 22.25 }}>
                        {"Preferred Treatment Approaches"}
                    </Text>
                    {requestData.approaches.map(item => {
                        return (
                        <Tag
                            chip
                            key={item.id}
                            style={{
                                marginTop: 10,
                                marginRight: 10
                            }}>
                            {item}
                        </Tag>
                        );
                    })}
                    <Text body2 semibold style={{marginBottom: 22.25, marginTop: 22.25 }}>
                        {"Selected meeting dates of month (Will occur on these dates EVERY month..)"}
                    </Text>
                    <View style={{ flexDirection: "row", display: "flex" }}>
                        <View style={[styles.backgroundCircle, { backgroundColor: colors.accent }]} />
                        <Text style={styles.rightText}>This indicates a selected meeting date...</Text>
                    </View>
                    <Calendar
                        markedDates={loopAndDetermine()}
                    />
                </View>
            </Fragment>
          );
        } else {
          return (
            <Fragment>
              <Header
                title=""
                renderLeft={() => {
                  return (
                    <Icon
                      name="arrow-left"
                      size={20}
                      color={BaseColor.whiteColor}
                      enableRTL={true}
                    />
                  );
                }}
                renderRight={() => {
                  return <Icon name="images" size={20} color={BaseColor.whiteColor} />;
                }}
                onPressLeft={() => {
                  navigation.goBack();
                }}
                onPressRight={() => {
                //   rbSheetRef.current.open();
                }}
              />
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
            </Fragment>
          );
        }
    }

    const joinVideoChatMeeting = () => {
        console.log("joinVideoChatMeeting clicked/ran...");

        const data = {
          otherUserID: requestData.requestedBy
        };

        navigation.navigate("LiveStreamingMentorship", { data });
    }
    const cancelContractMentorship = () => {
      console.log("cancelContractMentorship clicked/ran...");

      const configuration = {
        relevantListingID: requestData.id,
        authedID: authData.uniqueId,
        otherUserId: requestData.designatedTargetUserID
      };

      axios.post(`${BASE_URL}/cancel/mentorship/sesssions/contract`, configuration).then((res) => {
          if (res.data.message === "Successfully cancelled contract!") {
              console.log("res.ddata", res.data);

              Toast.show({
                  type: 'success',
                  text1: `Successfully cancelled/removed mentorship contract!`,
                  text2: `We're successfully ended the contract & cancelled your mentorship session(s)...`,
                  visibilityTime: 3275,
                  position: "bottom",
                  onHide: () => navigation.replace("BottomTabNavigator", { screen: "Profile" })
              });
          } else {
              console.log("Error inner res.data: ", res.data);

              Toast.show({
                  type: 'error',
                  text1: `Error occurred while processing your request!`,
                  text2: "We've encountered an error while attempting to process your request - try the action again or contact support if the problem persists...",
                  visibilityTime: 3275,
                  position: "bottom"
              });
          }
      }).catch((error) => {
          console.log("Error...:", error);

          Toast.show({
              type: 'error',
              text1: `Error occurred while processing your request!`,
              text2: "We've encountered an error while attempting to process your request - try the action again or contact support if the problem persists...",
              visibilityTime: 3275,
              position: "bottom"
          });
      })
        setConfirmationState(false);
    }

    const markCompleteAndRequestOtherUserConfirm = () => {
      console.log("markCompleteAndRequestOtherUserConfirm clicked/ran...");

      actionSheetRef.current.hide();
      
      setTimeout(() => {
        sendConfirmationRequestRef.current.open();
      }, 375)
    }

    const messageThisUser = () => {
        console.log("messageThisUser clicked/ran...");

        sendMessageRef.current.open();
    }
    const leaveReviewMentor = () => {
        console.log("leaveReviewMentor clicked/ran...", );

        rbsheetLeaveReviewRef.current.open();
    }

    const calulateOnPress = (index) => {
      switch (index) {
        case 0:
            joinVideoChatMeeting();
            break;
        case 1:
            markCompleteAndRequestOtherUserConfirm();
            break;
        case 2: 
            messageThisUser();
            break;
        default: 
            break;
      }
    }
    
    const calculateOptionsAction = (value) => {
      return ['Initiate Video Chat/Meeting', 'Confirm Completion Of Meeting(s)', 'Message This User', "Cancel/Close Pane"];
    }

    const calulateOnPressTwo = (index) => {
      if (alreadyReacted === true) {
        switch (index) {
          case 0:
              setConfirmationState(true);
              break;
          case 1: 
              messageThisUser();
              break;
          default: 
              break;
        }
      } else {
        switch (index) {
          case 0:
              leaveReviewMentor();
              break;
          case 1:
              setConfirmationState(true);
              break;
          case 2: 
              messageThisUser();
              break;
          default: 
              break;
        }
      }
    }

    const calculateDestructionTwo = () => {
      if (alreadyReacted === true) {
        return 2;
      } else {
        return 3;
      }
    }

    const calculateOptionsActionTwo = (value) => {
      if (alreadyReacted === true) {
        return ['Cancel/End Mentorship Contract', 'Message This User', "Cancel/Close Pane"];
      } else {
        return ['Leave A Review For Mentor', 'Cancel/End Mentorship Contract', 'Message This User', "Cancel/Close Pane"];
      }
    }
    return (
        <Fragment>
            <Dialog.Container visible={showConfirmation}>
              <Dialog.Title>Are you sure you'd like to cancel this contract & lose HALF of your deposit?</Dialog.Title>
              <Dialog.Description>
                  Cancelling this contract prematurely will result in ONLY getting 1/2 of your initial deposited tokens back as a penalty for not completing the agreed contract.
              </Dialog.Description>
              <Dialog.Button onPress={() => setConfirmationState(false)} style={{ color: "darkred" }} label="Cancel.." />
              <Dialog.Button onPress={() => cancelContractMentorship()} style={{ color: "green" }} label="Confirm Cancellation!" />
            </Dialog.Container>
          <RBSheet
            ref={sendMessageRef}
            height={height}
            openDuration={250}
            draggable={false}
            closeOnDragDown={false}
            closeOnPressMask={false}
            customStyles={{
                container: {
                    paddingHorizontal: 20,
                },
                draggableIcon: {
                    width: width * 0.725
                }
            }}
          >
            {authData !== null ? <SendPrivateMessagePane otherUser={requestData.requestedBy === authData.uniqueId ? requestData.designatedTargetUserID : requestData.requestedBy} authData={authData} sendMessageRef={sendMessageRef} /> : null}
          </RBSheet>
          <RBSheet
            ref={sendConfirmationRequestRef}
            height={height}
            openDuration={250}
            draggable={false}
            closeOnDragDown={false}
            closeOnPressMask={false}
            customStyles={{
                container: {
                    paddingHorizontal: 20,
                },
                draggableIcon: {
                    width: width * 0.725
                }
            }}
          >
            <SendConfirmationRequestHelper listingID={requestData.id} otherUser={requestData.requestedBy === authData.uniqueId ? requestData.designatedTargetUserID : requestData.requestedBy} authData={authData} sendConfirmationRequestRef={sendConfirmationRequestRef} />
          </RBSheet>
            <SafeAreaView style={{flex: 1}} edges={['right', 'left', 'bottom']}>
                <RBSheet
                    ref={rbsheetLeaveReviewRef}
                    height={height}
                    openDuration={250}
                    closeOnDragDown={false}
                    customStyles={{
                        draggableIcon: {
                            minWidth: width * 0.625
                        }
                    }}
                >
                 <View style={{ flex: 1 }}>
                  <LeaveAReviewForMentorActiveOnly rbsheetLeaveReviewRef={rbsheetLeaveReviewRef} requestData={requestData} />
                  </View>
                </RBSheet>
                
                {requestData.requestedBy === authData.uniqueId ? <ActionSheet
                    ref={actionSheetRef}
                    title={`Select your desired action for this mentor...`}
                    options={calculateOptionsActionTwo()}
                    cancelButtonIndex={calculateDestructionTwo()}
                    destructiveButtonIndex={calculateDestructionTwo()}
                    onPress={calulateOnPressTwo}
                /> : <ActionSheet
                    ref={actionSheetRef}
                    title={`Select your desired action for this user...`}
                    options={calculateOptionsAction()}
                    cancelButtonIndex={3}
                    destructiveButtonIndex={3}
                    onPress={calulateOnPress}
                />}
                <ScrollView
                    onScroll={Animated.event([
                        {
                        nativeEvent: {
                            contentOffset: {y: deltaY},
                        },
                        },
                    ])}
                    scrollEnabled={scrollEnabled}
                    onContentSizeChange={() => {
                        setHeightHeader(Utils.heightHeader());
                    }}
                    scrollEventThrottle={8}>
                    {renderMainContent()}
                </ScrollView>
                {/* Pricing & Booking Process */}
                <View
                style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
                <Button full outline onPress={() => actionSheetRef.current.show()}>
                    {"Contract Options/Action's"}
                </Button>
                </View>
            </SafeAreaView>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
	return {
		authenticatedData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
	}
}
export default connect(mapStateToProps, { })(IndividualViewContractDetails);