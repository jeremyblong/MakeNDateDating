import {StyleSheet, Dimensions, Platform} from 'react-native';
import * as Utils from '@utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  contain: {alignItems: 'center'},
  tourItem: {
    width: Utils.scaleWithPixel(135),
    height: Utils.scaleWithPixel(160),
  },
  carouselContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height:400,
  },
  resizedVideoStyle: {
    minHeight: 225,
    maxHeight: 225,
    height: 225,
    minWidth: "100%",
    width: "100%"
  },
  itemContainer: {
    width: width - 120,
    minWidth: width - 120,
    height: height * 0.375,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  imageCustom: {
    width: width * 0.775,
    minWidth: width * 0.775,
    height: height * 0.275,
    height: height * 0.275,
    borderRadius: 10,
  },
  textContainer: {
    width: '82.25%',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.875)',
    borderRadius: 10,
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    textAlign: 'center',
  },
  dotContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 5,
    borderWidth:1
  },
  contentButtonBottom: {
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscribeRestrictedButton: {
    width: "100%",
    borderWidth: 1.25,
    borderStyle: "dotted",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height: 60,
    borderRadius: 10
  },  
  hr: {
    marginTop: 12.25,
    marginBottom: 12.25,
    width: "100%",
    minWidth: "100%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 2
  },
  placeholderImage: {
    width: width * 0.925,
    height: height * 0.525
  },
  itemMapped: {
    backgroundColor: '#ffffff',
    justifyContent : 'flex-start', 
    alignItems: "flex-start", 
    alignContent: "flex-start",
    flex: 1,
    maxWidth: width / 2.975,
    minWidth: width / 2.975,
    minHeight: 112.5,
    height: 112.5
  },
  borderedTouchable: {
    borderWidth: 2,
    borderColor: "lightgrey",
    borderStyle: "dashed",
    height: 57.25,
    minHeight: 57.25, 
    width: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: 16.25
  },
  absoluteTopLeft: {
    position: "absolute",
    top: 10,
    left: 20
  },
  absoluteTopRight: {
    position: "absolute",
    top: 10,
    right: 20
  },
  audioSubtext: {
    marginHorizontal: 15
  },
  innerTouchAudioText: {
    fontWeight: "400", 
    textAlign: "center", 
    fontSize: 17.5
  },
  audioPrompt: {
    fontWeight: "400", 
    textAlign: "left", 
    textDecorationLine: "underline", 
    fontSize: 20 
  },
  bottomPositioned: {
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: "center"
  },
  noPass: {
    width: Platform.OS === "ios" ? width * 0.5 : width,
    height: 225
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: "center"
  },
  item: {
    backgroundColor: '#6495ED',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
    fontSize:30,
    fontWeight:'bold',
  },
  placeholderMediaSmaller: {
      backgroundColor: "#0496FF", width: 52.5, height: 52.5
  },
  placeholderMedia: {
      backgroundColor: "#0496FF", width: 82.5, height: 82.5
  },
  hotelItem: {width: Utils.scaleWithPixel(160)},
  image: {
    width: Platform.OS === "ios" ? 100 : 120,
    height: Platform.OS === "ios" ? 100 : 120,
    marginTop: 20,
    borderRadius: 60
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  tagFollow: {width: 100, marginTop: 15},
  description: {
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 22.5,
    textAlign: 'center',
  },
  contentField: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  fieldItem: {
    alignItems: 'center',
    flex: 1,
  },
  imageBanner: {
    width: 135,
    height: 160,
    borderRadius: 10,
  },
  txtBanner: {
    position: 'absolute',
    left: 10,
    top: 130,
  },
  label: {
    fontSize: 20.25,
    fontWeight: "400",
    textAlign: "left",
    marginLeft: 10
  },  
  contentTag: {
    marginLeft: 20,
    marginTop: 10,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabbar: {
    paddingTop: 10,
    paddingBottom: 10,
    height: 60,
  },
  tab: {
    width: 130,
  },
  indicator: {
    height: 1,
  },
  labelCustom: {
    fontWeight: "bold",
  },
  label: {
    fontWeight: '400',
  },
  contentImageGird: {
    flexDirection: 'row',
    height: Utils.scaleWithPixel(160),
    marginTop: 10,
  },
  lineInformation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  containCustom: {flexDirection: 'row', width: Utils.scaleWithPixel(300), marginTop: 12.25 },
  imageBannerCustom: {
    width: Utils.scaleWithPixel(100),
    height: Utils.scaleWithPixel(100),
    minWidth: Utils.scaleWithPixel(100),
    minHeight: Utils.scaleWithPixel(100)
  },
  contentCustom: {
    height: Utils.scaleWithPixel(100),
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
  },
  contentTitleCustom: {
    paddingTop: 5,
    justifyContent: 'flex-start',
  },
  contentDateCustom: {
    paddingBottom: 5,
    justifyContent: 'flex-end',
  },
});
