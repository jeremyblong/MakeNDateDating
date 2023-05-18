import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        margin: 0,
        padding: 0
    },
    contentContainer: {
        flex: 1
    },
    footer: {},
    buttonInnerText: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold"
    },
    absoluteMiddle: {
        backgroundColor: "#0496FF",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        paddingTop: 8.75,
        paddingBottom: 8.75,
        paddingLeft: 72.5,
        paddingRight: 72.5,
        left: -20,
        borderWidth: 1.25,
        borderColor: "#fff",
        borderRadius: 12.75
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    emphizedText: {
        fontWeight: "bold",
        fontSize: 18.25,
        textAlign: "center",
        textDecorationLine: "underline",
        color: "#fff",
        left: -18.75
    },
    topFixedText: {
        fontSize: 18.25,
        textAlign: "center",
        color: "#fff",
        left: -18.75,
        paddingBottom: 4.25
    },
    propertyAmountContentStyle: {
        borderWidth: 1.0,
        alignItems: 'center',
        height: 37.5,
        justifyContent: 'center',
        borderRadius: 10 - 5.0,
        backgroundColor: "#fff",
        borderColor: "#D81159",
        bottom: 2.75
    },
    subCategoryStyleText: { 
        fontWeight: "bold", 
        textDecorationLine: "underline", 
        fontSize: 17.25, 
        color: "#0496FF",
        paddingTop: 12.5
    },
    hr: {
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2.25,
        marginTop: 12.25,
        marginBottom: 12.25,
        width: "100%"
    },
    modalHrLine: {
        borderBottomColor: "#000",
        borderBottomWidth: 2.25,
        marginTop: 7.75,
        marginBottom: 7.75,
        width: "100%"
    },
    innerModalWrapper: {
        backgroundColor: "#fff"
    },
    showMoreOrLess: {
        fontWeight: "bold", 
        color: "#0496FF", 
        paddingBottom: 0, 
        textDecorationLine: "underline",
        paddingLeft: 17.75, 
        paddingTop: 7.5,
        backgroundColor: "#fff", 
        width, 
        paddingBottom: 32.5
    },
    propertyPhotosModalImageStyle: {
        width: "95.75%",
        minWidth: "95.75%",
        minHeight: height * 0.275,
        maxHeight: height * 0.275,
        height: height * 0.275,
        borderRadius: 10,
        marginRight: 10 + 8.0,
        margin: 7.25
    },
    textInnerContainer: {
        padding: 7.25,
        display: "flex",
        flexDirection: "column"
    }, 
    textInnerLabel: {
        fontWeight: "bold",
        textDecorationLine: "underline",
        marginBottom: 4.25,
        color: "#0496FF",
        fontSize: 17.25
    },
    imageNameWrapped: {
        fontWeight: "bold",
        color: "#000",
        fontSize: 17.25
    },
    propertyPhotosStyle: {
        width: 120.0,
        minWidth: 120.0,
        minHeight: 150.0,
        height: 150.0,
        borderRadius: 10,
        marginRight: 10 + 8.0
    },
    titled: {
        marginHorizontal: 10 * 1.675,
        fontSize: 19.5,
        marginBottom: 7.75,
        fontWeight: "bold"
    },
    mapStyle: {
        borderRadius: 10,
        marginVertical: 10 - 5.0,
        overflow: 'hidden',
        elevation: 3.0,
        marginHorizontal: 10 * 2.0
    },
    buildingTypeText: {
        fontWeight: "bold",
        color: "#0496FF"
    },
    buildingTypeTextSub: {
        fontWeight: "bold",
        color: "#000"
    },
    thinnerHr: {
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2.25,
        marginTop: 8.25,
        marginBottom: 8.25,
        width: "100%"
    },
    flatListBottomView: {}, 
    positionRightTouchable: {
        position: "absolute",
        bottom: 15,
        right: 15
    },
    positionLeftReply: {
        position: "absolute",
        bottom: 15,
        left: 21.75
    }, 
    positionLeftReplyLikeOutter: {
        position: "absolute",
        bottom: 15,
        left: 100
    }, 
    commentSubmissionTouchable: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        paddingBottom: 6.5,
        borderBottomWidth: 2,
        borderBottomColor: "#D81159",
        paddingRight: 22.5,
        paddingLeft: 22.5,
        borderTopWidth: 2,
        paddingTop: 6.5,
        borderTopColor: "#D81159"
    },
    touchableInnerText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginLeft: 12.5,
        textDecorationLine: "underline",
        color: "#000"
    },
    rowOnly: {
        display: "flex",
        flexDirection: "row"
    },
    replyTextLeft: {
        textAlign: "left",
        color: "grey",
        fontSize: 16.75,
        textDecorationLine: "underline"
    },
    replyTextLeftLike: {
        textAlign: "left",
        color: "#0496FF",
        opacity: 0.675,
        fontSize: 16.75,
        textDecorationLine: "underline"
    },
    replyTextLeftLikeNested: {
        textAlign: "right",
        color: "#0496FF",
        opacity: 0.675,
        fontSize: 16.75,
        textDecorationLine: "underline"
    },
    heartImageIconSubbed: {
        maxWidth: 32.5,
        maxHeight: 32.5,
        width: 32.5,
        height: 32.5,
        position: "absolute",
        left: 0,
        bottom: 0
    },
    heartImageIcon: {
        maxWidth: 32.5,
        maxHeight: 32.5,
        width: 32.5,
        height: 32.5
    },
    thickerBlueHr: {
        borderBottomColor: "#0496FF",
        borderBottomWidth: 2.75,
        marginTop: 13.75,
        marginBottom: 13.75,
        width: "82.5%"
    },
    thickerBlueHrTop: {
        borderBottomColor: "#0496FF",
        borderBottomWidth: 2.75,
        marginTop: 4.75,
        marginBottom: 13.75,
        width: "82.5%"
    },
    mainChunkText: {
        fontWeight: "bold",
        color: "#D81159",
        textDecorationLine: "underline"
    },
    aminitiesContentStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10 - 3.0,
        marginHorizontal: 10 * 2.0,
        maxWidth: width * 0.825
    },
    ownerInfoContentStyle: {
        position: 'absolute',
        bottom: 0.0,
        height: 82.5,
        backgroundColor: "#fff",
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 10 * 2.0,
        borderTopColor: 'rgba(128, 128, 128, 0.2)',
        borderTopWidth: 1.0,
        elevation: 2.0,
    },
    numericalText: {
        fontSize: 22.5, 
        fontWeight: "bold", 
        color: "#fff"
    },
    innerNumText: {
        color: "#0496FF"
    },  
    numericalTextSub: {
        marginTop: 10 - 6.25,
        fontWeight: "bold",
        textAlign: "center"
    },
    ownerContactContentStyle: {
        paddingLeft: 22.5
    },
    numericalWrapper: {
        backgroundColor: "#000",
        borderWidth: 2.75,
        paddingLeft: 7.25,
        paddingRight: 7.25,
        paddingTop: 3.75,
        paddingBottom: 3.75,
        marginBottom: 8.25,
        borderColor: "#0496FF"
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: 60.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
        elevation: 0.0
    },
    columned: {
        display: "flex",
        flexDirection: "column"
    },
    containerFlatList: {
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: 182.5
    },
    positionLeftReplyLikeOutterNested: {
        position: "absolute",
        bottom: 15,
        left: 13.25
    }, 
    positionRightTouchableNested: {
        position: "absolute",
        bottom: 7.75,
        right: 32.5
    },
    innerRowWrapper: {
        backgroundColor: "#fff",
        borderRadius: 75,
        padding: 4.25
    },
    centeredRowWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        paddingTop: 10
    },
    hookedArrowUp: {
        maxWidth: 37.5,
        maxHeight: 37.5,
        width: 37.5,
        height: 37.5,
        position: "absolute",
        left: 12.5,
        top: 5
    },
    hookedArrowUpRight: {
        maxWidth: 37.5,
        maxHeight: 37.5,
        width: 37.5,
        height: 37.5,
        position: "absolute",
        right: 12.5,
        top: 5
    },
    blackBold: {
        color: "#000",
        fontWeight: "bold"
    },
    greenTextTwo: {
        color: "#58D68D",
        fontWeight: "bold",
        fontSize: 21.25,
        marginBottom: 4.25
    },
    redTextTwo: {
        color: "red",
        fontWeight: "bold",
        fontSize: 21.25,
        marginBottom: 4.25
    },
    greenText: {
        color: "#58D68D",
        fontWeight: "bold"
    },
    redText: {
        color: "red",
        fontWeight: "bold"
    },
    replyingNoteText: {
        fontWeight: "bold",
        textAlign: "center",
        textDecorationLine: "underline",
        fontSize: 15,
        color: "#D81159"
    },
    containerNestedFlatList: {
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: 165,
        maxWidth: width * 0.925,
        width: width * 0.925
    },
    topContainerSub: {
        flexDirection: "row", 
        paddingBottom: 12.5,
        paddingTop: 12.5,
        display: "flex", 
        borderTopWidth: 1,
        borderTopColor: "lightgrey",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    outterRowLayer: {
        display: "flex",
        flexDirection: "row",
        paddingLeft: 12.5,
        alignItems: 'flex-start'
    },
    contentFlatList: {
        marginLeft: 16,
        flex: 1,
    },
    contentNestedFlatList: {
        marginLeft: 12.5,
        flex: 1,
    },
    innerIconInput: {
        width: 37.5,
        height: 37.5,
        maxHeight: 37.5,
        maxWidth: 37.5
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        marginBottom: 6
    },
    separator: {
        height: 1,
        backgroundColor: "#CCCCCC"
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 20,
        marginLeft: 20
    },
    mainTextSub: {
        textAlign: "left"
    },
    timeSub: {
        fontSize: 11,
        color: "#808080",
        position: "absolute",
        left: 0
    },
    nameSub: {
        fontSize: 16,
        fontWeight: "bold"
    },
    time: {
        fontSize: 11,
        color: "#808080",
        textAlign: "left",
        paddingBottom: 12.5
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "left",
        position: "absolute",
        left: 0
    },
    dialogContainerStyle: {
        borderRadius: 10,
        width: width - 90,
        paddingHorizontal: 10 * 3.0,
        paddingTop: -10,
        paddingBottom: 10 * 2.0
    },
    cancelButtonStyle: {
        flex: 0.50,
        backgroundColor: "#D2042D",
        borderRadius: 10 - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        marginRight: 10 + 5.0,
    },
    logOutButtonStyle: {
        flex: 0.50,
        backgroundColor: "#0496FF",
        borderRadius: 10 - 5.0,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10 + 5.0
    }
});

export default styles;