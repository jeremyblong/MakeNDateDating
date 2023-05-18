import React, { Fragment, useState } from "react";
import { Image, View, Text, TouchableOpacity, FlatList } from "react-native";
import styles from "./pageStyles.js";                
import Modal from "react-native-modal";
import { useTheme } from '@config';

const genderOptions = [{
	label: "Agender/Neither",
	value: "Agender-Neither"
}, {
	label: "Androgyne",
	value: "Androgyne"
}, {
	label: "Androgynous",
	value: "Androgynous"
}, {
	label: "Bigender",
	value: "Bigender"
}, {
	label: "Gender Fluid",
	value: "Gender-Fluid"
}, {
	label: "Neutrois",
	value: "Neutrois"
}, {
	label: "Pangender",
	value: "Pangender"
}, {
	label: "Transsexual",
	value: "Transsexual"
}, {
	label: "Two-Spirit",
	value: "Two-Spirit"
}, {
	label: "Third Gender",
	value: "Third-Gender"
}]

const PageFourteenDataRegisterClinician = ({ handleContinuation, businessAccountTempData, saveAuthenticationDetailsCounselor }) => {
	const [ state, setState ] = useState({
		showMore: false,
		isVisible: false
	})

	const itemSelection = (selected) => {
		console.log("itemSelection clicked/ran...");

		setState(prevState => {
			return {
				...prevState,
				showMore: false
			}
		});

		saveAuthenticationDetailsCounselor({ ...businessAccountTempData, gender: selected });

		handleContinuation(15);
	}

	const renderItem = ({ item, index }) => {
		return (
			<Fragment key={index}>
				<TouchableOpacity onPress={() => itemSelection()} style={styles.whiteRoundedBtn}>
					<Text style={styles.btnText}>{item.label}</Text>
					<Image source={require("../../../../assets/icons/circle-design.png")} style={styles.iconButton} />
				</TouchableOpacity>
			</Fragment>
		);
	}
	return (
		<View style={{ margin: 11.25 }}>
			<Modal coverScreen={true} collapsable={true} onBackdropPress={() => setState(prevState => {
			return {
				...prevState,
				showMore: false
			}
		})} isVisible={state.showMore}>
		        <View style={styles.flatlistContainer}>
					<FlatList
				        data={genderOptions}
				        showsVerticalScrollIndicator={false}
				        renderItem={renderItem}
				        keyExtractor={item => item.label.toString()}
				    />
			    </View>
		    </Modal>
		    <TouchableOpacity onPress={() => itemSelection({
				label: "Woman",
				value: "Woman"
			})} style={styles.whiteRoundedBtn}>
				<Text style={styles.btnText}>Woman</Text>
				<Image source={require("../../../../assets/icons/circle-design.png")} style={styles.iconButton} />
			</TouchableOpacity>
			<TouchableOpacity onPress={() => itemSelection({
				label: "Man",
				value: "Man"
			})} style={styles.whiteRoundedBtn}>
				<Text style={styles.btnText}>Man</Text>
				<Image source={require("../../../../assets/icons/circle-design.png")} style={styles.iconButton} />
			</TouchableOpacity>
			<TouchableOpacity onPress={() => itemSelection({
				label: "Non-Binary",
				value: "Non-Binary"
			})} style={styles.whiteRoundedBtn}>
				<Text style={styles.btnText}>Non-Binary</Text>
				<Image source={require("../../../../assets/icons/circle-design.png")} style={styles.iconButton} />
			</TouchableOpacity>
			<View style={styles.whiteThinHR} />
			<View style={styles.centeredMaxed}>
				<TouchableOpacity onPress={() => setState(prevState => {
					return {
						...prevState,
						showMore: !prevState.showMore
					}
				})} style={styles.nothingWrapperTouchable}>
					<Text style={styles.whiteTextInner}>More gender option's...</Text>
					<Image source={require("../../../../assets/icons/down-arked.png")} style={styles.iconButtonWhite} />
				</TouchableOpacity>
			</View>
		</View>
	);
}
export default PageFourteenDataRegisterClinician;