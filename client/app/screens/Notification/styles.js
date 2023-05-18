import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    item: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    contain: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
    },
    loadingYourContentText: {
        fontSize: 22.25,
        textAlign: "center",
        margin: 10
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    loadingImage: {
        minWidth: width * 0.975,
        width: width * 0.975,
        height: height * 0.525,
        minHeight: height * 0.525
    },
    noNotifications: {
        minWidth: width * 0.825,
        width: width * 0.825,
        height: height * 0.525,
        minHeight: height * 0.525
    },
    importantText: {
        textAlign: "center",
        fontSize: 18.25,
        paddingBottom: 10
    },  
    thumb: {width: 48, height: 48, marginRight: 10},
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    headline: {
        maxWidth: width * 0.5,
        width: width * 0.5,
        paddingBottom: 6.25
    },
    left: {
        flex: 7.5,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    right: {
        flex: 2.5,
        alignItems: 'flex-end',
        position: "absolute",
        top: 0,
        right: 10,
        justifyContent: 'center',
    }
});

export default styles;
