import {StyleSheet} from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';

export default StyleSheet.create({
    hr: {
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2.25,
        marginTop: 12.25,
        marginBottom: 12.25,
        width: "100%",
        minWidth: "100%"
    },
    placeholderMediaSmaller: {
        backgroundColor: "#0496FF", width: 52.5, height: 52.5
    },
    placeholderMedia: {
        backgroundColor: "#0496FF", width: 82.5, height: 82.5
    },
    selectedTime: {
        fontSize: 22.25,
        fontWeight: "bold",
        color: "darkred",
        textAlign: "center",
        textDecorationLine: "underline"
    },
    label: {
        fontSize: 16.75,
        marginBottom: 17.25,
        marginTop: 10,
        fontWeight: "400",
        textDecorationLine: "underline"
    },
    paragraphText: {
        fontWeight: "bold"
    }
});
