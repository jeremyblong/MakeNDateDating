import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    container: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    subtitle: {
        fontSize: 18.25,
        fontWeight: "400",
        marginBottom: 12.25
    },
    title: {
        fontSize: 22.25
    }
});

export default styles;