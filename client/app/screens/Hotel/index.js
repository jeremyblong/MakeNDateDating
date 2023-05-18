import React, {useState, useEffect, useRef, Fragment} from 'react';
import { RefreshControl, View, Animated, Dimensions, TouchableOpacity, Image } from 'react-native';
import { BaseStyle, useTheme, BaseColor } from '@config';
import { Header, SafeAreaView, Icon, HotelItem, FilterSort, Text, StarRating } from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL, TOMTOM_API_KEY } from "@env";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";
import FilterResultsSearching from "./panes/filterPane.js";
import RBSheet from "react-native-raw-bottom-sheet";
import RectangeCenteredBannerRender from "../../mainScreens/AdvertisementHelpers/RectanageBanner/rectangleBanner.js";   

const { width, height } = Dimensions.get("window");

const Hotel = ({navigation, authData}) => {
  const {colors, theme} = useTheme();
  const {t} = useTranslation();

  const RBSheetRef = useRef(null);
  const [modeView, setModeView] = useState('list');
  const [users, setUsers] = useState([]); // HotelData
  const [ ready, setReady ] = useState(false);
  const [refreshing] = useState(false);
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      offsetAnim,
    ),
    0,
    40,
  );

  const onChangeSort = () => {};

  const onFilter = () => {
    RBSheetRef.current.open();
  };
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'block':
        setModeView('grid');

        break;
      case 'grid':
        setModeView('list');

        break;
      case 'list':
        setModeView('block');

        break;
      default:
        setModeView('block');
        break;
    }
  };

  useEffect(() => {
    const config = {
      params: {
        sizeOfResults: 50,
        interestedIn: authData.interestedIn,
        uniqueId: authData.uniqueId
      }
    }

    axios.get(`${BASE_URL}/gather/users/limited`, config).then((ressss) => {
        if (ressss.data.message === "Gathered list of users!") {
            console.log("ressssdata", ressss.data);

            const { users } = ressss.data;

            const promises = [];

            if (typeof users !== "undefined" && users.length > 0) {
              for (let idx = 0; idx < users.length; idx++) {
                const user = users[idx];

                console.log("user", user.profilePictures); // 
      
                if (_.has(user, "currentApproxLocation")) {
                  promises.push(new Promise((resolve, reject) => {
  
                    const coords = `${user.currentApproxLocation.geo.coordinates[1]}, ${user.currentApproxLocation.geo.coordinates[0]}`;
        
                    axios.get(`https://api.tomtom.com/search/2/reverseGeocode/${coords}.json?key=${TOMTOM_API_KEY}`).then((res) => {
                        if (res.data) {
                            const addressRegion = res.data.addresses[0].address.municipalitySubdivision;
    
                            const conversion = {
                              ...user,
                              locationConverted: addressRegion
                            }

                            console.log("conversion", conversion);
    
                            resolve(conversion);
                        } else {
                            console.log("Err", res.data);
    
                            resolve(null);
                        }
                    }).catch((err) => {
                        console.log(err.message);
    
                        resolve(null);
                    })
                  }))
                }
  
                if ((users.length - 1) === idx) {
                  Promise.all(promises).then((passedData) => {

                    console.log("passedData", passedData);

                    setUsers(passedData);
                    setReady(true)
                  })
                }
              }
            } else {
              setReady(true);
            }
        } else {
            console.log("errrorrrrrr", ressss.data);
        }
    }).catch((err) => {
        console.log(err.message);
    })
  }, [])


  const calculateBizzType = (type) => {
    switch (type) {
      case "bizz":
        return "BIZZ (business relationship's)"
        break;
      case "date":
        return "DATE (Looking for a partner)"
        break;
      case "bff":
        return "BFF (Looking for friend's)"
        break;
      default: 
        break;
    }
  }

  const calculateRankingRate = rankingScore => {
    if (rankingScore <= 300) {
      return 1;
    } else if (rankingScore <= 500) {
      return 2;
    } else if (rankingScore <= 600) {
      return 3;
    } else if (rankingScore <= 800) {
      return 4;
    } else if (rankingScore >= 801) {
      return 5;
    }
  }

  const renderEmptyListContent = () => {
    return (
      <Fragment>
        <View style={styles.centered}>
          <Image resizeMode={"contain"} source={require("../../assets/images/no-user-results.png")} style={styles.noNotifications} />
          <View style={{ marginTop: 17.25 }} />
          <Text style={{ fontSize: 18.25, marginTop: 22.25, color: colors.accent, textAlign: "center", margin: 15 }}>Could NOT retreive any user's in your proximity at the current moment...</Text>
        </View>
      </Fragment>
    );
  }

  const renderContent = () => {
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    });
    switch (modeView) {
      case 'block':
        
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={users}
              ListEmptyComponent={renderEmptyListContent}
              key={'block'}
              keyExtractor={(item, index) => item !== null ? `${item.firstName} ~ @${item.username}` : `${index}-${Math.floor(Math.random() * (50 - 1 + 1) + 1)}`}
              renderItem={({item, index}) => {
                
                // if (index  % 3 == 0 && index !== 0) {
                //   return <RectangeCenteredBannerRender />
                // } 
                if (item !== null) {
                  if (index  % 3 == 0 && index !== 0) {
                    return (
                      <Fragment>
                        <RectangeCenteredBannerRender />
                        <View style={{ marginTop: 17.75 }} />
                        <TouchableOpacity onPress={() => navigation.navigate('Profile1', { user: item })} activeOpacity={0.9}>
                            {typeof item.profilePictures !== "undefined" && item.profilePictures !== null && item.profilePictures.length > 0 ? <Image source={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }} style={styles.blockImage} /> : <Image source={{ uri: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/no-image-available.jpg" }} style={styles.blockImage} />}
                          </TouchableOpacity>
                          <View style={{paddingHorizontal: 20}}>
                            <Text title2 semibold style={{ marginTop: 5 }} numberOfLines={1}>
                              {`${item.firstName} ~ @${item.username}`}
                            </Text>
                            <View style={styles.blockContentAddress}>
                              <Icon name="map-marker" color={colors.primaryLight} size={10} />
                              <Text
                                caption1
                                grayColor
                                style={{
                                  marginLeft: 3,
                                }}
                                numberOfLines={1}>
                                {typeof item.locationConverted !== "undefined" && _.has(item, "locationConverted") ? item.locationConverted : "Not Known ~ N/A"}
                              </Text>
                            </View>
                            <View style={styles.blockContentDetail}>
                              <View style={{ flex: 1 }}>
                                <Text title3 primaryColor semibold>
                                  {`${moment(item.birthdateRaw).fromNow(true)} old`}
                                </Text>
                                <Text
                                  caption1
                                  accentColor
                                  style={{
                                    marginTop: 3,
                                  }}
                                  numberOfLines={1}>
                                  {calculateBizzType(item.accountType)}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                }}>
                                <View
                                  style={{
                                    marginLeft: 10,
                                  }}>
                                  <Text caption1 grayColor semibold style={{paddingBottom: 5}}>
                                    Rank: {item.rank}
                                  </Text>
                                  <StarRating
                                    disabled={true}
                                    starSize={10}
                                    maxStars={5}
                                    rating={calculateRankingRate(item.rank)}
                                    selectedStar={rating => {}}
                                    fullStarColor={BaseColor.yellowColor}
                                  />
                                </View>
                              </View>
                            </View>
                          </View>
                          <View style={styles.contentService}>
                            {_.has(item, "coreProfileData") && _.has(item.coreProfileData, "aboutMe") ? <Text
                              overline
                              grayColor
                              style={{ marginTop: 7.25, paddingBottom: 17.25 }}
                              numberOfLines={3}>
                              {item.coreProfileData.aboutMe}
                            </Text> : <Text
                              overline
                              grayColor
                              style={{ marginTop: 7.25, paddingBottom: 17.25 }}
                              numberOfLines={1}>
                              {"No 'About-Me' Available"}
                            </Text>}
                          </View>
                      </Fragment>
                    );
                  } else {
                    return (
                      <View key={index}>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile1', { user: item })} activeOpacity={0.9}>
                          {typeof item.profilePictures !== "undefined" && item.profilePictures !== null && item.profilePictures.length > 0 ? <Image source={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }} style={styles.blockImage} /> : <Image source={{ uri: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/no-image-available.jpg" }} style={styles.blockImage} />}
                        </TouchableOpacity>
                        <View style={{paddingHorizontal: 20}}>
                          <Text title2 semibold style={{ marginTop: 5 }} numberOfLines={1}>
                            {`${item.firstName} ~ @${item.username}`}
                          </Text>
                          <View style={styles.blockContentAddress}>
                            <Icon name="map-marker" color={colors.primaryLight} size={10} />
                            <Text
                              caption1
                              grayColor
                              style={{
                                marginLeft: 3,
                              }}
                              numberOfLines={1}>
                              {typeof item.locationConverted !== "undefined" && _.has(item, "locationConverted") ? item.locationConverted : "Not Known ~ N/A"}
                            </Text>
                          </View>
                          <View style={styles.blockContentDetail}>
                            <View style={{ flex: 1 }}>
                              <Text title3 primaryColor semibold>
                                {`${moment(item.birthdateRaw).fromNow(true)} old`}
                              </Text>
                              <Text
                                caption1
                                accentColor
                                style={{
                                  marginTop: 3,
                                }}
                                numberOfLines={1}>
                                {calculateBizzType(item.accountType)}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <View
                                style={{
                                  marginLeft: 10,
                                }}>
                                <Text caption1 grayColor semibold style={{paddingBottom: 5}}>
                                  Rank: {item.rank}
                                </Text>
                                <StarRating
                                  disabled={true}
                                  starSize={10}
                                  maxStars={5}
                                  rating={calculateRankingRate(item.rank)}
                                  selectedStar={rating => {}}
                                  fullStarColor={BaseColor.yellowColor}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={styles.contentService}>
                          {_.has(item, "coreProfileData") && _.has(item.coreProfileData, "aboutMe") ? <Text
                            overline
                            grayColor
                            style={{ marginTop: 7.25, paddingBottom: 17.25 }}
                            numberOfLines={3}>
                            {item.coreProfileData.aboutMe}
                          </Text> : <Text
                            overline
                            grayColor
                            style={{ marginTop: 7.25, paddingBottom: 17.25 }}
                            numberOfLines={1}>
                            {"No 'About-Me' Available"}
                          </Text>}
                        </View>
                      </View>
                    );
                  }
                }
              }}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
      case 'grid':
        
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              columnWrapperStyle={{
                paddingLeft: 5,
                paddingRight: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              ListEmptyComponent={renderEmptyListContent}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              numColumns={2}
              data={users}
              key={'grid'}
              keyExtractor={(item, index) => item !== null ? `${item.firstName} ~ @${item.username}` : `${index}-${Math.floor(Math.random() * (50 - 1 + 1) + 1)}`}
              renderItem={({item, index}) => {
                if (item !== null) {
                  return (
                    <View key={index} style={[styles.girdContent, { marginBottom: 10, marginLeft: 10 }]}>
                      <TouchableOpacity onPress={() => navigation.navigate('Profile1', { user: item })} activeOpacity={0.9}>
                        {typeof item.profilePictures !== "undefined" && item.profilePictures !== null && item.profilePictures.length > 0 ? <Image source={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }} style={styles.girdImage} /> : <Image source={{ uri: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/no-image-available.jpg" }} style={styles.girdImage} />}
                      </TouchableOpacity>
                      <View style={[styles.girdContentLocation, { marginTop: 10 }]}>
                        <Icon name="map-marker" color={colors.primary} size={10} />
                        <Text
                          caption2
                          grayColor
                          style={{
                            marginHorizontal: 5,
                          }}
                          numberOfLines={1}>
                          {typeof item.locationConverted !== "undefined" && _.has(item, "locationConverted") ? item.locationConverted : "Not Known ~ N/A"}
                        </Text>
                      </View>
                      <Text
                        body2
                        semibold
                        style={{
                          marginTop: 5,
                        }}>
                        {`${item.firstName} ~ @${item.username}`}
                      </Text>
                      <View style={styles.girdContentRate}>
                        <Text caption2 grayColor>
                          {typeof item.followers !== "undefined" && item.followers.length > 0 ? item.followers.length : 0} {"Follower's"}
                        </Text>
                      </View>
                      <Text
                        title4
                        accentColor
                        semibold
                        style={{
                          marginVertical: 7.25,
                          textAlign: "center"
                        }}>  {/* calculateBizzType(item.accountType) */}
                        {`${moment(item.birthdateRaw).fromNow(true)} old`}
                      </Text>
                    </View>
                  );
                }
              }}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
      case 'list':
        
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              ListEmptyComponent={renderEmptyListContent}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={users}
              key={'list'}
              keyExtractor={(item, index) => item !== null ? `${item.firstName} ~ @${item.username}` : `${index}-${Math.floor(Math.random() * (50 - 1 + 1) + 1)}`}
              renderItem={({item, index}) => {
                if (item !== null) {
                  return (
                    <View key={index} style={[styles.listContent, { marginHorizontal: 20, marginBottom: 15 }]}>
                      <TouchableOpacity onPress={() => navigation.navigate('Profile1', { user: item })} activeOpacity={0.9}>
                        {typeof item.profilePictures !== "undefined" && item.profilePictures !== null && item.profilePictures.length > 0 ? <Image source={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }} style={styles.listImage} /> : <Image source={{ uri: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/no-image-available.jpg" }} style={styles.listImage} />}
                      </TouchableOpacity>
                      <View style={styles.listContentRight}>
                        <Text headline semibold numberOfLines={1}>
                          {`${item.firstName} ~ @${item.username}`}
                        </Text>
                        <View style={styles.listContentRow}>
                          <Icon name="map-marker" color={colors.primaryLight} size={10} />
                          <Text
                            caption1
                            grayColor
                            style={{
                              marginLeft: 3,
                            }}
                            numberOfLines={1}>
                            {typeof item.locationConverted !== "undefined" && _.has(item, "locationConverted") ? item.locationConverted : "Not Known ~ N/A"}
                          </Text>
                        </View>
                        <View style={styles.listContentRow}>
                          <Text
                            caption1
                            grayColor
                            semibold
                            style={{
                              marginLeft: 0,
                              marginRight: 3,
                            }}>
                            {"Acct. Type"}
                          </Text>
                          <Text caption1 primaryColor semibold>
                            {calculateBizzType(item.accountType)}
                          </Text>
                        </View>
                        <Text
                          title3
                          primaryColor
                          semibold
                          style={{marginTop: 5, marginBottom: 5}}>
                          {`${moment(item.birthdateRaw).fromNow(true)} old`}
                        </Text>
                        <Text footnote accentColor style={{marginTop: 3}}>
                          Rank: {item.rank}
                        </Text>
                      </View>
                    </View>
                  )
                }
              }}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
      default:
        
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              ListEmptyComponent={renderEmptyListContent}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={users}
              key={'block'}
              keyExtractor={(item, index) => item !== null ? `${item.firstName} ~ @${item.username}` : `${index}-${Math.floor(Math.random() * (50 - 1 + 1) + 1)}`}
              renderItem={({item, index}) => {
                return (
                  <HotelItem
                    block
                    image={{ uri: item.profilePictures !== null && typeof item.profilePictures !== "undefined" && item.profilePictures.length > 0 ? `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` : "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/no-image-available.jpg" }}
                    name={`${item.firstName} ~ @${item.username}`}
                    location={typeof item.locationConverted !== "undefined" && _.has(item, "locationConverted") ? item.locationConverted : "Not Known ~ N/A"} // item.locationConverted
                    price={`${moment(item.birthdateRaw).fromNow(true)} old`}
                    available={calculateBizzType(item.accountType)}
                    rate={Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
                    rateStatus={`${Math.floor(Math.random() * (5 - 1 + 1) + 1)}/5`}
                    numReviews={Math.floor(Math.random() * (325 - 10 + 1) + 10)}
                    // services={item.services}
                    style={{
                      marginBottom: 10,
                    }}
                    onPress={() => navigation.navigate('Profile1', { user: item })}
                    onPressTag={() => navigation.navigate('Preview')}
                  />
                )
              }}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
    }
  };
  const renderLoading = () => {
    if (!ready) {
      return (
        <View style={{ margin: 17.25 }}> 
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
        </View>
      );
    }
  }

  const handleFilterSearch = (configuration) => {

    axios.get(`${BASE_URL}/search/appropriate/filter`, configuration).then((res) => {
        if (res.data.message === "Successfully filtered!") {
          console.log("res.data", res.data);

          const { users } = res.data;
          
          setUsers(users);

          RBSheetRef.current.close()
        } else {
          console.log("Err", res.data);
        }
    }).catch((err) => {
        console.log(err.message);
    })
  }

  return (
    <View style={{flex: 1}}>
      <Header
        title={t(`User's Near You`)}
        subTitle="Explore/Find Matches Nearby"
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
      <RBSheet
        ref={RBSheetRef}
        closeOnDragDown={true}
        height={height}
        openDuration={250}
        customStyles={{
            container: {
                width,
                backgroundColor: theme.dark ? "#000" : "#fff"
            },
            draggableIcon: {
                borderBottomColor: "grey",
                borderBottomWidth: 2,
                width: 200
            }
        }}
    >
      <FilterResultsSearching handleFilterSearch={handleFilterSearch} RBSheetRef={RBSheetRef} />
    </RBSheet>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        {!ready ? renderLoading() : renderContent()}
      </SafeAreaView>
    </View>
  );
}
const mapStateToProps = (state) => {
  return {
      authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
  }
}

export default connect(mapStateToProps, {  })(Hotel);