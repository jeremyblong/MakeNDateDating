import {StyleSheet, Dimensions, Platform } from 'react-native';
import * as Utils from '@utils';

const { height, width } = Dimensions.get("window"); 

export default StyleSheet.create({
  contain: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
    flexGrow: 1,
    paddingTop: 50,
    paddingBottom: 125,
    height,
    maxHeight: height
  },
  wrapper: {
    width: '100%',
    height: 350,
  },
  contentPage: {
    bottom: 0,
  },
  linearGradient: {
    minHeight: height,
    width
  },
  logoIcon: {
    minWidth: width,
    maxWidth: width,
    height: 150,
    minHeight: 150,
    maxHeight: 150,
    borderRadius: 22.25,
    marginBottom: 77.25,
    borderRadius: 22.25,
    maxWidth: "92.25%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10
  },  
  contentActionBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  absoluteLogo: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  img: {
    width: Utils.scaleWithPixel(200),
    height: Utils.scaleWithPixel(200),
    borderRadius: Utils.scaleWithPixel(200) / 2,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textSlide: {
    marginTop: 30,
  },
});
