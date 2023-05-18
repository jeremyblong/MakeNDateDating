import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';
import * as Utils from '@utils';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, // 
  },
  placeholderMediaSmaller: {
    backgroundColor: "#0496FF", width: 52.5, height: 52.5
  },
  placeholderMedia: {
      backgroundColor: "#0496FF", width: 82.5, height: 82.5
  },
  noNotifications: {
    minWidth: width * 0.9425,
    borderRadius: 22.25,
    width: width * 0.9425,
    height: height * 0.4375,
    minHeight: height * 0.4375
  },
  centered: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  contentService: {
    marginLeft: 22.25,
    maxWidth: "90%"
  },
  blockImage: {
    height: Utils.scaleWithPixel(200),
    width: '100%',
  },
  blockContentAddress: {
    flexDirection: 'row',
    marginTop: 3,
    alignItems: 'center',
  },
  blockContentDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  blockListContentIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    width: '100%',
    marginTop: 4,
  },
  girdImage: {
    borderRadius: 8,
    height: Utils.scaleWithPixel(120),
    width: '100%',
  },
  listImage: {
    height: Utils.scaleWithPixel(140),
    width: Utils.scaleWithPixel(120),
    borderRadius: 8,
  },
  listContent: {
    flexDirection: 'row',
  },
  listContentRight: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    flex: 1,
  },
  listContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  girdContent: {
    flex: 1,
  },
  girdContentLocation: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  girdContentRate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
