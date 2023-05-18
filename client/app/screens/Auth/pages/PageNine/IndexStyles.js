import React from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    whiteRoundedBtn: {
        backgroundColor: "#fff",
        padding: 11.25,
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: 17.25,
        height: 62.5
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
        marginTop: 4.25,
        textAlign: "left"
    },
    whiteThinHR: {
        marginTop: 12.25,
        marginBottom: 12.25,
        minWidth: "80%",
        borderBottomWidth: 1.25,
        borderBottomColor: "#fff"
    },
})

export default styles;