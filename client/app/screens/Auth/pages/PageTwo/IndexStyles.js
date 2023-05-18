import React from "react";
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    textFieldContainerStyle: {
        marginHorizontal: 5,
        color: "#000",
        backgroundColor: "#ffffff",
        paddingVertical: 13,
        borderRadius: 10,
        elevation: 1.0,
        marginTop: 20,
        maxWidth: 50,
        minWidth: 50
    },
    rowOnly: { 
    	flexDirection: "row", 
    	display: "flex",
    	marginLeft: 11.25
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
})

export default styles;