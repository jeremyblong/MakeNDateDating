import React, { Fragment, useState } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import styles from "./IndexStyles.js";
import DatePicker from 'react-native-date-picker';
import Dialog from "react-native-dialog";
import moment from "moment";                    
import { saveAuthenticationDetails } from "../../../../actions/auth.js";
import { connect } from "react-redux";
import { useTheme } from '@config'; 

const currentDate = new Date();

const PageSixContentData = ({ updateMainState, saveAuthenticationDetails, temp, handleContinuation }) => {

	const { colors, theme } = useTheme();
	
	const [ state, setState ] = useState({
		selectedDate: null,
		open: false,
		showDialog: false
	})

	const handleSubmission = () => {
		console.log("handleSubmission clicked/ran...");

		setState(prevState => {
    		return {
    			...prevState,
    			showDialog: false
    		}
    	})

    	saveAuthenticationDetails({ ...temp, birthdateRaw: state.selectedDate, birthdate: moment(state.selectedDate).format("YYYY-MM-DD") });

    	handleContinuation(7);
	}

	console.log("selectedDate", state.selectedDate);
	return (
		<View style={{ margin: 11.25 }}>
			<Dialog.Container visible={state.showDialog}>
		      <Dialog.Title>You're {state.selectedDate !== null ? Number(currentDate.getFullYear() - state.selectedDate.getFullYear()) : "Loading..."} Year's Old</Dialog.Title>
		      <Dialog.Description>
		        Make sure you're age is correct as you cannot change it later, this is the only time you're able to set your birthdate.
		      </Dialog.Description>
		      <Dialog.Button onPress={() => setState(prevState => {
	        		return {
	        			...prevState,
	        			showDialog: false
	        		}
	        	})} label="Cancel" />
		      <Dialog.Button onPress={handleSubmission} label="Confirm" />
		    </Dialog.Container>
			<View style={styles.whiteThinHR} />
			<TouchableOpacity onPress={() => setState(prevState => {
        		return {
        			...prevState,
        			open: true
        		}
        	})} style={styles.whiteRoundedBtn}>
				<Text style={styles.btnText}>Select your birthdate</Text>
				<Image source={require("../../../../assets/icons/birthdate.png")} style={styles.iconButton} />
			</TouchableOpacity>
			<DatePicker
                modal
                open={state.open}
                mode={"date"}
				textColor={colors.accent}
                minimumDate={new Date("1960-01-01")}
                maximumDate={new Date("2004-01-01")}
                date={state.selectedDate !== null ? state.selectedDate : new Date()}
                onConfirm={(date) => setState(prevState => {
                		return {
                			...prevState,
                			open: false,
                			selectedDate: date,
                			showDialog: true
                		}
                	})}
	        	onCancel={() => setState(prevState => {
	        		return {
	        			...prevState,
	        			open: false
	        		}
	        	})}
            />
		</View>
	);
}
const mapStateToProps = (state) => {
	return {
		temp: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, { saveAuthenticationDetails })(PageSixContentData);