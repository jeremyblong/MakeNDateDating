import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';
import * as Utils from '@utils';


const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 0,
    },
    header: {
        alignItems: 'center',
    },
    listContainerStyle: {
        backgroundColor: "#fff",
        minHeight: 450,
        height: 450,
        maxHeight: 450,
        overflow: "scroll"
        // padding: 10
    },
    selectedText: {
        fontWeight: "bold",
        fontSize: 18.75,
        marginBottom: 12.25
    },
    listStyle: {
        paddingLeft: 10,
        minHeight: 25,
        paddingTop: 3.75
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    placeholderWrapper: {
        backgroundColor: "#fff",
        borderRadius: 17.25,
        padding: 10
    },
    relatedPostContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    relatedPostImage: {
        width: 50,
        minWidth: 50,
        minHeight: 50,
        height: 50,
    },
    relatedPostTitle: {
        fontSize: 16,
        marginLeft: 10,
    },
    invoiceInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    containerStyleViewview: {
        height: height * 0.825,
        minHeight: height * 0.825,
        width: width,
        minWidth: width
    },
    labeled: {
        fontSize: 18.25,
        fontWeight: "400",
        marginTop: 10,
        textAlign: "left",
        marginBottom: 10
    },
    inputContainer: {
        marginTop: 10,
        marginBottom: 15,
        borderWidth: 0.5,
        borderColor: "lightgrey",
        padding: 5.25,
        minHeight: 125, 
        height: 125
    },
    invoiceInfo: {
        flexDirection: "column",
        maxWidth: width * 0.40
    },
    label: {
        fontWeight: 'bold',
    },
    hr: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 10,
        marginBottom: 22.25
    },
    inputContainerPicker: {
        minHeight: 45,
        maxHeight: 45,
        borderRadius: 4.25,
        marginTop: 10,
        marginBottom: 15,
        marginLeft: 10,
        padding: 10
    },
    text: {
        marginLeft: 5,
    },
    divider: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginVertical: 20,
    },
    columnOne: {
        minWidth: width * 0.45,
        width: width * 0.45
    },  
    rowCustom: {
        flexDirection: "row"
    },
    customerInfoContainer: {
        marginTop: 20,
    },
    customerInfo: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    customerInfoCustom: {
        marginVertical: 5,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemsContainer: {
        marginTop: 20,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    itemName: {
        fontSize: 16,
    },
    itemDetails: {
        textAlign: "right",
        float: "right"
    },
    itemTotal: {
        fontWeight: 'bold',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    total: {
        fontSize: 18,
        color: "blue",
        fontWeight: 'bold',
    },
});
