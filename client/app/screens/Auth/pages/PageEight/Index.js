import React, { Fragment } from "react";
import { Image, View, Text, TouchableOpacity, Dimensions } from "react-native";
import styles from "./IndexStyles.js";
import { BaseStyle, useTheme } from '@config';
import { connect } from "react-redux";
import { saveAuthenticationDetails } from "../../../../actions/auth.js";


const { width, height } = Dimensions.get("window");

const PageEightContentData = ({ updateMainState, temp, renderTopTitleSubTitle, saveAuthenticationDetails, handleContinuation }) => {

	const { colors } = useTheme();

	const selectionSelect = (selected) => {
		console.log("selectionSelect clicked/ran...");

		saveAuthenticationDetails({ ...temp, accountType: selected });

		handleContinuation(9);
	}

	return (
		<View style={{ margin: 11.25, marginTop: 75, paddingTop: 75, paddingBottom: 75 }}>
			{renderTopTitleSubTitle("Choose a mode to get started", `Our platform helps assist our user's understanding the wants/needs of other user's in a transparent & non-confrontational manner - select what you're seeking on here...`)}
			<TouchableOpacity onPress={() => selectionSelect("date")} style={styles.whiteRoundedBtn}>
				<View style={styles.column}>
					<Text style={[styles.btnText, { color: colors.secondary }]}>Date</Text>
					<Text style={styles.subBtnText}>Find that spark in an empowered/thriving community</Text>
				</View>
				<Image source={require("../../../../assets/icons/circle-design.png")} style={styles.iconButton} />
			</TouchableOpacity>
			<View style={styles.whiteThinHR} />
			<TouchableOpacity onPress={() => selectionSelect("bff")} style={styles.whiteRoundedBtn}>
				<View style={styles.column}>
					<Text style={[styles.btnText, { color: colors.secondary }]}>BFF</Text>
					<Text style={styles.subBtnText}>Make new friends & build new experiences!</Text>
				</View>
				<Image source={require("../../../../assets/icons/circle-design.png")} style={styles.iconButton} />
			</TouchableOpacity>
			<View style={styles.whiteThinHR} />
			<TouchableOpacity onPress={() => selectionSelect("bizz")} style={styles.whiteRoundedBtn}>
				<View style={styles.column}>
					<Text style={[styles.btnText, { color: colors.secondary }]}>Bizz</Text>
					<Text style={styles.subBtnText}>Build your business relationships & expand your horizons</Text>
				</View>
				<Image source={require("../../../../assets/icons/circle-design.png")} style={styles.iconButton} />
			</TouchableOpacity>
			<View style={styles.whiteThinHR} />
			<Text style={styles.bottomQueueText}>Your profile will only be shown to other's in the same category - this heavily dictates what you see & experience...</Text>
		</View>
	);
}

const mapStateToProps = (state) => {
	return {
		temp: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, { saveAuthenticationDetails })(PageEightContentData);