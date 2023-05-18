import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';
import * as Utils from '@utils';

export default StyleSheet.create({
  btnClearSearch: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: '100%',
  },
  serviceItem: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCircleIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  imageBanner: {
    height: Utils.scaleWithPixel(120),
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  imageBannerPane: {
    height: 225,
    width: "100%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  content: {
    borderRadius: 5,
    borderWidth: 0.5,
    margin: 4.25,
    width: Utils.scaleWithPixel(200),
  },
  contentCustomized: {
    width: "48.75%",
    borderRadius: 5,
    borderWidth: 0.5,
    margin: 4.25,
  },
  contentPane: {
    borderRadius: 5,
    borderWidth: 0.5,
    width: "100%",
  },
});
