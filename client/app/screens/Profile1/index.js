import React, {useState, Fragment, useRef, useEffect, useCallback } from 'react';
import SendPrivateMessagePaneIndividualProfile from "./panes/messaging/messagingPane.js";
import SendPrivateMessageBoostedPane from "./panes/messaging/boostedPane.js";
import { connect } from "react-redux";
import _ from "lodash";
import { BASE_ASSET_URL, BASE_URL, TOMTOM_API_KEY } from "@env";
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
  ImageBackground
} from 'react-native';
import Video from "react-native-video";
import FlipCard from 'react-native-flip-card';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";
import FollowingFollowers from "./FollowingFollowers/Followers/index.js";
import axios from "axios";
import RBSheet from "react-native-raw-bottom-sheet";
import {BaseStyle, BaseColor, useTheme} from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  ProfilePerformance,
  Tag,
  Text,
  TourDay,
  Button,
  PackageItem,
  RateDetail,
  CommentItem,
} from '@components';
import Toast from "react-native-toast-message";
import {TabView, TabBar} from 'react-native-tab-view';
import styles from './styles';
import {UserData, ReviewData, PackageData} from '@data';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import ProgressiveImage from "../../lazyLoadImage.js";
import DialogInput from 'react-native-dialog-input';
import ManageEditProfileSubscriptionRestrictedSettings from "./panes/subscriptionSettings/subscription.js";
import Dialog from "react-native-dialog";
import FollowingUsersCurrentListPane from "./panes/following/followersPaneDisplay.js";
import SoundPlayer from 'react-native-sound-player'
import { useFocusEffect } from '@react-navigation/native';
  
const { width, height } = Dimensions.get("window");

const SecondRoute = ({ navigation, userData, authenticatedData }) => {
  const [ pictureList, setPictureList ] = useState([
    { key: 'A' }, { key: 'B' }, { key: 'C' }, { key: 'D' }, { key: 'E' }, { key: 'F' }, { key: 'G' }, { key: 'H' }, { key: 'I' }, { key: 'J' }, { key: 'K' }, { key: 'L' }, { key: 'M' }, { key: 'N' }, { key: 'O' }
  ])
  const [ updatedPics, setUpdatedPictures ] = useState(false);
  
  const renderItemCustom = ({item, index}) => {
    if (item.empty === true) {
      return <View style={[styles.itemMapped, styles.itemInvisible]} />;
    }
    let itemDimension = width / 3;
    const link = `${BASE_ASSET_URL}/${item.link}`;
    return (
      <TouchableOpacity style={[ styles.itemMapped, { height: itemDimension }]} onPress={() => {
        navigation.navigate("PreviewProfileImagesMain", { passedImages: pictureList });
      }}>
          <ProgressiveImage thumbnailSource={require("../../assets/images/custom/loading.png")} source={{ uri: link }} style={{ height: itemDimension - 2, width: itemDimension - 2}} />
      </TouchableOpacity>
    );
  }
  
  const renderItem = ({item, index}) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={[styles.item, {height: width / 3 }]}>
        <Text style={styles.itemText}>{item.key}</Text>
      </View>
    );
  }
  
  useEffect(() => {
    // check if self/authed
    if (authenticatedData !== null && userData.uniqueId === authenticatedData.uniqueId) {
      // self is viewing...
      const config = {
        params: {
            uniqueId: authenticatedData.uniqueId,
            accountType: authenticatedData.accountType
        }
      }
      axios.get(`${BASE_URL}/gather/user/profile`, config).then((res) => {
          if (res.data.message === "Successfully gathered profile!") {
              console.log(res.data);

              const { user } = res.data;

              if (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) {
                setPictureList(user.profilePictures);
                setUpdatedPictures(true);
              } 
          } else {
              console.log("Err", res.data);
          }
      }).catch((err) => {
          console.log(err.message);
      })
    } else {
      const config = {
        params: {
          postedByID: userData.uniqueId
        }
      }
      axios.get(`${BASE_URL}/gather/one/user/restricted/data`, config).then((res) => {
          if (res.data.message === "Submitted gathered user's info!") {
              console.log(res.data);

              const { user } = res.data;

              if (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) {
                setPictureList(user.profilePictures);
                setUpdatedPictures(true);
              }
          } else {
              console.log("Err", res.data);
          }
      }).catch((err) => {
          console.log(err.message);
      })
    }
  }, [])

  const formatRow = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  }
  return (
    <Fragment>
      {updatedPics ? <FlatList
          data={formatRow(pictureList, 3)}
          renderItem={renderItemCustom}
          numColumns={3}
        /> : <FlatList
        data={formatRow(pictureList, 3)}
        renderItem={renderItem}
        numColumns={3}
      />}
    </Fragment>
  );
}

