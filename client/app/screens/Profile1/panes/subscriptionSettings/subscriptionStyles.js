import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    flexedTopContainer: {
        flex: 1
    },
    header: {
        fontSize: 18.25,
        marginVertical: 22.25,
        fontWeight: "400"
    },
    hr: {
        marginTop: 12.25,
        marginBottom: 12.25,
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2
    },
    label: {
    	fontWeight: "400",
    	textAlign: "left",
    	fontSize: 16.25,
        marginTop: 12.25,
        marginBottom: 17.25
    },
    bottomContainer: {
        marginTop: 22.25,
        borderTopColor: "lightgrey",
        borderTopWidth: 2,
        paddingTop: 17.25,
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        paddingBottom: 17.25
    }
});

export default styles;