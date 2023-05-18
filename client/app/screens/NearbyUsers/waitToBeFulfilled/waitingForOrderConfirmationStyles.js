import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../../constants/styles.js"; 

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    avatarImageTouchable: {},
    largerPriceText: {
        fontSize: 22.5,
        paddingRight: 7.25,
        textAlign: "right",
        fontWeight: "bold",
        color: Colors.greenColor
    },
    threeQuarterCol: {
        flexDirection: "column",
        display: "flex",
        maxWidth: "85%",
        minWidth: "85%", 
        width: "85%"
    },
    hr: {
        marginTop: 12.25,
        marginBottom: 12.25,
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 1.25
    },
    placeholderMediaSmaller: {
        backgroundColor: Colors.secondaryColor, width: 52.5, height: 52.5
    },
    placeholderMedia: {
        backgroundColor: Colors.secondaryColor, width: 82.5, height: 82.5
    },
    centered: {
        justifyContent: 'center',
        alignItems: "center",
        alignContent: "center"
    },
    mainTextPlaceholder: {
        fontWeight: "bold",
        fontSize: 24.25,
        marginBottom: 13.25,
        textAlign: "center"
    },
    maxedDesignedIcon: {
        maxWidth: 265,
        maxHeight: 265,
        height: 265,
        width: 265
    },
    blackUnderlinedText: {
        fontWeight: "bold",
        color: "#000",
        textDecorationLine: "none"
    },
    secondRowHeaderText: {
        fontSize: 17.25,
        marginTop: 12,
        paddingLeft: 7.25,
        textAlign: "left",
        fontWeight: "bold",
        color: "#000"
    },
    smallerRowContainer: {
        flexDirection: "row",
        display: "flex",
        maxWidth: "100%",
        width: "100%",
        minWidth: "100%",
        textAlign: "left"
    },
    nameText: {
        fontWeight: "bold",
        textAlign: "left",
        fontSize: 14.75,
        color: "grey",
        marginTop: 8.25
    },
    rightTextAlongImage: {
        fontWeight: "bold",
        textAlign: "left",
        fontSize: 16,
        marginTop: 3,
        marginLeft: 5.25
    },
    smallerRowContainerLonger: {
        flexDirection: "row",
        display: "flex",
        maxWidth: "100%",
        textAlign: "left",
        width: "100%",
        minWidth: "100%"
    },
    rowOnlyMaxed: {
        flexDirection: "row",
        marginTop: 14.25,
        display: "flex",
        minWidth: "100%",
        width: "100%"
    },
    rowOnly: {
        flexDirection: "row",
        display: "flex",
    },
    boxedContainer: {
        borderWidth: 1.25,
        marginTop: 15.25,
        borderColor: Colors.secondaryColor,
        backgroundColor: "#fff",
        padding: 12.25,
        borderRadius: 6.25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.66,
        shadowRadius: 6.68,
        elevation: 11
    },
    superSmallIconImage: {
        maxWidth: 26.25,
        maxHeight: 26.25,
        height: 26.25,
        width: 26.25
    },
    avatarListItem: {
        maxWidth: 45,
        maxHeight: 45,
        height: 45,
        width: 45,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: Colors.secondaryColor
    },
    oneQuarterCol: {
        flexDirection: "column",
        display: "flex",
        maxWidth: "15%",
        width: "15%",
        minWidth: "15%"
    },
    oneThirdColumn: {
        flexDirection: "column",
        display: "flex",
        maxWidth: "37.5%",
        width: "37.5%",
        minWidth: "37.5%"
    },
    twoThirdColumn: {
        flexDirection: "column",
        display: "flex",
        maxWidth: "62.5%",
        width: "62.5%",
        minWidth: "62.5%"
    }
});

export default styles;
