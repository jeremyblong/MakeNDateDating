import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    container: {
        margin: 12.25
    },
    topText: {
        fontSize: 15,
        color: "#000"
    },
    label: {
        fontSize: 17.75,
        marginBottom: 20,
        marginTop: 10,
        fontWeight: "400",
        color: "#000"
    },
    hr: {
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2.25,
        marginTop: 12.25,
        marginBottom: 0,
        width: "100%"
    },
    itemPrice: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        alignItems: 'flex-start',
    },
    iconRight: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    linePrice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    }
});

export default styles;