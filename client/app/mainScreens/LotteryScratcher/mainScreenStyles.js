import { StyleSheet, Dimensions, Platform } from 'react-native';
import * as Utils from '@utils';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    scratcherView: {
        minHeight: height - 50,
        height: height - 50,
        width: "100%",
        minWidth: "100%"
    },
    scratcherViewImage: {
        minHeight: height - 50,
        height: height - 50,
        width: "100%",
        minWidth: "100%",
        zIndex: 9999999999999999999
    },
    scratcherViewImageTop: {
        minHeight: height,
        height: height,
        width: width,
        minWidth: width,
        zIndex: 99999999999999999999999999999999999999
    },
    customBackground: {
        minHeight: height - 50,
        height: height - 50,
        width: "100%",
        minWidth: "100%"
    },
    placeholderMediaSmaller: {
        backgroundColor:  "#0496FF", width: 52.5, height: 52.5
    },
    placeholderMedia: {
        backgroundColor:  "#0496FF", width: 82.25, height: 82.5
    },
    containerMiddle: {
        flex: 1,
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        zIndex: 999999999999999999999999999999999999999999999999999999999999,
        minHeight: height,
        height
    },
    cardMiddle: {
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        borderWidth: 1.75,
        width: '97.5%',
    },
    subTextMiddle: {
        fontSize: 17.25,
        textAlign: "left",
        marginBottom: 20,
    },
    titleMiddle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: "left",
        marginBottom: 20,
    },
    inputMiddle: {
        borderBottomColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 20,
        padding: 10,
        width: '90%',
    },
    buttonMiddle: {
        borderRadius: 5,
        padding: 10,
        width: '90%',
    },
    buttonTextMiddle: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    }
});
