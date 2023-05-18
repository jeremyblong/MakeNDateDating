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
    whiteRoundedBtn: {
    	backgroundColor: "#fff",
     	padding: 11.25,
     	borderWidth: 2,
     	borderColor: "#000",
     	borderRadius: 17.25
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