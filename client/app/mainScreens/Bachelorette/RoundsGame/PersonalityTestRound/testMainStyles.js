import {StyleSheet, Dimensions} from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center"
    },
    contentContainerScroll: {
        backgroundColor: "#fff"
    },
    container: {
        margin: 17.25
    },
    innerTextCustomLarger: {
        color: "#fff",
        marginRight: 27.25,
        textDecorationLine: "underline",
        marginLeft: 27.25,
        marginTop: 12.25,
        fontSize: 24.25,
        textAlign: "left",
        fontWeight: "bold"
    }, 
    innerTextCustom: {
        color: "#fff",
        marginRight: 27.25,
        marginLeft: 27.25,
        fontSize: 24.25,
        textAlign: "center"
    },  
    customScreeningQuestionText: {
        fontSize: 22.25,
        textAlign: "left",
        marginBottom: 32.25
    },
    selectableList: {
        marginTop: 32.25,
        paddingBottom: 150
    },
    selectableListLonger: {
        marginTop: 32.25
    },
    fullwidthTextContainerLarger: {
        minHeight: 375, 
        marginBottom: 50,
        borderRadius: 17.25,
        width: "100%",
        minWidth: "100%",
        backgroundColor: "#D81159"
    }, 
    fullwidthTextContainerBlue: {
        minHeight: 100, 
        marginBottom: 20,
        borderRadius: 17.25,
        paddingBottom: 10,
        paddingTop: 10,
        width: "100%",
        minWidth: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center"
    },  
    fullwidthTextContainer: {
        minHeight: 100, 
        marginBottom: 20,
        borderRadius: 17.25,
        paddingBottom: 10,
        paddingTop: 10,
        width: "100%",
        minWidth: "100%",
        backgroundColor: "#D81159",
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center"
    },  
    toppedIcon: {
        maxWidth: 62.5,
        maxHeight: 62.5,
        borderWidth: 1.25,
        borderRadius: 22.25,
        backgroundColor: "#000",
        margin: 4.25
    },
    row: {
        flexDirection: "row",
        display: "flex"
    },
    bottomText: {
        fontSize: 16
    },
    topText: {
        fontWeight: "bold",
        fontSize: 18
    },
    numberIcon: {
        maxWidth: 70,
        height: 70,
        maxHeight: 70,
        width: 70
    },
    smallestCol: {
        flexDirection: "column",
        maxWidth: "20%",
        width: "20%"
    },
    largestCol: {
        flexDirection: "column",
        maxWidth: "80%",
        width: "80%"
    },
    customTextInput: {
        backgroundColor: "#D81159",
        color: "#fff",
        maxHeight: 275,
        textAlignVertical: "top",
        fontSize: 18,
        margin: 12.25
    },
    wrapperSelectable: {
        minHeight: 100,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center",
        height: 100, 
        width: "100%",
        minWidth: "100%",
        borderWidth: 2,
        borderColor: "#ddd",
        marginTop: 11.25,
        borderRadius: 8.25
    },
    wrapperSelectableLarger: {
        minHeight: 150,
        height: 150, 
        maxHeight: 150,
        overflow: "hidden",
        paddingRight: 12.25,
        width: "100%",
        minWidth: "100%",
        borderWidth: 2,
        borderColor: "#ddd",
        marginTop: 22.25,
        paddingTop: 12.25,
        borderRadius: 8.25
    },
    labeled: {
        fontWeight: "bold", 
        color: "#000",
        textAlign: "left",
        width: "87.25%",
        fontSize: 16.25,
        marginTop: 10
    },
    imgBanner: {
        width: '100%',
        height: 325
    },
    placeholderMediaSmaller: {
        backgroundColor:  "#0496FF", width: 52.5, height: 52.5
    },
    placeholderMedia: {
        backgroundColor:  "#0496FF", width: 82.5, height: 82.5
    },
    rightAbsolute: {
        position: 'absolute',
        right: 12.25,
        bottom: 0
    },
    leftAbsolute: {
        position: 'absolute',
        left: 12.25,
        bottom: 0
    },
    inputContainer: {
        maxWidth: "85%"
    },
    hrGrey: {
        width: "100%",
        borderBottomWidth: 2,
        borderBottomColor: "lightgrey",
        marginTop: 22.25,
        marginBottom: 22.25
    },
    mediumHR: {
        borderBottomColor: "#fff",
        borderBottomWidth: 2,
        marginTop: 12.25,
        marginBottom: 12.25,
        width: "100%"
    },
    inputFloatingStylesMultiline: {
        textAlignVertical: 'top'
    },
    innerIconInputMulti: {
        width: 22.75,
        height: 22.75,
        maxHeight: 22.75,
        maxWidth: 22.75,
        marginTop: 27.25
    },
    innerIconInputMultiOne: {
        width: 22.75,
        height: 22.75,
        maxHeight: 22.75,
        maxWidth: 22.75,
        marginTop: 18.25
    },
    innerIconInput: {
        width: 40,
        height: 40,
        maxHeight: 40,
        maxWidth: 40
    },
    labelFloatingStyle: {
        paddingTop: 8
    },
    inputFloatingStyles: {
        paddingLeft: 7.75,
        textAlignVertical: "top",
        color: "#000",
        paddingTop: 14.25,
        maxWidth: "88.25%"
    },
    showCountdownStylesCustom: {
        color: "red",
        fontWeight: "bold",
        textDecorationLine: "underline",
        fontSize: 12.25
    }
});

export default styles;