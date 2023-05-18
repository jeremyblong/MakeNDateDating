import {StyleSheet, Dimensions } from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';


const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 20,
    },
    label: {
        fontSize: 17.75,
        marginBottom: 20,
        marginTop: 10,
        fontWeight: "400"
    },
    interestsText: {
        color: "#000"
    },
    labeled: {
        fontSize: 17.75,
        marginBottom: 20,
        marginTop: 10,
        fontWeight: "400"
    },
    map: {
        minHeight: 275,
        height: 275,
        width: "100%",
        minWidth: "100%"
    },
    mapWrapper: {
        shadowColor: "grey",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,
        elevation: 12,
        borderWidth: 2,
        borderColor: "#000"
    },
    mainTitle: {
        textAlign: "left",
        fontSize: 27.25,
        fontWeight: "400"
    },
    firstColOne: {
        minHeight: 189,
        marginBottom: 1,
        height: 189,
        width: "99.25%",
        minWidth: "99.25%",
        maxWidth: "99.25%"
    },
    spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
    },
    firstColTwo: {
        minHeight: 189,
        height: 189,
        width: "99.25%",
        minWidth: "99.25%",
        maxWidth: "99.25%"
    },
    innerRowOne: {
        minHeight: 125,
        height: 125,
        marginBottom: 2,
        width: "100%",
        minWidth: "100%",
        maxWidth: "100%"
    },
    innerRowTwo: {
        minHeight: 125,
        height: 125,
        marginBottom: 2,
        width: "100%",
        minWidth: "100%",
        maxWidth: "100%"
    },
    innerRowThree: {
        minHeight: 125,
        height: 125,
        width: "100%",
        minWidth: "100%",
        maxWidth: "100%"
    },
    columnOne: {
        minHeight: 375,
        height: 375,
        width: "50%",
        minWidth: "50%",
        maxWidth: "50%"
    },
    columnTwo: {
        minHeight: 375,
        height: 375,
        width: "50%",
        minWidth: "50%",
        maxWidth: "50%"
    },
    rowOutterImages: {
        flexDirection: "row",
        display: "flex"
    },
    titled: {
        fontWeight: "bold"
    },
    listitem: {
        height: "100%",
        width: "100%",
        minWidth: "100%",
        backgroundColor: "#eee",
        minWidth: "100%"
    },
    subtitleText: {
        color: "#000",
    },
    hr: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 10,
        marginBottom: 10
    }
});

export default styles;