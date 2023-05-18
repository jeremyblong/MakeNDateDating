import {StyleSheet} from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';

export default StyleSheet.create({
    hr: {
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2.25,
        marginTop: 12.25,
        marginBottom: 0,
        width: "100%"
    },
    selectedTime: {
        fontSize: 32.25,
        fontWeight: "400",
        textAlign: "center",
        textDecorationLine: "underline"
    },
    labeled: {
        fontSize: 16.75,
        marginBottom: 17.25,
        marginTop: 10,
        textAlign: "center",
        fontWeight: "400"
    },
    spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
    },
    warningStaking: {
        color: "#fff",
        fontSize: 15, 
        textAlign: "left"
    }
});
