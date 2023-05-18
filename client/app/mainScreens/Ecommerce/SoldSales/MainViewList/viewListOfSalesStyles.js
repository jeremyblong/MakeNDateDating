import {StyleSheet, Dimensions} from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';


const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    //block css
    blockImage: {
        height: Utils.scaleWithPixel(200),
        width: '100%',
    },
    absoluteTopLeft: {
        position: "absolute",
        left: 20,
        top: 20,
        zIndex: 99999
    },
    shippingImage: {
        minWidth: "100%",
        minHeight: height * 0.65,
        maxHeight: height * 0.65
    },
    blockImageCustom: {
        minWidth: 50,
        minHeight: 50,
        height: 50,
        width: 50,
        borderRadius: 50
    },
    label: {
        fontWeight: "400",
        fontSize: 18.25,
        textAlign: "left",
    },
    price: {
        fontSize: 20
    },
    mediumText: {
        fontSize: 17.25,
        marginVertical: 20,
        marginHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1.25,
        borderColor: "lightgrey",
        padding: 15
    },
    hrCustom: {
        borderBottomWidth: 2,
        borderBottomColor: "lightgrey",
        width: "100%",
        marginTop: 0,
        marginBottom: 20
    },
    hr: {
        borderBottomWidth: 2,
        borderBottomColor: "lightgrey",
        width: "100%",
        marginTop: 12.25,
        marginBottom: 12.25
    },
    illustrationImage: {
        maxWidth: "100%",
        height: 325,
        borderRadius: 27.25,
        marginTop: 22.25
    },  
    blockContentAddress: {
        flexDirection: 'row',
        marginTop: 3,
        alignItems: 'center',
    },
    blockContentDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    listContainerStyle: {

    },
    blockListContentIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        width: '100%',
        marginTop: 4,
    },
    contentService: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 7.25,
        marginTop: 15,
        borderTopColor: "lightgrey",
        borderTopWidth: 2
    },
    serviceItemBlock: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 60,
    },
    //list css
    listImage: {
        height: Utils.scaleWithPixel(140),
        width: Utils.scaleWithPixel(120),
        borderRadius: 8,
    },
    listContent: {
        flexDirection: 'row',
    },
    listContentRight: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        flex: 1,
    },
    listContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    //gird css
    girdImage: {
        borderRadius: 8,
        height: Utils.scaleWithPixel(120),
        width: '100%',
    },
    girdContent: {
        flex: 1,
    },
    containerWrapper: {
        margin: 12.25
    }, 
    itemWrapper: {
        borderWidth: 1.5,
        borderColor: "lightgrey",
        padding: 7.75
    },  
    girdContentLocation: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    girdContentRate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    contain: {
        paddingHorizontal: 20,
        width: '100%',
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
});
