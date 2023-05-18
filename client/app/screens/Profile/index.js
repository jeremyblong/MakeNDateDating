import React, {useState, useEffect, useCallback, useRef, Fragment} from 'react';
import {View, ScrollView, TouchableOpacity, Dimensions, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import {BaseStyle, useTheme, BaseColor} from '@config';
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail
} from '@components';
import { connect } from "react-redux";
import styles from './styles';
import {UserData} from '@data';
import {useTranslation} from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";
import { authentication, saveAuthenticationDetails } from "../../actions/auth.js";
import _ from "lodash";
import Dialog from "react-native-dialog";
import { CometChat } from "@cometchat-pro/react-native-chat";
import Web3 from "web3";
import { BLOCKCHAIN_BASE_URL } from "@env";
import BannerAdsRender from "../../mainScreens/AdvertisementHelpers/BannerFull/banner.js";
import Popover from 'react-native-popover-view';
import {
  TourGuideZone, // Main wrapper of highlight component
  useTourGuideController, // hook to start, etc.
} from 'rn-tourguide';
import { guidedTourCompletedAction } from "../../actions/guidedTour.js";

const web3 = new Web3(new Web3.providers.HttpProvider(BLOCKCHAIN_BASE_URL));

const { width, height } = Dimensions.get("window");