const Restricted = ({ navigation, pictures, authenticatedData, passedData }) => {
    const [ pictureList, setPictureList ] = useState(pictures);
    const subscriptionSheetRef = useRef(null);

    const renderItem = ({item, index}) => {
      if (item.empty === true) {
        return <View style={[styles.item, styles.itemInvisible]} />;
      }
      const obj = Object.values(item)[0];
      const linky = obj.link;
      const fileType = obj.type;
      
      let itemDimension = width / 3;

      if (fileType === "video/mp4") {
        const snapshotClip = obj.snapshot;
        const fileConverted = { uri: `${BASE_ASSET_URL}/${snapshotClip}` };
        return (
            <TouchableOpacity style={[styles.itemMapped, { height: itemDimension }]} onPress={() => {
              navigation.navigate("PreviewProfileImagesMainRestrictedView", { passedImages: pictureList });
            }}>
                <Image resizeMode={"contain"} source={fileConverted} style={styles.itemMapped} />
            </TouchableOpacity>
        );
      } else {
        return (
            <TouchableOpacity style={[ styles.itemMapped, { height: itemDimension }]} onPress={() => navigation.navigate("PreviewProfileImagesMainRestrictedView", { passedImages: pictureList })}>
                <ProgressiveImage thumbnailSource={require("../../assets/images/custom/loading.png")} source={{uri: linky }} style={{height:itemDimension - 2, width:itemDimension - 2}} />
            </TouchableOpacity>
        );
      }
    }
  
  const formatRow = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  }
  const renderEmptyComponent = () => {
    return (
      <Fragment>
        <View style={styles.centered}>
          <Image resizeMode={"contain"} source={require("../../assets/images/no-content.png")} style={styles.placeholderImage} />
        </View>
      </Fragment>
    );
  }
  const renderUnsubscribedContent = () => {
    return (
      <Fragment>
        <View style={styles.centered}>
            <Text style={{ fontWeight: "400", top: 32.25, fontSize: 25.25, textDecorationLine: "underline" }}>Must first subscribe to this user before viewing this page/screen.</Text>
          </View>
          <View style={styles.bottomPositioned}>
            <Image resizeMode={"contain"} source={require("../../assets/images/custom/removed-pass.png")} style={styles.noPass} />
        </View>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <RBSheet
        ref={subscriptionSheetRef}
        height={height}
        openDuration={250}
        draggable={false}
        closeOnDragDown={true}
        customStyles={{
            container: {
                paddingHorizontal: 20,
            },
            draggableIcon: {
                width: width * 0.725
            }
        }}
      >
          <ManageEditProfileSubscriptionRestrictedSettings authenticatedData={authenticatedData} passedData={passedData} subscriptionSheetRef={subscriptionSheetRef} />
      </RBSheet>
      {authenticatedData.uniqueId === passedData.uniqueId ? <View style={{ margin: 7.25 }}>
        <Button outline onPress={() => subscriptionSheetRef.current.open()}>
          {"Manage Your Subscription Setting(s)"}
        </Button>
      </View> : null}
      {_.has(passedData, "subscribedUsersRestricted") && passedData.subscribedUsersRestricted.includes(authenticatedData.uniqueId) ? <FlatList
        data={formatRow(pictureList, 3)}
        renderItem={renderItem}
        numColumns={3}
        ListEmptyComponent={renderEmptyComponent}
      /> : authenticatedData.uniqueId === passedData.uniqueId ? null : renderUnsubscribedContent()}
    </Fragment>
  );
}
const Profile1 = ({navigation, authenticatedData, route}) => {
  const {colors, theme} = useTheme();
  const colorSchemeDark = theme.dark;
  const {t} = useTranslation();
  const viewFollowersPaneRef = useRef(null);
  const sendMessageAddTokens = useRef(null);
  const sendPrivateMessageRef = useRef(null);
  const [passedData, setPassedData ] = useState(route.params.user);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'information', title: t('information')},
    {key: 'images', title: t('Pictures')},
    {key: 'restricted', title: t('Restricted')},
    {key: 'followers', title: "Follower's" },
    {key: 'package', title: t('packages')},
    // {key: 'review', title: t('reviews')},
  ]);
  const [userData] = useState(UserData[0]);
  const [ dialog, setDialogState ] = useState(false);
  const [ secondDialog, setSecondDialog ] = useState(null);
  const [ thirdDialog, setThirdDialogState ] = useState(false);

  console.log("route.params.user", route.params.user);

  // When tab is activated, set what's index value
  const handleIndexChange = index => setIndex(index);

  useFocusEffect(
    useCallback(() => {
      const config = {
        uniqueId: authenticatedData.uniqueId, 
        accountType: authenticatedData.accountType,
        otherUserData: route.params.user
      };

      axios.post(`${BASE_URL}/save/profile/view`, config).then((res) => {
        if (res.data.message === "Successfully saved profile view!") {
            console.log("res.data", res.data);
        } else {
            console.log("res.data", res.data);
        }
      }).catch((err) => {
        console.log("errrrrrr", err);
      });

  }, []));

  // Customize UI tab bar
  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={[styles.indicator, {backgroundColor: colors.primary}]}
      style={[styles.tabbar, {backgroundColor: colors.background}]}
      tabStyle={styles.tab}
      inactiveColor={BaseColor.grayColor}
      activeColor={colors.text}
      renderLabel={({route, focused, color}) => (
        <View style={{flex: 1, width: 130, alignItems: 'center'}}>
          <Text headline semibold={focused} style={{color}}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );
  const calculateBizzType = (type) => {
    switch (type) {
      case "bizz":
        return "BIZZ (Looking for business relationship's)"
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
  // Render correct screen container when tab is activated
  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'information':
        return <InformationTab setPassedData={setPassedData} authenticatedData={authenticatedData} dialog={dialog} setDialogState={setDialogState} sendMessageAddTokens={sendMessageAddTokens} colorSchemeDark={colorSchemeDark} routes={routes} userData={passedData} jumpTo={jumpTo} navigation={navigation} />;
      case 'images':
        return <SecondRoute setPassedData={setPassedData} authenticatedData={authenticatedData} jumpTo={jumpTo} userData={passedData} navigation={navigation} />;
      case 'restricted':
        return <Restricted authenticatedData={authenticatedData} passedData={passedData} pictures={_.has(passedData, "restrictedImagesVideos") ? passedData.restrictedImagesVideos : []} jumpTo={jumpTo} navigation={navigation} />;
      case "followers":
        return <FollowingFollowers setPassedData={setPassedData} authenticatedData={authenticatedData} jumpTo={jumpTo} userData={passedData} navigation={navigation} />
        break;
      case 'package':
        return <PackageTab authenticatedData={authenticatedData} setDialogState={setDialogState} colors={colors} userData={passedData} jumpTo={jumpTo} navigation={navigation} />;
      case 'review':
        return <ReviewTab jumpTo={jumpTo} navigation={navigation} />;
    }
  };

  const handleFollowReaction = () => {
    console.log("handleFollowReaction clicked/ran...");
    
    const config = {
      postedByID: passedData.uniqueId,
      authedUserID: authenticatedData.uniqueId,
      username: authenticatedData.username,
      firstName: authenticatedData.firstName
    }
    axios.post(`${BASE_URL}/subscribe/follower/profile`, config).then((res) => {
        if (res.data.message === "Submitted subscribed as follower!") {
            console.log(res.data);

            const { otherUser } = res.data;

            Toast.show({
              type: 'success',
              text1: `Successfully followed this user!`,
              text2: "Click the same icon to view other followers...",
              visibilityTime: 3250,
              position: "bottom"
            });
            
            setPassedData(prevState => {
              return {
                ...prevState,
                followers: otherUser.followers
              }
            });
        } else if (res.data.message === "You've already reacted/followed this user so we've assumed you wanted to unfollow this user, thus we unfollowed them for you.") {
          
          const { otherUser } = res.data;

          setPassedData(prevState => {
            return {
              ...prevState,
              followers: otherUser.followers
            }
          });

          Toast.show({
            type: 'info',
            text1: `You've already followed this user - we unfollowed them.`,
            text2: res.data.message,
            visibilityTime: 3250,
            position: "bottom"
          });
        } else {
            console.log("Err", res.data);

            Toast.show({
              type: 'error',
              text1: `We've encountered an error processing...`,
              text2: "We've ran into an error while processing your request - please try the action again later or contact support.",
              visibilityTime: 3250,
              position: "bottom"
            });
        }
    }).catch((err) => {
        console.log(err.message);

        // Toast.show({
        //   type: 'error',
        //   text1: `We've encountered an error processing...`,
        //   text2: "We've ran into an error while processing your request - please try the action again later or contact support.",
        //   visibilityTime: 3250,
        //   position: "bottom"
        // });
    })
  }

  const handleSuperMatchRequest = () => {
    console.log("handleSuperMatchRequest clicked/ran...");

    const configuration = {
      otherUserID: passedData.uniqueId, // 
      signedinID: authenticatedData.uniqueId
    }

    axios.post(`${BASE_URL}/send/match/request/super/request`, configuration).then((res) => {
      if (res.data.message === "Successfully sent match request!") {
          console.log("Successfully sent match request!", res.data);

          const { user } = res.data;
          
          setPassedData(user);

          Toast.show({
            type: 'success',
            text1: `Successfully sent your match request!`,
            text2: "If they decide to match with you, you'll receive a notification...",
            visibilityTime: 3250,
            position: "bottom"
          });
      } else {
          console.log("Err", res.data);

          Toast.show({
            type: 'error',
            text1: `An error occurred sending your match...`,
            text2: "An error occurred while attempting to send your match request, please try this action again or contact support if the problem persists...",
            visibilityTime: 3250,
            position: "bottom"
          });
      }
    }).catch((err) => {
      console.log(err.message);

      // Toast.show({
      //   type: 'error',
      //   text1: `An error occurred sending your match...`,
      //   text2: "An error occurred while attempting to send your match request, please try this action again or contact support if the problem persists...",
      //   visibilityTime: 3250,
      //   position: "bottom"
      // });
    })
  }

  useEffect( () => () => SoundPlayer.stop(), [] );

  const renderVeryBottomButton = (userData) => {
    if (_.has(userData, "generatedFake")) {
      return null;
    } else {
      return (
        <Fragment>
          <Button onPress={() => sendPrivateMessageRef.current.open()}>
            {t('Message This User')}
          </Button>
        </Fragment>
      );
    }
  }
  const subscribeToRestricted = (passedValue) => {
    console.log("subscribeToRestricted clicked/ran...", passedData);

    if (passedValue.toLowerCase() === "subscribe") {
      const config = {
        otherUserID: passedData.uniqueId,
        signedInID: authenticatedData.uniqueId
      };

      axios.post(`${BASE_URL}/subscribe/user/content/restricted/pay`, config).then((res) => {
          if (res.data.message === "Successfully subscribed!") {
              console.log(res.data);

              setDialogState(false);

              const { user } = res.data;

              setPassedData(user);

              Toast.show({
                type: 'success',
                text1: `Successfully subscribed to this user's restricted content!`,
                visibilityTime: 3250,
                position: "bottom"
              });
          } else if (res.data.message === "This user has NOT set a price for their subscription yet, no action was taken as the appropriate settings have not been set!") {
            setDialogState(false);

            Toast.show({
              type: 'error',
              text1: `User has NOT setup a subscription fee/cost yet!`,
              text2: res.data.message,
              visibilityTime: 3250,
              position: "bottom"
            });
          } else if (res.data.message === "You do NOT have enough tokens to complete this transaction.") {
            setDialogState(false);

            Toast.show({
              type: 'error',
              text1: `You do NOT have enough tokens to take this action.`,
              text2: "Your account doesn't have enough tokens to complete this process - buy more tokens and try the action again!",
              visibilityTime: 3250,
              position: "bottom"
            });
          } else {
              console.log("Err", res.data);

              setDialogState(false);

              Toast.show({
                type: 'error',
                text1: `Error occurred while attempting to process your request...`,
                text2: "Contract support if this problem persists or try the action again!",
                visibilityTime: 3250,
                position: "bottom"
              });
          }
      }).catch((err) => {
          console.log(err.message);

          setDialogState(false);

          // Toast.show({
          //   type: 'error',
          //   text1: `Error occurred while attempting to process your request...`,
          //   text2: "Contract support if this problem persists or try the action again!",
          //   visibilityTime: 3250,
          //   position: "bottom"
          // });
      });
    } else {
      setDialogState(false);

      Toast.show({
        type: 'error',
        text1: `Your entry MUST match the text 'subscribe' w/o the quotes to continue...`,
        visibilityTime: 3250,
        position: "bottom"
      });
    }
  }

  const subscriptionCost = _.has(userData, "subscriptionAmountRestrictedContent") ? userData.subscriptionAmountRestrictedContent : "N/A";
  return (
    <View style={{flex: 1}}>
      <DialogInput isDialogVisible={dialog}
        title={`Are you sure you'd like to pay ${subscriptionCost} tokens to subscribe to this user?`}
        message={`If you'd like to subscribe, please type in the input below 'subscribe' without* the parentheses...`}
        hintInput ={"Type 'subscribe' to subscribe..."}
        submitInput={(inputText) => subscribeToRestricted(inputText)}
        closeDialog={() => {
          setDialogState(false);
        }}
      />
      <Dialog.Container visible={secondDialog}>
        <Dialog.Title>Are you sure you'd like to 'follow' this user?</Dialog.Title>
        <Dialog.Description>
          You're about to follow this user, please confirm or cancel this action...
        </Dialog.Description>
        <Dialog.Button style={{ color: "red" }} onPress={() => setSecondDialog(false)} label="Cancel.." />
        <Dialog.Button onPress={() => {
            setSecondDialog(false);
            handleFollowReaction();
          }} style={{ color: "green" }} label="Follow!" />
      </Dialog.Container>
      <Dialog.Container visible={thirdDialog}>
        <Dialog.Title>Are you sure you'd like to 'super match' with this user?!</Dialog.Title>
        <Dialog.Description>
          This is a priority match request and will be shown in front of other match requests, are you sure you'd like to use 1 'super match' request? These are typically bought or bundled in subscription/boost packages
        </Dialog.Description>
        <Dialog.Button style={{ color: "darkred" }} onPress={() => setThirdDialogState(false)} label="Cancel.." />
        <Dialog.Button onPress={() => {
            setThirdDialogState(false);
            handleSuperMatchRequest();
          }} label="Super Match Me!" />
      </Dialog.Container>
      <RBSheet
        ref={sendPrivateMessageRef}
        height={height}
        openDuration={250}
        draggable={false}
        closeOnDragDown={false}
        closeOnPressMask={false}
        customStyles={{
            container: {
                paddingHorizontal: 20,
                backgroundColor: colorSchemeDark ? "#000" : "#fff"
            },
            draggableIcon: {
                width: width * 0.725
            }
        }}
      >
          {userData !== null ? <SendPrivateMessagePaneIndividualProfile otherUser={passedData} authData={authenticatedData} sendPrivateMessageRef={sendPrivateMessageRef} /> : null}
      </RBSheet>
      <RBSheet
        ref={sendMessageAddTokens}
        height={height}
        openDuration={250}
        draggable={false}
        closeOnDragDown={false}
        customStyles={{
            container: {
                paddingHorizontal: 20,
                backgroundColor: colorSchemeDark ? "#000" : "#fff"
            }
        }}
      >
          {userData !== null ? <SendPrivateMessageBoostedPane otherUser={passedData} authData={authenticatedData} sendPrivateMessageRef={sendMessageAddTokens} /> : null}
      </RBSheet>
      <RBSheet
        ref={viewFollowersPaneRef}
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
                width: width * 0.725 // 
            }
        }}
      >
          <FollowingUsersCurrentListPane setPassedData={setPassedData} passedData={passedData} followers={passedData.followers} authenticatedData={authenticatedData} viewFollowersPaneRef={viewFollowersPaneRef} />
      </RBSheet>
      <Header
        title={"Individual Profile View"}
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
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ImageBackground source={_.has(passedData, "coverPhoto") ? { uri: `${BASE_ASSET_URL}/${passedData.coverPhoto.link}` } : null} resizeMode={"cover"} style={{alignItems: 'center', width: "100%", height: "100%", maxHeight: 270 }}>
          <View style={colorSchemeDark ? { backgroundColor: "#000", opacity: 0.775, minHeight: "100%", alignItems: "center", width: "100%" } : { backgroundColor: "#fff", opacity: 0.775, minHeight: "100%", alignItems: "center", width: "100%" }}>
            {authenticatedData.uniqueId !== passedData.uniqueId && _.has(passedData, "acceptedMatches") && passedData.acceptedMatches.includes(authenticatedData.uniqueId) ? <TouchableOpacity style={styles.absoluteTopLeft} onPress={() => setThirdDialogState(true)}>
              <Image source={require("../../assets/icons/superlike.png")} style={{ width: 50, height: 50 }} />
            </TouchableOpacity> : null}
            <Image source={{ uri: `${BASE_ASSET_URL}/${passedData.profilePictures[passedData.profilePictures.length - 1].link}` }} style={styles.image} />
            <Text title1 style={{ textAlign: "center" }} semibold>
              {passedData.firstName}{"\n"}@{passedData.username}
            </Text>
            <Text subhead style={{ marginTop: 12.25, color: "#000", color: colors.accent }}>
              {calculateBizzType(passedData.accountType)}
            </Text>
            {authenticatedData.uniqueId !== passedData.uniqueId ? <TouchableOpacity style={styles.absoluteTopRight} onPress={() => _.has(passedData, "followers") && passedData.followers.findIndex(item => item.followerID === authenticatedData.uniqueId) !== -1 ? viewFollowersPaneRef.current.open() : setSecondDialog(true)}>
              <Image source={require("../../assets/icons/add-follower.png")} style={{ width: 50, height: 50 }} />
            </TouchableOpacity> : null}
          </View>
        </ImageBackground>
        <View style={colorSchemeDark ? { backgroundColor: "#000", flex: 1 } : { backgroundColor: "#fff", flex: 1 }}>
          <TabView
            lazy
            navigationState={{index, routes}}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={handleIndexChange}
          />
          <View
            style={[
              styles.contentButtonBottom,
              {borderTopColor: colors.border},
            ]}>
            <View>
              <Text caption1 semibold>
                This is the user's rank/score
              </Text>
              <Text style={{ textDecorationLine: "underline" }} title3 primaryColor semibold>
                {`${passedData.rank} Point(s)`}
              </Text>
              <Text caption1 semibold style={{marginTop: 5}}>
                This guages this {"\n"}person's past interaction's
              </Text> 
            </View>
            {renderVeryBottomButton(passedData)}
          </View>
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
export default connect(mapStateToProps, { })(Profile1);

