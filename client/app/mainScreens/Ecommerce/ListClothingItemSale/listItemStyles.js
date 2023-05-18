import {StyleSheet, Dimensions } from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';


const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 20,
    },
    mainTitle: {
        textAlign: "left",
        fontSize: 27.25,
        color: "#000"
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    illustration: {
        width: "100%",
        height: 225,
        marginTop: 17.25
    },
    fileNameText: {
        fontWeight: "bold",
        marginTop: 15,
        borderTopColor: "lightgrey",
        borderTopWidth: 1.25,
        paddingTop: 15
    },
    spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
    },
    touchableButton: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderStyle: "dotted",
        borderRadius: 10,
        borderColor: "lightgrey",
        minHeight: 75
    },
    innerText: {
        fontWeight: "bold",
        color: "darkblue"
    },
    labeledTier: {
        fontSize: 17.75,
        marginBottom: 20,
        marginTop: 10,
        marginBottom: 22.25,
        marginTop: 15
    },
    labeled: {
        fontSize: 17.75,
        marginBottom: 20,
        marginTop: 10
    },
    label: {
        fontSize: 23.75,
        marginBottom: 7.25,
        marginTop: 10,
        marginTop: 30,
        textDecorationLine: "underline"
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