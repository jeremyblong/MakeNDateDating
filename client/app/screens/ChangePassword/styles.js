import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  contentTitle: {
    alignItems: 'flex-start',
    width: '100%',
    height: 32,
    justifyContent: 'center',
  },
  contain: {
    flex: 1,
    padding: 20,
  },
  illustrationImage: {
    maxWidth: width * 0.925,
    width: width * 0.925,
    height: height * 0.4,
    maxHeight: height * 0.4,
    borderRadius: 12.25,
    marginBottom: 17.25
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
});