const Profile = ({navigation, authenticatedData, authentication, saveAuthenticationDetails, guidedTourCompletedAction, guidedTourCompleted }) => {
  const {colors, theme} = useTheme();
  const colorSchemeDark = theme.dark;
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [ state, setState ] = useState({
    user: null,
    showDialog: false,
    ready: false,
    tokenCount: 0,
    popoverShow: false,
    previousHeight: 0
  });
  const [userData] = useState(UserData[0]);
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const layoutRef = useRef(null);

  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    stop, // a function  to stopping it
    eventEmitter, // an object for listening some events
  } = useTourGuideController();

  useEffect(() => {
    if (canStart === true && guidedTourCompleted !== true) {
      start();
    }
  }, [canStart])

  // console.log("state.previousHeight", state.previousHeight);

  const handleOnStart = () => console.log('start');
  const handleOnStop = () => {
    console.log('stop');

    guidedTourCompletedAction(true);
  };
  const handleOnStepChange = (data) => {

    console.log("dataaaa step", data);
    // if (data.name === 4) {
    //   scrollViewRef.current.scrollTo({ y: layoutRef.current.y, animated: true });
    // }

    if (_.has(data, "name") && typeof data.name !== "undefined" && Number(data.name) === 3) {

      console.log(`stepChange`, data.name);

      scrollViewRef.current.scrollTo({ y: 220, animated: false });

    } else if (_.has(data, "name") && typeof data.name !== "undefined" && Number(data.name) === 5) {

      console.log(`stepChange`, data.name);

      scrollViewRef.current.scrollTo({ y: 325, animated: false });
      
    }  else if (_.has(data, "name") && typeof data.name !== "undefined" && Number(data.name) === 6) {

      console.log(`stepChange`, data.name);

      scrollViewRef.current.scrollTo({ y: 450, animated: false });
      
    } else if (_.has(data, "name") && typeof data.name !== "undefined" && Number(data.name) === 8) {

      console.log(`stepChange`, data.name);

      scrollViewRef.current.scrollTo({ y: 750, animated: false });
    }
  };

  useEffect(() => {

    scrollViewRef.current.scrollTo({ y: 0, animated: false });

    eventEmitter.on('start', handleOnStart)
    eventEmitter.on('stop', handleOnStop)
    eventEmitter.on('stepChange', handleOnStepChange)

    return () => {
      eventEmitter.off('start', handleOnStart)
      eventEmitter.off('stop', handleOnStop)
      eventEmitter.off('stepChange', handleOnStepChange)
    }
  }, [])

  const onLogOut = () => { // 
    setLoading(true);

    CometChat.logout().then(() => {
      // log change..
      console.log("Logged-out!");
      // dispatch actions to clear redux state..
      dispatch(authentication(false));
      dispatch(saveAuthenticationDetails({}));
      setLoading(false);
      // navigate to homepage..
      navigation.replace("BottomTabNavigator", { screen: "Home" });

    }, (error) => {
        console.log('Login failed with exception:', { error });

        console.log("Logged-out!");
        // dispatch actions to clear redux state..
        dispatch(authentication(false));
        dispatch(saveAuthenticationDetails({}));
        setLoading(false);
        // navigate to homepage..
        navigation.replace("BottomTabNavigator", { screen: "Home" });
    });

    // dispatch(authentication(false));
    // dispatch(saveAuthenticationDetails({}));
    // setLoading(false);
    // // navigate to homepage..
    // navigation.replace("BottomTabNavigator", { screen: "Home" });
  };

  useFocusEffect(
    useCallback(async () => {
      console.log("process.env.NODE_ENV", process.env.NODE_ENV);
      
      const config = {
        params: {
          uniqueId: authenticatedData.uniqueId,
          accountType: authenticatedData.accountType,
          returnTokens: true
        }
      }

      // const coinCount = await fetchDetailsCoinCount();
  
      axios.get(`${BASE_URL}/gather/user/profile`, config).then((res) => {
          if (res.data.message === "Successfully gathered profile!") {
              console.log("Successfully gathered profile!", res.data);
  
              const { user, tokenCount } = res.data;
  
              setState(prevState => {
                return {
                  ...prevState,
                  user,
                  tokenCount,
                  ready: true
                }
              })
          } else {
              console.log("Err", res.data);
          }
      }).catch((err) => {
          console.log(err.message);
      })
  }, []));

  const { user } = state;

  const renderMainContent = () => {
    if (user === null) {
      return (
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
    } else {

      const renderValue = (type, value) => {
        switch (type) {
          case 'primary':
            return (
              <Text title3 semibold primaryColor>
                {value}
              </Text>
            );
          case 'small':
            return (
              <Text body1 semibold>
                {value}
              </Text>
            );
          default:
            return (
              <Text headline semibold>
                {value}
              </Text>
            );
        }
      };
    
      const renderTitle = (type, value) => {
        switch (type) {
          case 'primary':
            return (
              <Text body2 grayColor>
                {value}
              </Text>
            );
          case 'small':
            return (
              <Text caption1 grayColor>
                {value}
              </Text>
            );
          default:
            return (
              <Text body2 grayColor>
                {value}
              </Text>
            );
        }
      };

      const calculateBizzType = (type) => {
        switch (type) {
          case "bizz":
            return "Bizz (business relationship's)";
            break;
          case "date":
            return "Date (Looking for a partner)";
            break;
          case "bff":
            return "Bff (Looking for friend's)";
            break;
          case "mentorship/companionship":
            return "Mentor/Counselor";
            break;
          default: 
            return "Unknown.."
            break;
        }
      }

      const calculateRank = (score) => {
        if (score <= 300) {
          return 1;
        } else if (score <= 450) {
          return 2;
        } else if (score <= 650) {
          return 3;
        } else if (score <= 775) {
          return 4;
        } else {
          return 5;
        }
      }

      return (
        <Fragment>
          <View style={styles.contain}>
          <TourGuideZone
            zone={1}
            text={'To see your primary profile from the perspective of others on the platform (the public view), click the highlighted link. If you need to modify any information, use the "Edit Profile Information & Details" link provided slightly below this highlighted section...'}
            borderRadius={16}
          >
            <ProfileDetail
              image={user === null ? userData.image : { uri: `${BASE_ASSET_URL}/${user.profilePictures[user.profilePictures.length - 1].link}` }}
              textFirst={user === null ? userData.name : `${user.firstName} ${user.lastName}`}
              point={user === null ? userData.point : calculateRank(user.rank)}
              textSecond={user === null ? "Loading..." : calculateBizzType(user.accountType)}
              textThird={user === null ? userData.id : user.username}
              onPress={() => navigation.navigate('Profile1', { user })}
            />
          </TourGuideZone>
            {state.ready ? <View style={[{justifyContent: 'space-between', flex: 1, paddingTop: 10}]}>
              <View style={styles.itemInfor}>
              <Popover
                onRequestClose={() => setState(prevState => {
                  return {
                    ...prevState,
                    popoverShow: false
                  }
                })}
                from={(
                  <TouchableOpacity onPress={() => {
                    setState(prevState => {
                      return {
                        ...prevState,
                        popoverShow: true
                      }
                    })
                  }} style={[styles.contentLeft]}>
                    {renderValue("primary", `${user.rank}`)}
                    {renderTitle("primary", "Rank")}
                  </TouchableOpacity>
                )}>
                <View style={styles.popover}>
                  <Text style={styles.innerPopoverText}>This is your ranking/score - your score starts out at 500. Use this to guage other user's interactions as well! Positive/Negative interactions affect this publically viewable score</Text>
                </View>
              </Popover>
              <Popover
                onRequestClose={() => setState(prevState => {
                  return {
                    ...prevState,
                    popoverShow: false
                  }
                })}
                from={(
                  <TouchableOpacity onPress={() => {
                    setState(prevState => {
                      return {
                        ...prevState,
                        popoverShow: true
                      }
                    })
                  }} style={[styles.contentCenter]}>
                    {renderValue("primary", _.has(user, "inAppTokenCurrency") ? user.inAppTokenCurrency : 0)}
                    {renderTitle("primary", "In-App Tokens/Coins")}
                  </TouchableOpacity>
                )}>
                <View style={styles.popover}>
                  <Text style={styles.innerPopoverText}>These are your in-app payment currencies to use for various services. You earn rewards for various in-app actions and even just simply using the app.</Text>
                </View>
              </Popover>
              <View style={[styles.contentRight]}>
                {renderValue("primary", typeof user.followers !== "undefined" && user.followers.length > 0 ? user.followers.length : 0)}
                {renderTitle("primary", "Followers")}
              </View>
            </View>
            </View>  : null}
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('EditProfileMain');
              }}>
              <Text body1 style={{ color: colors.accent }}>{"Edit Profile Information & Details"}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('ManageUploadRearrangeProfileImages');
              }}>
              <Text body1>{"Manage Restricted Content/Image's"}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity> */}
            <TourGuideZone
              zone={2}
              text={`Group discussions allow multiple individuals to engage in conversations with fellow users across the application.`}
              borderRadius={16}
            >
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  {borderBottomColor: colors.border, borderBottomWidth: 1},
                ]}
                onPress={() => {
                  navigation.navigate('JoinSpecificChatChannelSelection');
                }}>
                <Text body1>{"Join Specific Chat Channel(s)"}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </TouchableOpacity>
            </TourGuideZone>
            <TourGuideZone
              zone={3}
              text={`We distribute complimentary tokens each day! Make sure to visit daily and try your luck by scratching the lottery ticket...`}
              borderRadius={16}
            >
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('DailyFreeSpinLottery');
              }}>
              <Text body1 style={{ color: "#04b34d" }}>{"Scratch Lottery Ticket - In-App Rewards!"}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            </TourGuideZone>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('AuthenticationSecurityLogs');
              }}>
              <Text body1>{"View Authentication Security Log(s)"}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TourGuideZone
              zone={4}
              text={`Having trouble finding the right words during a conversation? Consult with AI to receive suggestions for amusing and witty remarks when your mind goes empty!`}
              borderRadius={16}
              keepTooltipPosition={true}
            >
              {/* <View onLayout={event => layoutRef.current = event.nativeEvent.layout}> */}
                <TouchableOpacity
                  style={[
                    styles.profileItem,
                    {borderBottomColor: colors.border, borderBottomWidth: 1},
                  ]}
                  onPress={() => {
                    navigation.navigate('ChatGPTSuggestionsMain');
                  }}>
                  <Text style={{ color: colors.accent }} body1>{"Brainstorming Communication / Chatbot"}</Text>
                  <Icon
                    name="angle-right"
                    size={18}
                    color={colors.primary}
                    style={{marginLeft: 5}}
                    enableRTL={true}
                  />
                </TouchableOpacity>
              {/* </View> */}
            </TourGuideZone>
            <TourGuideZone
              zone={5}
              text={`In this in-app game/contest, participants vie for both a reward and an opportunity to go on a date with the individual who created the game listing...`}
              borderRadius={16}
            >
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  {borderBottomColor: colors.border, borderBottomWidth: 1},
                ]}
                onPress={() => {
                  navigation.navigate('MainViewCompetitionBacheloretteGame');
                }}>
                <Text style={{ color: colors.primary }} body1>{"In-App Competition Game Menu"}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </TouchableOpacity>
            </TourGuideZone>
            <TouchableOpacity 
              style={[ 
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('MeetupDataListMain');
              }}>
              <Text body1>{"View/Manage Your 1v1 'Match' Meetup's"}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TourGuideZone
              zone={6}
              text={`In this segment, you'll find the pay-per-view content area, allowing you to upload images or videos that users can purchase on an individual basis to access and view them...`}
              borderRadius={16}
            >
            {authenticatedData.accountType === "bizz" || authenticatedData.accountType === "bff" || authenticatedData.accountType === "date" ? <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('ManageUploadRearrangeProfileImages');
              }}>
              <Text body1>{t('Upload/Manage Restricted Content')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity> : null}
            </TourGuideZone>
            {/* <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('ViewManageAllSalesPendingSold');
              }}>
              <Text body1 style={{ color: colors.accent }}>{"Manage Your Clothing Sales & Data"}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('VerifyAuthAccountPlaid');
              }}>
              <Text body1 style={{ color: BaseColor.greenColor }}>{t('Verify Your Account')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('ViewProfileViewsIndividualProfileOwn');
              }}>
              <Text body1 style={{ color: colors.primary }}>{t('View Who Viewed Your Profile')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            {/* <TourGuideZone
              zone={7}
              text={`It is possible to purchase pre-owned women's garments, intimate apparel, and associated clothing items due to their suggestive implications.`}
              borderRadius={16}
            >
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  {borderBottomColor: colors.border, borderBottomWidth: 1},
                ]}
                onPress={() => {
                  navigation.navigate('CommerceClothingMainView');
                }}>
                <Text body1 style={{ color: "#04b34d" }}>{"Send Flowers & Gifts In-App"}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </TouchableOpacity>
            </TourGuideZone> */}
            <TourGuideZone
              zone={7}
              text={`Engage with your current matched connections, as these individuals are those you have previously established a connection with.`}
              borderRadius={16}
            >
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('MatchInteractionsList');
              }}>
              <Text body1 style={{ color: colors.accent }}>{t('Interact W/Your Matches!')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            </TourGuideZone>
            <TourGuideZone
              zone={8}
              text={`The following match inquiries await your attention and require further action (requests that have not yet been addressed or resolved).`}
              borderRadius={16}
            >
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  {borderBottomColor: colors.border, borderBottomWidth: 1},
                ]}
                onPress={() => {
                  navigation.navigate('Matches');
                }}>
                <Text body1>{"Pending/Available Match Request's"}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </TouchableOpacity>
            </TourGuideZone>
            {/* <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('VerifyAccountBackgroundCheckInitiate');
              }}>
              <Text body1 style={{ color: colors.primary }}>{t('Verify Account With Background-Check')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}>
              <Text body1>{t('change_password')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
              onPress={() => {
                navigation.navigate('PrivacySettingsBlocking');
              }}>
              <Text body1 style={{ color: colors.primary }}>{"Privacy/Blocking Setting's"}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            {authenticatedData.accountType === "bizz" || authenticatedData.accountType === "bff" || authenticatedData.accountType === "date" ? <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('CreateNewGroupMeetup');
              }}>
              <Text body1 style={{ color: "#04b34d" }}>{t('Upload/Create New Meetup Group')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity> : null} 
            {authenticatedData.accountType === "mentorship/companionship" ? <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('ViewTherapyCompanionshipRequests');
              }}>
              <Text body1>{"View Mentorship Request(s)"}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity> : null}
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('ManageActiveAppointmentMeetingsMain');
              }}>
              <Text body1>{authenticatedData.accountType === "mentorship/companionship" ? "Manage Active Appointments/Meeting's" : "View Your Active Mentorship Session's"}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('Currency');
              }}>
              <Text body1>{t('currency')}</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text body1 grayColor>
                  USD
                </Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </View>
            </TouchableOpacity> */}
            <TourGuideZone
              zone={9}
              text={`The following link provides access to your financial management functions - enabling you to modify or introduce new payment options and withdraw funds as needed.`}
              borderRadius={16}
            >
              <TouchableOpacity
                style={[
                  styles.profileItem,
                  {borderBottomColor: colors.border, borderBottomWidth: 1},
                ]}
                onPress={() => navigation.navigate('MyPaymentMethod')}>
                <Text body1 style={{ color: "#04b34d" }}>{t('Payment Related')}</Text>
                <Icon
                  name="angle-right"
                  size={18}
                  color={colors.primary}
                  style={{marginLeft: 5}}
                  enableRTL={true}
                />
              </TouchableOpacity>
            </TourGuideZone>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => navigation.navigate('LiveStreamingHomepage')}>
              <Text body1>{t('Live-Video Streaming/Confrences')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileItem}
              onPress={() => {
                navigation.navigate('Setting'); // 
              }}>
              <Text body1>{t('setting')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
          </View>
        </Fragment>
      );
    }
  }
  
  return (
    <View style={{flex: 1}}>
			<Dialog.Container contentStyle={colorSchemeDark ? { backgroundColor: "#fff", borderWidth: 1.5, borderColor: colors.accent, borderRadius: 10 } : { backgroundColor: "#fff", borderWidth: 1.5, borderColor: colors.accent }} visible={state.showDialog}>
		      <Dialog.Title style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>Are you sure you'd like to sign-out?</Dialog.Title>
		      <Dialog.Description style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>
		        We are about to sign you out, please confirm this is what you want to do...
		      </Dialog.Description>
		      <Dialog.Button onPress={() => setState(prevState => {
	        		return {
	        			...prevState,
	        			showDialog: false
	        		}
	        	})} style={{ color: "red" }} label="Cancel" />
		      <Dialog.Button onPress={() => {
              setState(prevState => {
                  return {
                      ...prevState,
                      showDialog: false
                  }
              })
              onLogOut();
            }} style={{ color: "green" }} label="Confirm" />
		    </Dialog.Container>
      <Header
        title={t('profile')}
        renderRight={() => {
          return <Image source={require("../../assets/images/not.png")} style={{ minWidth: 50, minHeight: 50, maxHeight: 50, maxWidth: 50, paddingBottom: 15 }} />;
        }}
        onPressRight={() => {
          navigation.navigate('Notification');
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ScrollView ref={scrollViewRef}>
          {renderMainContent()}
          <BannerAdsRender />
          <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <Button full loading={loading} onPress={() => setState(prevState => {
                return {
                    ...prevState,
                    showDialog: true
                }
            })}>
              {"Sign Out Of Account"}
            </Button> 
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const mapStateToProps = (state) => {
	return {
    authenticatedData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null,
    guidedTourCompleted: state.guidedTour.tourCompleted
  }
}
export default connect(mapStateToProps, { authentication, saveAuthenticationDetails, guidedTourCompletedAction })(Profile);