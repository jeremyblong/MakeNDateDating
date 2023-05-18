import {StyleSheet, Dimensions, Platform} from 'react-native';
import {BaseColor} from '@config';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    topRightPositioned: {
        position: "absolute",
        top: 17.25,
        zIndex: 9999,
        right: 25
    },
    maxedHeight: {
        flex: 1,
        minHeight: Platform.OS === "ios" ? "95%" : "85%"
    }, 
    containerFlex: {
        flex: 1
    },
    contentContainerFlex: {
        flex: 1,
        flexGrow: 1
    },
    footer: {},  
    messageContainer: {
        paddingBottom: 70,
        flexGrow: 1,
        top: Platform.OS === "ios" ? 0 : 0,
        height: Platform.OS === "ios" ? height * 0.9125 : height * 0.925
    },
    examplePrompt: {
        borderWidth: 0.75, 
        borderRadius: 3.25,
        borderColor: "#fff",
        padding: 6.25,
        margin: 12.25,
        marginTop: 1.75
    },  
    spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
    },
    toppedText: {
        margin: 15,
        fontSize: 18.25,
        marginTop: 10
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    renderPriorButton: {
        position: "absolute",
        bottom: Platform.OS === "ios" ? 75 : 25,
        left: 0,
        right: 0,
        maxHeight: 62.25,
        minHeight: 62.25,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        width: "100%",
        borderRadius: 12.25,
        borderWidth: 1.5,
        borderColor: "blue",
        borderStyle: "dashed",
        margin: 0
    },
    initiateText: {
        fontSize: 22.25,
        fontWeight: "500",
        textAlign: "center"
    }
});
export default styles;