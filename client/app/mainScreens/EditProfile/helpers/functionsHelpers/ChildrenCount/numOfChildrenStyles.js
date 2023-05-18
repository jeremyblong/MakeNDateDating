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
    labeled: {
        fontWeight: "bold", 
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
    contentList: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
    },
    contentQuest: {
        height: 85,
        justifyContent: 'space-between',
        marginTop: 10,
    },
    lineRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconRight: {
        width: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    innerIconInput: {
        width: 40,
        height: 40,
        maxHeight: 40,
        maxWidth: 40
    },
    labelFloatingStyle: {
        paddingTop: 8
    },
    label: {
        fontSize: 17.25,
        fontWeight: "400",
        marginBottom: 32.25
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
        fontWeight: "bold",
        textDecorationLine: "underline",
        fontSize: 12.25
    }
});
