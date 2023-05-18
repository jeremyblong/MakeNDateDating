import React, {useState, useRef, useCallback, Fragment} from 'react';
import { View, TouchableOpacity, Dimensions, ScrollView, useColorScheme, Image, Platform } from 'react-native';
import { BaseStyle, useTheme, Images, BaseColor } from '@config';
import { Header, SafeAreaView, Icon, Text, Button, ListThumbSquare, TextInput } from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import _ from "lodash";
import { BASE_URL } from "@env";
import axios from "axios";
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { requestPurchase, getAvailablePurchases, getProducts, flushFailedPurchasesCachedAsPendingAndroid, purchaseErrorListener, purchaseUpdatedListener } from 'react-native-iap';
import Toast from "react-native-toast-message";

// $10 purchase - 2334534537467192923858
// $10 worth of in-app TheMaker Token's
// You'll be purchasing $10 worth of in-app TheMaker token's to use throughout the application for things such as 'boosts', promotions of various sorts, priority msging, paying mentors and so much more!
// -----------------------------------------------------------------
// $14.99 purchase - 7837748858990039929209202983873747 - IOS => 783774885899003993475734758345837
// $14.99 worth of in-app TheMaker Token's
// You'll purchase $14.99 worth of in-app TheMaker token's to use throughout the application for things such as 'boosts', promotions of various sorts, priority msging, paying mentors and so much more!
// -----------------------------------------------------------------
// $24.99 purchase - 3737737372665125215424633744849599569606
// $24.99 worth of in-app TheMaker Token's
// You'll purchase $24.99 worth of in-app TheMaker token's to use throughout the application for things such as 'boosts', promotions of various sorts, priority msging, paying mentors and so much more!
// -----------------------------------------------------------------
// $49.99 purchase - 99969868574746563545263745788697790
// $49.99 worth of in-app TheMaker Token's
// You'll purchase $49.99 worth of in-app TheMaker token's to use throughout the application for things such as 'boosts', promotions of various sorts, priority msging, paying mentors and so much more!
// -----------------------------------------------------------------


const { width, height } = Dimensions.get("window");

const items = Platform.select({
  ios: [
    '2334534537467192923858',
    '783774885899003993475734758345837',
    '3737737372665125215424633744849599569606',
    '99969868574746563545263745788697790',
  ],
  android: [
    '2334534537467192923858',
    '7837748858990039929209202983873747',
    '3737737372665125215424633744849599569606',
    '99969868574746563545263745788697790',
  ],
});

console.log(Platform.OS === "ios" ? items : null)


