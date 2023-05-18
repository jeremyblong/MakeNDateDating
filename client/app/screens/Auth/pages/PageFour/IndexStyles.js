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
    labelFloatingStyle: {
        paddingTop: 8
    },
    innerIconInput: {
    	maxWidth: 27.5,
    	width: 27.5,
    	height: 27.5,
    	maxHeight: 27.5
    },
    label: {
        fontSize: 17.75,
        marginBottom: 20,
        marginTop: 10,
        fontWeight: "400"
    },
    innerIconInputSmaller: {
    	maxWidth: 22.5,
    	width: 22.5,
    	height: 22.5,
    	maxHeight: 22.5,
    	marginTop: 6.25
    },
    whiteThinHR: {
        marginTop: 22.25,
        marginBottom: 22.25,
        minWidth: "80%",
        borderBottomWidth: 1.25,
        borderBottomColor: "#fff"
    },
    disabledContinueButtonStyle: {
        backgroundColor: "#ffffff",
        paddingVertical: 10 + 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        borderRadius: 10,
        marginTop: 20
    },
    continueButtonStyle: {
        paddingVertical: 10 + 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        borderRadius: 10,
        marginTop: 20
    },
    inputFloatingStyles: {
        paddingLeft: 7.75,
        textAlignVertical: "top",
        color: "#000",
        paddingTop: 20,
        maxWidth: "88.25%"
    },
    whiteRoundedBtn: {
    	backgroundColor: "#fff",
     	padding: 11.25,
     	borderWidth: 2,
     	borderColor: "#000",
     	borderRadius: 17.25
    },
    singleLineStyles: {
    	backgroundColor: "#fff",
    	borderRadius: 9.25,
    	maxHeight: 67.25,
    	height: 67.25
    },
    showCountdownStylesCustom: {
        color: "red",
        fontWeight: "bold",
        textDecorationLine: "underline",
        fontSize: 12.25
    }
})

export default styles;