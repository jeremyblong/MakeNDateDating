import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';

const { width, height } = Dimensions.get("window");


const styles = StyleSheet.create({
    contain: {
        flex: 1,
    },
    contentContainer: {
        flex: 1
    },
    container: {
        flex: 1
    },
    applyToAllText: {
        fontWeight: "bold",
        fontSize: 16.25,
        textAlign: "center"
    },
    footer: {
        height: height * 0.425
    },
    footerTwo: {
        height: height * 0.325
    },
    imageFilterTwo: {
        width: width * 0.50,
        height: height * 0.275,
        marginVertical: 10,
        alignSelf: 'center',
    },
    spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
    },
    hr: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 10,
        marginBottom: 10
    },
    labeled: {
        fontWeight: "bold", 
        marginLeft: 12.25,
        fontSize: 16.25,
        marginTop: 17.25
    },
    customTextInput: {
        maxHeight: 275,
        textAlignVertical: "top",
        fontSize: 18,
        margin: 12.25
    },
    imageFilterCustomized: {
        width: width * 0.575,
        minWidth: width * 0.575,
        marginRight: 17.25,
        height: 425,
        minHeight: 425,
        marginVertical: 10,
        alignSelf: 'center',
    },
    imageFilter: {
        width: width,
        height: 520,
        marginVertical: 10,
        alignSelf: 'center',
    },
    filterSelectorFilter: {
        width: 100,
        height: 100,
        minWidth: 100,
        minHeight: 100,
        margin: 5,
    },
    filterTitleFilter: {
        fontSize: 12,
        textAlign: 'center',
    },
    stretchedFull: {
        minWidth: "100%",
        minHeight: "100%",
        height: "100%",
        maxHeight: height * 0.525,
        backgroundColor: "#000",
        width: "100%"
    },
    oneQuarter: {
        maxWidth: width * 0.25,
        width: width * 0.25,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: "center"
    },
    middleChunk: {
        maxWidth: width * 0.50,
        width: width * 0.50
    },
    backgroundTopWrapper: {
        minWidth: "100%",
        minHeight: height * 0.05,
        display: "flex",
        flexDirection: "row",
        height: height * 0.05,
        maxHeight: height * 0.05,
        backgroundColor: "#fff",
        width: "100%"
    },
    multipleText: {
        textAlign: "right",
        fontWeight: "bold",
        fontSize: 16.25
    },
    placeholderMediaSmaller: {
        backgroundColor: "#0496FF", width: 52.5, height: 52.5
    },
    placeholderMedia: {
        backgroundColor: "#0496FF", width: 82.5, height: 82.5
    },
    checkedIcon: {
        maxWidth: 42.25,
        maxHeight: 42.25,
        position: "absolute",
        bottom: 12.25,
        right: 12.25,
        height: 42.25,
        width: 42.25,
        marginTop: -3.25
    },
    galleryIconTwo: {
        maxWidth: 47.25,
        maxHeight: 47.25,
        height: 47.25,
        width: 47.25,
        marginTop: -3.25
    },
    galleryIcon: {
        maxWidth: 27.25,
        maxHeight: 27.25,
        height: 27.25,
        width: 27.25,
        marginTop: -3.25
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: "center"
    },
    positionAlignRight: {
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        right: 12.25,
        bottom: 12.25,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 4.25
    },
    item: {
        backgroundColor: '#6495ED',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1,
    },
    itemInvisible: {
        backgroundColor: 'transparent',
    },
});
export default styles;