const MyPaymentMethod = ({ authenticatedData}) => {
  
  const navigation = useNavigation();
  const {colors} = useTheme();
  const {t} = useTranslation();
  const colorSchemeDark = useColorScheme() === "dark" ? true : false;
  const purchaseUpdateSubscription = useRef(null);
  const purchaseErrorSubscription = useRef(null);

  const [ state, setState ] = useState({
    selectedCurrency: "MakeNDate Coin's",
    publicAddress: null,
    privateAddress: null,
    passphrase: null,
    ready: false,
    cards: [],
    publicKeyEntry: "",
    purchaseTokenCount: "",
    loading: false,
    coinCount: 0,
    products: [],
    user: null,
    showDialog: false,
    lastOrder: null
  });

  // console.log("purchaseUpdateSubscription", purchaseUpdateSubscription);
  // console.log("purchaseErrorSubscription", purchaseErrorSubscription);

  useFocusEffect(
    useCallback(async () => {

      if (Platform.OS === "android") {
        flushFailedPurchasesCachedAsPendingAndroid().catch((err) => {
          console.log("exception happend...", err);
        }).then(() => {
          purchaseUpdateSubscription.current = purchaseUpdatedListener(
            (purchase) => {
              console.log('purchaseUpdatedListener', purchase);
              const receipt = purchase.transactionReceipt;
              if (receipt && (receipt.orderId !== state.lastOrder)) {

                const { orderId } = receipt;

                setState(prevState => {
                  return { 
                    ...prevState,
                    lastOrder: orderId
                  }
                })
              }
            },
          );

          purchaseErrorSubscription.current = purchaseErrorListener(
            (error) => {
              console.warn('purchaseErrorListener', error);
            },
          );
        });
      }

      const products = await getProducts({ skus: items });

      console.log("products...: ", products);

      const config = {
        params: {
          uniqueId: authenticatedData.uniqueId,
          accountType: authenticatedData.accountType
        }
      };
  
      axios.get(`${BASE_URL}/gather/wallet/info`, config).then(async (res) => {
          if (res.data.message === "Gathered wallet information!") {
              console.log("Successfully gathered...", res.data);
  
              const { publicKey, coinCount, user, privateKey } = res.data;
  
              setState(prevState => {
                  return {
                      ...prevState,
                      publicAddress: publicKey,
                      privateKey,
                      coinCount,
                      ready: true,
                      user
                  }
              })
          } else {
              console.log("Err", res.data);
          }
      }).catch((err) => {
          console.log(err.message);
      })
  }, []));

  const purchaseAppStore = async (sku, tier) => {
    console.log("sku", sku);

    const purchases = await getAvailablePurchases()
    
    console.log('purchases', purchases)

    let result;

    try {
      if (Platform.OS == "ios") {
        result = await requestPurchase({
          sku,
          andDangerouslyFinishTransactionAutomaticallyIOS: false
        });
      } else {
        result = await requestPurchase({ skus: [sku] });
      }

      console.log("result", result);
      //////////////// MAKE PURCHASE HERE... ///////// ONLY RUNS ONCE.
      const calculateValue = () => {
        switch (tier) {
          case "tier-1":
            return 10;
            break;
          case "tier-2":
            return 15;
            break;
          case "tier-3":
            return 25;
            break;
          case "tier-4":
            return 50;
            break;
          default:
            break;
        }
      }
      if (result) {
        const config = {
            uniqueId: authenticatedData.uniqueId,
            accountType: authenticatedData.accountType,
            value: calculateValue()
        };

        setState(prevState => {
          return {
            ...prevState,
            loading: true
          }
        })

        axios.post(`${BASE_URL}/purchase/coins/crypto/conversion/custom`, config).then((res) => {
            if (res.data.message === "Successfully processed!") {
              console.log("Successfully uploaded key...", res.data);

              Toast.show({
                type: 'success',
                text1: `Successfully purchased tokens - please wait for data change.`,
                text2: "It may take a few moments for the new tokens/changes to be relected in your account.",
                visibilityTime: 2375,
                position: "bottom"
              });

              setState(prevState => {
                return {
                  ...prevState,
                  loading: false
                }
              })
          } else {
              console.log("Err", res.data);

              Toast.show({
                type: 'error',
                text1: `An error occurred processing your request.`,
                text2: "An error occurred - refunding your transaction.",
                visibilityTime: 2375,
                position: "bottom"
              });

              setState(prevState => {
                return {
                  ...prevState,
                  loading: false
                }
              })
          }
        }).catch((err) => {
          console.log(err.message);

          // Toast.show({
          //   type: 'error',
          //   text1: `An error occurred processing your request.`,
          //   text2: "An error occurred - refunding your transaction.",
          //   visibilityTime: 2375,
          //   position: "bottom"
          // });

          setState(prevState => {
            return {
              ...prevState,
              loading: false
            }
          })
        })
      }
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  const handlePurchase = (tier) => {

    switch (tier) {
      case "tier-1":
        purchaseAppStore(items[0], tier);
        break;
      case "tier-2":
        purchaseAppStore(items[1], tier);
        break;
      case "tier-3":
        purchaseAppStore(items[2], tier);
        break;
      case "tier-4":
        purchaseAppStore(items[3], tier);
        break;
      default:
        break;
    }
  }

  return (
    <View style={{flex: 1}}>
      <Spinner
        visible={state.loading}
        textContent={'Purchasing/Loading...'}
        textStyle={styles.spinnerTextStyle}
        overlayColor={"rgba(0, 0, 0, 0.725)"}
      />
      <Header
        title={"Purchase In-App Token's"}
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
          <ScrollView contentContainerStyle={{ paddingBottom: 75, flexGrow: 1 }} style={styles.contain}>
          <View style={styles.containAbout}>
            <TouchableOpacity onPress={() => {
              handlePurchase("tier-1");
            }} style={{ marginTop: 22.25 }}>
                <Image
                  source={require("../../assets/images/custom/coins.jpg")}
                  resizeMode={"cover"}
                  style={{ width: '100%', height: 135, borderWidth: 3, borderColor: "darkblue", backgroundColor: "#000", opacity: 0.15 }}
                />
                <View
                  style={[
                    styles.titleAbout,
                    {
                      flexDirection: 'row',
                      paddingHorizontal: 20,
                    },
                  ]}>
                  <Image source={require("../../assets/icons/packOfMoney.png")} style={{ width: 45, height: 45, maxHeight: 45, maxWidth: 45, left: 5 }} />
                  <View style={{marginLeft: 10}}>
                    <Text title3 bold blackColor>
                      Purchase $9.99 worth of coin's
                    </Text>
                    <Text footnote blackColor numberOfLines={4}>
                      Purchase the equivalent of $9.99 worth of MND tokens/coins to use in-app! These can be used for boosts and other in-app purchases such as sending priority messages or purchasing restricted content. 
                    </Text>
                  </View>
                </View>
            </TouchableOpacity>
            <View style={styles.customHr} />
            <TouchableOpacity onPress={() => {
              handlePurchase("tier-2");
            }} style={{ marginTop: 22.25 }}>
                <Image
                  source={require("../../assets/images/custom/coins.jpg")}
                  resizeMode={"cover"}
                  style={{ width: '100%', height: 135, borderWidth: 3, borderColor: "darkblue", backgroundColor: "#000", opacity: 0.15 }}
                />
                <View
                  style={[
                    styles.titleAbout,
                    {
                      flexDirection: 'row',
                      paddingHorizontal: 20,
                    },
                  ]}>
                  <Image source={require("../../assets/icons/packOfMoney.png")} style={{ width: 45, height: 45, maxHeight: 45, maxWidth: 45, left: 5 }} />
                  <View style={{marginLeft: 10}}>
                    <Text title3 bold style={{ color: "green" }}>
                      Purchase $14.99 worth of coin's
                    </Text>
                    <Text footnote blackColor numberOfLines={4}>
                      Purchase the equivalent of $14.99 worth of MND tokens/coins to use in-app! These can be used for boosts and other in-app purchases such as sending priority messages or purchasing restricted content. 
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.customHr} />
              <TouchableOpacity onPress={() => {
                handlePurchase("tier-3");
              }} style={{ marginTop: 22.25 }}>
                <Image
                  source={require("../../assets/images/custom/coins.jpg")}
                  resizeMode={"cover"}
                  style={{ width: '100%', height: 135, borderWidth: 3, borderColor: "darkblue", backgroundColor: "#000", opacity: 0.15 }}
                />
                <View
                  style={[
                    styles.titleAbout,
                    {
                      flexDirection: 'row',
                      paddingHorizontal: 20,
                    },
                  ]}>
                  <Image source={require("../../assets/icons/packOfMoney.png")} style={{ width: 45, height: 45, maxHeight: 45, maxWidth: 45, left: 5 }} />
                  <View style={{marginLeft: 10}}>
                    <Text title3 bold style={{ color: "blue" }}>
                      Purchase $24.99 worth of coin's
                    </Text>
                    <Text footnote blackColor numberOfLines={4}>
                      Purchase the equivalent of $24.99 worth of MND tokens/coins to use in-app! These can be used for boosts and other in-app purchases such as sending priority messages or purchasing restricted content. 
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.customHr} />
              <TouchableOpacity onPress={() => {
                handlePurchase("tier-4");
              }} style={{ marginTop: 22.25 }}>
                <Image
                  source={require("../../assets/images/custom/coins.jpg")}
                  resizeMode={"cover"}
                  style={{ width: '100%', height: 135, borderWidth: 3, borderColor: "darkblue", backgroundColor: "#000", opacity: 0.15 }}
                />
                <View
                  style={[
                    styles.titleAbout,
                    {
                      flexDirection: 'row',
                      paddingHorizontal: 20,
                    },
                  ]}>
                  <Image source={require("../../assets/icons/packOfMoney.png")} style={{ width: 45, height: 45, maxHeight: 45, maxWidth: 45, left: 5 }} />
                  <View style={{marginLeft: 10}}>
                    <Text title3 bold style={{ color: "darkred" }}>
                      Purchase $49.99 worth of coin's
                    </Text>
                    <Text footnote blackColor semiBold numberOfLines={4}>
                      Purchase the equivalent of $49.99 worth of MND tokens/coins to use in-app! These can be used for boosts and other in-app purchases such as sending priority messages or purchasing restricted content. 
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
        </ScrollView>
        {/* <View style={{padding: 5 }}>
          <Button
            full
            style={{ backgroundColor: colors.primary }}
            onPress={() => purchaseTokensPaneRef.current.open()}>
            {"Purchase In-App Token(s)/Currency"}
          </Button>
        </View> */}
        {/* <View style={{padding: 5 }}>
          <Button
            full
            style={colorSchemeDark ? { backgroundColor: "darkgreen" } : { backgroundColor: "#000" }}
            onPress={() => navigation.navigate('AddPayment')}>
            {t('add_payment_method')}
          </Button>
        </View> */}
        <View style={styles.hr} />
        <View style={{ margin: 7.25 }}>
          <Button
            full
            style={{ backgroundColor: colors.accent }}
            onPress={() => navigation.navigate("PaymentMethodHomepage")}> {/* PaymentMethodDetail ---- navigation.navigate("PaymentMethodHomepage") */}
            {"View/Manage Your Cards (Payouts)"}
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
export default connect(mapStateToProps, { })(MyPaymentMethod);