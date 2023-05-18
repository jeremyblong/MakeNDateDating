import React, { Fragment } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import styles from "./IndexStyles.js";
import { BaseStyle, useTheme } from '@config';
import { connect } from "react-redux";
import { saveAuthenticationDetails } from "../../../../actions/auth.js";



const PageNineContentData = ({ updateMainState, temp, renderTopTitleSubTitle, saveAuthenticationDetails, handleContinuation }) => {

	const { colors } = useTheme();

	const selectionSelect = (selected) => {
		console.log("selectionSelect clicked/ran...");

		saveAuthenticationDetails({ ...temp, interestedIn: selected });

		handleContinuation(10);
	}

	return (
		<View style={{ margin: 11.25 }}>
			<TouchableOpacity onPress={() => selectionSelect("men")} style={styles.whiteRoundedBtn}>
				<Text style={styles.btnText}>I'm interested in men</Text>
				<Image source={require("../../../../assets/icons/circle-design.png")} style={styles.iconButton} />
			</TouchableOpacity>
			<View style={styles.whiteThinHR} />
			<TouchableOpacity onPress={() => selectionSelect("women")} style={styles.whiteRoundedBtn}>
				<Text style={styles.btnText}>I'm interested in women</Text>
				<Image source={require("../../../../assets/icons/circle-design.png")} style={styles.iconButton} />
			</TouchableOpacity>
			<View style={styles.whiteThinHR} />
			<TouchableOpacity onPress={() => selectionSelect("everyone")} style={styles.whiteRoundedBtn}>
				<Text style={styles.btnText}>I'm interested in everyone</Text>
				<Image source={require("../../../../assets/icons/circle-design.png")} style={styles.iconButton} />
			</TouchableOpacity>
		</View>
	);
}

const mapStateToProps = (state) => {
	return {
		temp: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, { saveAuthenticationDetails })(PageNineContentData);