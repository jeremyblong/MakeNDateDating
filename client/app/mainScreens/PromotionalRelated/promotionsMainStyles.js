import {StyleSheet} from 'react-native';
import * as Utils from '@utils';


const styles = StyleSheet.create({
    contentImageGird: {
        flexDirection: 'row',
        height: Utils.scaleWithPixel(160),
        marginTop: 10,
    },
    container: {
        margin: 12.25
    },
    imagePost: {
        width: '100%',
        borderWidth: 2,
        borderColor: "grey",
        marginTop: 22.25,
        height: Utils.scaleWithPixel(150)
    },
    customText: {
        fontSize: 21.25,
        textAlign: "center"
    },
    centeredMin: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginTop: 22.25,
        minHeight: 75
    },
    content: {
      marginHorizontal: 20,
      paddingVertical: 10,
      borderBottomWidth: 1,
    }
});
export default styles;