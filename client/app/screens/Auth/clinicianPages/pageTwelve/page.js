import React, { Fragment, useState } from "react";
import { Image, View, Text, TouchableOpacity, Platform } from "react-native";
import styles from "./pageStyles.js";
import { requestNotifications, request, PERMISSIONS } from 'react-native-permissions';

const PageTwelveDataRegisterClinician = ({ handleContinuation }) => {

	const [ state, setState ] = useState({
		hideLoc: false,
		hideNotifications: false
	}) 

	const handleNotificationAllow = () => {
		requestNotifications(['alert', 'sound']).then(({status, settings}) => {
			console.log("status, settings", status, settings);

			if (status === "granted") {
 				if (state.hideLoc === true) {
 					handleContinuation(13);
 				} else {
	 				setState(prevState => {
	 					return {
	 						...prevState,
	 						hideNotifications: true
	 					}
	 				})
 				}
 			}
		});
	}
	const handleLocationAllow = () => {
		if (Platform.OS === "ios") {
			request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
				console.log("result location request...:", result);
   
			   if (result === "granted") {
					if (state.hideNotifications === true) {
						handleContinuation(13);
					} else {
						setState(prevState => {
							return {
								...prevState,
								hideLoc: true
							}
						})
					}
				}
		   });
		} else {
			request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
				console.log("result location request...:", result);
   
			   if (result === "granted") {
					if (state.hideNotifications === true) {
						handleContinuation(13);
					} else {
						setState(prevState => {
							return {
								...prevState,
								hideLoc: true
							}
						})
					}
				}
		   });
		}
	}

	return (
		<Fragment>
			<View style={{ margin: 12.25, marginTop: 17.5 }}>
				{!state.hideLoc ? <TouchableOpacity onPress={handleLocationAllow} style={styles.whiteRoundedBtn}>
					<Text style={styles.btnText}>Enable Location</Text>
				</TouchableOpacity> : null}
				<View style={styles.whiteThinHR} />
				{!state.hideNotifications ? <TouchableOpacity onPress={handleNotificationAllow} style={styles.whiteRoundedBtn}>
					<Text style={styles.btnText}>Allow Notification's</Text>
				</TouchableOpacity> : null}
			</View>
		</Fragment>
	);
}
export default PageTwelveDataRegisterClinician;