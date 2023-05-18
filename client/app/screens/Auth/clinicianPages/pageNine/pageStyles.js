import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    itemPrice: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        alignItems: 'flex-start',
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        minWidth: "100%",
        marginTop: 32.25
    },
    spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
    },
    labeledWo: {
        fontSize: 16.75,
        marginBottom: 17.25,
        marginTop: 10,
        textAlign: "center",
        fontWeight: "400"
    },
    label: {
        fontSize: 16.75,
        marginBottom: 17.25,
        marginTop: 10,
        fontWeight: "400",
        textDecorationLine: "underline"
    },
    touchable: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        minHeight: 82.25,
        minWidth: "100%",
        width: "100%",
        height: 82.25,
        borderWidth: 2,
        borderStyle: "dotted"
    }
});