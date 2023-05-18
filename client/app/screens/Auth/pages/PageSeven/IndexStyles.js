import React from "react";
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    textFieldContainerStyle: {
        marginHorizontal: 20,
        backgroundColor: "#ffffff",
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderRadius: 10,
        elevation: 1.0,
        marginTop: 20
    },
    whiteRoundedBtn: {
    	backgroundColor: "#fff",
    	marginTop: 12.5,
     	padding: 11.25,
     	borderWidth: 2,
     	borderColor: "#000",
     	borderRadius: 17.25,
     	minHeight: 60
    },
    iconButton: {
    	maxWidth: 30,
    	width: 30,
    	height: 30,
    	maxHeight: 30,
    	position: "absolute",
    	right: 12.5,
    	top: 12.25
    },
    flatlistContainer: {
        // minHeight: 1250
        margin: 11.25,
        flexGrow: 1
    },
    iconButtonWhite: {
    	maxWidth: 37.25,
    	width: 37.25,
    	height: 37.25,
    	maxHeight: 37.25,
    	position: "absolute",
    	right: 12.5,
    	top: 7.25,
    	tintColor: "#fff"
    },
    centeredMaxed: {
    	justifyContent: "center",
    	alignItems: "center",
    	alignContent: "center"
    },
    nothingWrapperTouchable: {
    	marginTop: 12.5,
     	padding: 11.25,
     	width: width * 0.8,
     	minHeight: 60,
        flex: 1,
        height: 60
    },
    whiteThinHR: {
        marginTop: 22.25,
        marginBottom: 22.25,
        minWidth: "80%",
        borderBottomWidth: 1.25,
        borderBottomColor: "#fff"
    },
    whiteTextInner: {
    	fontWeight: "bold", 
    	marginTop: 3.25,
    	fontSize: 17.25,
    	textAlign: "left",
    	color: "#fff"
    },
    btnText: {
    	fontWeight: "bold", 
    	marginTop: 3.25,
    	fontSize: 17.25,
    	textAlign: "left"
    }
})

export default styles;