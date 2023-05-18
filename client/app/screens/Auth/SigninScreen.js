import React, { Component, Fragment, useState, useRef, useEffect } from "react";
import {
    Text,
    SafeAreaView,
    View,
    StatusBar,
    Image,
    TouchableOpacity,
    BackHandler,
    TextInput,
    ScrollView,
    ImageBackground
} from "react-native";
import { withNavigation } from "react-navigation";
import { Fonts, Colors, Sizes } from "../../constants/styles";
import IntlPhoneInput from 'react-native-intl-phone-input';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import SvgComponentAuth from "./helpers/signinScreen/logoSvg.js";
import { BASE_URL, COMET_CHAT_AUTH_KEY } from "@env";
import Toast from 'react-native-toast-message';
import axios from "axios";
import { useDispatch, connect } from "react-redux";
import { authentication } from "../../redux/actions/authentication/auth.js";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/base";
import styles from "./signinScreenStyles.js";
import _ from "lodash";
import Geolocation from '@react-native-community/geolocation';
import { getUniqueId, getManufacturer, getBrand, getBuildNumber, getBundleId, getCarrier, getDeviceId, getDeviceType, getDeviceName, getIpAddress, getMacAddress, getModel, getReadableVersion,getSystemVersion, getSystemName, getUserAgent, isTablet } from 'react-native-device-info';
import { CometChat } from '@cometchat-pro/react-native-chat';
import messaging from '@react-native-firebase/messaging';

GoogleSignin.configure({
  webClientId: "137910212655-tpo3qj5s3g15ajps6tf7nnj0s9r20hbp.apps.googleusercontent.com"
});

class SignInScreen extends Component {
constructor (props) {
    super(props);
    
}

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        BackHandler.exitApp();
        return true;
    };

    render() {
        return (
            <Signin userData={this.props.userData} navigation={this.props.navigation} />
        )
    }
}

