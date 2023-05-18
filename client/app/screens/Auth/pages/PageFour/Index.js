import React, { Fragment, useState } from "react";
import { Image, View, Text, TouchableOpacity, TextInput, useColorScheme } from "react-native";
import styles from "./IndexStyles.js";
import { BaseStyle, useTheme } from '@config';
import { connect } from "react-redux";
import { saveAuthenticationDetails } from "../../../../actions/auth.js";

const PageFourContentData = ({ temp, mainData, handleContinuation, saveAuthenticationDetails }) => {

	const { colors, theme } = useTheme();
	const colorSchemeDark = theme.dark;

	const [ state, setState ] = useState({
		firstName: "",
		lastName: "",
		username: "" // // 
	});

	const calculateReadiness = () => {
        const { firstName, lastName, username } = state;

        if ((typeof firstName !== "undefined" && firstName.length > 0) && (typeof lastName !== "undefined" && lastName.length > 0) && (typeof username !== "undefined" && username.length > 0)) {
            return false;
        } else {
            return true;
        }
    }
    const handleSubmission = () => {
    	console.log("handleSubmission clicked/ran...");

    	saveAuthenticationDetails({ ...temp, firstName: state.firstName, lastName: state.lastName, username: state.username });

    	handleContinuation(5);
    }
	return (
		<View style={{ margin: 11.25 }}>
			<Text style={styles.label}>What's your first name? (PUBLIC)</Text>
			<TextInput
                style={colorSchemeDark ? [BaseStyle.textInput, { backgroundColor: colors.card, color: "#fff" }] : [BaseStyle.textInput, { backgroundColor: colors.card }]}
                placeholder={`John`}
                placeholderTextColor={"#909090"}
                maxLength={20}
                value={state.firstName}
			    onChangeText={value => {
			        setState(prevState => {
			            return {
			                ...prevState,
			                firstName: value
			            }
			        })
			    }}
                selectionColor={colors.primary}
            />
			<View style={[styles.whiteThinHR, { marginBottom: 12.5, marginTop: 12.5 }]} />
			<Text style={styles.label}>What's your last name? (PRIVATE)</Text>
			<TextInput
                style={colorSchemeDark ? [BaseStyle.textInput, { backgroundColor: colors.card, color: "#fff" }] : [BaseStyle.textInput, { backgroundColor: colors.card }]}
                placeholder={`Doe`}
                placeholderTextColor={"#909090"}
                maxLength={20}
                value={state.lastName}
			    onChangeText={value => {
			        setState(prevState => {
			            return {
			                ...prevState,
			                lastName: value
			            }
			        })
			    }}
                selectionColor={colors.primary}
            />
			<View style={[styles.whiteThinHR, { marginBottom: 12.5, marginTop: 12.5 }]} />
			<Text style={styles.label}>Enter a username (@)</Text>
			<TextInput
                style={colorSchemeDark ? [BaseStyle.textInput, { backgroundColor: colors.card, color: "#fff" }] : [BaseStyle.textInput, { backgroundColor: colors.card }]}
                placeholder={`Johndoe101`}
                placeholderTextColor={"#909090"}
                maxLength={20}
                value={state.username}
			    onChangeText={value => {
			        setState(prevState => {
			            return {
			                ...prevState,
			                username: value
			            }
			        })
			    }}
                selectionColor={colors.primary}
            />
			<View style={styles.whiteThinHR} />
         	<TouchableOpacity
                disabled={calculateReadiness()}
                activeOpacity={0.9}
                onPress={() => handleSubmission()}
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
export default connect(mapStateToProps, { saveAuthenticationDetails })(PageFourContentData);