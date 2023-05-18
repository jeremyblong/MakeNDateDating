import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        margin: 12.25,
        minHeight: "90%",
        marginBottom: 12.25
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    container: {
        flex: 1
    },
    titleWrapper: {

    },
    inputWrapper: {

    },
    contentContainer: {
        flex: 1
    },
    footer: {
        height: 82.25,
        marginTop: 10
    }
});

export default styles;