function InformationTab({navigation, colorSchemeDark, authenticatedData, userData, sendMessageAddTokens, dialog, setDialogState, setPassedData}) {
  const [ ready, setReady ] = useState(false);
  const [ meetups, setMeetups ] = useState([]);
  const [information, updateInformation ] = useState([
    {title: 'Location', detail: "N/A - Loading..." },
    {title: 'Total Review(s)', detail: `${userData.reviews.length} review's` },
    {title: 'Interested In', detail: _.has(userData, "interestedIn") ? userData.interestedIn : "Unknown" },
    {title: 'Born', detail: `${moment(userData.birthdateRaw).fromNow()} (${moment(userData.birthdateRaw).format("YYYY/MM/DD")})` },
    {title: 'Registered', detail: moment(userData.registrationDate).fromNow() },
    {title: 'Verification Completed', detail: !userData.verficationCompleted ? "Not Verified." : "Verified!" },
    {title: 'Height (In.)', detail: _.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "heightProfileData") ? userData.coreProfileData.heightProfileData.height : "N/A"
   }
  ]);
  const [ audioPlaying, setAudioPlaying ] = useState(false);
  const [ playProfileVideo, updateProfileVideoPlaying ] = useState(false);
  const {colors, theme} = useTheme();
  const [ matchDialog, setMatchDialog ] = useState(false);

  useEffect(() => {

    if (_.has(userData, "currentApproxLocation")) {
      console.log("userData.currentApproxLocation", userData.currentApproxLocation);

      const coords = `${userData.currentApproxLocation.geo.coordinates[1]}, ${userData.currentApproxLocation.geo.coordinates[0]}`;
          
      axios.get(`https://api.tomtom.com/search/2/reverseGeocode/${coords}.json?key=${TOMTOM_API_KEY}`).then((res) => {
          if (res.data) {
              const addressRegion = res.data.addresses[0].address.municipality;

              console.log("addressRegion", addressRegion);

              updateInformation(prevState => {
                return prevState.map((item) => {
                  if (item.title === "Location") {
                    return {title: 'Location', detail: addressRegion }
                  } else {
                    return item;
                  }
                })
              })

          } else {
              console.log("Err", res.data);
          }
      }).catch((err) => {
          console.log(err.message);
      })
    }

    axios.get(`${BASE_URL}/gather/meetups/randomized`, {
        params: {} 
    }).then((res) => {
        if (res.data.message === "Gathered list of meetings!") {
            console.log("Gathered list of meetings!", res.data);

            const { meetups } = res.data;

            setMeetups(meetups);

            setReady(true);
        } else {
            console.log("Err", res.data);

            setReady(true);
        }
    }).catch((err) => {
        console.log(err.message);

        setReady(true);
    })
  }, []);

  const renderMainContentConditionally = () => {
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
        </View>
      );
    } else {

      const renderOpeners = () => {
        return (
          <Fragment>
            <FlatList
              contentContainerStyle={{}}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              data={userData.coreProfileData.aboutPrompts}
              keyExtractor={(item, index) => index}
              renderItem={({item, index}) => (
                <Fragment key={index}>
                  <TouchableOpacity
                    style={[styles.containCustom]}
                    onPress={() => {}}
                    activeOpacity={0.9}>
                    <Image tintColor={colorSchemeDark ? "#fff" : "#000"} source={index === 0 ? require("../../assets/icons/1.png") : index === 1 ? require("../../assets/icons/2.png") : require("../../assets/icons/3.png")} style={styles.imageBannerCustom} />
                    <View style={[styles.contentCustom, {backgroundColor: colors.card}]}>
                      {item.selected != '' && (
                        <View style={styles.contentTitleCustom}>
                          <Text headline semibold>
                            {item.selected}
                          </Text>
                        </View>
                      )}
                      <View style={{flex: 1}}>
                        <Text body2 grayColor numberOfLines={5} style={{paddingVertical: 5}}>
                          {item.answer}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Fragment>
              )}
            />
          </Fragment>
        );
      }
      const onStartPlay = async () => {
        console.log('onStartPlay');

        SoundPlayer.playUrl(`${BASE_ASSET_URL}/${userData.coreProfileData.profileAudioTrack.file.link}`);

        setAudioPlaying(true);
      };
      
      const onStopPlay = async () => {
          console.log('onStopPlay');

          SoundPlayer.stop();

          setAudioPlaying(false);
      };

      const renderProfileVideoIfApplicable = () => {
        if (_.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "introductoryVideo")) {
          return (
            <Fragment>
              <Text style={styles.audioSubtext}>Profile introductory/about-me video - this can be anything about this user to get to know them...</Text>
              <View style={{ marginTop: 18.25 }} />
              <FlipCard onFlipEnd={(isFlipEnd) => {
                updateProfileVideoPlaying(isFlipEnd);
              }}>
                {/* Face Side */}
                <View style={styles.face}>
                  <View style={{ margin: 15, marginTop: 0 }}>
                    <View style={styles.borderedTouchable}>
                      <Text style={styles.innerTouchAudioText}>Watch/View Introductory Video</Text>
                    </View>
                  </View>
                </View>
                {/* Back Side */}
                <View style={styles.back}>
                  <Video 
                    source={{ uri: `${BASE_ASSET_URL}/${userData.coreProfileData.introductoryVideo.link}` }}
                    style={styles.resizedVideoStyle} 
                    onError={(err) => console.log("err", err)}
                    onLoad={() => console.log("loaded...")}
                    resizeMode={"cover"}
                    paused={!playProfileVideo}
                    muted={false}
                    playWhenInactive={false}
                  /> 
                </View>
            </FlipCard>
            </Fragment>
          );
        }
      }

      const renderAudioData = () => {
        if (_.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "profileAudioTrack")) {
          return (
            <Fragment>
              <View style={styles.hr} />
              <Text style={[styles.labelCustom, { marginHorizontal: 15 }]}>Audio Prompt</Text>
              <Text style={styles.audioSubtext}>Question/Answer (click to play the audio response). This was this user's response to the question they decided to answer - get a gist of what they sound like!</Text>
              <View style={{ margin: 15 }}>
                <Text style={[styles.audioPrompt, { color: colors.accent }]}>{userData.coreProfileData.profileAudioTrack.selection.value}</Text>
                <TouchableOpacity onPress={() => audioPlaying ? onStopPlay() : onStartPlay()} style={styles.borderedTouchable}>
                  <Text style={styles.innerTouchAudioText}>{audioPlaying ? "Stop Audio Clip..." : "Play Audio Clip!"}</Text>
                </TouchableOpacity>
              </View>
            </Fragment>
          );
        }
      }
      const renderChildren = () => {
        return (
          <Fragment>
            <View style={{ paddingVertical: 20 }}>
              <Text style={styles.labelCustom}>Number Of Children</Text>
              <Text style={colorSchemeDark ? { color: "#fff", textAlign: "left", marginTop: 12.25 } : { color: "#000", textAlign: "left", marginTop: 12.25 }}>Number Of Full-Custody Children: {_.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "custodyChildren") && _.has(userData.coreProfileData.custodyChildren, "numberOfPartialCustody") ? userData.coreProfileData.custodyChildren.numberOfFullTimeChildren : 0}</Text>
              <Text style={colorSchemeDark ? { color: "#fff", textAlign: "left", marginTop: 12.25 } : { color: "#000", textAlign: "left", marginTop: 12.25 }}>Number Of Partial-Custody Children: {_.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "custodyChildren") && _.has(userData.coreProfileData.custodyChildren, "numberOfPartialCustody") ? userData.coreProfileData.custodyChildren.numberOfPartialCustody : 0}</Text>
            </View>
          </Fragment>
        );
      }

      const renderEducation = () => {
        return (
          <Fragment>
            <View style={{ paddingVertical: 20 }}>
              <Text style={styles.labelCustom}>Education, Religion & Hair Color</Text>
              <Text style={colorSchemeDark ? { color: "#fff", textAlign: "left", marginTop: 12.25 } : { color: "#000", textAlign: "left", marginTop: 12.25 }}><Text style={{ fontWeight: "bold" }}>Hair Color:</Text> {_.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "hairColor") ? userData.coreProfileData.hairColor : "N/A"}</Text>
              <Text style={colorSchemeDark ? { color: "#fff", textAlign: "left", marginTop: 12.25 } : { color: "#000", textAlign: "left", marginTop: 12.25 }}><Text style={{ fontWeight: "bold" }}>Religion:</Text>: {_.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "religion") ? userData.coreProfileData.religion.label : "N/A"}</Text>
              <Text style={colorSchemeDark ? { color: "#fff", textAlign: "left", marginTop: 12.25 } : { color: "#000", textAlign: "left", marginTop: 12.25 }}><Text style={{ fontWeight: "bold" }}>Education:</Text>: {_.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "educationalData") ? `${userData.coreProfileData.educationalData.schoolName}/${userData.coreProfileData.educationalData.degreeAquired} ~ ${userData.coreProfileData.educationalData.startedYear}-${userData.coreProfileData.educationalData.endingYear}` : "N/A"}</Text>
            </View>
          </Fragment>
        );
      }

      const renderSpecialButtons = (userData) => {
        if (_.has(userData, "generatedFake")) {
          return null;
        } else {
          if (authenticatedData.uniqueId !== userData.uniqueId) {
            return (
              <Fragment>
                <View style={{ margin: 12.25 }}>
                  <Button outline onPress={() => sendMessageAddTokens.current.open()}>
                    {"Super Message This User"}
                  </Button>
                  {renderMatchButton()}
                  <View style={styles.hr} />
                </View>
              </Fragment>
            );
          }
        }
      }

      const handleMatchRequest = () => {
        console.log("handleMatchRequest clicked/ran...");

        const configuration = {
          otherUserID: userData.uniqueId, 
          signedinID: authenticatedData.uniqueId
        }

        axios.post(`${BASE_URL}/send/match/request`, configuration).then((res) => {
          if (res.data.message === "Successfully sent match request!") {
              console.log("Successfully sent match request!", res.data);

              const { user } = res.data;
              
              setPassedData(user);

              Toast.show({
                type: 'success',
                text1: `Successfully sent your match request!`,
                text2: "If they decide to match with you, you'll receive a notification...",
                visibilityTime: 3250,
                position: "bottom"
              });
          } else {
              console.log("Err", res.data);

              Toast.show({
                type: 'error',
                text1: `An error occurred sending your match...`,
                text2: "An error occurred while attempting to send your match request, please try this action again or contact support if the problem persists...",
                visibilityTime: 3250,
                position: "bottom"
              });
          }
        }).catch((err) => {
          console.log(err.message);

          // Toast.show({
          //   type: 'error',
          //   text1: `An error occurred sending your match...`,
          //   text2: "An error occurred while attempting to send your match request, please try this action again or contact support if the problem persists...",
          //   visibilityTime: 3250,
          //   position: "bottom"
          // });
        })
      }

      const renderMatchButton = () => {
        console.log("userData.requestedMatches", userData.requestedMatches);
        
        if (typeof userData.requestedMatches !== "undefined") {
          if (!userData.requestedMatches.includes(authenticatedData.uniqueId)) {
            return (
              <Fragment>
                <View style={styles.hr} />
                <Button outline style={{ borderWidth: 1, borderColor: colors.accent }} styleText={{ color: colors.accent }} onPress={() => setMatchDialog(true)}>
                  {"Request To Match W/User"}
                </Button>
              </Fragment>
            );
          }
        } else {
          return (
            <Fragment>
              <View style={styles.hr} />
              <Button outline style={{ borderWidth: 1, borderColor: colors.accent }} styleText={{ color: colors.accent }} onPress={() => setMatchDialog(true)}>
                {"Request To Match W/User"}
              </Button>
            </Fragment>
          );
        }
      }

      const playAudioTrack = (linkURL) => {
        console.log("playAudioTrack clicked/ran...", linkURL);

        if (audioPlaying === false) {
          SoundPlayer.playUrl(linkURL);

          setAudioPlaying(true);
        } else {
          SoundPlayer.stop();

          setAudioPlaying(false);
        }
      }
      
      const renderAudioTracks = () => {
        if (_.has(userData, "spotifyRecentPlaylist")) {
          return (
            <Fragment>
              <View style={{ margin: 15, marginBottom: 0 }}>
                <Text style={styles.labelCustom}>User's Spotify Recently Played Tracks</Text>
                <Text style={{ marginTop: 10, textAlign: "left" }}>These are this users most recently played spotify audio tracks - this is to help give you a better idea of what this user is into and/or like IRL.</Text>
              </View>
              <FlatList
                contentContainerStyle={{}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={userData.spotifyRecentPlaylist}
                keyExtractor={(item, index) => index}
                renderItem={({item, index}) => {
                  const { album, preview_url, artists } = item.track;
                  return (
                    <TouchableOpacity onPress={() => playAudioTrack(preview_url)} key={index}>
                      <View key={index} style={styles.itemContainer}>
                        <Image resizeMode={"cover"} source={{ uri: album.images[0].url }} style={styles.imageCustom} />
                        <View style={styles.textContainer}>
                          <Text style={[styles.title, { color: "#000" }]}>Artist: {artists[0].name}</Text>
                          <Text style={[styles.content, { color: "#000" }]}>Album: {album.name}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </Fragment>
          );
        } else {
          return (
            <View style={{ marginHorizontal: 15 }}>
              <View style={{ marginBottom: 0 }}>
                <Text style={styles.labelCustom}>User's Spotify Recently Played Tracks</Text>
                <Text style={{ marginTop: 10, textAlign: "left" }}>These are this users most recently played spotify audio tracks - this is to help give you a better idea of what this user is into and/or like IRL.</Text>
              </View>
              <View style={{ marginTop: 17.25 }} />
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
      };

      return (
        <Fragment>
          <Dialog.Container visible={matchDialog}>
            <Dialog.Title style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>Are you sure you'd like to request to "match" with this user?</Dialog.Title>
            <Dialog.Description>
              We just want to make sure you really want to match with this user before sending the notification, are you sure you'd like to match with this user?
            </Dialog.Description>
            <Dialog.Button style={{ color: "red" }} onPress={() => setMatchDialog(false)} label="Cancel.." />
            <Dialog.Button onPress={() => {
              setMatchDialog(false);
              handleMatchRequest();
            }} style={{ color: "green" }} label="Match Me!" />
          </Dialog.Container>
          <ScrollView style={{marginBottom: 20}}>
            {renderSpecialButtons(userData)}
            <Text body2 grayColor style={[styles.description, { marginTop: 22.5 }]}>
              {_.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "aboutMe") ? userData.coreProfileData.aboutMe : "User has NOT completed their bio/about-me yet..."}
            </Text>
            {renderAudioData()}
            {renderProfileVideoIfApplicable()}
            <View style={styles.contentField}>
              <View style={styles.hr} />
              <ProfilePerformance type="primary" data={[{ title: "Social Rank", value: userData.rank.toString() }, { title: "In-App Tokens/Coins", value: _.has(userData, "inAppTokenCurrency") ? userData.inAppTokenCurrency : 0 }, { title: "Follower's", value: typeof userData.followers !== "undefined" && userData.followers.length > 0 ? userData.followers.length : 0 }]} />
              <View style={styles.hr} />
            </View>
            <View style={{paddingHorizontal: 20}}>
              {information.map((item, index) => {
                return (
                  <View
                    style={[
                      styles.lineInformation,
                      {borderBottomColor: colors.border},
                    ]}
                    key={'information' + index}>
                    <Text body2 grayColor>
                      {item.title}
                    </Text>
                    <Text body2 semibold accentColor>
                      {item.detail}
                    </Text>
                  </View>
                );
              })}
              <View style={{ paddingVertical: 20 }}>
                <Text style={styles.labelCustom}>Activities/Interest(s)</Text>
                <FlatList
                  contentContainerStyle={{paddingLeft: 2.5, paddingRight: 2.5, flexDirection: 'row', flexWrap: 'wrap' }}
                  horizontal={false}
                  showsHorizontalScrollIndicator={false}
                  data={_.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "interests") ? userData.coreProfileData.interests : []}
                  keyExtractor={(item, index) => item.id}
                  ListEmptyComponent={() => {
                    return (
                      <Fragment>
                        <Text style={colorSchemeDark ? { color: "#fff", textAlign: "left", marginTop: 12.25 } : { color: colors.secondary, textAlign: "left", marginTop: 12.25 }}>N/A - Hasn't selected 'activites/interests' yet...</Text>
                      </Fragment>
                    );
                  }}
                  renderItem={({item, index}) => (
                    <Fragment key={index}>
                      <Tag
                        icon={
                          <Icon
                            name={"tag"}
                            size={12}
                            color={colors.primary}
                            solid
                            style={{marginRight: 5}}
                          />
                        }
                        chip
                        style={{
                          marginTop: 5,
                          marginRight: 5,
                        }}>
                        {item}
                      </Tag>
                    </Fragment>
                  )}
                />
              </View>
              <View style={{ paddingVertical: 20 }}>
                <Text style={styles.labelCustom}>Employment Data</Text>
                <Text style={colorSchemeDark ? { color: "#fff", textAlign: "left", marginTop: 12.25 } : { color: "#000", textAlign: "left", marginTop: 12.25 }}>{_.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "employmentData") ? userData.coreProfileData.employmentData.sector : `N/A - Hasn't selected 'employment sector' yet...`}</Text>
                <Text style={colorSchemeDark ? { color: "#fff", textAlign: "left", marginTop: 12.25 } : { color: "#000", textAlign: "left", marginTop: 12.25 }}>{_.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "employmentData") ? userData.coreProfileData.employmentData.description : `N/A - Hasn't selected 'previous/current employment data' yet...`}</Text>
              </View>
              {renderChildren()}
              {renderEducation()}
              <View style={{ paddingVertical: 20 }}>
                <Text style={styles.labelCustom}>Prompt's/Openers</Text>
                <Text style={{ marginTop: 10, textAlign: "left" }}>These are 'openers' or 'conversation starters' to open dialog with - use these to chat-it-up with this user...</Text>
                {_.has(userData, "coreProfileData") && _.has(userData.coreProfileData, "aboutPrompts") ? renderOpeners() : <View style={{ marginTop: 17.25 }}>
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
                </View>}
              </View>  
            </View>
            {renderAudioTracks()}
            <View>
              <Text
                headline
                semibold
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                Nearby Meetup's Near You!
              </Text>
              <FlatList
                contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={meetups}
                keyExtractor={(item, index) => item.id}
                renderItem={({item}) => (
                  <TourDay
                    image={{ uri: item.meetupPics.imageOne }}
                    day={`${item.postedByName} ~ @${item.postedByUsername}`}
                    title={item.title}
                    description={item.description}
                    style={{marginLeft: 15}}
                    onPress={() => navigation.navigate('HotelDetail', { meetingData: item })}
                  />
                )}
              />
            </View>
            {/* <View style={{paddingHorizontal: 20, marginTop: 20}}>
              <Text headline semibold style={{marginBottom: 10}}>
                Includes
              </Text>
              <Text body2>
                - Donec sollicitudin molestie malesuada. Quisque velit nisi, pretium
                ut lacinia in, elementum id enim.
              </Text>
              <Text body2 style={{marginTop: 5}}>
                - Other hygienic practices that the new hotel — which handles, among
                other guests, patients seeking medical treatment at the Texas Medical
                Center — include removing nonessential items like decorative pillows
                and magazines
              </Text>
              <Text body2 style={{marginTop: 5}}>
                - Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Donec
                rutrum congue leo eget malesuada.
              </Text>
            </View> */}
          </ScrollView>
        </Fragment>
      );
    }
  }

  return (
    <ScrollView style={colorSchemeDark ? { backgroundColor: "#000" } : { backgroundColor: "#fff" }}>
      {renderMainContentConditionally()}
    </ScrollView>
  );
}

