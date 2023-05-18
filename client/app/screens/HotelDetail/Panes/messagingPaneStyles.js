import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    flexBottomContainer: {
        flex: 1
    }, 
    flexedTopContainer: {
        flex: 1
    },
    label: {
        fontSize: 17.75,
        marginBottom: 20,
        marginTop: 10,
        fontWeight: "400"
    },
    mainWrapper: {
        flex: 1
    },
    innerIconInput: {
        width: 22.25,
        height: 22.25,
        maxHeight: 22.25,
        maxWidth: 22.25
    },
    time: {
        fontSize: 11,
        color: "#808080",
    },
    dialogContainerStyle: {
        borderRadius: 10,
        width: width - 90,
        paddingHorizontal: 10 * 3.0,
        paddingTop: -10,
        paddingBottom: 10 * 2.0
    },
    modalHrLine: {
        borderBottomColor: "#000",
        borderBottomWidth: 2.25,
        marginTop: 7.75,
        marginBottom: 7.75,
        width: "100%"
    },
    cancelButtonStyle: {
        flex: 0.425,
        backgroundColor: "#D2042D",
        borderRadius: 10 - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginRight: 10 + 5.0,
    },
    logOutButtonStyle: {
        flex: 0.575,
        backgroundColor: "blue",
        borderRadius: 10 - 5.0,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10 + 5.0
    },
    activityPostingToDB: {
        position: 'absolute',
        left: -23.5,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.535)",
        height: "100%",
        minWidth: width + 25,
        width: width + 25,
        minHeight: "100%",
        zIndex: 9999999999999999
    },
    name: {
        fontSize: 16,
        fontWeight: "400"
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
    },
    labelTextInput: {
        fontWeight: "400",
        textAlign: "left",
        fontSize: 20,
        marginTop: 17.5
    },
    hrLine: {
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2.75,
        marginTop: 22.25,
        marginBottom: 22.25,
        width: "100%"
    },
    hrLineTopPortion: {
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2.75,
        marginTop: 27.25,
        marginBottom: 3.25,
        width: "100%"
    },
    charLengthCheckText: {
        fontWeight: "400",
        textAlign: "left",
        fontSize: 20,
        marginTop: 17.5
    },
    textFieldContainerStyle: {
        marginHorizontal: 10,
        backgroundColor: "#fff",
        paddingVertical: 10 + 3.0,
        paddingHorizontal: 10 + 3.25,
        borderRadius: 10,
        elevation: 13.5,
        marginTop: 10 * 2.0,
        borderWidth: 0.75,
        borderColor: "blue"
    },
    outterMostWrapperComment: {
        borderWidth: 1.5, 
        borderColor: "blue",
        marginTop: 32.5
    },
    containerFlatList: {
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: 165
    },
    contentFlatList: {
        marginLeft: 16,
        flex: 1,
    }
});

export default styles;