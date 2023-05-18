import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
    contain: {
        padding: 20,
    },
    textInput: {
        height: 46,
        backgroundColor: BaseColor.fieldColor,
        borderRadius: 5,
        marginTop: 10,
        padding: 10,
        width: '100%',
    },
    spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
    },
    bottomSheetStyle: {
        backgroundColor: 'white',
        paddingHorizontal: 10 * 2.0,
        paddingVertical: 10
    },
    iconCustom: {
        maxWidth: 30,
        maxHeight: 30,
        minHeight: 30,
        minWidth: 30
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    uploadContainer: {
        minHeight: 125,
        height: 125,
        borderWidth: 1.25,
        borderStyle: "dashed",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginBottom: 22.25,
        marginTop: 22.25
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    fileNameText: {
        fontWeight: "bold",
        marginTop: 15,
        borderTopColor: "lightgrey",
        borderTopWidth: 1.25,
        paddingTop: 15
    },
    hr: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 10,
        marginBottom: 10
    },
    labeledTier: {
        fontSize: 16.25,
        marginBottom: 20,
        marginTop: 8.25,
        fontWeight: "400",
        marginBottom: 8.25,
        marginTop: 15
    },
});
