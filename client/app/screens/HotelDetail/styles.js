import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';
import * as Utils from '@utils';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  imgBanner: {
    width: '100%',
    height: 250,
    position: 'absolute',
  },
  blockView: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  contentService: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  innerRowOne: {
    minHeight: 125,
    height: 125,
    marginBottom: 2,
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%"
  },
  firstColTwo: {
    minHeight: 189,
    height: 189,
    width: "99.25%",
    minWidth: "99.25%",
    maxWidth: "99.25%"
  },
  firstColOne: {
      minHeight: 189,
      marginBottom: 1,
      height: 189,
      width: "99.25%",
      minWidth: "99.25%",
      maxWidth: "99.25%"
  },
  innerRowTwo: {
      minHeight: 125,
      height: 125,
      marginBottom: 2,
      width: "100%",
      minWidth: "100%",
      maxWidth: "100%"
  },
  columnOne: {
    minHeight: 375,
    height: 375,
    width: "50%",
    minWidth: "50%",
    maxWidth: "50%"
  },
  columnTwo: {
      minHeight: 375,
      height: 375,
      width: "50%",
      minWidth: "50%",
      maxWidth: "50%"
  },
  rowOutterImages: {
      flexDirection: "row",
      display: "flex",
      marginBottom: 12.25,
      marginTop: 12.25
  },
  innerRowThree: {
      minHeight: 125,
      height: 125,
      width: "100%",
      minWidth: "100%",
      maxWidth: "100%"
  },
  columnOne: {
      minHeight: 375,
      height: 375,
      width: "50%",
      minWidth: "50%",
      maxWidth: "50%"
  },
  columnTwo: {
      minHeight: 375,
      height: 375,
      width: "50%",
      minWidth: "50%",
      maxWidth: "50%"
  },
  tagCustom: {
    margin: 4.75,
    fontWeight: "bold",
    fontSize: 16.25,
    borderWidth: 1.25,
    borderColor: "#fff",
    paddingLeft: 6.25,
    paddingRight: 6.25
  },
  contentBoxTop: {
    padding: 10,
    height: 120,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 0.5,
    shadowOffset: {width: 1.5, height: 1.5},
    shadowOpacity: 1.0,
    elevation: 5,
  },
  circlePoint: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRateDetail: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  lineBaseRate: {
    width: '100%',
    maxWidth: "100%",
    height: 12,
    borderRadius: 8,
    backgroundColor: BaseColor.dividerColor,
  },
  labeled: {
    fontSize: 18.25,
    fontWeight: "bold",
    marginTop: 22.25,
    textAlign: "center"
  },
  maxedCommentIcon: {
    maxWidth: width * 0.875,
    maxHeight: 300,
    height: 300,
    marginBottom: 82.25,
    width: width * 0.875
  },
  hrSpacer: {
    width: "100%",
    minWidth: "100%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 2,
    marginTop: 22.25,
    marginBottom: 22.25
  },
  linePercent: {
    width: '100%',
    maxWidth: "100%",
    height: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    position: 'absolute',
    bottom: 0,
  },
  contentLineRate: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  listContentIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  itemReason: {
    paddingLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  listItem: {
    fontSize: 15,
    fontWeight: "bold",
    lineHeight: 22.25
  },  
  contentButtonBottom: {
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listImage: {
    height: Utils.scaleWithPixel(140),
    width: Utils.scaleWithPixel(120),
    borderRadius: 8,
  },
  listContentMapped: {
    flexDirection: 'row',
  },
  listContentRight: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
  },
  toppedRightIcon: {
    tintColor: "#fff",
    maxWidth: 37.25,
    maxHeight: 37.25,
    top: 7.75
  },
  listContentService: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  bottomModal: {
    borderWidth: 2,
    borderColor: "#fff"
  },
  contain: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 17.25
  },
  centered: {
    alignItems: 'center', 
    alignContent: "center",
    justifyContent: 'center'
  },
  contentLeft: {
    flex: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  contentRight: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
