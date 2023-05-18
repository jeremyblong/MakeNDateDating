import {StyleSheet} from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';

export default StyleSheet.create({
    //block css
    blockImage: {
        height: Utils.scaleWithPixel(200),
        width: '100%',
    },
    label: {
        fontWeight: "400",
        fontSize: 18.25,
        textAlign: "left",
    },
    spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
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
        height: 375,
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
