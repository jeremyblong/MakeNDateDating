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
    singleLineStyles: {
        backgroundColor: "#fff",
        borderRadius: 9.25,
        maxHeight: 67.25,
        height: 67.25,
        borderWidth: 1.5,
        borderColor: "#000"
    },
    showCountdownStylesCustom: {
        color: "red",
        fontWeight: "bold",
        textDecorationLine: "underline",
        fontSize: 12.25
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
    labelFloatingStyle: {
        paddingTop: 8
    },
    innerIconInput: {
        maxWidth: 27.5,
        width: 27.5,
        height: 27.5,
        maxHeight: 27.5,
        right: 7.25,
        bottom: 13.25
    },
    innerIconInputPass: {
        maxWidth: 27.5,
        tintColor: "#fff",
        width: 27.5,
        height: 27.5,
        maxHeight: 27.5,
        position: "absolute",
        right: 7.25,
        top: 10.25
    }
})

export default styles;