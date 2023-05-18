import {StyleSheet, Dimensions} from 'react-native';
import * as Utils from '@utils';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
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
    centeredAbsolute: {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center'
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
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textDecorationLine: "underline",
        textAlign: 'center',
        marginBottom: 5,
    },
    content: {
        fontSize: 14,
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
    container: {
        margin: 15,
        marginTop: 25
    },
    titleTop: {
        fontSize: 24,
        fontWeight: '400'
    }
});
