import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    contain: {
        flex: 1,
    },
    bottomImage: {
        maxWidth: width,
        minWidth: width,
        minHeight: 500,
        maxHeight: 500,
        height: 500,
        borderRadius: 7.25
    },
    labeled: {
        fontSize: 18.25,
        fontWeight: "bold",
        marginTop: 22.25,
        textAlign: "center"
    },
    thumb: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 5,
    },
    contentLeft: {
        flex: 8,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    maxedCommentIcon: {
        maxWidth: width,
        maxHeight: 300,
        height: 300,
        marginBottom: 82.25,
        width: width,
        marginTop: 22.25
    },
    contentRight: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    containMapped: {
        borderRadius: 8,
        paddingHorizontal: 20,
        borderWidth: 0.5,
        borderColor: "#fff",
        paddingVertical: 10,
        marginTop: 17.25
    },
    containCustom: {
        shadowOffset: {height: 1},
        shadowOpacity: 1.0,
        elevation: 5,
    },
    placeholderMediaSmaller: {
        backgroundColor: "#0496FF", width: 52.5, height: 52.5
    },
    placeholderMedia: {
        backgroundColor: "#0496FF", width: 82.5, height: 82.5
    },
    commentText: {
        fontWeight: "bold",
        color: "#fff"
    },
    farRightText: {
        position: "absolute",
        right: 10,
        top: 8.25
    },
    nameContent: {
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    absoluteBottomRight: {
        position: "absolute",
        bottom: 5,
        right: 5
    },
    validContent: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 7,
        justifyContent: 'space-between',
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
    },
    mainContent: {
        paddingHorizontal: 12,
        paddingVertical: 20,
        flexDirection: 'row',
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        maxWidth: width
    },
    bottomRow: {
        flexDirection: "row",
        display: "flex"
    },
    rowCentered: {
        flexDirection: "row",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    iconCustomSmaller: {
        maxWidth: 37.25,
        maxHeight: 37.25,
        height: 37.25,
        width: 37.25,
        marginRight: 5,
        marginTop: 10
    },
    iconCustom: {
        maxWidth: 42.25,
        maxHeight: 42.25,
        height: 42.25,
        width: 42.25,
        marginRight: 5,
        marginTop: 10
    },
    leftCol: {
        flexDirection: "column",
        display: "flex",
        maxWidth: width * 0.5
    }
});
