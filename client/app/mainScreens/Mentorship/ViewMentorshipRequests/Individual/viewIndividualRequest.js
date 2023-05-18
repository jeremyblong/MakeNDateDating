import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  View,
  ScrollView,
  Animated,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { BaseColor, Images, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Tag,
  Image,
  Button
} from '@components';
import { useTranslation } from 'react-i18next';
import * as Utils from '@utils';
import styles from './viewIndividualRequestStyles.js';
import { useNavigation } from '@react-navigation/native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";
import { BASE_URL } from "@env";
import axios from "axios";
import { connect } from "react-redux";
import _ from "lodash";
import moment from 'moment';
import Markdown from 'react-native-showdown';
import { Calendar } from 'react-native-calendars'
import DialogInput from 'react-native-dialog-input';
import Toast from 'react-native-toast-message';


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

const ViewIndividualMentorshipRequest = (props) => {
  const authData = props.authData;
  const navigation = useNavigation();
  const deltaY = new Animated.Value(0);
  const colorSchemeDark = useColorScheme() === "dark" ? true : false;
  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [ requestData, setRequestData ] = useState(props.route.params.item);
  const [ ready, setReady ] = useState(true);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [ userData, setUserState ] = useState(null);
  const [ dialog, setDialog ] = useState(false);
  const [ scrollable, setScrollable ] = useState(true);

  const loopAndDetermine = () => {
    return {
        [moment(requestData.formattedDates.dateOne).format("YYYY-MM-DD")]: { selected: true, marked: true, selectedColor: colors.accent },
        [moment(requestData.formattedDates.dateTwo).format("YYYY-MM-DD")]: { selected: true, marked: true, selectedColor: colors.accent },
        [moment(requestData.formattedDates.dateThree).format("YYYY-MM-DD")]: {selected: true, marked: true, selectedColor: colors.accent }
    }
  }
  const renderMainContent = () => {
    if (ready) {
      return (
        <Fragment>
          <View style={{ height: 255 - heightHeader }} />
            <View
              style={{
                paddingHorizontal: 20,
                marginBottom: 20,
              }}>
              <Text title1 semibold numberOfLines={1} style={{marginBottom: 10}}>
                {`${requestData.meetingsPerMonth} meetings at `}<Text style={{ color: colors.accent, fontWeight: "500" }}>${requestData.monthlyEarnings}</Text> in tokens
              </Text>
              <Text body style={{ marginBottom: 22.25 }}>This is a request specifically for you by one of our dating users. This user sent the request as they're interested in having you mentor/guide them through the dating process/enviorment - this is VIRTUAL and no in-person action/activity is required, just video/text calling.</Text>
              <Text body2 semibold style={{marginBottom: 10, marginTop: 22.25 }}>
                  {"Initial Introduction Message"}
              </Text>
              <ScrollView onTouchStart={(ev) => setScrollable(false)} onTouchEnd={(ev) => setScrollable(true)} contentContainerStyle={{ height: 375, flex: 1 }} style={{ height: 375, flex: 1 }}>
                  <Markdown markdown={requestData.initialMarkdownMessage} css={css} />
              </ScrollView>
              <View style={{ flexDirection: "row", display: "flex" }}>
                <View style={styles.halfSized}>
                  <Text body2 semibold style={{ marginTop: 20 }}>
                    {"Meetings will occur at this hour if accepted"}
                  </Text>
                  <Text body2 grayColor style={{marginVertical: 10}}>
                    {requestData.hourSet}
                  </Text>
                </View>
                <View style={styles.halfSized}>
                  <Text body2 semibold style={{ marginTop: 20 }}>
                    {"Day this meeting will occur on..."}
                  </Text>
                  <Text body2 grayColor style={{marginVertical: 10}}>
                  {moment(requestData.formattedDateRaw).format("YYYY-MM-DD")}
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
  const renderTopContent = () => {
    if (ready) {
      return (
        <Fragment>
          <Animated.View
            style={[
              styles.imgBanner,
              {
                height: deltaY.interpolate({
                  inputRange: [
                    0,
                    Utils.scaleWithPixel(140),
                    Utils.scaleWithPixel(140),
                  ],
                  outputRange: [heightImageBanner, heightHeader, heightHeader],
                }),
              },
            ]}>
            <Image source={require("../../../../assets/images/custom/blurred-gradient.png")} style={{flex: 1}} />
            <Animated.View
              style={{
                position: 'absolute',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingHorizontal: 20,
                width: '100%',
                bottom: 15,
                opacity: deltaY.interpolate({
                  inputRange: [
                    0,
                    Utils.scaleWithPixel(140),
                    Utils.scaleWithPixel(140),
                  ],
                  outputRange: [1, 0, 0],
                }),
              }}>
              <View style={styles.rowBanner}>
                <Image source={userData !== null ? require("../../../../assets/icons/profile-black-squared.png") : Images.profile2} style={styles.userIcon} />
                <View style={styles.infoContainer}>
                  <Text headline semibold whiteColor>
                    {requestData.requesterName} ~ @{requestData.requesterUsername}
                  </Text>
                  <Text footnote whiteColor>
                    Appicant/Requesting-User
                  </Text>
                </View>
              </View>
            </Animated.View>
          </Animated.View>
          {/* Header */}
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
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
        </Fragment>
      );
    }
  }

  const submitDialogInput = (inputText) => {
    console.log("submitDialogInput clicked/ran...");

    if (inputText.toLowerCase() === "accept") {
      console.log("accept request...");

      const config = {
        authedUserID: authData.uniqueId,
        requestID: requestData.id,
        accepted: true,
        requestingUserID: requestData.requestedBy
      }

      axios.post(`${BASE_URL}/accept/decline/request/mentorship`, config).then((res) => {
          if (res.data.message === "Successfully submitted response!") {
              console.log("Successfully submitted response!", res.data);

              setDialog(false);
              
              Toast.show({
                  type: 'success',
                  text1: 'Successfully ACCEPTED request!',
                  visibilityTime: 3250,
                  position: "bottom",
                  onHide: () => {
                    navigation.replace("BottomTabNavigator", { screen: "Profile" });
                  }
              });
          } else {
              console.log("Err", res.data);

              setDialog(false);

              Toast.show({
                type: 'error',
                text1: `Error occurred while processing your request...`,
                visibilityTime: 3250,
                position: "bottom"
              });
          }
      }).catch((err) => {
          console.log(err.message);

          Toast.show({
            type: 'error',
            text1: `Error occurred while processing your request...`,
            visibilityTime: 3250,
            position: "bottom"
          });

          setDialog(false);
      })
    }
    if (inputText.toLowerCase() === "decline") {
      console.log("decline request...");

      setDialog(false);
    }
  }
  return (
    <View style={{flex: 1}}>
      {renderTopContent()}
      <DialogInput isDialogVisible={dialog}
        title={"What would you like to do with this request? Accept or Decline?"}
        message={"If you'd like to accept this request, please type ACCEPT in the input-box. If you'd like to decline, please type DECLINE..."}
        hintInput ={"ACCEPT/DECLINE"}
        submitInput={(inputText) => submitDialogInput(inputText)}
        closeDialog={() => {
          setDialog(false);
        }}>
      </DialogInput>
      <SafeAreaView style={{flex: 1}} edges={['right', 'left', 'bottom']}>
        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          scrollEnabled={scrollable}
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          scrollEventThrottle={8}>
          {renderMainContent()}
        </ScrollView>
        {/* Pricing & Booking Process */}
        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          <Button full outline onPress={() => setDialog(true)}>
            {"Accept/Decline Invitation.."}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
const mapStateToProps = (state) => {
  return {
      authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
  }
}
export default connect(mapStateToProps, {  })(ViewIndividualMentorshipRequest);