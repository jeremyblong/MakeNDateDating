import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    container: {
        margin: 3.25
    },
    headerText: {
        fontSize: 16.25,
        marginTop: 22.25,
        margin: 10
    },
    hr: {
        width: '100%',
        minWidth: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
        marginTop: 12.25,
        marginBottom: 22.25
    },
    accordionContainer: {
        margin: 0,
        marginTop: 32.25,
    },
    titleContainer: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    contentContainer: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    content: {
        fontSize: 14,
    },
    sectionImage: {
        marginTop:20,
        width: '100%',
        height: 200,
        borderRadius:6,
    }
});

export default styles;