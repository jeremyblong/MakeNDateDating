import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import styles from "./IndexStyles.js";
import { Text, Image } from '@components';
import { BaseColor, useTheme } from '@config';
import { connect } from "react-redux";
import { saveAuthenticationDetails, authentication } from "../../../../actions/auth.js";
import Swiper from 'react-native-swiper';
import { BASE_URL, COMET_CHAT_AUTH_KEY } from "@env";
import { getUniqueId, getManufacturer, getBrand, getBuildNumber, getBundleId, getCarrier, getDeviceId, getDeviceType, getDeviceName, getIpAddress, getMacAddress, getModel, getReadableVersion,getSystemVersion, getSystemName, getUserAgent, isTablet } from 'react-native-device-info';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from "@react-native-community/geolocation";
import { CometChat } from '@cometchat-pro/react-native-chat';


const { width, height } = Dimensions.get("window");

const PageElevenContentData = ({ updateMainState, temp, renderTopTitleSubTitle, saveAuthenticationDetails, authentication }) => {

	const navigation = useNavigation();

	const [ loading, setLoading ] = useState(false);

	const [ slides ] = useState([
	    { key: 1, image: require("../../../../assets/icons/coinss.png"), title: "Earn while using our app!", textVal: "EARN MONEY (tokens) through in-app services which can be cashed out for actual USD!" },
	    { key: 2, image: require("../../../../assets/icons/socialdating.png"), title: "Social-Style dating.", textVal: "Social style dating with an emphasis on transparency, honesty & authenticity!" },
	    { key: 3, image: require("../../../../assets/icons/transparency-2.png"), title: "Transparent & positive dating...", textVal: "User's have 'feedback rankings/scores' to evaluate their previous behavior's & interactions ensuring accountablity & kindness." },
	    { key: 4, image: require("../../../../assets/icons/innovation.png"), title: "Connect in innovative ways...", textVal: "Live-stream your matches, send priority messages, IRL meetup's for dating events & much more..." },
	    { key: 5, image: require("../../../../assets/icons/intimatcy.png"), title: "Open/Explorable community or marketplace", textVal: "Open exporable marketplace with options to connect in various fashions fostering intimate connection before you meet in-person!" }
	]);

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

	const handleSubmission = async () => {
		console.log("handleSubmission clicked/ran...");

		setLoading(true);

		const config = {
            data: temp,
            deviceInfo: await handleDeviceInformationFetch()
        }

        axios.post(`${BASE_URL}/register/new/user`, config).then((res) => {
            if (res.data.message === "Successfully registered new user!") {
                console.log("Successfully registered new user!", res.data);

                const { user } = res.data;

                Toast.show({
				    type: 'success',
				    text1: `Successfully registered your account!`,
				    text2: `We've successfully registered your new account - you'll be redirected momentarily...`,
				    visibilityTime: 2375,
				    position: "bottom",
				    onHide: () => {
                        

                        Geolocation.getCurrentPosition(info => {

                            const { latitude, longitude } = info.coords;
                        
                            const location = { latitude, longitude, latitudeDelta: 0.00875, longitudeDelta: 0.00875 };
                      
                            const config = {
                              location,
                              userID: temp.uniqueId
                            };
                      
                            axios.post(`${BASE_URL}/update/partially/randomize/user/public/location`, config).then((res) => {
                                
                                const { updated, message } = res.data;

                                CometChat.login(temp.uniqueId, COMET_CHAT_AUTH_KEY).then((chatUser) => {
                                    console.log('Login Successful:', { chatUser });
                                
                                    if (updated === true && message === "Successfully updated user's current approx location!") {
                                        setLoading(false);
                                        authentication(user, true);
                                        saveAuthenticationDetails(user);
                                        navigation.replace("BottomTabNavigator", { screen: "Profile" });
                                    } else {
                                        setLoading(false);
                                        authentication(user, true);
                                        saveAuthenticationDetails(user);
                                        navigation.replace("BottomTabNavigator", { screen: "Profile" });
                                    }
                                }, (error) => {
                                    console.log('Login failed with exception:', { error });

                                    if (updated === true && message === "Successfully updated user's current approx location!") {
                                        setLoading(false);
                                        authentication({}, false);
                                        saveAuthenticationDetails({});
                                        navigation.replace("BottomTabNavigator", { screen: "Profile" });
                                    } else {
                                        setLoading(false);
                                        authentication({}, false);
                                        saveAuthenticationDetails({});
                                        navigation.replace("BottomTabNavigator", { screen: "Profile" });
                                    }
                                });
                    
                            }).catch((err) => {
                                console.log("err", err);
                            });
                        });
				    }
				});
            } else {
                console.log("Err", res.data);

                setLoading(false);

                Toast.show({
				    type: 'error',
				    text1: `An error occurred while registering your account!`,
				    text2: `We could NOT properly register your account - please try again or contact support if the problem persists...`,
				    visibilityTime: 2375,
				    position: "bottom"
				});
            }
        }).catch((err) => {
            console.log(err.message);

            setLoading(false);

            Toast.show({
			    type: 'error',
			    text1: `An error occurred while registering your account!`,
			    text2: `We could NOT properly register your account - please try again or contact support if the problem persists...`,
			    visibilityTime: 2375,
			    position: "bottom"
			});
        })
	}

	const { colors } = useTheme();
	return (
		<View style={{ margin: 11.25, marginTop: 75 }}>
			{renderTopTitleSubTitle("View our 'quickstart' key-notes", `Swipe through the key notes & we'll complete your registration! Congrats, welcome to the best dating app.`)}
			<Spinner
		          visible={loading}
		          textContent={'Loading/Registering...'}
		          textStyle={styles.spinnerTextStyle}
		          overlayColor={"rgba(0, 0, 0, 0.725)"}
	        />
			<View style={styles.wrapper}>
				<Swiper
	              dotStyle={{
	                backgroundColor: BaseColor.dividerColor,
	              }}
	              activeDotColor={colors.secondary}
	              paginationStyle={styles.contentPage}
	              removeClippedSubviews={false}
	              onIndexChanged={(index) => index === 4 ? handleSubmission() : null}>
	              {slides.map((item, index) => {
	                return (
	                  <View style={styles.slide} key={item.key}>
	                    <Image source={item.image} style={styles.img} />
	                    <Text body1 style={[styles.textSlide, { textAlign: "center" }]}>
	                      {item.title}
	                    </Text>
	                    <Text body1 style={[styles.textSlide, { textAlign: "center" }]}>
	                      {item.textVal}
	                    </Text>
	                  </View>
	                );
	              })}
	            </Swiper>
	        </View>
		</View>
	);
}

const mapStateToProps = (state) => {
	return {
		temp: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, { saveAuthenticationDetails, authentication })(PageElevenContentData);