function PackageTab({authenticatedData, setDialogState, userData, colors}) {
  const [packageItem] = useState(PackageData[0]);
  const subscriptionCost = _.has(userData, "subscriptionAmountRestrictedContent") ? userData.subscriptionAmountRestrictedContent : "N/A";
  const firstTier = [{
    desc: "Get access to 'restricitve/restricted' content (pictures/videos) each month as new content is revealed including all older content",
    name: "Access to 'restricted content pics/videos'"
  }]
  if (_.has(userData, "subscribedUsersRestricted") && userData.subscribedUsersRestricted.includes(authenticatedData.uniqueId)) {
    return (
      <ScrollView>
        <View style={{paddingHorizontal: 20}}>
          <Text body2 style={{marginTop: 20}}>
            You've already 'subscribed' & paid the one-time fee to see this restricted user's content. No action can be taken on this page at this point in time.
          </Text>
          <View style={styles.hr} />
          <Image resizeMode={"contain"} source={require("../../assets/images/custom/mail.png")} style={[styles.placeholderImage, { maxHeight: 325 }]} />
          <Text style={{ fontSize: 26.25, color: colors.accent, textAlign: "center" }}>You've already 'subbed' to this person's restricted content!</Text>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView>
        <View style={{paddingHorizontal: 20}}>
          <Text body2 style={{marginTop: 20}}>
            Each user can set their specific "packages" other user's can subscribe to. The following packages are cultivated by {userData.firstName} & vary at any given point in time in value. This unlocks the ability to do various things such as see restricted content (pictures/videos), priority private chat/messages, view limited-time "one time purchase" listings and much more!
          </Text>
          <View style={styles.hr} />
          {_.has(userData, "subscribedUsersRestricted") && userData.subscribedUsersRestricted.includes(authenticatedData.uniqueId) ? null : <TouchableOpacity onPress={() => setDialogState(true)} style={[styles.subscribeRestrictedButton, { borderColor: colors.accent }]}>
            <Text style={[styles.innerTextButton, { color: colors.accent }]}>Subscribe To Restricted-Content</Text>
          </TouchableOpacity>}
          <View style={styles.hr} />
          <PackageItem
            packageName={packageItem.packageName}
            price={subscriptionCost}
            type={subscriptionCost !== "N/A" ? "One-time purchase" : "No price/content has been set yet."}
            description={subscriptionCost !== "N/A" ? "Get access to 'restricitve/restricted' content (pictures/videos) each month as new posts arrive! This ONLY allows for the access to the 'restricted' content sub-page/tab giving access to restricted data that other user's cannot see if not subscribed..." : "Do NOT subscribe to this user as they have likely not submitted any restirctive/restricted content as they haven't set a payment 'cost tier' yet so you might waste your tokens..."}
            services={firstTier}
            onPress={() => {
              setDialogState(true)
            }}
            detail
            style={{marginBottom: 10, marginTop: 20}}
          />
        </View>
      </ScrollView>
    );
  }
}

