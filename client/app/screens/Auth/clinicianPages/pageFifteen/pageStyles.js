import React from "react";
import { StyleSheet } from "react-native";

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
    label: {
    	fontWeight: "400",
    	textAlign: "left",
    	fontSize: 16.25,
        marginTop: 12.25,
        marginBottom: 12.25
    },
    whiteRoundedBtn: {
    	backgroundColor: "#fff",
     	padding: 11.25,
     	borderWidth: 2,
     	borderColor: "#000",
     	borderRadius: 17.25
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
    btnText: {
    	fontWeight: "bold", 
    	fontSize: 17.25,
    	textAlign: "center"
    },
    whiteThinHR: {
        marginTop: 22.25,
        marginBottom: 22.25,
        minWidth: "80%",
        borderBottomWidth: 1.25,
        borderBottomColor: "#fff"
    },
})

export default styles;