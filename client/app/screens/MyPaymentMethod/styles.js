import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  contain: {
    flex: 1,
    padding: 20,
  },
  centered: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  warningBottomWrapper: {
    position: "absolute",
    bottom: 12.25,
    left: 0,
    right: 0
  },
  containAbout: {
    paddingHorizontal: 0,
    width: '100%',
  },
  titleAbout: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labeled: {
    fontWeight: "bold", 
    color: "#000",
    fontSize: 15.25,
    marginTop: 12.25
  },
  warningText: {
    fontWeight: "400"
  },
  textInputCustom: {
    marginTop: 20
  },
  cardIcon: {
    width: 42.25,
    height: 42.25,
    maxHeight: 42.25,
    maxWidth: 42.25
  },
  placeholderMediaSmaller: {
    backgroundColor:  BaseColor.blueColor, width: 52.5, height: 52.5
  },
  placeholderMedia: {
      backgroundColor:  BaseColor.blueColor, width: 82.5, height: 82.5
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 5,
    width: '100%',
    marginBottom: 15,
  },
  threeFourthsCol: {
    flexDirection: "column",
    maxWidth: width * 0.725,
    width: width * 0.725
  }, 
  oneFouthCol: {
    flexDirection: "column",
    maxWidth: width * 0.225,
    width: width * 0.225
  },
  customHr: {
    width: '100%',
    minWidth: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    marginTop: 20,
    marginBottom: 0
  },
  hr: {
    width: '100%',
    minWidth: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    marginTop: 12.25,
    marginBottom: 22.25
  },
  coinCount: {
    fontWeight: "500",
    fontSize: 30.25, 
    textDecorationLine: "underline"
  },
  spinnerTextStyle: {
    fontSize: 24.75,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff"
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "left",
    margin: 7.25
  },
  iconContent: {
    width: 60,
    marginRight: 10,
    alignItems: 'center',
  },
  containerPane: {
      flex: 1,
      margin: 12.25
  },
  contentContainerPane: {
      flex: 1 // pushes the footer to the end of the screen
  },
  footerPane: {
      height: 200
  }
});
