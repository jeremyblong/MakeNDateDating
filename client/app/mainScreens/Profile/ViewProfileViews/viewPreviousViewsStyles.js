import {StyleSheet, Dimensions } from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        padding: 20,
    },
    title: {
        fontSize: 24,
        margin: 12.25
    },
    costText: {
        lineHeight: 21.25
    },
    image: {
        height: 200,
        marginVertical: 20,
    },
    content: {
        fontSize: 16,
        lineHeight: 21.25,
    },
    hr: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 10,
        marginBottom: 10
    },
    sectionTitle: {
        fontSize: 20,
        marginTop: 30,
    },
    commentContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    commentAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    commentTextContainer: {
        marginLeft: 10,
    },
    commentAuthor: {
        fontSize: 16
    },
    commentText: {
        fontSize: 16,
    },
    relatedPostContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    relatedPostImage: {
        width: 50,
        minWidth: 50,
        minHeight: 50,
        height: 50,
    },
    relatedPostTitle: {
        fontSize: 16,
        marginLeft: 10,
    },
    container: {
      flex: 1,
      marginVertical: 20,
    },
    spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
    },
    containerItem: {
        backgroundColor: '#fff',
        flex:1,
    },
    videoItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    placeholderImage: {
        width: "100%",
        height: height * 0.325
    },
    thumbnailItem: {
        width: '35%',
        aspectRatio: 16 / 9,
        borderRadius: 5,
    },
    detailsItem: {
        padding: 10,
        width: '65%',
    },
    titleItem: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    channelItem: {
        color: '#999',
        fontSize: 14,
        marginTop: 5,
    },
    viewCountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    }
});

export default styles;