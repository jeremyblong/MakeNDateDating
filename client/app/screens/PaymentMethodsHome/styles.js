import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
    contain: {
        flex: 1,
        padding: 20,
    },
    paymentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingVertical: 5,
        width: '100%',
        marginBottom: 15,
    },
    iconContent: {
        width: 60,
        marginRight: 10,
        alignItems: 'center',
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    loadingText: {
        marginBottom: 32.25,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    centeredInside: {
        marginTop: 125
    },
    cardIcon: {
        minWidth: 45,
        width: 45,
        height: 37.25,
        minHeight: 37.25,
        maxHeight: 37.25,
        maxWidth: 45
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
