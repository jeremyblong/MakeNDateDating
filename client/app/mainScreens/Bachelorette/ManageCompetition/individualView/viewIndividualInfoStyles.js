import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 30,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22.5,
        marginTop: 10,
    },
    importantText: {
        fontSize: 18.25
    },
    name: {
        fontSize: 22,
        fontWeight: '600',
    },
    hr: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 15.25,
        marginBottom: 10.25
    },
    postContent: {
        flex: 1,
        padding: 30,
    },
    postTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    postDescription: {
        fontSize: 16,
        marginTop: 10,
    },
    centeredBox: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        minWidth: "100%",
        minHeight: 100,
        height: 100,
        marginTop: 13.25,
        marginBottom: 10,
        borderRadius: 17.25,
        borderWidth: 1,
    },
    roundTwoImage: {
        maxWidth: "100%",
        width: "100%",
        maxHeight: 325,
        height: 325,
        marginTop: 15,
        borderRadius: 12.25
    },
    titleAbout: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.475)",
        padding: 22.25,
        paddingLeft: 18.25,
        paddingRight: 18.25,
        borderWidth: 2,
        borderColor: "#fff"
    },
    tags: {
        color: '#00BFFF',
        fontSize: 23.25
    },
    specialText: {
        fontSize: 20,
        textAlign: "center",
        padding: 10,
        margin: 10
    }, 
    date: {
        marginTop: 10,
    },
    avatar: {
        width: 80,
        marginBottom: 12.25,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#00BFFF',
    },
    profile: {
        flexDirection: 'row',
        marginTop: 20,
    },
    name: {
        fontSize: 22,
        color: '#00BFFF',
        fontWeight: '600',
        alignSelf: 'center',
        marginLeft: 10,
    },
    shareButton: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#00BFFF',
    },
    shareButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
    }
});

export default styles;