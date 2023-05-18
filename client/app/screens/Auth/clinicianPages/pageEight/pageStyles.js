import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    itemPrice: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        alignItems: 'flex-start',
    },
    linePrice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    row: {
        flexDirection: "row",
        display: "flex"
    },
    oneThird: {
        flexDirection: "column",
        display: "flex",
        width: "27.25%",
        maxWidth: "27.25%",
        minWidth: "27.25%",
        borderWidth: 2,
        margin: 3.25,
        borderColor: "lightgrey",
        justifyContent: 'center',
        alignContent: "center",
        alignItems: "center",
        borderRadius: 8.25,
        marginTop: 15
    },
    selectedOneThird: {
        flexDirection: "column",
        display: "flex",
        width: "27.25%",
        maxWidth: "27.25%",
        minWidth: "27.25%",
        borderWidth: 2,
        margin: 3.25,
        borderColor: "#D81159",
        justifyContent: 'center',
        alignContent: "center",
        alignItems: "center",
        borderRadius: 8.25,
        marginTop: 15
    },
    fullWidthTouchable: {
        minWidth: "100%",
        marginTop: 8.25,
        width: "100%",
        borderWidth: 2,
        borderColor: "lightgrey",
        minHeight: 55,
        justifyContent: 'center',
        alignContent: "center",
        alignItems: "center",
    },
    fullWidthTouchableActive: {
        minWidth: "100%",
        marginTop: 8.25,
        width: "100%",
        borderColor: "#D81159",
        borderWidth: 2,
        minHeight: 55,
        justifyContent: 'center',
        alignContent: "center",
        alignItems: "center",
    },
    touchableCustomTxtActive: {
        fontSize: 18.25,
        textAlign: "left",
        paddingTop: 5,
        paddingBottom: 5,
        paddingHorizontal: 5
    },  
    touchableCustomTxt: {
        fontSize: 18.25,
        textAlign: "left",
        paddingTop: 5,
        paddingBottom: 5,
        paddingHorizontal: 5
    },  
    innerText: {
        fontSize: 15,
        textAlign: "left",
        paddingTop: 5,
        paddingBottom: 5,
        paddingHorizontal: 5
    },  
    fourtyPercent: {
        flexDirection: "column",
        justifyContent: 'center',
        alignContent: "center",
        alignItems: "center",
        display: "flex",
        width: width * 0.375,
        maxWidth: width * 0.375,
        minWidth: width * 0.375
    },
    sixtyPercent: {
        flexDirection: "column",
        display: "flex",
        width: width * 0.625,
        maxWidth: width * 0.625,
        minWidth: width * 0.625
    },
    iconRight: {
        width: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});