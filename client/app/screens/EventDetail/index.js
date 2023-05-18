import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  RefreshControl
} from 'react-native';
import { BaseColor, Images, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Tag,
  Image,
  Button,
  RateDetail, 
  CommentItem,
  ProfileGroup
} from '@components';
import { useTranslation } from 'react-i18next';
import * as Utils from '@utils';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";
import { ReviewData } from '@data';
import { BASE_URL, BASE_ASSET_URL } from "@env";
import axios from "axios";
import { connect } from "react-redux";
import _ from "lodash";
import moment from 'moment';

const { width, height } = Dimensions.get("window");

const EventDetail = (props) => {
  const authData = props.authData;
  const navigation = useNavigation();
  const deltaY = new Animated.Value(0);
  const colorSchemeDark = useColorScheme() === "dark" ? true : false;
  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const {colors, theme} = useTheme();
  const {t} = useTranslation();
  const [ refreshing, setRefreshing ] = useState(false);
  const [ listing, setListing ] = useState(props.route.params.listing);
  const [ ready, setReady ] = useState(false);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [reviewList] = useState(ReviewData);
  const [ userData, setUserState ] = useState(null);
  const [ selectedTier, setSelectedTier ] = useState("N/A");
  
  const fetchCommentsToAddProfilePic = (reactions) => {

    const promises = [];

    if (typeof reactions !== "undefined" && reactions.length > 0) {
        for (let idxxxxx = 0; idxxxxx < reactions.length; idxxxxx++) {
            const previousCommentOBJ = reactions[idxxxxx];
            
            const { reactorID } = previousCommentOBJ;

            promises.push(new Promise((resolve, reject) => {
              // update comments state
              const config = {
                  params: {
                    postedByID: reactorID
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
        };

        Promise.all(promises).then((passedValues) => {

            console.log("Promise passedValues passedValues passedValues passedValues....:", passedValues);

            setListing(prevState => {
              return {
                ...prevState,
                hearts: passedValues
              }
            })
        });
    } else {
        console.log("NO reactions available...!");

        setListing(prevState => {
          return {
            ...prevState,
            hearts: []
          }
        })
    }
  }

  useEffect(() => {
      console.log("Effect subcomments-related re-mounted...");

      fetchCommentsToAddProfilePic(listing.hearts);

  }, [...listing.hearts.map((reaction) => {
      return reaction.reactorID;
  })])
  
  const [rateDetail] = useState({
    point: 4.7,
    maxPoint: 5,
    totalRating: 25,
    data: ['80%', '10%', '10%', '0%', '0%'],
  });

  useEffect(() => {
    const config = {
      params: {
        postedByID: props.route.params.listing.uniqueId
      }
    }

    axios.get(`${BASE_URL}/gather/one/user/restricted/data/mentorship`, config).then((res) => {
        if (res.data.message === "Submitted gathered user's restricted data!") {
            console.log("resdata", res.data);

            const { user } = res.data;

            setUserState(user);
            setReady(true);
        } else {
            console.log("errrorrrrrr", res.data);
        }
    }).catch((err) => {
        console.log(err.message);
    })
  }, []);

  const renderListFooterComponent = () => {
    return (
      <Fragment>
        <Text style={{ fontWeight: "bold", textAlign: "center", textDecorationLine: "underline", marginTop: 15, fontSize: 18.25 }}>View More/All Reviews</Text>
      </Fragment>
    );
  }

  const handleHeartLoveLike = () => {
    console.log("handleHeartLoveLike clicked/ran...!");

    const config = {
      postedByID: props.route.params.listing.uniqueId,
      uniqueId: authData.uniqueId,
      reactorName: authData.firstName,
      reactorUsername: authData.username
    }

    axios.post(`${BASE_URL}/heart/like/mentorship/profile/listing`, config).then((res) => {
        if (res.data.message === "Submitted heart/like!") {
            console.log("resdata", res.data);

            const { hearts } = res.data;

            fetchCommentsToAddProfilePic(hearts);
        } else {
            console.log("errrorrrrrr", res.data);
        }
    }).catch((err) => {
        console.log(err.message);
    })
  }

  const calculateRatings = (reviews) => {
    let sum = 0;

    for (let index = 0; index < reviews.length; index++) {
      const review = reviews[index];
      sum += review.rating;
    };

    return sum / reviews.length;
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
              Assisted Dating Mentorship
            </Text>
            <ProfileGroup
              name="Like this also..."
              detail={`${listing.hearts.length} people like this!`}
              users={listing.hearts.slice(0, 4).map((reaction, index) => {
                console.log("reaction.lastProfilePic", reaction.lastProfilePic);
                if (typeof reaction.lastProfilePic !== "undefined" && reaction.lastProfilePic !== null) {
                  return { image: { uri: `${BASE_ASSET_URL}/${reaction.lastProfilePic.link}` } };
                } else {
                  return { image: Images.profile1 };
                }
              })}
              onPressLove={() => handleHeartLoveLike()}
            />
            <Text body style={{ marginBottom: 22.25 }}>Our mentors are registered therapists & practicing mental health professionals who work in tandem with our user's to provide THE best/optimal dating experience possible. Examine your experiences and enhance them going forward with the cognative assistance our providers provide.</Text>
            <View style={{ flexDirection: "row", display: "flex" }}>
              <View style={styles.halfSized}>
                <Text body2 semibold>
                  {`Year's Of Experience`}
                </Text>
                <Text body2 grayColor style={{marginVertical: 10}}>
                  {listing.coreMentorshipAccountInfo.yearsOfExperience} Year's
                </Text>
              </View>
              <View style={styles.halfSized}>
                <Text body2 semibold style={{ marginBottom: 10}}>
                  {"Working Hours Per Week"}
                </Text>
                <Text body2 grayColor style={{marginVertical: 10}}>
                  {listing.coreMentorshipAccountInfo.hoursPerWeekWorking.value}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", display: "flex" }}>
              <View style={styles.halfSized}>
                <Text body2 semibold style={{marginBottom: 10}}>
                  {"Allocation of time"}
                </Text>
                <Text body2 grayColor style={{marginVertical: 10}}>
                  {listing.coreMentorshipAccountInfo.billingTimeAllocation.value}
                </Text>
              </View>
              <View style={styles.halfSized}>
                <Text body2 semibold style={{marginVertical: 10}}>
                  {"Previous Experience"}
                </Text>
                <Text body2 grayColor style={{marginVertical: 10}}>
                 {listing.coreMentorshipAccountInfo.allocationOfTime.value}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", display: "flex" }}>
              <View style={styles.halfSized}>
                <Text body2 semibold style={{marginBottom: 10}}>
                  {"School Name (Higher Education)"}
                </Text>
                <Text body2 grayColor style={{marginVertical: 10}}>
                  {listing.coreMentorshipAccountInfo.schoolAndResume.schoolName}
                </Text>
              </View>
              <View style={styles.halfSized}>
                <Text body2 semibold style={{marginVertical: 10}}>
                  {"Graduation Year (Schooling)"}
                </Text>
                <Text body2 grayColor style={{marginVertical: 10}}>
                 {listing.coreMentorshipAccountInfo.schoolAndResume.graduationYear}
                </Text>
              </View>
            </View>
      
      
            
            <Text body2 grayColor lineHeight={20}>
              {listing.description}
            </Text>
            <View style={{alignItems: 'flex-end'}}>
              <Text caption1 accentColor>
                {t('see_details')}
              </Text>
            </View>
            <Text title3 semibold style={{marginTop: 10, marginBottom: 5}}>
              Service's Available By Mentor
            </Text>
            <View style={[styles.itemPrice, {borderColor: colors.border}]}>
              <Text headline semibold>
                One Meeting (30-Min)
              </Text>
              <Text body2 grayColor style={{marginVertical: 5}}>
                You will have ONE meeting with this therapist/companion at whatever time you and your therapist are available.
              </Text>
              <View style={styles.linePrice}>
                <Text title3 primaryColor semibold>
                  $34.99
                </Text>
                <View style={styles.iconRight}>
                  <TouchableOpacity onPress={() => setSelectedTier("N/A")}>
                    <Icon
                      name="minus-circle"
                      size={24}
                      color={BaseColor.grayColor}
                    />
                  </TouchableOpacity>
                  <Text title1 style={{paddingHorizontal: 10}}>
                    {selectedTier === "tier-1" ? 1 : 0}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedTier("tier-1")}>
                    <Icon name="plus-circle" size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={[styles.itemPrice, {borderColor: colors.border}]}>
              <Text headline semibold>
                Two Meetings (30-Min)
              </Text>
              <Text body2 grayColor style={{marginVertical: 5}}>
                You will have TWO meetings with this therapist/companion at whatever time you and your therapist are available.
              </Text>
              <View style={styles.linePrice}>
                <Text title3 primaryColor semibold>
                  $64.99
                </Text>
                <View style={styles.iconRight}>
                  <TouchableOpacity onPress={() => setSelectedTier("N/A")}>
                    <Icon
                      name="minus-circle"
                      size={24}
                      color={BaseColor.grayColor}
                    />
                  </TouchableOpacity>
                  <Text title1 style={{paddingHorizontal: 10}}>
                    {selectedTier === "tier-2" ? 1 : 0}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedTier("tier-2")}>
                    <Icon name="plus-circle" size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={[styles.itemPrice, {borderColor: colors.border}]}>
            <Text headline semibold>
                Three Meetings (30-Min)
              </Text>
              <Text body2 grayColor style={{marginVertical: 5}}>
                You will have THREE meetings with this therapist/companion at whatever time you and your therapist are available.
              </Text>
              <View style={styles.linePrice}>
                <Text title3 primaryColor semibold>
                  $99.99
                </Text>
                <View style={styles.iconRight}>
                  <TouchableOpacity onPress={() => setSelectedTier("N/A")}>
                    <Icon
                      name="minus-circle"
                      size={24}
                      color={BaseColor.grayColor}
                    />
                  </TouchableOpacity>
                  <Text title1 style={{paddingHorizontal: 10}}>
                    {selectedTier === "tier-3" ? 1 : 0}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedTier("tier-3")}>
                    <Icon name="plus-circle" size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text
              title3
              semibold
              style={{
                paddingTop: 10,
              }}>
              {"Catered/Specifc Request(s)"}
            </Text>
            <View style={[styles.wrapContent, {borderColor: colors.border}]}>
              {typeof listing.coreMentorshipAccountInfo.specificRequests !== "undefined" && listing.coreMentorshipAccountInfo.specificRequests.length > 0 ? listing.coreMentorshipAccountInfo.specificRequests.map(item => {
                return (
                  <Tag
                    icon={
                      <Icon
                        name={"hashtag"}
                        size={14}
                        color={colors.accent}
                        solid
                        style={{marginRight: 5}}
                      />
                    }
                    chip
                    key={item.id}
                    style={{
                      marginTop: 10,
                      marginRight: 10
                    }}>
                    {item}
                  </Tag>
                );
              }) : <Fragment>
                <Text style={styles.cateredText}>This mentor hasn't listed any specific request's that they cater to (liberterian, republican leaning, religious/non-religous, etc...)</Text>
              </Fragment>}
            </View>
          </View>
          {typeof listing.reviewsOfMentor !== "undefined" && listing.reviewsOfMentor.length > 0 ? <FlatList
            contentContainerStyle={{ padding: 20 }}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {}}
              />
            }
            data={listing.reviewsOfMentor}
            keyExtractor={(item, index) => item.id}
            ListFooterComponent={renderListFooterComponent}
            ListHeaderComponent={() => (
              <RateDetail
                point={calculateRatings(listing.reviewsOfMentor)}
                maxPoint={rateDetail.maxPoint}
                totalRating={listing.reviewsOfMentor.length}
                data={rateDetail.data}
              />
            )}
            renderItem={({item}) => (
              <CommentItem
                style={{marginTop: 10}}
                image={{ uri: `https://ui-avatars.com/api/?name=${item.reviewerName}` }}
                name={`${item.reviewerName} ~ @${item.reviewerUsername}`}
                rate={item.rating}
                date={moment(item.dateReviewed).fromNow(true)}
                title={item.title}
                comment={item.description}
              />
            )}
          /> : null}
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
          />
            <View style={{ margin: 12.25 }}>
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
                  <PlaceholderLine width={width * 0.225} />
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
                  <PlaceholderLine width={width * 0.225} />
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
                  <PlaceholderLine width={width * 0.225} />
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
                  <PlaceholderLine width={width * 0.225} />
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
                  <PlaceholderLine width={width * 0.225} />
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
                  <PlaceholderLine width={width * 0.225} />
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
                  <PlaceholderLine width={width * 0.225} />
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
                  <PlaceholderLine width={width * 0.225} />
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
                  <PlaceholderLine width={width * 0.225} />
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
                  <PlaceholderLine width={width * 0.225} />
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
                  <PlaceholderLine width={width * 0.225} />
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
                  <PlaceholderLine width={width * 0.225} />
                  <PlaceholderLine width={30} />
              </Placeholder>
            </View>
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
            {ready ? <Image resizeMode={"cover"} source={{ uri: `${BASE_ASSET_URL}/${userData.profilePictures[userData.profilePictures.length - 1].link}` }} style={{flex: 1}} /> : <Image source={require("../../assets/images/custom/loading.png")} style={{flex: 1}} />}
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
                <Image source={userData !== null ? require("../../assets/icons/profile-black-squared.png") : Images.profile2} style={styles.userIcon} />
                <View style={styles.infoContainer}>
                  <Text headline semibold whiteColor>
                    {userData !== null ? `${userData.firstName} ~ @${userData.username}` : "Loading... (N/A)"}
                  </Text>
                  <Text footnote whiteColor>
                    {userData !== null ? `${userData.accountType}` : "N/A"} | {userData !== null ? userData.rank : "N/A"}
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
  const renderContinuationButtonOrNot = () => {
    if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
      return (
        <Fragment>
          <Button onPress={() => navigation.navigate("EnrollmentCompanionMentorStartProcess", { data: selectedTier, userData })}>
            {"Hire This Mentor"}
          </Button>
        </Fragment>
      );
    } else {
      return null;
    }
  }
  return (
    <View style={{flex: 1}}>
      {renderTopContent()}
      <SafeAreaView style={{flex: 1}} edges={['right', 'left', 'bottom']}>
        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          scrollEventThrottle={8}>
          {renderMainContent()}
        </ScrollView>
        {/* Pricing & Booking Process */}
        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          <View>
            <Text caption1 semibold grayColor>
              {"User's Rank"}
            </Text>
            <Text title3 primaryColor semibold>
              {userData !== null ? userData.rank : "N/A"}
            </Text>
            <Text caption1 semibold grayColor style={{marginTop: 5}}>
              {"Ranking based on other peer's \nrankings/reviews"}
            </Text>
          </View>
          {selectedTier !== "N/A" ? renderContinuationButtonOrNot() : null}
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
export default connect(mapStateToProps, {  })(EventDetail);