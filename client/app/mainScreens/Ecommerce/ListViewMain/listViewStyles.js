import {Dimensions, StyleSheet} from 'react-native';
import * as Utils from '@utils';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    blockImage: {
        height: Utils.scaleWithPixel(200),
        width: '100%',
        maxWidth: ""
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
        marginTop: 10,
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
    imageWrapper: {
        padding: 10
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
    nodatanone: {
        minWidth: "100%",
        minHeight: 275,
        height: 275
    },
    imageBackground: {
        height: 175,
        width: '100%',
        position: 'absolute',
    },
    searchForm: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 0.5,
        width: '100%',
        shadowColor: 'black',
        shadowOffset: {width: 1.5, height: 1.5},
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 1,
    },
    scoreText: {
        fontWeight: "400",
        textAlign: "right",
        fontSize: 16.25
    },
    label: {
        fontSize: 18.25,
        fontWeight: "400",
        textAlign: "left",
        marginVertical: 20.25,
        marginHorizontal: 15
    },
    contentServiceIcon: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    contentCartPromotion: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    btnPromotion: {
        height: 30,
        borderRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    contentHiking: {
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 10,
    },
    promotionBanner: {
        height: Utils.scaleWithPixel(100),
        width: '100%',
        marginTop: 10,
    },
    line: {
        height: 1,
        marginTop: 10,
        marginBottom: 15,
    },
    iconContent: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    itemService: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingTop: 10,
    },
    promotionItem: {
        width: Utils.scaleWithPixel(200),
        height: Utils.scaleWithPixel(250),
        minWidth: Utils.scaleWithPixel(200),
        minHeight: Utils.scaleWithPixel(250)
    },
    tourItem: {
        width: Utils.scaleWithPixel(135),
        height: Utils.scaleWithPixel(160),
    },
    titleView: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    blockImage: {
        height: Utils.scaleWithPixel(200),
        width: '100%',
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
    halfWidth: {
        maxWidth: "47.5%",
        width: "47.5%"
    },
    blockListContentIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        width: '100%',
        marginTop: 4,
    },
    hrSpacer: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 12.25,
        marginBottom: 27.25
    },
    mainContainerIterated: {
        backgroundColor: "#fff",
        borderWidth: 1.5,
        borderColor: "#000",
        maxWidth: "49.5%",
        margin: 1.75,
        minWidth: "49.5%"
    },
    contentService: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    serviceItemBlock: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 60,
    },
});
