import {StyleSheet, Dimensions, Platform} from 'react-native';
import * as Utils from '@utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        margin: 12.25
    },
    video: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    placeholderImage: {
        width: width * 0.875,
        height: height * 0.425
    },
    placeholderWrapper: {
        backgroundColor: "#fff",
        borderRadius: 17.25,
        padding: 10
    },
    thumbnail: {
        width: '45%',
        aspectRatio: 16 / 9,
        borderRadius: 5,
    },
    details: {
        padding: 10,
        width: '65%',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    channel: {
        color: '#999',
        fontSize: 14,
        marginTop: 5,
    },
    viewCount: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },

    views: {
        color: '#999',
        fontSize: 14,
    },
    duration: {
        color: '#999',
        fontSize: 14,
        marginLeft: 10,
    }
});