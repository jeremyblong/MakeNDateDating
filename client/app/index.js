import React, { useEffect, useState, Fragment } from 'react';
import {store, persistor} from 'app/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Navigator from './navigation';
import Toast from 'react-native-toast-message';
import FlashMessage, { showMessage } from "react-native-flash-message";
import Orientation from 'react-native-orientation-locker';
import BackgroundLocationTrackingHelper from "./backgroundLocationTracking.js";
import { CometChat } from '@cometchat-pro/react-native-chat';
import { BASE_URL, COMET_CHAT_APP_ID } from "@env";
import { withIAPContext, initConnection } from 'react-native-iap';
import UserInactivity from 'react-native-user-inactivity';
import axios from "axios";
import ConfettiCannon from 'react-native-confetti-cannon';
import messaging from '@react-native-firebase/messaging';
import { requestNotifications } from 'react-native-permissions';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import _ from 'lodash';
import OnboardingProcess from "./onboardingProcess.js";
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import {
  TourGuideProvider
} from 'rn-tourguide';
import { useColorScheme, Platform, View, TouchableOpacity, Text, StyleSheet, Button } from "react-native";

const timerCountExludeReward = 60000; // 60000
const rewardMarker = Math.floor(Math.random() * (625 - 375 + 1) + 375); // 300 is real number for production...

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister:  (token) => {
    console.log("TOKEN:", token);
  },
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification:  (notification) => {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction:  (notification) => {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },
  onRegistrationError: (err) => {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const App = (props) => {  // 
  const userData = store.getState().auth.tempUserData;

  const colorSchemeDark = useColorScheme() === 'dark';

  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    // save update .env //
    if (fcmToken && userData.uniqueId) {
      axios.post(`${BASE_URL}/register/fcm/token`, {
        fcmToken,
        uniqueId: userData.uniqueId,
        accountType: userData.accountType
      }).then((res) => {
        if (res.data.message === "Registered FCM token!") {
          console.log("res.data: ! ", res.data);
        } else {
          console.log("res.data error", res.data);
        }
      }).catch((err) => {
        console.log("err", err);
      })
    } 
  } 
  const [active, setActive] = useState(true);
  const [ currentRewardCount, setCurrentRewardCount ] = useState(20);
  const [ showConfetti, setConfettiState ] = useState(false);
  // change so env saves /// 
  const handleRewardDispursement = () => {
    console.log("handleRewardDispursement ran...!");

    if (active === true && _.has(userData, "uniqueId")) {
      const config = {
        userID: userData.uniqueId,
        accountType: userData.accountType
      };

      axios.post(`${BASE_URL}/update/reward/user/continous/usage`, config).then((res) => {
          const { amount, message } = res.data;
          if (message === "Successfully rewarded the user!") {
            setCurrentRewardCount(0);

            Toast.show({
              type: 'success',
              text1: `You've been awarded ${amount} tokens!`,
              text2: `Congrats! You've been awarded ${amount} tokens for consistently using our application 😄 Enjoy!`,
              visibilityTime: 6750,
              position: "bottom",
              onHide: () => {
                setConfettiState(false);
              },
              onShow: () => {
                setConfettiState(true);
              }
          });
          }
      }).catch((err) => {
          console.log("err", err);
          
          setCurrentRewardCount(0);
      })
      
    } else {
      console.log("NOT active - don't do anything/dont reward.");
    }
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("------ A new FCM message arrived! --------- ", remoteMessage);

      const { body, title } = remoteMessage.notification;
      
      showMessage({
        message: title,
        description: body,
        type: "success",
        duration: 7750
      });
    });

    return unsubscribe;
  }, []);

  console.log("currentRewardCount", BASE_URL);

  useEffect(() => {

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
      if (enabled) {
        // console.log('Authorization status:', authStatus);
      }
    };

    requestUserPermission();

    requestNotifications(['alert', 'sound']).then(({status, settings}) => {
      // console.log("status, settings", status, settings);
    });

    if (currentRewardCount < rewardMarker) {
      const timeout = setTimeout(() => {
        setCurrentRewardCount(prevState => prevState += 1);
      }, 1000);
  
      return () => {
        clearTimeout(timeout);
      };
    } else {
      handleRewardDispursement();
    }
  }, [currentRewardCount]);
  
  useEffect(() => {
 
    Orientation.lockToPortrait();

    mobileAds().setRequestConfiguration({
      // Update all future requests suitable for parental guidance
      maxAdContentRating: MaxAdContentRating.R,
      // Indicates that you want your content treated as child-directed for purposes of COPPA.
      tagForChildDirectedTreatment: false,
      // Indicates that you want the ad request to be handled in a
      // manner suitable for users under the age of consent.
      tagForUnderAgeOfConsent: false,
      // An array of test device IDs to allow.
      testDeviceIdentifiers: ['EMULATOR'],
    }).then(() => {
      // Request config successfully set!
      console.log("advertising set!");
    });

    mobileAds().initialize().then(adapterStatuses => {
      // Initialization complete!
      console.log("intiializing advertising set : ", adapterStatuses);
    })

    checkToken();

    if (_.has(userData, "uniqueId")) {
      PushNotification.createChannel(
        {
          channelId: userData.uniqueId, // (required)
          channelName: "My channel", // (required)
          channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
          playSound: false, // (optional) default: true
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );
    }
    // comment to update env
    initConnection().catch((err) => console.log(err))

    const appID = COMET_CHAT_APP_ID;
    const region = 'us';

    const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();

    CometChat.init(appID, appSetting).then(
      () => {
        console.log('Initialization completed successfully');
        // You can now call login function.
      },
      (error) => {
        console.log('Initialization failed with error:', error);
        // Check the reason for error and take appropriate action.
      },
    ); // save
  }, []) //// save again

const Tooltip = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
  labels,
}) => (
  <View
    style={{
      borderRadius: 16,
      paddingTop: 24,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 16,
      width: '80%',
      backgroundColor: '#ffffffef',
    }}
  >
    <View style={styles.tooltipContainer}>
      <Text testID='stepDescription' style={styles.tooltipText}>
        {currentStep && currentStep.text}
      </Text>
    </View>
    <View style={[styles.bottomBar]}>
      {!isLastStep ? (
        <View>
          <Button onPress={handleStop} title={labels?.skip || 'Skip'}></Button>
        </View>
      ) : null}
      {/* {!isFirstStep ? (
        <View>
          <Button onPress={handlePrev} title={labels?.previous || 'Previous'}></Button>
        </View>
      ) : null} */}
      {!isLastStep ? (
        <View>
          <Button onPress={handleNext} title={labels?.next || 'Next'}></Button>
        </View>
      ) : (
        <View onPress={handleStop}>
          <Button onPress={handleStop} title={labels?.finish || 'Finish'}></Button>
        </View>
      )}
    </View>
  </View>
)

  return (
      <Fragment>
        <TourGuideProvider {...{tooltipComponent: Tooltip }} backdropColor={colorSchemeDark ? "rgba(255, 255, 255, 0.325)" : "rgba(0, 0, 0, 0.325)"} verticalOffset={Platform.OS === "ios" ? 0 : 42.5} preventOutsideInteraction={true} {...{ borderRadius: 16 }}>
          <UserInactivity
            isActive={active}
            timeForInactivity={timerCountExludeReward}
            onAction={isActive => {
              console.log("isActive", isActive);
              setCurrentRewardCount(0);
              setActive(isActive);
            }}
          >
            <Provider store={store}>
              <OnboardingProcess completedAlready={store.getState().intro.introCompleted} />
              <PersistGate loading={null} persistor={persistor}>
                <Navigator />
                {showConfetti ? <ConfettiCannon count={250} origin={{x: -10, y: 0}} /> : null}
                <BackgroundLocationTrackingHelper props={props} />
                <Toast />
                <FlashMessage position="top" />
              </PersistGate>
            </Provider>
          </UserInactivity>
        </TourGuideProvider>
      </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  tooltip: {
    position: 'absolute',
    paddingHorizontal: 15,
    overflow: 'hidden',
    width: '100%',
    borderRadius: 16,
    paddingTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    zIndex: 100 - 1,
  },
  nonInteractionPlaceholder: {
    backgroundColor: 'transparent',
    zIndex: 100 - 2,
  },
  tooltipText: {
    textAlign: 'center',
  },
  tooltipContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    padding: 10,
  },
  buttonText: {
    color: '#27ae60',
  },
  bottomBar: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  overlayContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
});

export default withIAPContext(App);