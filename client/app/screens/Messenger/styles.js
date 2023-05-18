import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    emptyHolderImage: {
        maxWidth: width * 0.925, 
        width: width * 0.925, 
        height: height * 0.35,
        maxHeight: height * 0.35,
    },
    center: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    tab: {
        width: width * 0.50,
    },
    tabbar: {
        height: 50,
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginTop: 32.25
    },
    labeled: { 
        textAlign: "center", 
        fontWeight: "bold", 
        fontSize: 18.25 
    },
    itemMapped: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    bottomPositioned: {
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0
    },
    noPass: {
        width
    },
    contain: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
    },
    thumbMapped: { 
        width: 48, 
        height: 48, 
        marginRight: 10, 
        borderRadius: 72.25 
    },
    contentMapped: {
        flex: 1,
        flexDirection: 'row',
    },
    leftMapped: {
        flex: 7.5,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    rightMapped: {
        flex: 2.5,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    hrSpacer: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 22.25,
        marginBottom: 22.25
    }
});
