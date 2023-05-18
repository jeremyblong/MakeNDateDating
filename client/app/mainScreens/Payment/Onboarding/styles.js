import {StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    containerStyleViewview: {
        width,
        height: "100%",
        minHeight: "100%",
        minWidth: width
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
    }
});

export default styles;