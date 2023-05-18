import React, { useState } from "react";
import { Image, View, Text, TextInput, TouchableOpacity, useColorScheme } from "react-native";
import styles from "./pageStyles.js";
import { useTheme, BaseStyle } from '@config';
import Dialog from "react-native-dialog";
import axios from "axios";
import { BASE_URL } from "@env";
import Toast from "react-native-toast-message";
import { authentication } from "../../../../actions/auth.js";
import { useDispatch, connect } from "react-redux";
import { useNavigation } from "@react-navigation/native"; // 

const PageSixteenDataRegisterClinician = ({ authentication, businessAccountTempData, saveAuthenticationDetailsCounselor }) => {

    const dispatch = useDispatch();

    const { colors, theme } = useTheme();
    const navigation = useNavigation();
    const colorSchemeDark = theme.dark;
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ showDialog, setDialog ] = useState(false);
	const [ isPassword, setPasswordVisibility ] = useState(true);

	const calculateReadiness = () => {
		const validateEmail = (email) => {
		  return String(email)
		    .toLowerCase()
		    .match(
		      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		    );
		};

		if (validateEmail(email) && (typeof password !== "undefined" && password.length >= 8)) {
			return false;
		} else {
			return true;
		}
	}

	const handleSubmission = () => {
		console.log("handleSubmission clicked/ran...");

		setDialog(false);

        const combinedData = {
            email, 
            enrolled: false, 
            password,
            ...businessAccountTempData
        }

		setTimeout(() => {
            const config = {
                businessAccountTempData: combinedData
            }

            axios.post(`${BASE_URL}/register/account/companion/mentorship`, config).then((res) => {
                if (res.data.message === "Successfully registered!") {
                    console.log("Successfully registered!", res.data);

                    const { user } = res.data;

                    Toast.show({
                        type: 'success',
                        text1: `Successfully created your account!`,
                        text2: `We are now signing you in - successful account creation!`,
                        visibilityTime: 2750,
                        position: "bottom",
                        onHide: () => {

                            dispatch(authentication(user));

                            saveAuthenticationDetailsCounselor({});

                            navigation.replace("BottomTabNavigator", { screen: "Home" });
                        }
                    });
                } else {
                    console.log("Err", res.data);

                    Toast.show({
                        type: 'error',
                        text1: `Error occurred while registering your account!`,
                        text2: `An unknown error occurred while we were trying to register your account...`,
                        visibilityTime: 2750,
                        position: "bottom"
                    });

                }
            }).catch((err) => {
                console.log(err.message);

                Toast.show({
                    type: 'error',
                    text1: `Error occurred while registering your account!`,
                    text2: `An unknown error occurred while we were trying to register your account...`,
                    visibilityTime: 2750,
                    position: "bottom"
                });
            })
        }, 2250)
	}
	const handleEnrollmentSubscription = () => {
		console.log("handleEnrollmentSubscription clicked/ran...");

		setDialog(false);

		const combinedData = {
            email, 
            enrolled: true, 
            password,
            ...businessAccountTempData
        }

		setTimeout(() => {
            const config = {
                businessAccountTempData: combinedData
            }

            axios.post(`${BASE_URL}/register/account/companion/mentorship`, config).then((res) => {
                if (res.data.message === "Successfully registered!") {
                    console.log("Successfully registered!", res.data);

                    const { user } = res.data;
                    
                    Toast.show({
                        type: 'success',
                        text1: `Successfully created your account!`,
                        text2: `We are now signing you in - successful account creation!`,
                        visibilityTime: 2750,
                        position: "bottom",
                        onHide: () => {

                            dispatch(authentication(user));

                            saveAuthenticationDetailsCounselor({});

                            navigation.replace("BottomTabNavigator", { screen: "Home" });
                        }
                    });
                } else {
                    console.log("Err", res.data);

                    Toast.show({
                        type: 'error',
                        text1: `Error occurred while registering your account!`,
                        text2: `An unknown error occurred while we were trying to register your account...`,
                        visibilityTime: 2750,
                        position: "bottom"
                    });

                }
            }).catch((err) => {
                console.log(err.message);

                Toast.show({
                    type: 'error',
                    text1: `Error occurred while registering your account!`,
                    text2: `An unknown error occurred while we were trying to register your account...`,
                    visibilityTime: 2750,
                    position: "bottom"
                });
            })
        }, 2250)
	}
	console.log("isPassword", isPassword);
	return (
		<View style={{ margin: 11.25 }}>
			<Dialog.Container visible={showDialog}>
		      <Dialog.Title>Want to keep up to date with our changing enviorment?</Dialog.Title>
			      <Dialog.Description>
			        You can always change your mind later by changing your email settings...
			      </Dialog.Description>
			      <Dialog.Button onPress={handleSubmission} label="Opt Out.." />
		      	<Dialog.Button onPress={handleEnrollmentSubscription} label="Enroll!" />
		    </Dialog.Container>
            <TextInput
                style={colorSchemeDark ? [BaseStyle.textInput, { backgroundColor: colors.card, color: "#fff" }] : [BaseStyle.textInput, { backgroundColor: colors.card }]}
                placeholder={"Youremail@gmail.com"}
                placeholderTextColor={"#909090"}
                maxLength={45}
                value={email}
			    onChangeText={value => {
			        setEmail(value);
			    }}
                selectionColor={colors.primary}
            />
            <View style={styles.whiteThinHR} />
            <TextInput
                style={colorSchemeDark ? [BaseStyle.textInput, { backgroundColor: colors.card, color: "#fff" }] : [BaseStyle.textInput, { backgroundColor: colors.card }]}
                placeholder={"Enter a password (8 Char Min.)"}
                placeholderTextColor={"#909090"}
                maxLength={25}
                secureTextEntry={isPassword}
                value={password}
			    onChangeText={value => {
			        setPassword(value);
			    }}
                selectionColor={colors.primary}
            />
			<TouchableOpacity hitStop={15} onPress={() => setPasswordVisibility(prevState => !prevState)}>
				<View style={{ flexDirection: "row", display: "flex" }}>
					<Text style={{ fontWeight: "bold", textAlign: "left", textDecorationLine: "underline", color: "#fff", marginTop: 12.25, marginLeft: 7.25 }}>{isPassword ? "Hide Password Text" : "Show Password Text"}</Text>
					<Image style={styles.innerIconInputPass} source={require("../../../../assets/icons/eye-100.png")} />
				</View>
			</TouchableOpacity>
			<TouchableOpacity
                disabled={calculateReadiness()}
                activeOpacity={0.9}
                onPress={() => setDialog(true)}
                style={!calculateReadiness() ? [styles.continueButtonStyle, { backgroundColor: colors.accent, borderWidth: 1.25, borderColor: "#fff" }] : styles.disabledContinueButtonStyle}>
                <Text style={!calculateReadiness() ? { color: "#fff" } : { color: "black" }}>Continue & Register!</Text>
            </TouchableOpacity>
		</View>
	);
}
const mapStateToProps = (state) => {
    return {}
}
export default connect(mapStateToProps, { authentication })(PageSixteenDataRegisterClinician);