const Signin = (props) => {

    console.log("props", props);

    const navigation = useNavigation();

    let textInputPassword = useRef(null);

    const dispatch = useDispatch();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [ data, setData ] = useState(null);
    const [ password, setPassword ] = useState("");
    const [ passwordVisibility, setPasswordVisibility ] = useState(true);

    const customTimerPromiseCheckAuthenticated = (limit, maxedTime) => {

        let i = 0;
        // check readiness function helper
        const checkReadyYet = () => {
            console.log("props.userData checkReadyYet function: ... --- :", props.userData);

            if (_.has(props.userData, "authenticated") && props.userData.authenticated === true && Object.keys(props.userData).length > 0) {
                // navigate to appropriate page
                return true;
            } else {
                // not ready YET...
                return false;
            }
        };

        return new Promise((resolve) => {
            // create interval and/or timer count start
            let intervalCustomized = setInterval(() => {
                // log iteration data
                console.log(i, checkReadyYet());
                // check if ready
                if (checkReadyYet() === true) {
                    // clear timer interval
                    clearInterval(intervalCustomized);
                    // resolve pending promise
                    resolve(true);
                } else if (i === maxedTime) {
                    // clear timer interval
                    clearInterval(intervalCustomized);
                    // log change for appropriate monitoring
                    console.log("time ran out and/or expired - no data/match found for 'auth' data.");
                    // resolve negative
                    resolve(false);
                }
                i++;
            }, limit);

        }).then((passedValue) => {
            console.log("passedValue", passedValue);

            if (passedValue === true) {
                // navigate to appropriate page upon authentication recognization
                navigation.navigate('BottomTabScreen', { index: 1 });
            } else {
                navigation.navigate('SignIn');
            }
        });
    }

    useEffect(() => {
        customTimerPromiseCheckAuthenticated(1000, 5);
    }, []);

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            
            const userInfo = await GoogleSignin.signIn();

            setData({
                oauthData: userInfo,
                oauth: true
            });
        
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.log("user cancelled the login flow", error);
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                console.log("operation (e.g. sign in) is in progress already", error);
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                console.log("play services not available or outdated", error);
            } else {
                // some other error happened
                console.log("Unknown error has occurred...", error.code);

                if (Number(error.code) === 12502) {
                    const userInfo = await GoogleSignin.signInSilently();

                    setData({
                        oauthData: userInfo,
                        oauth: true
                    });
                }
            }
        }
    };

    const renderPasswordSignin = () => {
        return (
            <Fragment>
                <View style={styles.customTextInputWrapper}>
                    <TextInput
                        style={styles.customTextInput}
                        ref={textInputPassword}
                        secureTextEntry={passwordVisibility}
                        placeholder={"Password (Min. 9 Charecters required)"}
                        onChangeText={(value) => {
                            setPassword(value)
                        }}
                    />
                    <TouchableOpacity hitSlop={75} onPress={() => setPasswordVisibility(prevState => !prevState)}>
                        <Image style={styles.searchIcon} source={require("../../assets/images/icon/eye-filled.png")} />
                    </TouchableOpacity>
                </View>
            </Fragment>
        );
    }

    const phoneNumberTextField = () => {
        return (
            <IntlPhoneInput
                onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber.unmaskedPhoneNumber)}
                defaultCountry="US"
                placeholder="Phone Number"
                containerStyle={styles.phoneNumberContainerStyle}
                dialCodeTextStyle={{ ...Fonts.black16Medium }}
                phoneInputStyle={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0, ...Fonts.black16Medium }}
            />
        )
    }
    const checkPhoneNumberValid = () => {
        if (phoneNumber.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)) {
            return true;
        } else {
            return false;
        }
    }
    const calculateDisabled = () => {
        if (checkPhoneNumberValid(phoneNumber) && (typeof password !== "undefined" && password.length >= 9) && typeof props.userData !== "undefined" && props.userData.authenticated !== true) {
            return false;
        } else {
            return true;
        }
    }

    const handleDBUpdateLocationOnly = (location, uniqueId) => {
        console.log("handleDBUpdateLocationOnly running/ran...!", uniqueId, location);

        const config = {
            location,
            userID: uniqueId
        };

        axios.post(`${BASE_URL}/update/partially/randomize/user/public/location`, config).then((res) => {
            
            const { updated, message } = res.data;

            if (updated === true && message === "Successfully updated user's current approx location!") {

                console.log("ressssssss location (current) data:", res.data);
            } else {
                console.log("err", res.data);
            }
        }).catch((err) => {
            console.log("err", err);
        })
    }

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

    const getFCMToken = (user) => {
        return new Promise(async (resolve, reject) => {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log("Your Firebase Token is:", fcmToken);
                
                axios.post(`${BASE_URL}/save/firebase/token`, {
                    token: fcmToken,
                    uniqueId: user.uniqueId
                }).then((res) => {
                    if (res.data.message === "Saved firebase token!") {
                        console.log(res.data);

                        resolve(true);
                    } else {
                        console.log("err", res.data);

                        resolve(false);
                    }
                }).catch((err) => {
                    console.log(err.message);

                    resolve(false);
                })
            } else {
              console.log("Failed", "No token received");

              resolve(false);
            }
        })    
    }

    const handleAuthenticationNormal = async () => {
        
        const deviceInfo = await handleDeviceInformationFetch();

        const config = {
            phoneNumber,
            password,
            deviceInfo
        }
        axios.post(`${BASE_URL}/login`, config).then((res) => {
            if (res.data.message === "Successfully authenticated!") {
                console.log(res.data);

                const { user } = res.data;

                return getFCMToken(user).then((succeeded) => {
                    if (succeeded === true) {

                        const addition = {
                            ...user, authenticated: true
                        }
                        dispatch(authentication(addition));
        
                        Geolocation.getCurrentPosition(info => {
                            console.log("Gathered information correctly - geo: ", info);
        
                            const locationObj = { latitude: info.coords.latitude, longitude: info.coords.longitude, latitudeDelta: 5, longitudeDelta: 5 };
        
                            handleDBUpdateLocationOnly(locationObj, user.uniqueId);
        
                            const authKey = COMET_CHAT_AUTH_KEY;
                            const uid = user.uniqueId; //
        
                            CometChat.login(uid, authKey).then((user) => {
                                console.log('Login Successful:', { user });
        
                                setPhoneNumber("");
                                setPassword("");
                                
        
                                setTimeout(() => {
                                    navigation.navigate('BottomTabScreen', { index: 1 });
                                }, 750);
                            }, (error) => {
                                console.log('Login failed with exception:', { error });
                            });

                            // setPhoneNumber("");
                            // setPassword("");
                            
    
                            // setTimeout(() => {
                            //     navigation.navigate('BottomTabScreen', { index: 1 });
                            // }, 750);
                        });
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: `Successfully authenticated BUT could NOT retreieve your firebase token...`,
                            text2: `We've successfully found/authenticated your account but you've either not enabled firebase notifications or we could not find the appropriate data so NO ACTION WAS TAKEN.`,
                            visibilityTime: 4250,
                            position: "bottom"
                        });
                    }
                })
            } else {
                console.log("Err", res.data);

                const { message } = res.data;

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while attempting to authenticate your account...`,
                    text2: message,
                    visibilityTime: 4250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);

            Toast.show({
                type: 'error',
                text1: `An error occurred while attempting to authenticate your account...`,
                text2: `An unknown error has occurred while authenticating your request - we are unable to pinpoint the exact nature of this error. Try again or contact support...`,
                visibilityTime: 4250,
                position: "bottom"
            });
        })
    }
    const continueButton = () => {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                disabled={calculateDisabled()}
                onPress={() => handleAuthenticationNormal()}
                style={calculateDisabled() ? styles.continueButtonStyleDisabled :styles.continueButtonStyle}>
                <Text style={calculateDisabled() ? { ...Fonts.white16SemiBold, color: "black" } : {...Fonts.white16SemiBold}}>Continue</Text>
            </TouchableOpacity>
        )
    }

    const initUser = (token) => {
        fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token).then((response) => response.json()).then((json) => {

          let user = {};

          user.name = json.name;
          user.id = json.id;
          user.user_friends = json.friends;
          user.email = json.email;
          user.username = json.name;
          user.loading = false;
          user.loggedIn = true;
          user.avatar = json.id;
          
          setData(user);
        })
        .catch(() => {
          reject('ERROR GETTING DATA FROM FACEBOOK')
        })
    }

    const loginWithFacebook = () => {
        // Attempt a login using the Facebook login dialog asking for default permissions.
        LoginManager.logInWithPermissions(["public_profile"]).then((result) => {
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    console.log("Login success with permissions: ", result.grantedPermissions.toString());

                    AccessToken.getCurrentAccessToken().then((data) => {
                        const { accessToken } = data;

                        initUser(accessToken)
                    })
                }
            }, (error) => {
                console.log("Login fail with error: " + error);
            }
        );
    }

    const loginWithFacebookButton = () => {

        if (typeof props.userData !== "undefined" && props.userData.authenticated !== true) {
            return (
                <View>
                    <TouchableOpacity onPress={loginWithFacebook} style={styles.loginWithFacebookButtonStyle}>
                        <Image source={require('../../assets/images/facebook.png')}
                            style={{ height: 30.0, width: 30.0 }}
                            resizeMode="contain"
                        />
                        <Text style={{ ...Fonts.white15Medium, marginLeft: Sizes.fixPadding + 5.0 }}>
                            Login with Facebook
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    const loginWithGoogleButton = () => {
        if (typeof props.userData !== "undefined" && props.userData.authenticated !== true) {
            return (
                <View>
                    <TouchableOpacity onPress={() => signIn()} style={styles.loginWithGoogleButtonStyle}>
                        <Image source={require('../../assets/images/google.png')}
                            style={{ height: 30.0, width: 30.0 }}
                            resizeMode="contain"
                        />
                        <Text style={{ ...Fonts.black15Medium, marginLeft: Sizes.fixPadding + 5.0 }}>
                            Login with Google
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }

    }

    const sendOTPInfo = () => {
        return (
            <Text style={{ ...Fonts.black15Medium, alignSelf: 'center', marginTop: 17.5, color: "#fff" }}>
                We'll send otp for verification
            </Text>
        )
    }

    const logo = () => {
        return (
            <SvgComponentAuth />
        )
    }

    const signInText = () => {
        return (
            <Text style={{ ...Fonts.gray16Bold, alignSelf: 'center', marginVertical: Sizes.fixPadding + 5.0, color: "#fff", fontWeight: "bold" }}>
                Sign-in with phone number
            </Text>
        )
    }

    const renderRegistrationTextLink = () => {
        if (typeof props.userData !== "undefined" && props.userData.authenticated !== true) {
            return (
                <Fragment>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Register")
                    }} style={{}}>
                        <Text style={styles.registrationTxt}>Register new user - raw data</Text>
                    </TouchableOpacity>
                </Fragment>
            );
        }
    }

    const renderRedirectToHomepageAuthed = () => {
        if (typeof props.userData !== "undefined" && props.userData.authenticated === true) {
            return (
                <View style={{ margin: 17.5 }}>
                    <Button onPress={() => navigation.navigate("BottomTabScreen", { index: 1 })} title={"Redirect To Authenticated View"} buttonStyle={{ borderRadius: 12.5, height: 55, marginTop: 10 }} style={{ width: "100%" }} color={Colors.primaryColor} />
                </View>
            );
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar />
            <ImageBackground source={require("../../assets/images/tinted-ewaste.jpeg")} style={styles.linearGradient}>
                <ScrollView contentContainerStyle={styles.contentContainer} style={{ flex: 1 }}>
                    {logo()}
                    {signInText()}
                    {phoneNumberTextField()}
                    {renderPasswordSignin()}
                    {renderRegistrationTextLink()}
                    {continueButton()}
                    {sendOTPInfo()}
                    {loginWithFacebookButton()}
                    {loginWithGoogleButton()}
                    {renderRedirectToHomepageAuthed()}
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    )
}

SignInScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}
const mapStateToProps = (state) => {
    return {
        userData: state.auth.data,
        authenticated: state.auth.data.authenticated
    }
}
export default connect(mapStateToProps, { authentication })(withNavigation(SignInScreen));