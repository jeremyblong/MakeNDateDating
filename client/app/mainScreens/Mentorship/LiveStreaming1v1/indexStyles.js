import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    headerText: {
        fontSize: 20.25,
        margin: 12.25
    },
    buttonView: {
        height: 50,
        backgroundColor: '#000', //'#131415' Vonage Black
        display: 'flex',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
    subbedText: {
        margin: 12.25, 
        fontSize: 15
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    playimage: {
        maxWidth: 175,
        maxHeight: 175,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "darkblue"
    },
    hr: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 10,
        marginBottom: 10
    },
    iconStyle: {
        fontSize: 34,
        paddingTop: 15,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 15,
        /* borderRadius: 50 */
    },
    fullView: {
        flex: 1,
        height
    },
    scrollView: {
        // backgroundColor: Colors.lighter,
    },
    footer: {
        // color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    publisherStyle: {
        width: 100,
        height: 100,
        position: 'absolute',
        top: 15,
        right: 5,
        zIndex: 5,
    },
    mainSubscriberStyle: {
        height: (height * 3) / 4 - 50,
    },
    secondarySubscribers: {
        height: height / 4,
    },
});

export default styles;