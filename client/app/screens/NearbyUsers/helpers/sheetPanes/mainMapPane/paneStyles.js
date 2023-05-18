import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    rightIconArrow: {
        maxWidth: 30,
        maxHeight: 30,
        minHeight: 30,
        minWidth: 30,
        position: "absolute",
        right: 12.25,
        top: -16.25,
    },
    listitemSelectedActive: {
        maxWidth: width,
        height: (height * 0.20) - 75,
        maxHeight: (height * 0.20) - 75,
        width,
        left: -20,
        backgroundColor: "#9bcef2"
    },
    avatarIcon: {
        maxWidth: 45,
        maxHeight: 40,
        minHeight: 40,
        minWidth: 45
    },
    columned: {
        display: "flex",
        flexDirection: "column",
        borderLeftColor: "lightgrey",
        borderLeftWidth: 1
    },
    columnText: {
        fontWeight: "bold",
        textDecorationLine: "underline",
        minWidth: 72.5,
        fontSize: 17.5,
        marginRight: 12.75,
        textAlign: "right",
        width: 72.5,
        color: "blue"
    },
    labelTitleMapped: {
        fontWeight: "bold",
        color: "#000"
    },
    subLabeledMapped: {},
    listitemSettingsTop: {
        maxWidth: width,
        height: (height * 0.20) - 75,
        maxHeight: (height * 0.20) - 75,
        width,
        left: -20,
        borderTopColor: "lightgrey",
        borderTopWidth: 1
    },
    listitemSettings: {
        maxWidth: width,
        height: (height * 0.20) - 75,
        maxHeight: (height * 0.20) - 75,
        width,
        left: -20
    }
});

export default styles;