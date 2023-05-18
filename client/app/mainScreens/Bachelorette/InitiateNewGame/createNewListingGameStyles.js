import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    textInputCustom: {
        marginTop: 20
    },
    spacerContainer: {
        marginTop: 15
    },
    hr: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 20,
        marginBottom: 10
    },
    realitytvImage: {
        width,
        maxHeight: 200,
        marginTop: 15,
        marginBottom: 10,
        height: 200,
        maxWidth: width
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
});

export default styles;