import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 65,
    padding: 10,
    width: '100%',
  },
  label: {
    fontSize: 17.25,
    fontWeight: "400",
    textAlign: "left",
    left: -62.25,
    paddingBottom: 15,
    marginLeft: 10
  },  
  forgottenPassword: {
    width,
    minWidth: width,
    height: height * 0.5,
    maxHeight: height * 0.5,
    marginBottom: 32.25
  }
});
