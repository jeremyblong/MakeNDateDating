import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logoContainer: {
        overflow: 'hidden',
        marginBottom:20,
    },
    eyeIconed: {
        maxWidth: 26.25,
        maxHeight: 26.25
    },  
    logo: {
        width: 225,
        height: 125,
        borderRadius: 40,
    },
    description: {
        marginBottom: 20,
        textAlign: 'center',
    },
    hr: {
        width: '42.25%',
        minWidth: "42.25%",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
        marginTop: 3.25,
        marginBottom: 22.25
    },
    card: {
        width: '92.25%',
        height: 50,
        marginBottom: 25,
        backgroundColor: '#fff',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        shadowColor: '#00CED1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    cardFirst: {
        width: '62.25%',
        height: 50,
        marginBottom: 25,
        backgroundColor: '#fff',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        shadowColor: '#00CED1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    input: {
        flex: 1,
        fontSize: 18
    },
    inputFirst: {
        flex: 1,
        fontSize: 18
    },
    button: {
        backgroundColor: '#00CED1',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default styles;