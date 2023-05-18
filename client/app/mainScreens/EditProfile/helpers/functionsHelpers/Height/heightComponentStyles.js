import {StyleSheet, Dimensions} from 'react-native';
import * as Utils from '@utils';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center"
    },
    illustrationImg: {
        width: width,
        marginTop: 32.5,
        height: height * 0.525,
    },
    imgBanner: {
        width: '100%',
        height: 375
    },
    container: {
        margin: 15,
        marginTop: 25
    },
    title: {
        fontSize: 24,
        fontWeight: '400'
    }
});
