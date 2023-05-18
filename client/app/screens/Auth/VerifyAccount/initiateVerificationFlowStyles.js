import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    spinnerTextStyle: {
        fontSize: 24.75,
        textAlign: "center",
        fontWeight: "bold",
        color: "#fff"
    },
    outterCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center"
    },
    illustrationImage: {
        maxWidth: "100%",
        height: 300,
        borderRadius: 27.25,
        marginTop: 22.25
    },  
    customImageWaiting: {
        width: width * 0.875,
        height: height * 0.425
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    backgroundContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.475)",
        padding: 22.25,
        paddingLeft: 18.25,
        paddingRight: 18.25,
        borderWidth: 2,
        borderColor: "#fff"
    },
    innerText: {
        fontWeight: 'bold', 
        color: "#0496FF", 
        textDecorationLine: "underline", 
        textAlign: "center", 
        fontSize: 25
    },
    uploadContainer: {
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: '#000',
        minHeight: 175,
        height: 175,
        marginBottom: 50,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
    },
    labeled: {
        textAlign: "center",
        fontSize: 20
    },
    thinGreyHR: {
        borderBottomWidth: 2,
        borderBottomColor: "lightgrey",
        marginTop: 17.25,
        marginBottom: 17.25,
        width: "100%"
    },
    contain: {
        paddingHorizontal: 20,
        width: '100%',
    },
    titleAbout: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default styles;
