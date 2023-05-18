import React, { useState, useEffect } from 'react';
import { connect} from 'react-redux';
import {
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, TextInput, Image} from '@components';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { BASE_URL, COMET_CHAT_AUTH_KEY } from "@env";
import axios from "axios";
import { authentication, saveAuthenticationDetails } from '../../actions/auth.js';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { Switch } from 'react-native-switch';
import { getUniqueId, getManufacturer, getBrand, getBuildNumber, getBundleId, getCarrier, getDeviceId, getDeviceType, getDeviceName, getIpAddress, getMacAddress, getModel, getReadableVersion,getSystemVersion, getSystemName, getUserAgent, isTablet } from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';            
import Geolocation from '@react-native-community/geolocation';
import _ from "lodash";
import { PERMISSIONS, request } from 'react-native-permissions';
import Spinner from 'react-native-loading-spinner-overlay';

const SignIn = ({navigation, authentication, userData, saveAuthenticationDetails}) => {
  const {colors, theme} = useTheme();
  const colorSchemeDark = theme.dark;

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [ state, setState ] = useState({
    email: "",
    password: "",
    loading: false,
    mentorshipAccount: false,
    loadingSignin: false
  });
  
  const validateEmail = (email) => {
    let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (reg.test(email) === false) {
      console.log("Email is Not Correct");
      return false;
    } else {
      console.log("Email is Correct");
      return true;
    }
  };


  const checkToken = async (uniqueId) => {
    const fcmToken = await messaging().getToken();

    console.log("userData.uniqueId", uniqueId);
    
    if (fcmToken) {
      axios.post(`${BASE_URL}/register/fcm/token`, {
        fcmToken,
        uniqueId,
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

  const requestAppropriatePermissions = async () => {

    if (Platform.OS === "ios") {
      const permission = PERMISSIONS.IOS.LOCATION_ALWAYS;

      request(permission).then((result) => {
        console.log("result", result);
      });
    } else {

      const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
    
      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) {
        return "granted";
      } else {
        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
      }
    }
  }

  useEffect(async () => {
    const permissCheck = await requestAppropriatePermissions();

    console.log("permissCheck", permissCheck);

    if (Platform.OS === "ios") {
      console.log("ios check/ran...");
    } else {
      if ((permissCheck === 'limited') || (permissCheck === 'granted') || (permissCheck === 'approved')) {
        console.log("approved");
      } else {
        Toast.show({
          type: 'info',
          text1: 'You MUST enable geo-location services...',
          text2: "If you want to authenticate, you MUST enable geo-location abilities!",
          visibilityTime: 3250,
          position: "bottom"
        });
      }
    }
  }, [])

  const onLogin = async () => {

    const deviceInfo = await handleDeviceInformationFetch();

    const { password, email, mentorshipAccount } = state;

    setState(prevState => {
      return {
        ...prevState,
        loadingSignin: true
      }
    })

    if (mentorshipAccount === true) {

      const config = {
        password,
        email,
        deviceInfo
      }
  
      axios.post(`${BASE_URL}/login/authenticate/mentorship`, config).then((res) => {
          if (res.data.message === "Successfully authenticated!") {
              console.log("Successfully authenticated!", res.data);
              
              const { user } = res.data;

              Geolocation.getCurrentPosition(info => {

                const { latitude, longitude } = info.coords;
        
                console.log("latitude, longitude", latitude, longitude);
            
                const currentLoc = { latitude, longitude };
        
                const configurationCustom = {
                  location: currentLoc,
                  userID: user.uniqueId
                };
        
                axios.post(`${BASE_URL}/update/partially/randomize/user/public/location`, configurationCustom).then((innerResponse) => {
                  // fcm token update
                  checkToken(user.uniqueId);

                  const uid = user.uniqueId;

                  console.log("COMET_CHAT_AUTH_KEY", COMET_CHAT_AUTH_KEY);
      
                  CometChat.login(uid, COMET_CHAT_AUTH_KEY).then((chatUser) => {

                    setState(prevState => {
                      return {
                        ...prevState,
                        loadingSignin: false
                      }
                    })

                    console.log('Login Successful:', { chatUser });
      
                    saveAuthenticationDetails({...user, success: true});
      
                    navigation.replace("BottomTabNavigator", { screen: "Home" });
                  }, (error) => {
                      console.log('Login failed with exception:', { error });

                      Toast.show({
                        type: 'error',
                        text1: 'Could not sign-in, problem with signing in w/chat login...',
                        text2: "We've encountered a problem while authenticating with your chat related logic.",
                        visibilityTime: 4250,
                        position: "bottom"
                      });

                      setState(prevState => {
                        return {
                          ...prevState,
                          loadingSignin: false
                        }
                      })
                  });
                }).catch((errrrrrrrrrrrrrrr) => {
                    console.log("errrrrrrrrrrrrrrr", errrrrrrrrrrrrrrr);

                    setState(prevState => {
                      return {
                        ...prevState,
                        loadingSignin: false
                      }
                    })
                })
    
              }, (errrrrrrrrr) => {
                  console.log("errrrrrrrrrrrrr geoloc :", errrrrrrrrr);

                  setState(prevState => {
                    return {
                      ...prevState,
                      loadingSignin: false
                    }
                  })
              });
          } else {
              console.log("Err", res.data);

              setState(prevState => {
                return {
                  ...prevState,
                  loadingSignin: false
                }
              })

              Toast.show({
                type: 'error',
                text1: 'Could NOT authenticate your account...',
                text2: res.data.message,
                visibilityTime: 4250,
                position: "bottom"
              });
          }
      }).catch((err) => {
          console.log(err.message);

          setState(prevState => {
            return {
              ...prevState,
              loadingSignin: false
            }
          })
      })
    } else {

      console.log("deviceInfo", deviceInfo, password, email);

      const config = {
        password,
        email,
        deviceInfo
      } 
  
      axios.post(`${BASE_URL}/login/authenticate`, config).then((res) => {
        if (res.data.message === "Successfully authenticated!") {
          console.log("Successfully authenticated!", res.data);
          
          const { user, } = res.data;

          const uid = user.uniqueId;

          Geolocation.getCurrentPosition(info => {

            const { latitude, longitude } = info.coords;
    
            console.log("latitude, longitude", latitude, longitude);
            // 
            const currentLoc = { latitude, longitude };
    
            const configurationCustom = {
              location: currentLoc,
              userID: user.uniqueId
            };
    
            axios.post(`${BASE_URL}/update/partially/randomize/user/public/location`, configurationCustom).then((innerResponse) => {
              // 
              checkToken(user.uniqueId);
  
              console.log("COMET_CHAT_AUTH_KEY", COMET_CHAT_AUTH_KEY);

              CometChat.login(uid, COMET_CHAT_AUTH_KEY).then((chatUser) => {
                console.log('Login Successful ---------------- :', { chatUser });

                setState(prevState => {
                  return {
                    ...prevState,
                    loadingSignin: false
                  }
                })
  
                saveAuthenticationDetails({...user, success: true});
  
                navigation.replace("BottomTabNavigator", { screen: "Home" })
              }, (error) => {

                Toast.show({
                  type: 'error',
                  text1: 'Could not sign-in, problem with signing in w/chat login...',
                  text2: "We've encountered a problem while authenticating with your chat related logic.",
                  visibilityTime: 4250,
                  position: "bottom"
                });

                setState(prevState => {
                  return {
                    ...prevState,
                    loadingSignin: false
                  }
                })

                console.log('Login failed with exception:', { error });
              });
            }).catch((errrrrrrrrrrrrrrr) => {
                console.log("errrrrrrrrrrrrrrr", errrrrrrrrrrrrrrr);

                setState(prevState => {
                  return {
                    ...prevState,
                    loadingSignin: false
                  }
                })
            })

          }, (errrrrrrrrr) => {
              console.log("errrrrrrrrrrrrr geoloc :", errrrrrrrrr);

              setState(prevState => {
                return {
                  ...prevState,
                  loadingSignin: false
                }
              })
          });
        } else {
          console.log("Err", res.data);

          setState(prevState => {
            return {
              ...prevState,
              loadingSignin: false
            }
          })

          Toast.show({
            type: 'error',
            text1: 'Could NOT authenticate your account...',
            text2: res.data.message,
            visibilityTime: 4250,
            position: "bottom"
          });
        }
      }).catch((err) => {
          console.log(err.message);

          setState(prevState => {
            return {
              ...prevState,
              loadingSignin: false
            }
          })
      })
    }
  };

  const handleDeviceInformationFetch = () => {

    const brand = getBrand(); 
    const buildNumber = getBuildNumber();
    const bundleID = getBundleId();
    const deviceID = getDeviceId();
    const deviceType = getDeviceType();
    const deviceModel = getModel();
    const readableVersion = getReadableVersion();
    const systemVersion = getSystemVersion(); 
    const systemName = getSystemName();
    const tabletOrNot = isTablet();

    const promises = [];

    promises.push(getUniqueId().then(value => {
        return {
            label: "deviceUniqueId",
            value
        }
    }));
    promises.push(getManufacturer().then(value => {
        return {
            label: "manufacturer",
            value
        }
    }));
    promises.push(getCarrier().then(value => {
        return {
            label: "carrier",
            value
        }
    }));
    promises.push(getDeviceName().then(value => {
        return {
            label: "deviceName",
            value
        }
    }));
    promises.push(getIpAddress().then(value => {
        return {
            label: "ipAddress",
            value
        }
    }));
    promises.push(getMacAddress().then(value => {
        return {
            label: "macAddress",
            value
        }
    }));
    promises.push(getUserAgent().then(value => {
        return {
            label: "userAgent",
            value
        }
    }));

    return Promise.all(promises).then((deviceValues) => {
        const newOBJFormatted = {};
        // iterate over available values...
        for (let idxxxx = 0; idxxxx < deviceValues.length; idxxxx++) {
            const element = deviceValues[idxxxx];
            
            newOBJFormatted[element.label] = element.value;
            // check for last iteration + return...
            if ((deviceValues.length - 1) === idxxxx) {
                // contruct the returnable object!
                const valuesToReturn = {
                    brand,
                    buildNumber,
                    bundleID,
                    deviceID, 
                    deviceType,
                    deviceModel, 
                    readableVersion, 
                    systemVersion,
                    systemName,
                    tabletOrNot,
                    ...newOBJFormatted
                };
                // return final value(s)...
                return valuesToReturn;
            }
        }
    });
  } 

  const calculateDisabled = () => {
    const { email, password } = state;
    
    if ((typeof email !== "undefined" && email.length > 0) && (validateEmail(email)) && (typeof password !== "undefined" && password.length > 0)) {
      return false;
    } else {
      return true;
    }
  }
  const showAlert = () => {
    Toast.show({
        type: 'info',
        text1: 'You must complete the appropriate data before continuing...',
        text2: 'Please make sure you complete BOTH the email & the password fields before proceeeding.',
        visibilityTime: 4250,
        position: "bottom"
    });
  }
  return (
    <View style={{flex: 1}}>
      <Header
        title={"Sign In"}
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
        <KeyboardAwareScrollView 
          keyboardShouldPersistTaps='always' 
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 50, paddingTop: 100 }}
        >
          <Spinner
              visible={state.loadingSignin}
              textContent={'Signing in, please wait...'}
              textStyle={styles.spinnerTextStyle}
              overlayColor={"rgba(0, 0, 0, 0.725)"}
          />
          <View style={styles.contain}>
            <Image source={require("../../assets/images/custom/space.png")} style={styles.loginIllustration} />
            <TextInput
              onChangeText={text => {
                setState(prevState => {
                  return {
                    ...prevState,
                    email: text
                  }
                })
              }}
              placeholder={'Enter your email address'}
              value={state.email}
            />
            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => {
                setState(prevState => {
                  return {
                    ...prevState,
                    password: text
                  }
                })
              }}
              name="password"
              placeholder={'Password...'}
              secureTextEntry={true}
              value={state.password}
            /> 
            <View style={{ marginVertical: 17.25 }}>
              <Switch
                value={state.mentorshipAccount}
                onValueChange={(val) => setState(prevState => {
                  return {
                    ...prevState,
                    mentorshipAccount: !prevState.mentorshipAccount
                  }
                })}
                disabled={false}
                activeText={'Mentorship User'}
                inActiveText={'Standard User'}
                circleSize={35}
                barHeight={25}
                circleBorderWidth={3}
                backgroundActive={"#000"}
                backgroundInactive={'gray'}
                circleActiveColor={"green"}
                circleInActiveColor={colors.primary}
                changeValueImmediately={true}
                innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                outerCircleStyle={{}}
                renderActiveText={true}
                renderInActiveText={true}
                switchLeftPx={2}
                switchRightPx={2}
                switchWidthMultiplier={4.25}
                switchBorderRadius={30}
              />
            </View>
            <Button
              style={calculateDisabled() ? [styles.disabledButton, { borderColor: "#fff" }] : { marginTop: 10 }}
              full
              loading={state.loading}
              onPress={() => calculateDisabled() ? showAlert() : onLogin()}
            >
              {"Sign in"}
            </Button>
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}>
              <Text body1 style={{ color: colors.accent, marginTop: 25 }}>
                {'Forgot Your Password'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
}

const mapStateToProps = (state) => {
	return {
    userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
  }
}
export default connect(mapStateToProps, { authentication, saveAuthenticationDetails })(SignIn);