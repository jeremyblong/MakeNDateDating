import React, {useState, useCallback, useRef, Fragment, useEffect } from 'react';
import { View, Animated, TouchableOpacity, FlatList, Dimensions, Platform, ScrollView, Image as NativeImage } from 'react-native';
import {
  Image,
  Text,
  Icon,
  Card,
  Button,
  SafeAreaView
} from '@components';
import {BaseStyle, Images, useTheme} from '@config';
import * as Utils from '@utils';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import { connect } from "react-redux";
import _ from "lodash";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from "moment";
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";
import BannerAdsRenderSpacer from "../../mainScreens/AdvertisementHelpers/BannerFull/bannerSpacer.js";
import ShowDetailsPaneBachelorette from "../../mainScreens/Bachelorette/ViewMainView/Sheets/InfoSheet.js";

const { width, height } = Dimensions.get("window");

const Home = (props) => {
  const navigation = useNavigation();
  const { authData } = props;
  const {colors, theme} = useTheme();
  const colorSchemeDark = theme.dark;
  const {t} = useTranslation();
  const [icons] = useState([
    {
      icon: require("../../assets/icons/dating-icons/Nearby.png"),
      name: `Explore Users`,
      route: 'Hotel',
    },
    {
      icon: require("../../assets/icons/dating-icons/Message.png"),
      name: 'Notification(s)',
      route: 'Notification',
    },
    {
      icon: require("../../assets/icons/dating-icons/DatingApp.png"),
      name: 'Group Chat',
      route: 'JoinSpecificChatChannelSelection',
    },
    {
      icon: require("../../assets/icons/dating-icons/HeartLocked.png"),
      name: 'Matches',
      route: 'Matches',
    },
    {
      icon: require("../../assets/icons/dating-icons/Photos.png"),
      name: 'New Feed Post',
      route: 'PostNewFeedItems',
    },
    {
      icon: require("../../assets/icons/dating-icons/SpeedDating.png"),
      name: '1v1 Chat',
      route: 'OneVOneChatRandom',
    },
    {
      icon: require("../../assets/icons/dating-icons/Games.png"),
      name: `Competition Game`,
      route: 'BacheloretteMain',
    },
    {
      icon: require("../../assets/icons/dating-icons/Help.png"),
      name: 'more',
      route: 'More',
    },
  ]);
  
  const [ state, setState ] = useState({
    meetups: [],
    mentors: [],
    promotedUsers: [],
    scrollable: true,
    listings: [],
    alreadyIncluded: [],
    users: []
  });

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const deltaY = new Animated.Value(0);
  const _carouselRef = useRef(null);
  const refSheet = useRef(null);

  useFocusEffect(
    useCallback(() => {

      const configurationCompetitions = {
        params: {
            idsAlreadyIncluded: state.alreadyIncluded
        }
    };

    axios.get(`${BASE_URL}/gather/competitions/bachelorette/games`, configurationCompetitions).then((res) => {
        if (res.data.message === "Successfully gathered games!") {
            console.log("Successfully gathered games!", res.data);

            const { listings } = res.data;

            setState(prevState => {
                return {
                    ...prevState,
                    listings: listings.filter((listing) => {

                      const dateA = moment(new Date(moment(listing.creationDate).add(7, "d")));
                      const dateB = moment(new Date());

                      const differenceDate = dateA.diff(dateB, 'days');

                      if (differenceDate > 0) {
                        if (Number(listing.listingData.startDate) >= Number(moment(authData.birthdate).format("YYYY")) && Number(listing.listingData.endDate) <= Number(moment(authData.birthdate).format("YYYY")) && listing.joinable === true) { 
                          return listing;
                        }
                      }
                    })
                }
            })
        } else {
            console.log("Err", res.data);

            Toast.show({
                type: 'error',
                text1: `Error attempting to gather proper data!`,
                text2: `An error occurred while attempting to gather proper data - please try again or report to support if persists...`,
                visibilityTime: 2750,
                position: "bottom"
            });
        }
    }).catch((err) => {
        console.log(err.message);
    })

      const configgggg = {
        params: {
          sizeOfResults: 20
        }
      }
  
      axios.get(`${BASE_URL}/gather/randomized/users/coaching/mentorship`, configgggg).then((res) => {
          if (res.data.message === "Gathered list of counselors!") {
              console.log("resdata", res.data);
  
              const { counselors } = res.data;
  
              setState(prevState => {
                return {
                    ...prevState,
                    mentors: counselors
                }
            })
          } else {
              console.log("errrorrrrrr", res.data);
          }
      }).catch((err) => {
          console.log(err.message);
      })

      const configuration = {
        params: {}
      }
  
      axios.get(`${BASE_URL}/gather/meetups/randomized`, configuration).then((ressss) => {
          if (ressss.data.message === "Gathered list of meetings!") {
              console.log("ressssdata", ressss.data);
  
              const { meetups } = ressss.data;
  
              setState(prevState => {
                return {
                    ...prevState,
                    meetups
                }
            })
          } else {
              console.log("errrorrrrrr", ressss.data);
          }
      }).catch((err) => {
          console.log(err.message);
      })

      // const configurationCustom = {
      //     params: {
      //         sizeOfResults: 20
      //     }
      // };

      // axios.get(`${BASE_URL}/gather/randomized/listings/for/sale`, configurationCustom).then((res) => {
      //     if (res.data.message === "Gathered listings!") {

      //         const { listings } = res.data; 

      //         setState(prevState => {
      //           return {
      //             ...prevState,
      //             listings
      //           }
      //         })
      //     } else {

      //         console.log("res.data error", res.data);

      //         Toast.show({
      //             type: 'error',
      //             text1: `An error occurred while processing your request.`,
      //             text2: `We've experienced an error while trying to fetch listing details...`,
      //             visibilityTime: 4250,
      //             position: "bottom"
      //         });
      //     }
      // }).catch((err) => {
      //     console.log("err", err);

      //     Toast.show({
      //         type: 'error',
      //         text1: `An error occurred while processing your request.`,
      //         text2: `We've experienced an error while trying to fetch listing details...`,
      //         visibilityTime: 4250,
      //         position: "bottom"
      //     });
      // })

      if (_.has(authData, "interestedIn")) {
        const config = {
          params: {
            sizeOfResults: 20,
            interestedIn: authData.interestedIn,
            uniqueId: authData.uniqueId
          }
        }
    
        axios.get(`${BASE_URL}/gather/users/limited`, config).then((ressss) => {
            if (ressss.data.message === "Gathered list of users!") {
                console.log("ressssdata", ressss.data);
    
                const { users } = ressss.data;
    
                setState(prevState => {
                  return {
                      ...prevState,
                      users
                  }
              })
            } else {
                console.log("errrorrrrrr", ressss.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })

        const configurationCustom = {
          params: {
            sizeOfResults: 20,
            uniqueId: authData.uniqueId
          }
        }
    
        axios.get(`${BASE_URL}/gather/users/limited/promoted/boosted`, configurationCustom).then((ressss) => {
            if (ressss.data.message === "Gathered list of users!") {
                console.log("ressssdata PROMOTED...:", ressss.data);
    
                const { users } = ressss.data;
    
                setState(prevState => {
                  return {
                      ...prevState,
                      promotedUsers: users
                  }
                })
            } else {
                console.log("errrorrrrrr", ressss.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
      } else {
        const config = {
          params: {
            sizeOfResults: 20
            // uniqueId: authData.uniqueId
          }
        }
    
        axios.get(`${BASE_URL}/gather/users/limited/general`, config).then((ressss) => {
            if (ressss.data.message === "Gathered list of users!") {
                console.log("ressssdata", ressss.data);
    
                const { users } = ressss.data;
    
                setState(prevState => {
                  return {
                      ...prevState,
                      users
                  }
              })
            } else {
                console.log("errrorrrrrr", ressss.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
      }
  }, []));

  const renderIconService = () => {
    return (
      <FlatList
        data={icons}
        numColumns={4}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.itemService}
              activeOpacity={0.9}
              onPress={() => {
                if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                  navigation.navigate(item.route);
                } else {
                  Toast.show({
                      type: 'info',
                      text1: 'You must sign-in/up first...',
                      text2: `Please login/signup before accessing these features...`,
                      visibilityTime: 4250,
                      position: "bottom"
                  });
                }
              }}>
              <View
                style={[styles.iconContent, {backgroundColor: colors.card, borderWidth: 1, borderColor: "darkgrey"}]}>
                  <Image resizeMode={"contain"} source={item.icon} style={{ maxHeight: 20, maxWidth: 20, width: 20, height: 20, borderRadius: 4.25 }} />
                {/* <Icon name={item.icon} size={18} color={colors.primary} solid /> */}
              </View>
              <Text footnote grayColor numberOfLines={1}>
                {t(item.name)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const heightImageBanner = Utils.scaleWithPixel(Platform.OS === "ios" ? 225 : 175);
  const marginTopBanner = heightImageBanner - heightHeader;

  const _renderItem = ({item, index}) => {
    return (
      <Fragment>
        <View style={colorSchemeDark ? [styles.mainContainerIterated, { backgroundColor: "#000", borderWidth: 2, borderColor: "#fff" }] : styles.mainContainerIterated}>
          <TouchableOpacity onPress={() => {
            if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
              navigation.navigate('Profile1', { user: item });
            } else {
              Toast.show({
                  type: 'info',
                  text1: 'You must sign-in/up first...',
                  text2: `Please login/signup before accessing these features...`,
                  visibilityTime: 4250,
                  position: "bottom"
              });
            }
          }} activeOpacity={0.9}>
            <Image resizeMode={"contain"} source={{ uri: typeof item.profilePictures !== "undefined" && item.profilePictures.length > 0 ? `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` : `https://i.pravatar.cc/300?img=${index}` }} style={styles.blockImage} />
          </TouchableOpacity>
          <View style={{paddingHorizontal: 20, paddingVertical: 20}}>
            <Text title2 semibold style={{marginTop: 5}} numberOfLines={1}>
              {`${item.firstName} ~ \n@${item.username}`}
            </Text>
            <View style={styles.blockContentAddress}>
              <Icon name="map-marker-alt" color={colors.primaryLight} size={10} />
              <Text
                caption1
                grayColor
                style={{
                  marginLeft: 3,
                }}
                numberOfLines={1}>
                {`${moment(item.birthdateRaw).fromNow(true)} old`}
              </Text>
            </View>
            <View style={styles.blockContentDetail}>
              <View style={{flex: 1}}>
                <Text title3 primaryColor semibold>
                  {item.verficationCompleted ? "Verified!" : "Not Verified."}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {/* <Tag onPress={() => {}}>
                  {Math.floor(Math.random() * (5 - 1 + 1) + 1)}
                </Tag> */}
                <View
                  style={{
                    marginLeft: 10,
                  }}>
                  {/* <StarRating
                    disabled={true}
                    starSize={10}
                    maxStars={5}
                    rating={3}
                    selectedStar={rating => {}}
                    fullStarColor={BaseColor.yellowColor}
                  /> */}
                  <Text style={[styles.scoreText, { color: colors.accent }]}>{item.rank}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Fragment>
    )
  }

  const Bachelor = () => {
    return (
      <View style={{ margin: 12.25, minWidth: width * 0.75 }}>
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
            <PlaceholderLine width={width * 0.625} />
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
            <PlaceholderLine width={width * 0.625} />
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
            <PlaceholderLine width={width * 0.625} />
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
            <PlaceholderLine width={width * 0.625} />
            <PlaceholderLine width={30} />
        </Placeholder>
      </View>
    );
  }

  const renderSkelatonLoadingBachelor = () => {
    return (
      <Fragment>
        <View style={styles.centeredMargin}>
          <Image resizeMode={"contain"} source={require("../../assets/images/nodatafound.png")} style={colorSchemeDark ? [styles.placeholderImageBach, { borderColor: "#fff" }] : [styles.placeholderImageBach, { borderColor: "#000" }]} />
        </View>
      </Fragment>
    );
  }

  return (
    <View style={{flex: 1}}>
        <Animated.Image
          source={require("../../assets/images/custom/dating.jpg")}
          style={[
            styles.imageBackground,
            {
              height: deltaY.interpolate({
                inputRange: [
                  0,
                  Utils.scaleWithPixel(Platform.OS === "ios" ? 275 : 225),
                  Utils.scaleWithPixel(Platform.OS === "ios" ? 275 : 225),
                ],
                outputRange: [heightImageBanner, heightHeader, 0],
              }),
            },
          ]}
        />
        <SafeAreaView style={{flex: 1}} edges={['right', 'left']}>
          <FlatList
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: {y: deltaY},
                },
              },
            ])}
            onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
            scrollEventThrottle={8}
            ListHeaderComponent={
              <View style={{paddingHorizontal: 20}}>
                <View
                  style={[
                    styles.searchForm,
                    {
                      marginTop: marginTopBanner,
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      shadowColor: colors.border,
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                        navigation.navigate('Search')
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
                    activeOpacity={0.9}>
                    <View
                      style={[
                        BaseStyle.textInput,
                        {backgroundColor: colors.card},
                      ]}>
                      <Text body1 grayColor>
                        {"Search for a user (username)"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {renderIconService()}
                </View>
              </View>
            }
            ListFooterComponent={
              <View>
                  <View>
                    <Text title3 semibold style={styles.titleView}>
                      {t(`View Local Meetup's Nearby !`)}
                    </Text>
                    <TouchableOpacity onPress={() => {
                      if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                        navigation.navigate("ViewAllMeetupsNearby");
                      } else {
                        Toast.show({
                            type: 'info',
                            text1: 'You must sign-in/up first...',
                            text2: `Please login/signup before accessing these features...`,
                            visibilityTime: 4250,
                            position: "bottom"
                        });
                      }
                    }}>
                      <Text style={{ marginBottom: 15, marginHorizontal: 22.25, textDecorationLine: "underline" }} body2 accentColor>
                        {"Click to view/search ALL meetup's"}
                      </Text>
                    </TouchableOpacity>
                    <FlatList
                      contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      ListEmptyComponent={Bachelor}
                      data={state.meetups}
                      keyExtractor={(item, index) => item.id}
                      renderItem={({item, index}) => {
                        return (
                          <Card
                            style={[styles.promotionItem, {marginLeft: 15}]}
                            image={{ uri: item.meetupPics.imageOne }}
                            onPress={() => {
                              if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                                navigation.navigate('HotelDetail', { meetingData: item })
                              } else {
                                Toast.show({
                                    type: 'info',
                                    text1: 'You must sign-in/up first...',
                                    text2: `Please login/signup before accessing these features...`,
                                    visibilityTime: 4250,
                                    position: "bottom"
                                });
                              }
                            }}>
                            <Text style={{ fontWeight: "bold", backgroundColor: "#000", padding: 3.25, opacity: 0.775, borderRadius: 4.25 }} subhead whiteColor>
                              {item.title.slice(0, 100)}
                            </Text>
                            <Text title2 whiteColor semibold>
                              {item.postedByUsername}
                            </Text>
                            <View style={styles.contentCartPromotion}>
                              <Button
                                style={styles.btnPromotion}
                                onPress={() => {}}>
                                <Text body2 semibold whiteColor>
                                  View Now!
                                </Text>
                              </Button>
                            </View>
                          </Card>
                        );
                      }} // 
                    /> 
                  </View>
                <BannerAdsRenderSpacer />
                <View style={{ marginVertical: 22.25 }}>
                  <Text style={styles.label}>These are our <Text style={{ color: colors.accent, textDecorationLine: "underline" }}>BOOSTED</Text> accounts - these people have promoted their accounts and are ready to meet some new people!</Text>
                  {typeof state.promotedUsers !== "undefined" && state.promotedUsers.length > 0 ? <Carousel
                    ref={_carouselRef}
                    data={state.promotedUsers}
                    layout={'stack'} 
                    firstItem={Platform.OS === "ios" ? 0 : state.promotedUsers.length - 1}
                    layoutCardOffset={Number(24)}
                    renderItem={_renderItem}
                    sliderWidth={width}
                    itemWidth={width * 0.825}
                  /> : <Fragment>
                    <Image resizeMode={"contain"} source={require("../../assets/images/NoResultsModified.png")} style={colorSchemeDark ? [styles.nodatanone, { borderColor: "#fff" }] : [styles.nodatanone, { borderColor: "#000" }]} />
                  </Fragment>}
                </View>
                  <View style={styles.titleView}>
                    <Text title3 semibold>
                      {t('Meet/Hire Our Dating Mentors & Guides (everyone needs some help)')}
                    </Text>
                    <Text body2 grayColor>
                      {"Meet new mentors & dating advisors you can hire to guide you through the dating process!"}
                    </Text>
                  </View>
                    <FlatList
                      contentContainerStyle={{ paddingLeft: 5, paddingRight: 20 }}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      data={state.mentors}
                      keyExtractor={(item, index) => item.id}
                      renderItem={({item, index}) => (
                        <Card
                          style={[styles.tourItem, {marginLeft: 15}]}
                          image={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }}
                          onPress={() => {
                            if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                              navigation.navigate('EventDetail', { listing: item });
                            } else {
                              Toast.show({
                                  type: 'info',
                                  text1: 'You must sign-in/up first...',
                                  text2: `Please login/signup before accessing these features...`,
                                  visibilityTime: 4250,
                                  position: "bottom"
                              });
                            }
                          }}>
                          <LinearGradient
                            style={{ position:'absolute', bottom:0, width: Utils.scaleWithPixel(135), height: 62.25 }}
                            colors={['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 1)']}
                            pointerEvents={'none'}
                          />
                          <Text title6 numberOfLines={1} whiteColor semibold>
                            {`${item.firstName} ~ @${item.username}`}
                          </Text>
                        </Card>
                      )}
                    />
                {/* Promotion */}
                <View style={styles.titleView}>
                  <Text title3 semibold>
                    {t(`View our subscription promotion's!`)}
                  </Text>
                  <Text body2 grayColor>
                    {t(`We periodically provide games, free prizes & promo's so check back often to check for updates/discount(s)... View our various promotional options by clicking the image below to be redirected!`)}
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("PromotionalOptionsMainView")}>
                    <Image source={Images.banner1} style={styles.promotionBanner} />
                  </TouchableOpacity>
                  <View style={[styles.line, {backgroundColor: colors.border}]} />
                </View>
                <View style={styles.titleView}> 
                  <Text title3 semibold>
                    {t(`View user's in your proximity/city below`)}
                  </Text>
                  <Text style={{ marginBottom: 10 }} body2 grayColor>
                    {t(`View user's in your general location & connect with nearby locals! These people are eager to meet new people so don't hesitate to shoot your shot!`)}
                  </Text>
                </View>
                <FlatList
                  columnWrapperStyle={{paddingLeft: 5, paddingRight: 20}}
                  numColumns={2}
                  data={state.users}
                  keyExtractor={(item, index) => item.id}
                  ListEmptyComponent={() => (
                    <Fragment>
                      <Image source={require("../../assets/images/analyticsnone.jpg")} style={styles.placeholderImageLoadingEmpty} />
                    </Fragment>
                  )}
                  renderItem={({item, index}) => {
                    return (
                      <View key={index} style={[styles.girdContent, { marginLeft: 15, marginBottom: 15 }]}>
                        <TouchableOpacity onPress={() => {
                          if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                            navigation.navigate('Profile1', { user: item })
                          } else {
                            Toast.show({
                                type: 'info',
                                text1: 'You must sign-in/up first...',
                                text2: `Please login/signup before accessing these features...`,
                                visibilityTime: 4250,
                                position: "bottom"
                            });
                          }
                        }} activeOpacity={0.9}>
                          <Image source={{ uri: typeof item.profilePictures !== "undefined" && item.profilePictures.length > 0 ? `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` : `https://i.pravatar.cc/300?img=${index}` }} style={styles.girdImage} />
                        </TouchableOpacity>
                        <View style={styles.girdContentLocation}>
                          <Icon name="calendar" color={colors.primary} size={10} />
                          <Text
                            caption2
                            grayColor
                            style={{
                              marginHorizontal: 5,
                            }}
                            numberOfLines={1}>
                            {`${moment(item.birthdateRaw).fromNow(true)} old`}
                          </Text>
                        </View>
                        <Text
                          body2
                          semibold
                          style={{
                            marginTop: 5,
                          }}>
                          {`${item.firstName} ~ \n@${item.username}`}
                        </Text>
                        <View style={styles.girdContentRate}>
                          {/* <StarRating
                            disabled={true}
                            starSize={10}
                            maxStars={5}
                            rating={rate}
                            selectedStar={rating => {}}
                            fullStarColor={BaseColor.yellowColor}
                          /> */}
                          <Text caption2 accentColor>
                            {typeof item.followers !== "undefined" && item.followers.length > 0 ? item.followers.length : 0} {"Follower(s)"}
                          </Text>
                          <Text
                            title4
                            primaryColor
                            semibold
                            style={{
                              marginTop: 0,
                            }}>
                            {item.verficationCompleted ? "Verified!" : "Not Verified."}
                          </Text>
                        </View>
                      </View>
                    )
                  }}
                />
                <View>
                <BannerAdsRenderSpacer />
                <View style={styles.titleView}>
                  <Text style={{ marginBottom: 10.25 }} title3 semibold>
                    {"In-App Game/Competition Series"}
                  </Text>
                  <Text style={{ marginBottom: 0 }} body2 grayColor>
                    {"Participate in the game like the bachelorette where you compete for dates & tokens with the main candidate/participant in a series of events played with other users... We have both male/female contestants!"}
                  </Text>
                </View>
                <FlatList
                  data={state.listings}
                  horizontal={true}
                  scrollEnabled={state.scrollable}
                  onScrollStartDrag={() => {
                    console.log("Start drag...");

                    setState(prevState => {
                      return {
                        ...prevState,
                        scrollable: true
                      }
                    })
                  }}
                  onScrollEndDrag={() => {
                    console.log("End drag...");

                    setState(prevState => {
                      return {
                        ...prevState,
                        scrollable: false
                      }
                    })
                  }}
                  ListEmptyComponent={renderSkelatonLoadingBachelor}
                  renderItem={({ item, index }) => {
                    if (item.joinable === true) {
                      const { bachelor, listingData } = item;
                      const lengthOfUsersJoined = typeof item.joined !== "undefined" && item.joined.length > 0 ? item.joined.length : 0;
                      const amountToFill = listingData.canidateCount - lengthOfUsersJoined;
                      const joinedArr = item.joined.concat(new Array(amountToFill).fill(null));
                      return (
                          <View onTouchStart={() => {
                            console.log('You touched by View');
    
                            setState(prevState => {
                              return {
                                ...prevState,
                                scrollable: true
                              }
                            });
                          }}  onStartShouldSetResponder={() => {
                            console.log('You click by View');
    
                            setState(prevState => {
                              return {
                                ...prevState,
                                scrollable: true
                              }
                            })
                          }} key={index} style={colorSchemeDark ? [styles.card, { backgroundColor: "#000", borderColor: "#fff" }] : [styles.card, { backgroundColor: "#fff", borderColor: "#000" }]} onPress={() => {}}>
                              <View style={styles.cardContent}>
                                  <Text style={styles.membersText}>These are the 'already joined' competing members...</Text>
                                  <ScrollView onScrollStartDrag={() => {
                                    console.log("Start drag...");
  
                                    // setState(prevState => {
                                    //   return {
                                    //     ...prevState,
                                    //     scrollable: false
                                    //   }
                                    // })
                                  }} onScrollEndDrag={() => {
                                    console.log("begin drag...");
  
                                    setState(prevState => {
                                      return {
                                        ...prevState,
                                        scrollable: true
                                      }
                                    })
                                  }} nestedScrollEnabled={true} showsHorizontalScrollIndicator={false} horizontal style={styles.imagesContent}>
                                      {joinedArr.map((joinedUser, index) => {
                                          if (joinedUser === null) {
                                              return (
                                                  <TouchableOpacity onPress={() => {}} key={`${item.id}_${index}`}>
                                                      <NativeImage blurRadius={10} style={colorSchemeDark ? [styles.productImage, { borderColor: "#fff" }] : [styles.productImage, { borderColor: "#000" }]} source={{ uri: `https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/placeholder-loading.png` }} />
                                                  </TouchableOpacity>
                                              );
                                          } else {
                                              return (
                                                  <TouchableOpacity onPress={() => {}} key={`${item.id}_${index}`}>
                                                      <NativeImage blurRadius={10} style={colorSchemeDark ? [styles.productImage, { borderColor: "#fff" }] : [styles.productImage, { borderColor: "#000" }]} source={{ uri: `${BASE_ASSET_URL}/${joinedUser.profilePictures[joinedUser.profilePictures.length - 1].link}` }} />
                                                  </TouchableOpacity>
                                              );   
                                          }
                                      })}
                                  </ScrollView>
                                  <Text style={[styles.productName, { color: colors.accent }]}>{item.postedName}</Text>
                                  <Text style={styles.gender}>{bachelor.gender.label}</Text>
                                  <Text style={styles.productPrice}>Cohort Starts in {differenceDate} days...</Text>
                                  <View style={styles.centered}>
                                      <Image style={[styles.bacheloretteImage, { borderColor: colors.primary }]} source={{ uri: `${BASE_ASSET_URL}/${bachelor.profilePictures[bachelor.profilePictures.length - 1].link}` }} />
                                  </View>
                              </View>
                              <View style={styles.cardActions}>
                                  {/* <TouchableOpacity style={[styles.buttonMain, { backgroundColor: colors.accent }]} onPress={() => {}}>
                                      <Text style={[styles.buttonText, { color: "#fff" }]}>Join Competition</Text>
                                  </TouchableOpacity> */}
                                  <TouchableOpacity style={[styles.buttonMain, { backgroundColor: colors.accent }]} onPress={() => {
                                      navigation.navigate("BacheloretteMain");
                                  }}>
                                      <Text style={[styles.buttonText, { color: "#fff" }]}>View Details About Competition</Text>
                                  </TouchableOpacity>
                                  {/* <TouchableOpacity style={styles.button} onPress={() => {}}>
                                      <Text style={styles.buttonText}>Message</Text>
                                  </TouchableOpacity> */}
                              </View>
                          </View>
                      );
                    }
                  }}
                  keyExtractor={item => item.id.toString()}
                />
                <ShowDetailsPaneBachelorette updateOutterState={setState} selected={state.selected} refSheet={refSheet} />
                  {/* <FlatList
                    contentContainerStyle={{paddingLeft: 5, paddingRight: 20, marginBottom: 50 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={state.listings}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({item, index}) => {
                      return (
                        <Fragment>
                          <View style={styles.pricedTextAbsolute}>
                            <Text title2 style={styles.pricedText} semibold>
                              ${Number(item.price).toFixed(2)}
                            </Text>
                          </View>
                          <Card
                            style={[styles.promotionItem, {marginLeft: 15}]}
                            image={{ uri: `${BASE_ASSET_URL}/${item.files[0].link}` }}
                            onPress={() => {
                              if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                                navigation.navigate("IndividualClothingItemListing", { data: item })
                              } else {
                                Toast.show({
                                    type: 'info',
                                    text1: 'You must sign-in/up first...',
                                    text2: `Please login/signup before accessing these features...`,
                                    visibilityTime: 4250,
                                    position: "bottom"
                                });
                              }
                            }}>
                            <Text style={{ fontWeight: "bold", backgroundColor: "#000", padding: 3.25, opacity: 0.775, borderRadius: 7.5 }} subhead whiteColor>
                              {item.title.slice(0, 70)}{typeof item.title !== "undefined" && item.title.length >= 70 ? "..." : ""}
                            </Text>
                            <View style={styles.contentCartPromotion}>
                              <Button
                                style={styles.btnPromotion}
                                onPress={() => {}}>
                                <Text body2 semibold whiteColor>
                                  View Now!
                                </Text>
                              </Button>
                            </View>
                          </Card>
                        </Fragment>
                      );
                    }}
                  />  */}
                </View>
              </View>
            }
          />
        </SafeAreaView>
    </View>
  );
}
const mapStateToProps = (state) => {
  return {
      authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
  }
}

export default connect(mapStateToProps, {  })(Home);