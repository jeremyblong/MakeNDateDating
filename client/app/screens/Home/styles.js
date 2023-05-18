import {StyleSheet, Dimensions} from 'react-native';
import * as Utils from '@utils';


const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
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
  centeredMargin: {
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    alignContent: "center",
    alignItems: "center",
    margin: 10
  },
  placeholderImageBach: {
    width: width * 0.9325,
    height: height * 0.375,
    minHeight: height * 0.375,
    minWidth: width * 0.9325,
    borderRadius: 12.25
    // backgroundColor: "#fff"
  },
  placeholderImageLoadingEmpty: {
    width: "100%",
    minWidth: "100%",
    minHeight: 275,
    maxHeight: 275,
    height: 275,
    paddingTop: 20
  },  
  blockListContentIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    width: '100%',
    marginTop: 4,
  },
  contentService: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  serviceItemBlock: {
    alignItems: 'center',
    justifyContent: 'center',

    width: 60,
  },
  //list css
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
  //gird css
  girdImage: {
    borderRadius: 8,
    height: Utils.scaleWithPixel(120),
    width: '100%',
  },
  girdContent: {
    flex: 1, //
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
  nodatanone: {
    minWidth: "100%",
    width: "100%",
    left: 0,
    minHeight: 275,
    borderRadius: 12.25,
    height: 275,
    // borderWidth: 1
  },
  imageBackground: {
    height: 175,
    width: '100%',
    position: 'absolute',
  },
  searchForm: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    width: '100%',
    shadowColor: 'black',
    shadowOffset: {width: 1.5, height: 1.5},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
  },
  scoreText: {
    fontWeight: "400",
    textAlign: "right",
    fontSize: 16.25
  },
  label: {
    fontSize: 18.25,
    fontWeight: "400",
    textAlign: "left",
    marginVertical: 20.25,
    marginHorizontal: 15
  },
  placeholderMediaSmaller: {
    backgroundColor: "#0496FF", width: 52.5, height: 52.5
  },
  placeholderMedia: {
      backgroundColor: "#0496FF", width: 82.5, height: 82.5
  },
  pricedTextAbsolute: {
    position: "absolute",
    zIndex: 9999999999999,
    right: 10,
    top: 10
  },
  pricedText: {
    color: "lightgreen", 
    backgroundColor: "#000", 
    borderWidth: 1.5,
    borderColor: "#fff",
    padding: 3.25, 
    opacity: 0.775, 
    marginTop: 7.25, 
    borderRadius: 7.25
  },
  contentServiceIcon: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contentCartPromotion: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  btnPromotion: {
    height: 30,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  contentHiking: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 10,
  },
  promotionBanner: {
    height: Utils.scaleWithPixel(100),
    width: '100%',
    marginTop: 10,
  },
  line: {
    height: 1,
    marginTop: 10,
    marginBottom: 15,
  },
  iconContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  itemService: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 10,
  },
  promotionItem: {
    width: Utils.scaleWithPixel(200),
    height: Utils.scaleWithPixel(250),
    minWidth: Utils.scaleWithPixel(200),
    minHeight: Utils.scaleWithPixel(250)
  },
  tourItem: {
    width: Utils.scaleWithPixel(135),
    height: Utils.scaleWithPixel(160),
  },
  titleView: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
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
  halfWidth: {
    maxWidth: "47.5%",
    width: "47.5%"
  },
  blockListContentIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    width: '100%',
    marginTop: 4,
  },
  hrSpacer: {
    width: "100%",
    minWidth: "100%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 2,
    marginTop: 12.25,
    marginBottom: 27.25
  },
  mainContainerIterated: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#000",
    maxWidth: "75%",
    left: 62.25
  },
  contentService: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  serviceItemBlock: {
    alignItems: 'center',
    justifyContent: 'center',

    width: 60,
  },
  card: {
    shadowColor: '#B0C4DE',
    marginBottom: 22.25,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    maxWidth: width * 0.950,
    shadowRadius: 2,
    elevation: 1,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1
  },
  membersText: {
      textAlign: "center"
  },
  centered: {
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center"
  },
  bacheloretteImage: {
      width: 125,
      height: 125,
      maxHeight: 125,
      marginTop: 12.25,
      borderRadius: 25,
      borderWidth: 2.25,
      maxWidth: 125
  },
  cardContent: {
      flexDirection: 'column',
      alignItems: 'center',
      padding: 10,
  },
  productImage: {
      width: 100,
      height: 100,
      borderRadius: 14.25,
      borderWidth: 0.5,
      margin: 10,
  },
  productName: {
      fontSize: 20,
      fontWeight: 'bold'
  },
  productPrice: {
      fontSize: 16
  },
  cardActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
  },
  buttonMain: {
      padding: 10,
      borderRadius: 5,
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      minWidth: "40%"
  },
  button: {
      backgroundColor: '#eee',
      padding: 10,
      borderRadius: 5,
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      minWidth: "40%"
  },
  buttonText: {
      color: '#000',
      fontSize: 16,
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
  },
  avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
  },
  info: {
      marginLeft: 20,
  },
  name: {
      fontSize: 24,
      fontWeight: 'bold',
  },
  hr: {
      width: "100%",
      minWidth: "100%",
      borderBottomColor: "lightgrey",
      borderBottomWidth: 2,
      marginTop: 10,
      marginBottom: 10
  },
  username: {
      color: '#999',
      fontSize: 18,
      marginBottom: 13.25
  },
  stats: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
  },
  stat: {
      flex: 1,
      alignItems: 'center',
  },
  statLabel: {
      fontSize: 14,
  },
  statValue: {
      fontSize: 18,
  },
  bio: {
      padding: 20,
      fontSize: 16,
      color: "lightgrey"
  }
});
