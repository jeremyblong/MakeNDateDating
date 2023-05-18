import {StyleSheet, Dimensions } from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';


const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 20,
    },
    labeled: {
        fontSize: 16.75,
        marginBottom: 10,
        marginTop: 10
    },
    streamImage: {
        maxWidth: "100%",
        minWidth: "100%",
        minHeight: 325,
        height: 325,
        marginTop: 42.25,
        maxHeight: 300
    },
    mainTitle: {
        textAlign: "left",
        fontSize: 27.25,
        fontWeight: "bold",
        color: "#000"
    },
    titled: {
        fontWeight: "bold"
    },
    listitem: {
        height: "100%",
        width: "100%",
        minWidth: "100%",
        backgroundColor: "#eee",
        minWidth: "100%"
    },
    subtitleText: {
        color: "#000",
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