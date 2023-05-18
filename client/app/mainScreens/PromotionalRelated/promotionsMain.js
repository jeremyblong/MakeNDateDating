import React, { Fragment, useState, useCallback } from "react";
import { View, TouchableOpacity, Image, ScrollView } from "react-native";
import { Text, Icon, Header, Card, Button } from "@components";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@config'; 
import styles from "./promotionsMainStyles.js";
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from "@env";
import axios from "axios";
import { connect } from "react-redux";
import _ from "lodash";
import Dialog from "react-native-dialog";
import Toast from "react-native-toast-message";

const ViewPromotionalOptionsViewMain = ({ authenticatedData }) => {

    const navigation = useNavigation();
    const { colors, theme } = useTheme();
    const [ user, setUser ] = useState(null);
    const [ showDialog, setDialogState ] = useState(false);

    useFocusEffect(
        useCallback(() => {
          axios.get(`${BASE_URL}/gather/user/profile`, {
              params: {
                uniqueId: authenticatedData.uniqueId
              } 
          }).then((res) => {
              if (res.data.message === "Successfully gathered profile!") {
                  console.log("Successfully gathered profile!", res.data);
      
                  const { user } = res.data;
      
                  setUser(user);
              } else {
                  console.log("Err", res.data);
              }
          }).catch((err) => {
              console.log(err.message);
          })
    }, []));

    const handleUseExistingBoost = () => {
      console.log("handleUseExistingBoost clicked/ran..");

      const config = {
        uniqueId: authenticatedData.uniqueId
      }

      axios.post(`${BASE_URL}/boost/user/profile/existing`, config).then((res) => {
          if (res.data.message === "Successfully boosted!") {
            console.log("Successfully boosted!", res.data);

            Toast.show({
              type: 'success',
              text1: `We've successfully BOOSTED your profile!`,
              visibilityTime: 2375,
              position: "bottom",
              onHide: () => {
                  navigation.goBack();
              }
            });
          } else if (res.data.message === "You do NOT have enough boosts to take this action - please buy more boosts and try again.") {
            Toast.show({
              type: 'error',
              text1: `You do NOT have enough boosts to boost!`,
              text2: res.data.message,
              visibilityTime: 2375,
              position: "bottom"
            });
          } else {
              console.log("Err", res.data);

              Toast.show({
                type: 'error',
                text1: `An error occurred while processing request.`,
                text2: "Could NOT boost your profile - please try this action again...",
                visibilityTime: 2375,
                position: "bottom"
              });
          }
      }).catch((err) => {
          console.log(err.message);

          Toast.show({
            type: 'error',
            text1: `An error occurred while processing request.`,
            text2: "Could NOT boost your profile - please try this action again...",
            visibilityTime: 2375,
            position: "bottom"
          });
      })
    }

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 50, flexGrow: 1 }}>
            <Dialog.Container visible={showDialog}>
              <Dialog.Title style={theme.dark ? { color: "#fff" } : { color: "#000" }}>Are you sure you'd like to use an existing boost!?</Dialog.Title>
              <Dialog.Description>
                This will 'boost' your account, this will use an existing boost that you have purchased - if not, this action will not work. It will reduct ONE from your boost count.
              </Dialog.Description>
              <Dialog.Button onPress={() => setDialogState(false)} style={{ color: "darkred" }} label="Cancel.." />
              <Dialog.Button onPress={() => {
                setDialogState(false);
                handleUseExistingBoost();
              }} style={{ color: "green" }} label="Use BOOST!" />
            </Dialog.Container>
            <Header
                title={"Promotional Activities"}
                subTitle="Promotional Options & Activities"
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
            <View style={styles.container}>
              <View>  
                <TouchableOpacity onPress={() => {}} activeOpacity={0.9}>
                  <Image style={styles.imagePost} resizeMode={"contain"} source={require("../../assets/images/custom/promo.jpg")} />
                </TouchableOpacity>
                <View style={[styles.content, {borderBottomColor: colors.border}]}>
                  <Text headline semibold style={{ paddingBottom: 10, borderBottomColor: colors.accent, borderBottomWidth: 1.25 }}>
                    Promote your online profile/account to get more views for a temporary period of time!
                  </Text>
                  <Text style={{ paddingTop: 12.25 }} body2>
                    Boosting your account does not only make your profile drastically more visible but increases liklihood of matches or compatiable partners but provides you with THE best experience available in the online dating scene...
                  </Text>
                </View>
                <Button
                  outline
                  onPress={() => {
                    if (authenticatedData !== null && Object.keys(authenticatedData).length > 5 && _.has(authenticatedData, "uniqueId")) {
                      navigation.navigate("PromoteIndividualAccountPage")
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
                  <Text body2 semibold primaryColor>
                    Purchase New Boosts!
                  </Text>
                </Button>
                <View style={{ marginTop: 22.25 }} />
                <Button
                  outline
                  style={{ borderWidth: 1, borderColor: colors.accent }}
                  onPress={() => {
                    if (authenticatedData !== null && Object.keys(authenticatedData).length > 5 && _.has(authenticatedData, "uniqueId")) {
                      setDialogState(true);
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
                  <Text body2 semibold accentColor>
                    Use Existing Boost!
                  </Text>
                </Button>
                {user !== null ? <Fragment>
                  <View style={styles.centeredMin}>
                    <Text style={styles.customText}>You have approx. <Text style={{ color: colors.accent, textDecorationLine: "underline" }}>{_.has(user, "profileBoosts") ? user.profileBoosts : 0} boost(s)</Text> at the current moment...</Text>
                  </View>
                </Fragment> : null}
              </View>
            </View>
        </ScrollView>
    );
} 
const mapStateToProps = (state) => {
	return {
		authenticatedData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
	}
}
export default connect(mapStateToProps, { })(ViewPromotionalOptionsViewMain);