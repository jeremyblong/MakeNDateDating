import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';
import * as Utils from '@utils';


export default StyleSheet.create({
  contentPickDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderRadius: 8,
    backgroundColor: BaseColor.fieldColor,
    padding: 10,
  },
  itemPick: {
    flex: 1,
    justifyContent: 'center',
  },
  centeredOnly: {
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#fff",
    borderRadius: 17.25,
    marginVertical: 17.75,
    borderWidth: 2,
    alignItems: "center"
  },
  middlePlaceholder: {
    width: "92.25%",
    minWidth: "92.25%",
    height: 275,
    maxHeight: 275,
    marginTop: 32.25,
    marginBottom: 32.25
  },
  hr: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 2.25,
    marginTop: 12.25,
    marginBottom: 0,
    width: "100%"
  },
  total: {
    flex: 6,
    borderRadius: 8,
    padding: 10,
    marginRight: 15,
  },
  duration: {
    flex: 4,
    borderRadius: 8,
    padding: 10,
  },
  contentQuest: {
    marginTop: 15,
    flexDirection: 'row',
    marginBottom: 15,
  },
  contentModal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCalendar: {
    borderRadius: 8,
    width: '100%',
    backgroundColor: 'white',
  },
  contentActionCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  iconRight: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentFilterBottom: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 20,
  },
  contentSwipeDown: {
    paddingTop: 10,
    alignItems: 'center',
  },
  lineSwipeDown: {
    width: 30,
    height: 2.5,
    backgroundColor: BaseColor.dividerColor,
  },
  contentActionModalBottom: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  placeholderMediaSmaller: {
    backgroundColor: "#0496FF", width: 52.5, height: 52.5
  },
  placeholderMedia: {
      backgroundColor: "#0496FF", width: 82.5, height: 82.5
  },
  girdImage: {
    borderRadius: 8,
    height: Utils.scaleWithPixel(120),
    width: '100%',
  },
  girdContent: {
    flex: 1,
    padding: 5
  },
  absoluteFollowers: {
    position: "absolute",
    right: 5
  },
  girdContentLocation: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  girdContentRate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
});
