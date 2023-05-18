import {StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginTop: 12.25,
        marginBottom: 12.25,
        backgroundColor: "#000"
    }
});

export default styles;