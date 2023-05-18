import React, {useState, useEffect, useRef, Fragment} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
  Image,
  useColorScheme,
  Dimensions,
  Keyboard
} from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import {BaseColor, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  CommentItem,
  TextInput,
  Button,
  RateDetail
} from '@components';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import * as Utils from '@utils';
import {InteractionManager} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import styles from './styles';
import { SliderBox } from "react-native-image-slider-box";
import {useTranslation} from 'react-i18next';
import _ from 'lodash';
import moment from "moment";
import { connect } from 'react-redux';
import axios from "axios";
import { BASE_ASSET_URL, BASE_URL } from "@env";
import SendPrivateMessagePane from "./Panes/messagingPane.js";
import Geolocation from '@react-native-community/geolocation';
import PreviewImageGroupMeetup from "./Helpers/Slideshow/view.js";
import GroupMemebersListPane from "./Panes/GroupMembersList/list.js";

const { width, height } = Dimensions.get("window");

const HotelDetail = ({ navigation, authenticatedData, route }) => {
  const { colors, theme } = useTheme();
  const cardColor = colors.card;
  const {t} = useTranslation();
  const colorSchemeDark = theme.dark;
  const leaveNewCommentRBRef = useRef(null);
  const groupListPaneRef = useRef(null);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [renderMapView, setRenderMapView] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ selectedIndex, setSelectedIndex ] = useState(1);
  const [ meetingData, setMeetingData ] = useState(route.params.meetingData);
  const [ reviewData, setReviewData ] = useState(null);
  const [ comments, setComments ] = useState([]);
  const [ users, setUsers ] = useState([]);
  const deltaY = new Animated.Value(0);

  
  const fetchCommentsToAddProfilePic = (passedComments) => {

    const promises = [];

    if (typeof passedComments !== "undefined" && passedComments.length > 0) {
        for (let idxxxxx = 0; idxxxxx < passedComments.length; idxxxxx++) {
            const previousCommentOBJ = passedComments[idxxxxx];
            
            const { postedByID } = previousCommentOBJ;

            if (typeof previousCommentOBJ.subcomments !== "undefined" && previousCommentOBJ.subcomments.length > 0) {

                for (let idxxxxx = 0; idxxxxx < previousCommentOBJ.subcomments.length; idxxxxx++) {
                    const nestedSubcomment = previousCommentOBJ.subcomments[idxxxxx];

                    console.log("nestedSubcomment", nestedSubcomment);

                    promises.push(new Promise((resolve, reject) => {
                        // update comments state
                        const config = {
                            params: {
                                postedByID: nestedSubcomment.postedByID
                            }
                        };
                        axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
                            if (res.data.message === "Submitted gathered user's picture/file!") {
    
                                const { user } = res.data; 
        
                                nestedSubcomment["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
        
                                resolve(previousCommentOBJ);
                            } else {
        
                                nestedSubcomment["lastProfilePic"] = null;
        
                                resolve(previousCommentOBJ);
                            }
                        }).catch((err) => {
                            nestedSubcomment["lastProfilePic"] = null;
        
                            resolve(previousCommentOBJ);
                        })
                    }));
                }

            } else {
                promises.push(new Promise((resolve, reject) => {
                    // update comments state
                    const config = {
                        params: {
                            postedByID: postedByID
                        }
                    };
                    axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
                        if (res.data.message === "Submitted gathered user's picture/file!") {

                            const { user } = res.data; 
    
                            previousCommentOBJ["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
    
                            resolve(previousCommentOBJ);
                        } else {
    
                            previousCommentOBJ["lastProfilePic"] = null;
    
                            resolve(previousCommentOBJ);
                        }
                    }).catch((err) => {
                        previousCommentOBJ["lastProfilePic"] = null;
    
                        resolve(previousCommentOBJ);
                    })
                }));
            }
        };

        Promise.all(promises).then((passedValues) => {

            console.log("Promise passedValues passedValues passedValues passedValues....:", passedValues);

            setComments(passedValues);
        });
    } else {
        console.log("NO comments available...!");
    }
  }
  console.log("state.comments", comments);

  useEffect(() => {
      console.log("Effect subcomments-related re-mounted...");

      fetchCommentsToAddProfilePic(comments);

  }, [...comments.map((comment) => {
      return comment.id;
  })])

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setRenderMapView(true);
    });

    fetchCommentsToAddProfilePic(meetingData.comments);

    if (authenticatedData !== null && typeof authenticatedData !== "undefined" && Object.values(authenticatedData).length >= 5 && _.has(authenticatedData, "currentApproxLocation")) {

      const meetingDataPassed = route.params.meetingData.reviewsOfGroup;
      let reviewObj = {
        "positive-experience": 0,
        "fun-and-engaging-experience": 0,
        "friendly-and-welcoming": 0,
        "id-return-repeat-again": 0,
        "total-reviews": meetingDataPassed.length
      };

      for (let index = 0; index < meetingDataPassed.length; index++) {
        const individualReview = meetingDataPassed[index];

        for (let idx = 0; idx < individualReview.remarks.length; idx++) {
          const remark = individualReview.remarks[idx];
          reviewObj[remark] += 1;
        }
        
        console.log("individualReview", individualReview);
      }

      setReviewData(reviewObj);

      const latitude = authenticatedData.currentApproxLocation.geo.coordinates[1];
      const longitude = authenticatedData.currentApproxLocation.geo.coordinates[0]

      const config = {
        params: {
          currentLoc: { latitude, longitude },
          interestedIn: authenticatedData.interestedIn,
          accountType: authenticatedData.accountType,
          uniqueId: authenticatedData.uniqueId
        }
      };

      axios.get(`${BASE_URL}/gather/nearby/users`, config).then((res) => {
          if (res.data.message === "Gathered nearby location users!") {
              console.log(res.data);

              const { results } = res.data;

              setUsers(results);

          } else {
              console.log("Err", res.data);

              Toast.show({
                  type: 'error',
                  text1: `An error occurred while fetching relevant results!`,
                  text2: `We've encountered an error while attempting to fetch the desired/relevant users nearby, please try to load the page again or contact support if the problem persists...`,
                  visibilityTime: 3250,
                  position: "bottom"
              });
          }
      }).catch((err) => {
          console.log(err.message);

          // Toast.show({
          //     type: 'error',
          //     text1: `An error occurred while fetching relevant results!`,
          //     text2: `We've encountered an error while attempting to fetch the desired/relevant drop-off locations, please try to load the page again or contact support if the problem persists...`,
          //     visibilityTime: 3250,
          //     position: "bottom"
          // });
      })
    } else {
      Geolocation.getCurrentPosition(info => {

        const { latitude, longitude } = info.coords;
    
        const config = {
          params: {
            currentLoc: { latitude, longitude },
            interestedIn: authenticatedData.interestedIn,
            accountType: authenticatedData.accountType,
            uniqueId: authenticatedData.uniqueId
          }
        };
  
        axios.get(`${BASE_URL}/gather/nearby/users`, config).then((res) => {
            if (res.data.message === "Gathered nearby location users!") {
                console.log(res.data);
  
                const { results } = res.data;
  
                setUsers(results);
  
            } else {
                console.log("Err", res.data);
  
                Toast.show({
                    type: 'error',
                    text1: `An error occurred while fetching relevant results!`,
                    text2: `We've encountered an error while attempting to fetch the desired/relevant users nearby, please try to load the page again or contact support if the problem persists...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);
  
            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while fetching relevant results!`,
            //     text2: `We've encountered an error while attempting to fetch the desired/relevant drop-off locations, please try to load the page again or contact support if the problem persists...`,
            //     visibilityTime: 3250,
            //     position: "bottom"
            // });
        })
      });
    }
  }, []);

  const joinMeetupGroup = () => {
    console.log("joinMeetupGroup clicked/ran...");

    if (authenticatedData !== null && Object.keys(authenticatedData).length > 5 && _.has(authenticatedData, "uniqueId")) {
      const config = {
        groupID: meetingData.id,
        uniqueId: authenticatedData.uniqueId,
        username: authenticatedData.username,
        firstName: authenticatedData.firstName
      };
  
      axios.post(`${BASE_URL}/join/meetup/group`, config).then((res) => {
          if (res.data.message === "Gathered nearby location users!") {
              console.log(res.data);
  
              const { group } = res.data;
  
              setMeetingData(group);
  
              groupListPaneRef.current.close();
  
              Toast.show({
                type: 'success',
                text1: `Successfully joined this group!`,
                text2: `We've successfully joined you to this group, you may now participate in the group/meetup activities...`,
                visibilityTime: 3250,
                position: "bottom",
                onHide: () => {}
              });
  
          } else if (res.data.message === "You're already a member of this group!") {
  
            groupListPaneRef.current.close();
            
            Toast.show({
              type: 'info',
              text1: `You're already a member of this group!`,
              visibilityTime: 3250,
              position: "bottom"
            });
          } else {
              console.log("Err", res.data);
  
              Toast.show({
                  type: 'error',
                  text1: `An error occurred while attempting to join group!`,
                  text2: `We've encountered an error while attempting to join this specific meet-up group, please try to load the page again or contact support if the problem persists...`,
                  visibilityTime: 3250,
                  position: "bottom"
              });
          }
      }).catch((err) => {
          console.log(err.message);
  
          // Toast.show({
          //     type: 'error',
          //     text1: `An error occurred while attempting to join group!`,
          //     text2: `We've encountered an error while attempting to join this specific meet-up group, please try to load the page again or contact support if the problem persists...`,
          //     visibilityTime: 3250,
          //     position: "bottom"
          // });
      })
    } else {
      Toast.show({
          type: 'info',
          text1: 'You must sign-in/up first...',
          text2: `Please login/signup before accessing these features...`,
          visibilityTime: 4250,
          position: "bottom"
      });
    }
  }

  const renderImage = (num) => {
    switch (num) {
        case 1:
            return <Image source={{ uri: meetingData.meetupPics.imageOne }} style={{ width: "100%", height: "100%" }} />
            break;
        case 2:
            return <Image source={{ uri: meetingData.meetupPics.imageTwo }} style={{ width: "100%", height: "100%" }} />
            break;
        case 3:
            return <Image source={{ uri: meetingData.meetupPics.imageThree }} style={{ width: "100%", height: "100%" }} />
            break;
        case 4:
            return <Image source={{ uri: meetingData.meetupPics.imageFour }} style={{ width: "100%", height: "100%" }} />
            break;
        case 5:
            return <Image source={{ uri: meetingData.meetupPics.imageFive }} style={{ width: "100%", height: "100%" }} />
            break;
        default:
            break;
    }
  }

  const renderListFooterComponent = () => {
    return (
      <Fragment>
        <Text style={{ fontWeight: "bold", textAlign: "center", textDecorationLine: "underline", marginTop: 15, fontSize: 18.25, marginBottom: 10 }}>View More/All Reviews</Text>
      </Fragment>
    );
  }

  const calculateRatings = (reviews) => {
    if (typeof reviews !== "undefined" && reviews.length === 0) {
      return 0;
    } else {
      let sum = 0;

      for (let index = 0; index < reviews.length; index++) {
        const review = reviews[index];
        sum += review.rating;
      };

      return sum / reviews.length;
    }
  }

  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  console.log("----- ", reviewData !== null ?  (reviewData["positive-experience"] / reviewData["total-reviews"]) * 100 + "%" : "0%");

  console.log("reviewData ------------- : ", meetingData.reviewsOfGroup);
  return (
    <View style={{flex: 1}}>
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
        }}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <PreviewImageGroupMeetup setModalVisible={setModalVisible} selectedIndex={selectedIndex} passedImages={[meetingData.meetupPics.imageOne, meetingData.meetupPics.imageTwo, meetingData.meetupPics.imageThree, meetingData.meetupPics.imageFour, meetingData.meetupPics.imageFive]} />
      </Modal>
      <Animated.Image
        source={{uri: meetingData.meetupPics.imageOne}}
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(200),
                Utils.scaleWithPixel(200),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}
      />
      <Header
        title=""
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
          return <Image source={require("../../assets/icons/join-group.png")} style={styles.toppedRightIcon} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          if (authenticatedData !== null && Object.keys(authenticatedData).length > 5 && _.has(authenticatedData, "uniqueId")) {
            groupListPaneRef.current.open();
          } else {
            Toast.show({
                type: 'info',
                text1: 'You must sign-in/up first...',
                text2: `Please login/signup before accessing these features...`,
                visibilityTime: 4250,
                position: "bottom"
            });
          }
        }}
      />
      <RBSheet
        ref={leaveNewCommentRBRef}
        height={height}
        openDuration={250}
        draggable={false}
        closeOnDragDown={false}
        customStyles={{
            container: {
                paddingHorizontal: 20,
            }
        }}
      >
          {Object.values(authenticatedData).length >= 5 ? <SendPrivateMessagePane setComments={setComments} meetingData={meetingData} authData={authenticatedData} sendCommentRef={leaveNewCommentRBRef} /> : null}
      </RBSheet>
      <RBSheet
        ref={groupListPaneRef}
        height={height}
        openDuration={250}
        draggable={false}
        closeOnDragDown={true}
        customStyles={{
            container: colorSchemeDark ? {
              paddingHorizontal: 20,
              backgroundColor: "#000"
            } : {
              paddingHorizontal: 20,
            },
            draggableIcon: {
                width: width * 0.725
            }
        }}
      >
          <GroupMemebersListPane joinMeetupGroup={joinMeetupGroup} meetingData={meetingData} authData={authenticatedData} groupListPaneRef={groupListPaneRef} />
      </RBSheet>
      <SafeAreaView style={{flex: 1}} edges={['right', 'left', 'bottom']}>
        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 180 }}
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={8}>
          {/* Main Container */}
          <View style={{paddingHorizontal: 20}}>
            {/* Information */}
            <View
              style={[
                styles.contentBoxTop,
                {
                  marginTop: marginTopBanner,
                  backgroundColor: colors.card,
                  shadowColor: colors.border,
                  borderColor: colors.border,
                  minHeight: typeof meetingData.title !== "undefined" && meetingData.title.length >= 100 ? 300 : 200
                },
              ]}>
              <Text title2 semibold style={{marginBottom: 10 }}>
                {meetingData.title}
              </Text>
              <StarRating
                disabled={true}
                starSize={25}
                maxStars={5}
                rating={calculateRatings(typeof meetingData.reviewsOfGroup !== "undefined" && meetingData.reviewsOfGroup.length > 0 ? meetingData.reviewsOfGroup : [])}
                selectedStar={rating => {}}
                fullStarColor={BaseColor.yellowColor}
              />
              <Text
                body2
                style={{
                  marginTop: 5.75,
                  textAlign: 'center',
                  position: "absolute",
                  bottom: 15,
                  fontWeight: "bold"
                }}>
                  Group/Meetup created {moment(meetingData.posted).fromNow(true)}
              </Text>
            </View>
            {/* Rating Review */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={[
                    styles.circlePoint,
                    {backgroundColor: colors.primary},
                  ]}>
                  <Text title3 whiteColor>
                    {reviewData !== null ? reviewData["total-reviews"] : 0}
                  </Text>
                </View>
                <View>
                  <Text title3 primaryColor style={{marginBottom: 3}}>
                    Overall Group Rating By Review's
                  </Text>
                  <Text body2>See {reviewData !== null ? reviewData["total-reviews"] : 0} reviews</Text>
                </View>
              </View>
              <View style={styles.contentRateDetail}>
                <View style={[styles.contentLineRate, {marginRight: 10}]}>
                  <View style={{flex: 1}}>
                    <Text caption2 grayColor style={{marginBottom: 5}}>
                      Overall Positive Experience
                    </Text>
                    <View style={styles.lineBaseRate} />
                    <View
                      style={[
                        styles.linePercent,
                        {backgroundColor: colors.accent},
                        {width: reviewData !== null ?  (reviewData["positive-experience"] / reviewData["total-reviews"]) * 100 + "%"  : "0%"},
                      ]}
                    />
                  </View>
                  <Text caption2 style={{marginLeft: 15}}>
                    {reviewData !== null ? reviewData["positive-experience"] : 0}
                  </Text>
                </View>
                <View style={styles.contentLineRate}>
                  <View style={{flex: 1}}>
                    <Text caption2 grayColor style={{marginBottom: 5}}>
                      Friendly & Welcoming
                    </Text>
                    <View style={styles.lineBaseRate} />
                    <View
                      style={[
                        styles.linePercent,
                        {backgroundColor: colors.accent},
                        {width: reviewData !== null ?  (reviewData["friendly-and-welcoming"] / reviewData["total-reviews"]) * 100 + "%"  : "0%"},
                      ]}
                    />
                  </View>
                  <Text caption2 style={{marginLeft: 15}}>
                    {reviewData !== null ? reviewData["friendly-and-welcoming"] : 0}
                  </Text>
                </View>
              </View>
              <View style={styles.contentRateDetail}>
                <View style={[styles.contentLineRate, {marginRight: 10}]}>
                  <View style={{flex: 1}}>
                    <Text caption2 grayColor style={{marginBottom: 5}}>
                      Fun & Engaging
                    </Text>
                    <View style={styles.lineBaseRate} />
                    <View
                      style={[
                        styles.linePercent,
                        {backgroundColor: colors.accent},
                        {width: reviewData !== null ?  (reviewData["fun-and-engaging-experience"] / reviewData["total-reviews"]) * 100 + "%"  : "0%"},
                      ]}
                    />
                  </View>
                  <Text caption2 style={{marginLeft: 15}}>
                    {reviewData !== null ? reviewData["fun-and-engaging-experience"] : 0}
                  </Text>
                </View>
                <View style={styles.contentLineRate}>
                  <View style={{flex: 1}}>
                    <Text caption2 grayColor style={{marginBottom: 5}}>
                      Would Go To Again
                    </Text>
                    <View style={styles.lineBaseRate} />
                    <View
                      style={[
                        styles.linePercent,
                        {backgroundColor: colors.accent},
                        {width: reviewData !== null ?  (reviewData["id-return-repeat-again"] / reviewData["total-reviews"]) * 100 + "%"  : "0%"},
                      ]}
                    />
                  </View>
                  <Text caption2 style={{marginLeft: 15}}>
                    {reviewData !== null ? reviewData["id-return-repeat-again"] : 0}
                  </Text>
                </View>
              </View>
            </View>
            {authenticatedData !== null && Object.keys(authenticatedData).length > 5 && _.has(authenticatedData, "uniqueId") ? <Button outline style={{ marginTop: 12.25, marginBottom: 12.25 }} onPress={() => navigation.navigate("LeaveAReviewMeetupGroupScreen", { meetingData })}>
              {"Review This Group..."}
            </Button> : null}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold>
                Meetup Description/Detail's
              </Text>
              <Text body2 style={{marginTop: 5}}>
                {meetingData.description}
              </Text>
            </View>
            {/* Facilities Icon */}
            <View
              style={[
                styles.contentService,
                {borderBottomColor: colors.border},
              ]}>
              <Text headline semibold>   
                These are the interest's of the group creator/leader interest's...
              </Text>
              <Text body2 style={{marginTop: 5, marginBottom: 12.25}}>
                This is to give you a better idea of the personality of the creator of this group & what they're interested in outside of this group that other group members may also be interested in.
              </Text>
              <View style={styles.hr} />
              {meetingData.relevantTagsMeetup.map((item, index) => (
                <View style={{alignItems: 'center'}} key={'service' + index}>
                  <Text overline grayColor style={colorSchemeDark ? [styles.tagCustom, {borderWidth: 1.25, borderColor: "#fff"} ] : [styles.tagCustom, {borderWidth: 1.25, borderColor: "#000"} ]}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
            {/* Map location */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline style={{marginBottom: 5}} semibold>
                Meeting Location (Exact)
              </Text>
              <Text body2 numberOfLines={2}>
                <Text style={{ fontWeight: "bold" }}>Est. General Location</Text>: {meetingData.generalRegionOfMeetup.municipality} {meetingData.generalRegionOfMeetup.countrySubdivision}
              </Text>
              <Text body2 numberOfLines={2}>
              <Text style={{ fontWeight: "bold" }}>{meetingData.locationMeetupDetails.name}</Text>{"\n"}{meetingData.locationMeetupDetails.freeformAddress}
              </Text>
              <View
                style={{
                  height: 180,
                  width: '100%',
                  marginTop: 20,
                }}>
                {renderMapView && (
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={meetingData.selectedMeetupLocation}
                    onRegionChange={() => {}}>
                    <Marker
                      coordinate={meetingData.selectedMeetupLocation}
                    />
                  </MapView>
                )}
              </View>
            </View>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline style={{marginBottom: 5}} semibold>
                Total/Maximum member count allowed
              </Text>
              <Text body2 numberOfLines={2}>
              <Text style={{ fontWeight: "bold" }}>{meetingData.maximumMemberCount}</Text> maximum member count
              </Text>
            </View>
            {/* Open Time */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold>
                {t('good_to_know')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text body2 grayColor>
                    Meetins/Meetup Starts At
                  </Text>
                  <Text body2 accentColor semibold>
                    {moment(meetingData.meetupTime).format("HH:mm:ss A")}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Text body2 grayColor>
                    On Date
                  </Text>
                  <Text body2 accentColor semibold>
                    {moment(meetingData.meetupTime).format("MM-DD-YYYY")}
                  </Text>
                </View>
              </View>
              <Text style={{ marginTop: 12.25 }} headline semibold>
                Repeating Every Week? {meetingData.repeating ? "Yes!" : "No..."}
              </Text>
            </View>
            {/* Rooms */}
            <View style={styles.rowOutterImages}>
              <View style={styles.columnOne}>
                  <TouchableOpacity onPress={() => {
                    setSelectedIndex(0);
                    setModalVisible(true);
                  }} style={styles.firstColOne}>
                      {renderImage(1)}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setSelectedIndex(1);
                    setModalVisible(true);
                  }} style={styles.firstColTwo}>
                      {renderImage(2)}
                  </TouchableOpacity>
              </View>
              <View style={styles.columnTwo}>
                  <TouchableOpacity onPress={() => {
                    setSelectedIndex(2);
                    setModalVisible(true);
                  }} style={styles.innerRowOne}>
                      {renderImage(3)}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setSelectedIndex(3);
                    setModalVisible(true);
                  }} style={styles.innerRowTwo}>
                      {renderImage(4)}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setSelectedIndex(4);
                    setModalVisible(true);
                  }} style={styles.innerRowThree}>
                      {renderImage(5)}
                  </TouchableOpacity>
              </View>
          </View>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold>
                {"Other Users Near You!"}
              </Text>
              <FlatList
                data={users.slice(0, 3)}
                keyExtractor={(item, index) => item.id}
                renderItem={({item}) => (
                  <View style={[styles.listContentMapped, { marginTop: 15 }]}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile1', { user: item })} activeOpacity={0.9}>
                      <Image source={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }} style={styles.listImage} />
                    </TouchableOpacity>
                    <View style={styles.listContentRight}>
                      <Text headline semibold numberOfLines={1}>
                        {`${item.firstName} ~ ${item.username}`}
                      </Text>
                      <View style={styles.listContentService}>
                        <Text style={[styles.listItem, {color: colors.primary, marginTop: 6.25 } ]}>
                          Height: {_.has(item, "coreProfileData") && _.has(item.coreProfileData, "heightProfileData") ? item.coreProfileData.heightProfileData.height : "N/A"} {"\n"}Work Sector: {_.has(item, "coreProfileData") && _.has(item.coreProfileData, "employmentData") ? item.coreProfileData.employmentData.sector : "N/A"}{"\n"}Education: {_.has(item, "coreProfileData") && _.has(item.coreProfileData, "educationalData") ? item.coreProfileData.educationalData.schoolName : "N/A"}
                        </Text>
                      </View>
                      <Text
                        title3
                        accentColor
                        semibold
                        style={{paddingTop: 4.25, paddingBottom: 5}}>
                        Acct. Type: {item.accountType}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  alignItems: 'flex-end',
                }}>
                <Text headline semibold>
                  {"View Group Review's"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Post');
                  }}>
                  <Text caption1 grayColor>
                    {t('show_more')}
                  </Text>
                </TouchableOpacity>
              </View>
              <RateDetail
                  point={calculateRatings(typeof meetingData.reviewsOfGroup !== "undefined" && meetingData.reviewsOfGroup.length > 0 ? meetingData.reviewsOfGroup : [])}
                  maxPoint={5}
                  totalRating={typeof meetingData.reviewsOfGroup !== "undefined" && meetingData.reviewsOfGroup.length > 0 ? meetingData.reviewsOfGroup.length : 0}
                  // data={rateDetail.data}
                />
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={typeof meetingData.reviewsOfGroup !== "undefined" && meetingData.reviewsOfGroup.length > 0 ? meetingData.reviewsOfGroup : []}
                keyExtractor={(item, index) => item.id}
                renderItem={({item}) => (
                  <CommentItem
                    style={{marginTop: 10, maxWidth: width * 0.85, marginRight: 12.25 }}
                    image={{ uri: `https://ui-avatars.com/api/?name=${item.reviewerName}` }}
                    name={`${item.reviewerName} ~ @${item.reviewerUsername}`}
                    rate={item.rating}
                    date={moment(item.dateReviewed).fromNow(true)}
                    title={item.title}
                    comment={item.description}
                  />
                )}
              />
              {renderListFooterComponent()}
            </View>
            {/* Help Block Information */}
            {/* <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <HelpBlock
                title={helpBlock.title}
                description={helpBlock.description}
                phone={helpBlock.phone}
                email={helpBlock.email}
                style={{margin: 20}}
                onPress={() => {
                  navigation.navigate('ContactUs');
                }}
              />
            </View> */}
            {/* Other Information */}
            {/* 
              <Text headline semibold>
                4 Reason To Choose Us
              </Text>
              <View style={styles.itemReason}>
                <Icon name="map-marker-alt" size={18} color={colors.accent} />
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    Good Location
                  </Text>
                  <Text body2>
                    Andaz Tokyo Toranomon Hills is one of the newest luxury
                    hotels in Tokyo. Located in one of the uprising areas of
                    Tokyo
                  </Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <Icon name="pagelines" size={18} color={colors.accent} />
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    Great Food
                  </Text>
                  <Text body2>
                    Excellent cuisine, typical dishes from the best Romagna
                    tradition and more!
                  </Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <Icon name="servicestack" size={18} color={colors.accent} />
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    Private Beach
                  </Text>
                  <Text body2>
                    Excellent cuisine, typical dishes from the best Romagna
                    tradition and more!
                  </Text>
                </View>
              </View>
              <View style={styles.itemReason}>
                <Icon name="trophy" size={18} color={colors.accent} />
                <View style={{marginLeft: 10}}>
                  <Text subhead semibold>
                    5 Stars Hospitality
                  </Text>
                  <Text body2>Romagna hospitality, typical and much</Text>
                </View>
              </View> */}
              <View style={{paddingVertical: 10}}>
              <View style={{paddingVertical: 10 }}>
                <Text headline semibold>
                  Comment(s) About Meetup/Group
                </Text>
                <View style={styles.hrSpacer} />
                <Text style={styles.labeled}>Drop a comment (click the box below)...</Text>
                {Object.values(authenticatedData).length >= 5 ? <TextInput
                    onFocus={() => {
                        Keyboard.dismiss();
                        leaveNewCommentRBRef.current.open()
                    }}
                    style={colorSchemeDark ? { color: "#fff", margin: 15, left: -(width * 0.0325 ) } : { margin: 15, left: -(width * 0.0325 ), color: "#000" }}
                    placeholderTextColor={colorSchemeDark ? "#fff" : "#000"}
                    secureTextEntry={false}
                    placeholder={"Tap to open comment submission settings..."}
                /> : null}
                {typeof comments !== "undefined" && comments.length > 0 ? comments.map((comment, index) => {
                  const { postedDate, subject, postedBy, postedByID, postedByUsername, id } = comment;
                  return (
                    <Fragment key={index}>
                      <View style={[styles.contain, {backgroundColor: cardColor}]}>
                          <View style={{flexDirection: 'row', marginBottom: 10}}>
                            <View style={styles.contentLeft}>
                              <Image source={{ uri: typeof comment.lastProfilePic !== "undefined" && comment.lastProfilePic !== null ? `${BASE_ASSET_URL}/${comment.lastProfilePic.link}` : `https://i.pravatar.cc/300?img=${index}` }} style={styles.thumb} />
                              <View>
                                <Text headline semibold numberOfLines={1}>
                                  {postedBy}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.contentRight}>
                              <Text caption2 grayColor numberOfLines={1}>
                                {moment(postedDate).format("YYYY-MM-DD")}
                              </Text>
                            </View>
                          </View>
                          <View>
                            <Text subhead semibold>
                              {subject}
                            </Text>
                            <Text
                              body2
                              grayColor
                              style={{
                                marginTop: 10,
                              }}>
                                {comment.message}
                            </Text>
                          </View>
                        </View>
                    </Fragment>
                  );
                }) : <Fragment>
                  <Text style={[styles.labeled, { textAlign: "center" }]}>No Comment's Yet...</Text>  
                  <Image resizeMode='contain' source={require("../../assets/images/custom/no-comments.png")} style={styles.maxedCommentIcon} />
                </Fragment>}
              </View>
            </View>
          </View>
        </ScrollView>
        {/* Pricing & Booking Process */}
        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          <View>
            <Text caption1 semibold>
              Meetup Date
            </Text>
            <Text title3 primaryColor semibold>
              {moment(meetingData.meetupTime).format("MM-DD-YYYY")}
            </Text>
          </View>
          <Button onPress={() => joinMeetupGroup()}>
            {"Join Meet-Up Group"}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}

const mapStateToProps = (state) => {
	return {
    authenticatedData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
	}
}
export default connect(mapStateToProps, { })(HotelDetail);