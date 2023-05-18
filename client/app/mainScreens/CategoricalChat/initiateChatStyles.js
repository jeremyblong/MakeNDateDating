import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    serviceItemBlock: {
        minHeight: 55,
        height: 55,
        borderWidth: 0.75,
        borderColor: "lightgrey",
        margin: 6.25
    },
    hr: {
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 12.25,
        marginBottom: 12.25,
        width: "100%"
    },
    label: {
        fontWeight: "bold", 
        fontSize: 16.25,
        marginBottom: 12.25,
        marginTop: 17.25
    },
    topRightPositioned: {
        position: "absolute",
        top: 14.25,
        right: 14.25
    },
    serviceItemBlockActive: {
        minHeight: 55,
        height: 55,
        borderWidth: 0.75,
        margin: 6.25
    },
    container: {
        margin: 12.25,
        marginTop: 20
    },
    textInner: {
        fontWeight: "400",
        fontSize: 20,
        paddingTop: 13.25,
        paddingLeft: 10
    }
});

export default styles;