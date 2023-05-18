import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center"
    },
    illustrationImg: {
        width: width,
        marginTop: 32.5,
        height: height * 0.525,
    },
    redband: {
        width
    },
    labeled: {
        // textAlign: "center",
        marginTop: 10,
        paddingBottom: 22.25,
        paddingLeft: 5,
        paddingRight: 5
    },
    centeredAbsolute: {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    specialContainer: {
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
    resizedVideoStyle: {
        backgroundColor: "lightgrey",
        padding: 12.25,
        width: "95%",
        minWidth: "95%",
        minHeight: 250,
        height: 250
    },  
    textContainer: {
        width: '90%',
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 10,
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
    },
    titleeee: {
        fontSize: 25,
        fontWeight: 'bold',
        color: "#000",
        textDecorationLine: "underline",
        textAlign: 'center',
        marginBottom: 5,
    },
    contenttttt: {
        fontSize: 14,
        color: "#000",
        textAlign: 'center',
    },
    itemContainer: {
        width: "100%",
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "lightgrey",
        height: height * 0.325,
        marginTop: 22.25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#fff"
    },
    imgBanner: {
        width: '100%',
        height: 300
    },
    titleTop: {
        fontSize: 24,
        marginTop: 17.25,
        padding: 7.25,
        textDecorationLine: "underline",
        fontWeight: '400'
    },
    container: {
        backgroundColor:'#fff'
    },
    accordionContainer: {
        padding: 7.25,
        marginTop: 3.25,
        borderWidth: 1,
        borderColor: "lightgrey"
    },
    headerText: {
        marginBottom: 12.5
    },
    titleContainer: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    contentContainer: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    content: {
        fontSize: 14,
    },
    sectionImage: {
        marginTop: 0,
        width: 50,
        height: 50,
        borderRadius: 50,
    }
});

export default styles;