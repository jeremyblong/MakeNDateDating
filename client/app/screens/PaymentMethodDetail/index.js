import React, { Fragment, useState, useCallback } from 'react';
import {View, Switch, Image} from 'react-native';
import { BaseStyle, useTheme, BaseColor } from '@config';
import {Header, SafeAreaView, Icon, Text, Button, TextInput } from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { BASE_URL, APPROX_VALUE_PER_COIN } from "@env";
import { connect } from "react-redux";
import _ from "lodash";
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import Dialog from "react-native-dialog";
                
const PaymentMethodDetail = (props) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const navigation = useNavigation();

  const authData = props.authData;
  const [primary, setPrimary] = useState(false);
  const [ state, setState ] = useState({
    depositAmount: 0,
    showConfirmation: false,
    cardDetails: props.route.params.cardDetails
  });

  useFocusEffect(
    useCallback(async () => {
      console.log("process.env.NODE_ENV", process.env.NODE_ENV);
      
      const config = {
        params: {
          uniqueId: authData.uniqueId,
          accountType: authData.accountType,
          returnTokens: true
        }
      }
  
      axios.get(`${BASE_URL}/gather/user/profile`, config).then((res) => {
          if (res.data.message === "Successfully gathered profile!") {
              console.log("Successfully gathered profile!", res.data);
  
              const { tokenCount } = res.data;
  
              setState(prevState => {
                return {
                  ...prevState,
                  depositAmount: tokenCount
                }
              })
          } else {
              console.log("Err", res.data);
          }
      }).catch((err) => {
          console.log(err.message);
      })
  }, []));

  const toggleSwitch = value => {

    if (value === true) {
      const configuration = {
        uniqueId: authData.uniqueId, 
        accountType: authData.accountType, 
        cardID: state.cardDetails.id
      };
      
      axios.post(`${BASE_URL}/change/primary/card/stripe/account/payment`, configuration).then((res) => {
          if (res.data.message === "Successfully updated primary payout method!") {
              console.log("Successfully updated primary payout method!", res.data);

              setPrimary(true);

              Toast.show({
                type: 'success',
                text1: `Successfully changed your primary payout method!`,
                text2: `We've successfully saved and updated your payment related settings/data & changed your payout primary method...`,
                visibilityTime: 3250,
                position: "bottom",
                onHide: () => {
                  setPrimary(true);

                  setState(prevState => {
                    return {
                      ...prevState,
                      cardDetails: {
                        ...prevState.cardDetails,
                        default_for_currency: true
                      }
                    }
                  })
                }
              });
          } else {
              console.log("Err", res.data);

              Toast.show({
                type: 'error',
                text1: `An unknown error has occurred!`,
                text2: `We've encountered an error while processing the request - please try this action again or contact support if the problem persists...`,
                visibilityTime: 3250,
                position: "bottom"
              });
          }
      }).catch((err) => {
          console.log(err.message);

          // Toast.show({
          //   type: 'error',
          //   text1: `An unknown error has occurred!`,
          //   text2: `We've encountered an error while processing the request - please try this action again or contact support if the problem persists...`,
          //   visibilityTime: 3250,
          //   position: "bottom"
          // });
      })
    }
  };

  const onDeletePayment = () => {

    const config = {
      uniqueId: authData.uniqueId, 
      accountType: authData.accountType, 
      cardID: state.cardDetails.id
    }

    axios.post(`${BASE_URL}/delete/card/payment/method/payout`, config).then((res) => {
        if (res.data.message === "Successfully deleted the desired card!") {
          console.log("Successfully deleted the desired card!", res);

          Toast.show({
            type: 'success',
            text1: `Successfully deleted the desired card!`,
            text2: "We've successfully removed this card from your account...",
            visibilityTime: 3750,
            position: "bottom",
            onHide: () => {
              navigation.replace("BottomTabNavigator", { screen: "Profile" });
            }
          });
          
        } else if (res.data.message === "You cannot delete your primary payment method - please switch payment/payout method then try again.") {

          Toast.show({
            type: 'error',
            text1: `You can't delete your primary payout/payment method!`,
            text2: res.data.message,
            visibilityTime: 3500,
            position: "bottom",
            onHide: () => {}
          });
        } else {
          console.log("Err", res.data);

          Toast.show({
            type: 'error',
            text1: `An unknown error has occurred!`,
            text2: "We've encountered an unexpected error - please try again or contact support if the problem persists...",
            visibilityTime: 3500,
            position: "bottom"
          });
        }
    }).catch((err) => {
        console.log(err.message);

        // Toast.show({
        //   type: 'error',
        //   text1: `An unknown error has occurred!`,
        //   text2: "We've encountered an unexpected error - please try again or contact support if the problem persists...",
        //   visibilityTime: 3500,
        //   position: "bottom"
        // });
    })
  };

  const cashoutTokens = () => {
    console.log("cashoutTokens clicked/ran...");

    const config = {
      uniqueId: authData.uniqueId, 
      accountType: authData.accountType, 
      cardID: state.cardDetails.id,
      amount: Math.floor(state.depositAmount * APPROX_VALUE_PER_COIN),
      tokenCount: state.depositAmount
    }

    axios.post(`${BASE_URL}/cashout/funds/card/stripe`, config).then((res) => {
        if (res.data.message === "Successfully cashed out to the desired card!") {
          console.log("Successfully cashed out to the desired card!", res);

          Toast.show({
            type: 'success',
            text1: `Successfully cashed out your funds to your debit card!`,
            text2: "We've successfully sent the funds to your selected debit card - be on the lookout for the deposit!",
            visibilityTime: 3500,
            position: "bottom"
          });
          
        } else {
          console.log("Err", res.data);

          Toast.show({
            type: 'error',
            text1: `An unknown error has occurred!`,
            text2: "We've encountered an unexpected error - please try again or contact support if the problem persists...",
            visibilityTime: 3500,
            position: "bottom"
          });
        }
    }).catch((err) => {
        console.log(err.message);

        // Toast.show({
        //   type: 'error',
        //   text1: `An unknown error has occurred!`,
        //   text2: "We've encountered an unexpected error - please try again or contact support if the problem persists...",
        //   visibilityTime: 3500,
        //   position: "bottom"
        // });
    })
  }

  const calculateDisabledTokens = () => {
    if (typeof state.depositAmount !== "undefined" && state.depositAmount.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  const renderCardIconImage = (brand) => {
    switch (brand) {
        case "Discover":
            return <Image source={require("../../assets/icons/card-icons/discover.png")} style={styles.cardIcon} />
            break;
        case "AmEx":
            return <Image source={require("../../assets/icons/card-icons/american.png")} style={styles.cardIcon} />
            break;
        case "DinersClub":
            return <Image source={require("../../assets/icons/card-icons/diners.png")} style={styles.cardIcon} />
            break;
        case "Visa":
            return <Image source={require("../../assets/icons/card-icons/visa.png")} style={styles.cardIcon} />
            break;
        case "JCB":
            return <Image source={require("../../assets/icons/card-icons/jcb.png")} style={styles.cardIcon} />
            break;
        case "MasterCard":
            return <Image source={require("../../assets/icons/card-icons/mastercard.png")} style={styles.cardIcon} />
            break;
        default:
            return <Text style={{ fontSize: 13.25, fontWeight: "400", textAlign: "center", textDecorationLine: "underline", color: colors.accent }}>N/A</Text>
        break;
    }
  }

  const renderMainContent = () => {
    if (state.cardDetails.default_for_currency === true) {
       return (
        <Fragment>
          <View style={styles.hr} />
          <Text style={styles.label}>Select how many token's you'd like to cash-out/withdrawl</Text>
          <TextInput
            onChangeText={(value) => setState(prevState => {
                return {
                    ...prevState,
                    depositAmount: value.replace(/[^0-9]/g, '')
                }
            })}
            maxLength={9}
            keyboardType={"number-pad"}
            placeholder="Enter the amount of tokens you wish to withdrawl"
            value={state.depositAmount}
          />
          <View style={styles.hr} />
          <Text style={[styles.tokenValue, { color: colors.accent }]}>{typeof state.depositAmount !== "undefined" && state.depositAmount !== 0 ? state.depositAmount : "N/A - Loading..."} token(s) - Equivalent to: <Text style={{ color: "green", fontWeight: "bold", textDecorationLine: "underline" }}>${(state.depositAmount * APPROX_VALUE_PER_COIN).toFixed(2)} USD</Text></Text>
          <View style={styles.hr} />
          <Button disabled={calculateDisabledTokens()} outline styleText={calculateDisabledTokens() ? { color: "lightgrey" } : { color: colors.accent }} style={calculateDisabledTokens() ? { borderWidth: 1.25, borderColor: "lightgrey" } : { borderWidth: 1.25, borderColor: colors.accent }} onPress={() => setState(prevState => {
            return {
              ...prevState,
              showConfirmation: true
            }
          })}>
            {"Submit/Cash-Out"}
          </Button>
        </Fragment>
       );
    } else {
      return <Text style={[styles.warningTxt, { color: colors.accent }]}>You can ONLY cashout to your 'primary' debit card - please change this card to your primary card or go to your other card and cashout to that card instead...</Text>
    }
  }
  const renderMore = () => {
    if (state.cardDetails.default_for_currency === false) {
      return (
        <Fragment>
          <Text body2>{t('set_as_primary')}</Text>
            <Switch
              name="angle-right"
              size={18}
              onValueChange={toggleSwitch}
              value={primary}
            />
        </Fragment>
      );
    }
  }

  return (
    <View style={{flex: 1}}>
      <Header
        title={"Card Detail(s)"}
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
      <Dialog.Container visible={state.showConfirmation}>
        <Dialog.Title>Please confirm that you'd like to cashout these tokens...</Dialog.Title>
          <Dialog.Description>
             Are you sure you'd like to cashout these tokens? This action is permanent and cannot be undone - transfers sometimes take some time so please wait and be patient while the transfer completes..
          </Dialog.Description>
          <Dialog.Button onPress={() => setState(prevState => {
            return {
              ...prevState,
              showConfirmation: false
            }
          })} style={{ color: "darkred" }} label="Cancel." />
          <Dialog.Button onPress={() => {
            setState(prevState => {
              return {
                ...prevState,
                showConfirmation: false
              }
            })
            cashoutTokens();
          }} style={{ color: "green" }} label="Cashout!" />
      </Dialog.Container>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <View style={{flex: 1, padding: 20}}>
          <View
            style={[
              styles.card,
              {backgroundColor: colors.card, borderColor: colors.border},
            ]}>
            {renderCardIconImage(state.cardDetails.brand)}
            <Text body1 style={{marginTop: 10}}>
              **** **** **** {state.cardDetails.last4}
            </Text>
            <Text footnote grayColor style={{marginTop: 4}}>
              Expires {state.cardDetails.exp_month}/{state.cardDetails.exp_year}
            </Text>
            <View style={{alignItems: 'flex-end'}}>
              <Text footnote primaryColor style={{marginTop: 15}}>
                {state.cardDetails.default_for_currency === true ? "Primary Card" : ""}
              </Text>
            </View>
          </View>
          <View style={[styles.checkDefault, {borderTopColor: colors.border}]}>
            {renderMore()}
          </View>
          {renderMainContent()}
          </View>
        <View style={{margin: 20}}>
          <Button outline onPress={() => onDeletePayment()}>
            {t('delete')}
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
export default connect(mapStateToProps, {  })(PaymentMethodDetail);