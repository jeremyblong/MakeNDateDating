import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  contain: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
  },
  spinnerTextStyle: {
    fontSize: 24.75,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff"
  },
  loginIllustration: {
    width: 425,
    height: 375
  },
  disabledButton: {
    backgroundColor: "#000",
    borderWidth: 1.25,
    marginTop: 10
  }
});
