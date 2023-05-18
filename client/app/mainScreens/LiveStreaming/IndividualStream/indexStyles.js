import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    nodeCameraView: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        minHeight: height,
        minWidth: width,
        width,
        height,
        right: 0
    },
    nodeCameraViewWrapper: {
        position: 'absolute',
        zIndex: -1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    bottomSlightlyAbove: { 
        textAlign: "left", 
        fontWeight: "bold", 
        color: "#fff", 
        fontSize: 18.25, 
        marginLeft: 12.25,
        position: "absolute",
        bottom: 87.25,
        left: 25
    },
    centeredMiddleBottom: {
        position: 'absolute', 
        left: 0, 
        right: 10, 
        bottom: height * 0.1125,
        height: 75,
        maxWidth: 100,
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
    },
    leftButtonTouchable: {
        position: 'absolute', 
        left: 5, 
        right: 10, 
        top: 125,
        height: 75,
        maxWidth: 100,
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
    },
    bottomRightTouchableSend: {
        position: 'absolute', 
        right: 10, 
        bottom: 10
    },
    touchableIconUntintedSmaller: {
        maxWidth: 50,
        position: 'absolute', 
        right: 10, 
        bottom: 10,
        top: 0,
        maxHeight: 50
    },
    rightButtonTouchable: {
        position: 'absolute', 
        left: 0, 
        right: 10, 
        maxWidth: 100,
        height: 75,
        bottom: height * 0.6,
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
    },
    chatlog: {

    },
    messagingList: {
        maxWidth: width * 0.75,
        width: width * 0.75,
        maxHeight: height * 0.525,
        height: height * 0.525,
        position: "absolute",
        right: 10,
        top: 0
    },  
    contain: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    contentLeft: {
        flex: 8,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    thumb: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 5,
    },
    messageTyper: {
        minHeight: 50, 
        height: 50,
        paddingLeft: 12.25
    },
    contentRight: {
        flex: 2,
        justifyContent: 'center',
        top: -12.25,
        alignItems: 'flex-start',
    },
    typingSec: {
        position: 'absolute', 
        left: 0, 
        backgroundColor: "#fff",
        maxHeight: 50,
        borderRadius: 10,
        right: 0, 
        bottom: 0,
        margin: 22.25,
        opacity: 0.575
    },
    bottomSlightlyTextTyping: {
        position: 'absolute', 
        left: 0, 
        right: 0, 
        bottom: 10,
        top: 0
    },
    touchableIconCustom: {
        maxWidth: 62.25,
        borderRadius: 75,
        maxHeight: 62.25
    },
    touchableIcon: {
        tintColor: '#D81159',
        maxWidth: 72.25,
        borderRadius: 75,
        maxHeight: 72.25
    },
    touchableIconUntinted: {
        maxWidth: 72.25,
        borderRadius: 75,
        maxHeight: 72.25
    }
});
export default styles;