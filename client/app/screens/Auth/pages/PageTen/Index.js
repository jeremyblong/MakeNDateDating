import React, { Fragment, useState } from "react";
import { Image, View, Text, TextInput, TouchableOpacity, useColorScheme } from "react-native";
import styles from "./IndexStyles.js";
import { BaseStyle, useTheme } from '@config';
import { connect } from "react-redux";
import { saveAuthenticationDetails } from "../../../../actions/auth.js";
import Dialog from "react-native-dialog";
			

const PageTenContentData = ({ updateMainState, temp, renderTopTitleSubTitle, saveAuthenticationDetails, handleContinuation }) => {

	const { colors, theme } = useTheme();

	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ showDialog, setDialog ] = useState(false);
	const [ isPassword, setPasswordVisibility ] = useState(true);
	const colorSchemeDark = theme.dark;

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

		saveAuthenticationDetails({ ...temp, email, enrolled: false, password });

		handleContinuation(11);
	}
	const handleEnrollmentSubscription = () => {
		console.log("handleEnrollmentSubscription clicked/ran...");

		setDialog(false);

		saveAuthenticationDetails({ ...temp, email, enrolled: true, password });

		handleContinuation(11);
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
			<Text style={styles.label}>What's your email address?</Text>
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
			<Text style={styles.label}>Enter a password (8 Char Min.)</Text>
			<TextInput
                style={colorSchemeDark ? [BaseStyle.textInput, { backgroundColor: colors.card, color: "#fff" }] : [BaseStyle.textInput, { backgroundColor: colors.card }]}
                placeholder={"MyP@sswordHere123"}
                placeholderTextColor={"#909090"}
                maxLength={20}
				value={password}
			    secureTextEntry={isPassword}
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
                <Text style={!calculateReadiness() ? { color: "#fff" } : { color: "black" }}>Continue</Text>
            </TouchableOpacity>
		</View>
	);
}

const mapStateToProps = (state) => {
	return {
		temp: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, { saveAuthenticationDetails })(PageTenContentData);