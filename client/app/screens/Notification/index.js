import React, { useState, useCallback, Fragment } from 'react';
import { RefreshControl, FlatList, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text } from '@components';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import Toast from "react-native-toast-message";
import _ from "lodash";
import moment from 'moment';
import helpers from "./NotificationActions/actions.js";
import Dialog from "react-native-dialog";
import DialogInput from 'react-native-dialog-input';

const { enablePicturesViaMessageSpecificUser, changePendingMeetupToActiveMeetup } = helpers;

const Notification = ({ navigation, authData }) => {

  const {colors, theme} = useTheme();

  const colorSchemeDark = theme.dark;

  const [ state, setState ] = useState({
    notifications: [],
    refreshing: false,
    user: null,
    loading: true,
    selectedNotification: null,
    inputConfirmationText: "",
    dialogs: {
      showDialog: false,
      confirmBachelorApplicant: false,
      showMeetupRequestDialog: false
    }
  })

  const fetchCommentsToAddProfilePic = (notifications) => {

    const promises = [];

    if (typeof notifications !== "undefined" && notifications.length > 0) {
        for (let idxxxxx = 0; idxxxxx < notifications.length; idxxxxx++) {
            const notification = notifications[idxxxxx];
            
            const { from } = notification;

            promises.push(new Promise((resolve, reject) => {
              // update comments state
              const config = {
                  params: {
                      postedByID: from
                  }
              };
              axios.get(`${BASE_URL}/gather/one/user/restricted/data`, config).then((res) => {
                  if (res.data.message === "Submitted gathered user's info!") {

                      const { user } = res.data; 

                      notification["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
                      notification["name"] = user.firstName;
                      notification["username"] = user.username;
                      
                      resolve(notification);
                  } else {
                      notification["lastProfilePic"] = null;
                      notification["name"] = null;
                      notification["username"] = null;

                      resolve(notification);
                  }
              }).catch((err) => {

                  notification["lastProfilePic"] = null;
                  notification["name"] = null;
                  notification["username"] = null;

                  resolve(notification);
              })
            }));
        };

        Promise.all(promises).then((passedValues) => {

            console.log("Promise passedValues passedValues passedValues passedValues....:", passedValues);

            setState(prevState => {
              return {
                ...prevState,
                notifications: passedValues.reverse(),
                loading: false
              }
            })
        });
    } else {
        console.log("NO notifications available...!");
    }
  }

  useFocusEffect(
    useCallback(() => {

      const config = {
        params: {
          uniqueId: authData.uniqueId, 
          accountType: authData.accountType
        }
      };

      axios.get(`${BASE_URL}/gather/user/profile`, config).then((res) => {
          if (res.data.message === "Successfully gathered profile!") {
              console.log("res.data", res.data);

              const { user } = res.data;

              setState(prevState => {
                return {
                  ...prevState,
                  user
                }
              })

              fetchCommentsToAddProfilePic(user.notifications);

          } else {
              console.log("res.data", res.data);

              Toast.show({
                  type: 'error',
                  text1: `An error occurred while fetching your latest information...`,
                  text2: `We've encountered an error while fetching your latest information, please try again or contact support if the problem persists...`,
                  visibilityTime: 3250,
                  position: "bottom"
              });
          }
      }).catch((err) => {
          // Toast.show({
          //     type: 'error',
          //     text1: `An error occurred while fetching your latest information...`,
          //     text2: `We've encountered an error while fetching your latest information, please try again or contact support if the problem persists...`,
          //     visibilityTime: 3250,
          //     position: "bottom"
          // });
      })
  }, []));

  console.log("state.user", state.user);

  const handleNotificationClick = notification => {
    console.log("handleNotificationClick...", notification);

    setState(prevState => {
      return {
        ...prevState,
        selectedNotification: notification
      }
    })

    switch (notification.link) {
      case "request-picture-messaging":
        setState(prevState => {
          return {
            ...prevState,
            dialogs: {
              ...prevState.dialogs,
              showDialog: true
            }
          }
        })
        break;
      case "meetup-request":
        navigation.navigate("NotificationMeetupRequestIndividual", { notification })
        break;
      case "live-streaming-mentorship-call":
        console.log("live-streaming-mentorship-call ran/clicked...");

        const { data } = notification.data;

        const newDataPassedMentorshipCall = {
          streamID: data.generatedStreamID,
          sessionID: data.sessionID,
          token: data.token,
          redirectedNotifications: true
        };

        navigation.navigate("LiveStreamingMentorship", { data: newDataPassedMentorshipCall });
        break;
      case "new-private-message":
        navigation.replace("BottomTabNavigator", { screen: "Messenger" });
        break;
      case "super-match-request":
        navigation.navigate("Matches")
        break;
      case "round-two-continuation":
          navigation.navigate("InAppGameCompetitionSubmitTalentVideo");
          break;
      case "round-one-results-submission":
        navigation.navigate("MainViewCompetitionBacheloretteGame");
        break;
      case "round-one-bachelorette-bachelor":
        navigation.navigate("QuestionareBachelorBachelorettePage", { listing: notification.data.data.listingDataMain, notificationPassed: notification, notificationNav: true });
        break;
      case "match-request":
        navigation.navigate("Matches")
        break;
      case "competition-video-calling":
        console.log("booooooooom");

        navigation.navigate("VideoCallInstigateInAppGame", { fromNotifications: true, notification: notification });
        break;
      case "bachelor-game-pending":
        console.log("bachelor-game-pending ran...");

        setState(prevState => {
          return {
            ...prevState,
            dialogs: {
              ...prevState.dialogs,
              confirmBachelorApplicant: true
            }
          }
        })
        break;
      case "live-streaming-match-call":
        let customData = notification.data.data;

        const newDataPassedMatchCall = {
          streamID: customData.generatedStreamID,
          sessionID: customData.sessionID,
          token: customData.token,
          redirectedNotifications: true
        };

        navigation.navigate("MatchChatVideoCommunicationView", { data: newDataPassedMatchCall });
        break;
      case "new-mentorship-request":
        navigation.navigate("ViewTherapyCompanionshipRequests")
        break;
      case "accepted-mentorship-request":
        navigation.navigate("ManageActiveAppointmentMeetingsMain")
        break;
      case "completion-mentorship-contract-request":
        navigation.navigate("CompletionMentorshipContractingRequests", { data: notification });
        break;
      default:
        break;
    }
  }

  const renderEmptyListContent = () => {
    return (
      <Fragment>
        <View style={styles.centered}>
          <Image resizeMode={"contain"} source={require("../../assets/images/no-notifications.png")} style={styles.noNotifications} />
          <View style={{ marginTop: 17.25 }} />
          <Text style={{ fontSize: 18.25, marginTop: 22.25, color: colors.accent, textAlign: "center" }}>You do NOT currently have any pending/active notifications, use the app some more and check back later after you've engaged with other users in-app!</Text>
        </View>
      </Fragment>
    );
  }

  const listHeaderComponent = () => {
    return (
      <Fragment>
        <View style={{ margin: 11.25 }}>
          <Text style={styles.importantText}>Click each/any notification to see & take additional actions...</Text>
        </View>
      </Fragment>
    );
  }

  const calculateSpecialNotification = item => {
    if (item.link === "super-match-request") {
      return true;
    } else {
      return false;
    }
  }

  const submitDialogInput = (inputText) => {
    console.log("submitDialogInput clicked/ran...");

    if (inputText.toLowerCase() === "accept") {
      console.log("accept request...");

      const config = {
        uniqueId: authData.uniqueId, 
        accountType: authData.accountType,
        notificationID: state.selectedNotification.id,
        listingID: state.selectedNotification.data.data.listingID,
        from: state.selectedNotification.from
      };

      axios.post(`${BASE_URL}/accept/respond/notification/competition/game/request`, config).then((res) => {
        if (res.data.message === "Successfully responded to the notification!") {
            console.log("res.data", res.data);
          
            setState(prevState => {
              return {
                ...prevState,
                notifications: prevState.notifications.filter((item) => item.id !== state.selectedNotification.id),
                selectedNotification: null
              }
            })
        } else {
            console.log("res.data", res.data);

            Toast.show({
                type: 'error',
                text1: `An error occurred while processing your request...`,
                text2: `We've encountered an error while processing your req uest, please try again or contact support if the problem persists...`,
                visibilityTime: 3250,
                position: "bottom"
            });
        }
      }).catch((err) => {
          // Toast.show({
          //     type: 'error',
          //     text1: `An error occurred while processing your request...`,
          //     text2: `We've encountered an error while processing your req uest, please try again or contact support if the problem persists...`,
          //     visibilityTime: 3250,
          //     position: "bottom"
          // });
      })

      setState(prevState => {
        return {
          ...prevState,
          dialogs: {
            ...prevState.dialogs,
            confirmBachelorApplicant: false
          }
        }
      })
    }
    if (inputText.toLowerCase() === "decline") {
      console.log("decline request...");

      const config = {
        uniqueId: authData.uniqueId, 
        accountType: authData.accountType,
        notificationID: state.selectedNotification.id,
        listingID: state.selectedNotification.data.data.listingID,
        from: state.selectedNotification.from
      };

      axios.post(`${BASE_URL}/decline/respond/notification/competition/game/request`, config).then((res) => {
        if (res.data.message === "Successfully responded to the notification!") {
            console.log("res.data", res.data);
          
            setState(prevState => {
              return {
                ...prevState,
                notifications: prevState.notifications.filter((item) => item.id !== state.selectedNotification.id),
                selectedNotification: null
              }
            })
        } else {
            console.log("res.data", res.data);

            Toast.show({
                type: 'error',
                text1: `An error occurred while processing your request...`,
                text2: `We've encountered an error while processing your req uest, please try again or contact support if the problem persists...`,
                visibilityTime: 3250,
                position: "bottom"
            });
        }
      }).catch((err) => {
          // Toast.show({
          //     type: 'error',
          //     text1: `An error occurred while processing your request...`,
          //     text2: `We've encountered an error while processing your req uest, please try again or contact support if the problem persists...`,
          //     visibilityTime: 3250,
          //     position: "bottom"
          // });
      })

      setState(prevState => {
        return {
          ...prevState,
          dialogs: {
            ...prevState.dialogs,
            confirmBachelorApplicant: false
          }
        }
      })
    }
  };

  return (
    <View style={{flex: 1}}>
      <Dialog.Container visible={state.dialogs.showDialog}>
        <Dialog.Title style={{ color: "#000" }}>Are you sure you'd like to enable 'picture messaging' with this user?</Dialog.Title>
        <Dialog.Description>
            By clicking 'confirm' on this dialog box, this will allow you and the other user to send pictures or images via messaging through our existing messaging features/functionality...
        </Dialog.Description>
        <Dialog.Button onPress={() => setState(prevState => {
          return {
            ...prevState,
            dialogs: {
              ...prevState.dialogs,
              showDialog: false
            }
          }
        })} label="Cancel/Abort." />
        <Dialog.Button onPress={() => {
          enablePicturesViaMessageSpecificUser(state.selectedNotification, authData)

          setState(prevState => {
            return {
              ...prevState,
              dialogs: {
                ...prevState.dialogs,
                showDialog: false
              }
            }
          })
        }} label="Confirm!" />
      </Dialog.Container>
      <DialogInput isDialogVisible={state.dialogs.confirmBachelorApplicant}
        title={"Would you like to ACCEPT or DECLINE this applicant for your bachelorette/bachelor competition?"}
        message={"If you'd like to accept this request, please type ACCEPT in the input-box. If you'd like to decline, please type DECLINE..."}
        hintInput ={"ACCEPT/DECLINE"}
        submitInput={(inputText) => submitDialogInput(inputText)}
        closeDialog={() => {
          setState(prevState => {
            return {
              ...prevState,
              dialogs: {
                ...prevState.dialogs,
                confirmBachelorApplicant: false
              }
            }
          })
        }}>
      </DialogInput>
      <Header
        title={"Notification List"}
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
        {state.loading === true ? <View style={styles.centered}>
          <View style={{ marginTop: 82.25 }} />
          <ActivityIndicator size="large" color={colors.accent} />
          <View style={{ marginTop: 32.25 }} />
          <Text style={styles.loadingYourContentText}>Loading your notifications, please wait for us to load your data...</Text>
          <Image resizeMode={"contain"} source={require("../../assets/images/longloading.png")} style={[styles.loadingImage]} />
        </View> : <FlatList
          contentContainerStyle={{ paddingVertical: 10 }}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={state.refreshing}
              onRefresh={() => {}}
            />
          }
          ListHeaderComponent={listHeaderComponent}
          ListEmptyComponent={renderEmptyListContent}
          data={state.notifications}
          keyExtractor={(item, index) => item.id}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={calculateSpecialNotification(item) ? colorSchemeDark ? [styles.item, { backgroundColor: "#6082B6" }] : [styles.item, { backgroundColor: "#f7cddd" }] : [styles.item]}
                key={index}
                onPress={() => {
                  handleNotificationClick(item);
                }}
                activeOpacity={0.9}>
                <View style={[styles.contain, { borderBottomColor: colors.border }]}>
                  <Image source={item.lastProfilePic !== null ? { uri: `${BASE_ASSET_URL}/${item.lastProfilePic.link}` } : require("../../assets/images/custom/blank-profile-pic.png")} style={[styles.thumb]} />
                  <View style={styles.content}>
                    <View style={styles.left}>
                      <Text numberOfLines={1} style={[styles.headline, { color: colors.accent }]} headline semibold>
                        {`${item.name} ~ @${item.username}`}
                      </Text>
                      <Text
                        note
                        numberOfLines={2}
                        footnote
                        style={colorSchemeDark ? [{
                          paddingTop: 5,
                          color: "#fff"
                        }] : [{
                          paddingTop: 5,
                          color: "#000"
                        }]}>
                        {item.data.title}
                      </Text>
                      <Text
                        note
                        numberOfLines={5}
                        footnote
                        style={colorSchemeDark ? [{
                          paddingTop: 5,
                          color: "#fff"
                        }] : [{
                          paddingTop: 5,
                          color: "#000"
                        }]}>
                        {item.data.body}
                      </Text>
                    </View>
                    <View style={styles.right}>
                      <Text caption2 grayColor numberOfLines={1}>
                        {moment(item.system_date).fromNow(true)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
        />}
      </SafeAreaView>
    </View>
  );
}
const mapStateToProps = (state) => {
  return {
      authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
  }
}
export default connect(mapStateToProps, { })(Notification);