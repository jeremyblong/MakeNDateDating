import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    labeledWo: {
        fontSize: 16.75,
        marginBottom: 17.25,
        marginTop: 10,
        textAlign: "center",
        fontWeight: "400"
    },
    container: {
        flex: 1,
        margin: 15
    },
    timezoneText: {
        fontSize: 16.25,
        textAlign: "left"
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    importantNoteText: {
        fontSize: 18.25
    },  
    spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
    },
    rightBelowIconPositioned: {
        position: "absolute",
        right: 22.25,
        bottom: 10
    },
    selectedText: {
        fontSize: 20,
        fontWeight: "400",
        textAlign: "left"
    },
    contentButtonBottom: {
        borderTopWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hr: {
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 12.25,
        marginBottom: 12.25,
        width: "100%"
    },
    label: {
        fontSize: 16.75,
        marginBottom: 17.25,
        marginTop: 10,
        fontWeight: "400",
        textDecorationLine: "underline"
    }
});
