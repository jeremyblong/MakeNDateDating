import {StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 12.25
    },
    item: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    minHeightListItem: {
        minHeight: 25,
        paddingTop: 3.75
    },
    listContainerStyle: {
        minHeight: 450,
        height: 450,
        maxHeight: 450,
        overflow: "scroll"
        // padding: 10
    },
    listStyle: {
        paddingLeft: 10,
        color: "#000",
        minHeight: 25,
        paddingTop: 3.75
    },
    autocompleteContain: {
        flex: 1,
        minHeight: 62.25,
        zIndex: 1
    },
    lockill: {
        height: height * 0.575,
        maxHeight: height * 0.575,
        maxWidth: "100%",
        width: "100%",
        borderRadius: 20,
        marginTop: 22.25
    },
    privacyImageIllustration: {
        minWidth: "100%",
        maxWidth: "100%",
        height: height * 0.425,
        maxHeight: height * 0.425,
        borderRadius: 20,
        marginTop: 22.25
    },
    label: {
    	fontWeight: "400",
        marginBottom: 12.25,
    	textAlign: "left",
    	fontSize: 17.25
    },
    hr: {
        minWidth: "100%",
        width: "100%",
        marginTop: 17.25,
        marginBottom: 17.25,
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"
    },
    contain: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
    },
    thumb: {width: 48, height: 48, marginRight: 10},
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    left: {
        flex: 7.5,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    right: {
        flex: 2.5,
        alignItems: 'flex-end',
        justifyContent: 'center',
    }
});

export default styles;