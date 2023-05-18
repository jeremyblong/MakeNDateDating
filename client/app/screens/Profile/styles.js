import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

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
  textInput: {
    height: 56,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  placeholderMediaSmaller: {
    backgroundColor:  BaseColor.blueColor, width: 52.5, height: 52.5
  },
  placeholderMedia: {
      backgroundColor:  BaseColor.blueColor, width: 82.5, height: 82.5
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  contentLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  contentCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemInfor: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 55,
    maxHeight: 55
  },
  innerPopoverText: {
    color: "#fff"
  },
  popover: {
    backgroundColor: "#000",
    padding: 10,
    borderWidth: 1.5,
    borderColor: "#fff"
  }
});
