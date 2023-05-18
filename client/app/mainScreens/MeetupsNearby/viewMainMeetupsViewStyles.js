import { Dimensions, StyleSheet } from 'react-native';
import * as Utils from '@utils';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    list: {
        paddingHorizontal: 10,
    },
    listContainer: {
        alignItems: 'center',
    },
    separator: {
        marginTop: 10,
    },
    card: { // 
        marginVertical: 8,
        backgroundColor: 'white',
        borderWidth: 1.25,
        borderColor: "grey",
        flexBasis: '47%',
        marginHorizontal: 10
    },
    placeholderImage: {
        width: "100%",
        marginTop: 20,
        minWidth: "100%",
        height: height * 0.425,
        minHeight: height * 0.425
    },
    noneAvailableText: {
        fontSize: 22.25,
        textAlign: "center",
        marginVertical: 12.25
    },
    centeredMargin: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        margin: 10
    },
    centered: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',
        maxWidth: "65%",
        width: "65%"
    },
    cardContent: {
        paddingVertical: 17,
        paddingHorizontal: 10,
        justifyContent: 'space-between'
    },
    cardImage: {
        flex: 1,
        height: 150,
        width: "44.25%",
        maxWidth: "44.25%"
    },
    imageContainer: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        width: width * 0.45,
        maxWidth: width * 0.45,
        elevation: 9
    },
    /******** card components **************/
    title: {
        fontSize: 18,
        flex: 1,
        color: '#778899',
    },
    count: {
        fontSize: 18,
        flex: 1,
        color: '#B0C4DE',
    }
});
