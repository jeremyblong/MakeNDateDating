import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';
import * as Utils from '@utils';

export default StyleSheet.create({
    wrapper: {
        width: '100%',
        height: Utils.scaleWithPixel(220),
        justifyContent: 'flex-end',
    },
    contentPage: {
        bottom: 0,
    },
    blockImage: {
        height: Utils.scaleWithPixel(225),
        width: '100%',
    },
    iconedBackground: {
        backgroundColor: "#fff",
        borderWidth: 1.25,
        borderColor: "#000",
        borderRadius: 6.25,
        minWidth: 42.25,
        maxHeight: 42.25,
        maxWidth: 42.25,
        minHeight: 42.25,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },  
    iconed: {
        minWidth: 32.25,
        maxHeight: 32.5,
        maxWidth: 32.5,
        minHeight: 32.5
    },
    img: {
        width: '100%',
        height: '100%',
    },
    rowWrapped: {
        flex: 1, flexDirection: 'row', flexWrap: 'wrap'
    },
    listContentService: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        flexWrap: 'wrap',
    },
    line: {
        height: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    contentActionBottom: {
        padding: 8,
        flexDirection: 'row',
    },
    itemAction: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    contentModel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 40,
        paddingTop: 10,
    },
    contentFilterBottom: {
        width: '100%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingHorizontal: 20,
    },
    contentSwipeDown: {
        paddingTop: 10,
        alignItems: 'center',
    },
    lineSwipeDown: {
        width: 30,
        height: 2.5,
        backgroundColor: BaseColor.dividerColor,
    },
    contentContact: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 20,
    },
});