const ReviewTab = ({navigation}) => {
  const [refreshing] = useState(false);
  const [rateDetail] = useState({
    point: 4.7,
    maxPoint: 5,
    totalRating: 25,
    data: ['80%', '10%', '10%', '0%', '0%'],
  });
  const [reviewList] = useState(ReviewData);
  const {colors} = useTheme();
  const renderListFooterComponent = () => {
    return (
      <Fragment>
        <Text style={{ fontWeight: "bold", textAlign: "center", textDecorationLine: "underline", marginTop: 15, fontSize: 18.25 }}>View More/All Reviews</Text>
      </Fragment>
    );
  }
  return (
    <FlatList
      contentContainerStyle={{padding: 20}}
      refreshControl={
        <RefreshControl
          colors={[colors.primary]}
          tintColor={colors.primary}
          refreshing={refreshing}
          onRefresh={() => {}}
        />
      }
      data={reviewList}
      keyExtractor={(item, index) => item.id}
      ListFooterComponent={renderListFooterComponent}
      ListHeaderComponent={() => (
        <RateDetail
          point={rateDetail.point}
          maxPoint={rateDetail.maxPoint}
          totalRating={rateDetail.totalRating}
          data={rateDetail.data}
        />
      )}
      renderItem={({item}) => (
        <CommentItem
          style={{marginTop: 10}}
          image={item.source}
          name={item.name}
          rate={item.rate}
          date={item.date}
          title={item.title}
          comment={item.comment}
        />
      )}
    />
  );
}
