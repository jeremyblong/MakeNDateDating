import {StyleSheet, Dimensions} from 'react-native';
import * as Utils from '@utils';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center"
    },
    contentContainerScroll: {
        backgroundColor: "#fff"
    },
    container: {
        margin: 17.25
    },
    containerStyleViewview: {
        width: "95%",
        height: height * 0.975,
        maxHeight: height * 0.975,
        maxWidth: "95%"
    },  
    mainAuthModal: {
        width: "95%",
        height: height * 0.975,
        maxHeight: height * 0.975,
        maxWidth: "95%"
    },  
    labeled: {
        fontWeight: "400", 
        color: "#000",
        fontSize: 16.25,
        marginTop: 17.25
    },
    imgBanner: {
        width: '100%',
        height: 325
    },
    hrGrey: {
        width: "100%",
        borderBottomWidth: 2,
        borderBottomColor: "lightgrey",
        marginTop: 22.25,
        marginBottom: 22.25
    },
    mediumHR: {
        borderBottomColor: "#fff",
        borderBottomWidth: 2,
        marginTop: 12.25,
        marginBottom: 12.25,
        width: "100%"
    },
    inputFloatingStylesMultiline: {
        textAlignVertical: 'top'
    },
    innerIconInputMulti: {
        width: 22.75,
        height: 22.75,
        maxHeight: 22.75,
        maxWidth: 22.75,
        marginTop: 27.25
    },
    innerIconInputMultiOne: {
        width: 22.75,
        height: 22.75,
        maxHeight: 22.75,
        maxWidth: 22.75,
        marginTop: 18.25
    },
    innerIconInput: {
        width: 22.75,
        height: 22.75,
        maxHeight: 22.75,
        maxWidth: 22.75
    },
    labelFloatingStyle: {
        paddingTop: 8
    },
    inputFloatingStyles: {
        paddingLeft: 7.75,
        textAlignVertical: "top",
        color: "#000",
        paddingTop: 14.25,
        maxWidth: "88.25%"
    },
    showCountdownStylesCustom: {
        color: "red",
        fontWeight: "400",
        textDecorationLine: "underline",
        fontSize: 12.25
    }
});
