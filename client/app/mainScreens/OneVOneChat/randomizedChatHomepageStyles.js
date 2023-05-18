import {StyleSheet, Dimensions } from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 12.25
    },
    titleWrapper: {

    },
    slider: {
        width: 500,
        minWidth: 500,
        height: 10
    },
    fullWidthIll: {
        width: "100%",
        minWidth: "100%",
        minHeight: 300, 
        height: 300
    },  
    subtitle: {
        fontSize: 16.25,
        fontWeight: "400"
    },  
    contentRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        marginTop: 10,
    },
    contentResultRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    headTitle: {
        fontSize: 22.25,
        fontWeight: "400"
    },  
    inputWrapper: {

    },
    hr: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 10,
        marginBottom: 10
    },
    contentContainer: {
        flex: 1 // pushes the footer to the end of the screen
    },
    footer: {
        height: 100
    }
});

export default styles;