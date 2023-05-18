import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        margin: 11.25
    },
    backgroundContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.775)",
        padding: 22.25,
        paddingLeft: 18.25,
        paddingRight: 18.25,
        borderWidth: 2,
        borderColor: "#fff"
    },
    hr: {
        width: '100%',
        minWidth: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
        marginTop: 12.25,
        marginBottom: 22.25
    },
    titleAbout: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50
    }
});

export default styles;