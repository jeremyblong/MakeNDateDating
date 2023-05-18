import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    flexBottomContainer: {
        flex: 1
    }, 
    flexedTopContainer: {
        flex: 1
    },
    mainWrapper: {
        flex: 1
    },
    inputFloatingStyles: {
        maxHeight: 82.25
    },
    hr: {
        minWidth: "100%",
        width: "100%",
        marginTop: 10,
        marginBottom: 10,
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2
    },
    singlelineContainerStyle: {
        maxHeight: 82.25
    },
    innerIconInputMulti: {
        width: 22.75,
        height: 22.75,
        maxHeight: 22.75,
        maxWidth: 22.75,
        marginTop: 27.25
    },
    innerIconInput: {
        width: 22.25,
        height: 22.25,
        maxHeight: 22.25,
        maxWidth: 22.25
    },
    containerFlatList: {
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: 165
    },
    contentFlatList: {
        marginLeft: 16,
        flex: 1,
    }
});

export default styles;