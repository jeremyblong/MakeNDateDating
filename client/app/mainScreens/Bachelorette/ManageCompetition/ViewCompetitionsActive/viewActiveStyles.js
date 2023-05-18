import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 22.25
    },
    video: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    thumbnail: {
        width: '35%',
        minHeight: "100%",
        aspectRatio: 16 / 9,
        borderRadius: 5,
    },
    details: {
        padding: 10,
        width: '65%',
    },
    emptyHolderImage: {
        maxWidth: "100%", 
        width: "100%", 
        height: height * 0.35,
        maxHeight: height * 0.35
    },
    hrSpacer: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 22.25,
        marginBottom: 22.25
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    channel: {
        fontSize: 14,
        marginTop: 5,
    },
    viewCount: {
        flexDirection: 'column',
        marginTop: 5,
    },

    views: {
        color: '#999',
        fontSize: 14,
    },
    duration: {
        color: '#999',
        fontSize: 14
    }
});

export default styles;