import { StyleSheet, Dimensions } from "react-native";
import * as Utils from '@utils';


const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    map: {
        minWidth: width, 
        minHeight: height * 0.925, 
        height: height * 0.925, 
        width,
        zIndex: 999999
    },
    customMapStyle: {
        backgroundColor: "black"
    },
    calloutMain: {
        backgroundColor: "black"
    },
    conditionalHR: {
        borderBottomColor: "#fff",
        borderBottomWidth: 1.75,
        marginTop: 32.25,
        marginBottom: 62.5,
        width: "100%"
    },
    blockImage: {
        height: Utils.scaleWithPixel(150),
        width: '100%',
        borderRadius: 17.25
    },
    hrSpacer: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 12.25,
        marginBottom: 27.25
    },
    centerMeWrapper: {
        flexDirection: 'row', 
        justifyContent: 'center',
        alignContent: "center",
        alignItems: "center"
    },
    mainContainerIterated: {
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: "#000",
        maxWidth: "75%",
        bottom: -35,
        borderRadius: 17.25
    },
    contentService: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    serviceItemBlock: {
        alignItems: 'center',
        justifyContent: 'center',
    
        width: 60,
    },
    absoluteCentered: {
        position: "absolute",
        bottom: 15,
        left: 0,
        zIndex: 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
    },  
    modalHrLine: {
        borderBottomColor: "#eee",
        borderBottomWidth: 2.25,
        marginTop: 7.75,
        marginBottom: 7.75,
        width: "100%"
    },
    margined: {
        zIndex: 99999999999999999999999999999999999999999999999999,
        position: 'absolute', 
        top: 10, 
        left: 0, 
        right: 0, 
        bottom: 20, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    backgroundRoundedSimpleDefaulted: {
        backgroundColor: "black",
        marginLeft: 17.5,
        marginRight: 17.5,
        maxHeight: 82.25,
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 12.25,
        zIndex: 9999999999999999999999999999999999999999,
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: "#fff"
    },
    dialogContainerStyle: {
        borderRadius: 10,
        width: width - 90,
        zIndex: 99999999999999999999999999999999999999999999999999999999999999999999999999,
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
    dialogYesButtonStyle: {
        flex: 0.50,
        backgroundColor: "#0496FF",
        borderRadius: 10 - 5.0,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10 + 5.0
    },
    backgroundRoundedSimple: {
        backgroundColor: "black",
        marginLeft: 17.5,
        marginRight: 17.5,
        marginTop: 10.5,
        height: 155,
        borderRadius: 12.25,
        zIndex: 9999999999999999999999999999999999999999,
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 2,
        borderColor: "#fff"
    },
    greenCashText: {
        color: "#58D68D",
        fontWeight: "bold",
        textDecorationLine: "underline"
    }, 
    emphisizedTextRed: {
        color: "#D81159",
        fontWeight: "bold",
        textDecorationLine: "underline"
    }, 
    emphisizedText: {
        color: "#0496FF",
        fontWeight: "bold",
        textDecorationLine: "underline"
    }, 
    columnOnly: {
        display: "flex",
        flexDirection: "column",
        position: 'absolute', 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    selectedDataTextBottom: {
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        zIndex: 9999999999999999999999999999999999999999,
        position: 'absolute', 
        left: 0, 
        right: 0, 
        bottom: 7, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    selectedDataText: {
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        zIndex: 9999999999999999999999999999999999999999,
        position: 'absolute', 
        top: 12.25, 
        left: 0, 
        right: 0, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    bottomRightAlignedTouchable: {
        position: "absolute",
        bottom: 22.25,
        right: 22.25,
        zIndex: 999999999999999999999999999999,
        width: 60,
        height: 52.25
    },
    bottomRightAlignedTouchableImage: {
        maxWidth: 60, 
        width: 60,
        tintColor: "#fff",
        maxHeight: 45,
        zIndex: 999999999999999999999999999999,
        height: 45
    },
    containerMiddle: {
        flex: 1,
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        zIndex: 999999999999999999999999999999999999999999999999999999999999
    },
    cardMiddle: {
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        borderWidth: 2,
        borderColor: "#fff",
        width: '80%',
    },
    titleMiddle: {
        fontSize: 21.25,
        marginBottom: 20,
    },
    inputMiddle: {
        borderBottomColor: '#999',
        borderBottomWidth: 1,
        marginBottom: 20,
        padding: 10,
        width: '90%',
    },
    buttonMiddle: {
        borderRadius: 5,
        padding: 10,
        width: '90%',
    },
    buttonTextMiddle: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    }
});

export default styles;
