import {StyleSheet, Dimensions} from 'react-native';


const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  imgBanner: {
    width: '100%',
    height: 250,
    position: 'absolute',
  },
  rowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 7.25,
    borderWidth: 1,
    borderColor: 'white',
    marginRight: 5,
  },
  infoContainer: {
    alignItems: 'flex-start', 
    backgroundColor: "#000", 
    padding: 8.25, 
    borderRadius: 10, 
    borderWidth: 1.5, 
    borderColor: "#fff"
  },
  placeholderMediaSmaller: {
      backgroundColor: "#0496FF", width: 52.5, height: 52.5
  },
  placeholderMedia: {
      backgroundColor: "#0496FF", width: 82.5, height: 82.5
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundCircle: {
    minHeight: 32.25,
    maxWidth: 32.25,
    minWidth: 32.25,
    borderRadius: 40,
    marginBottom: 20
  },
  rightText: {
    marginLeft: 15,
    fontWeight: "400",
    marginTop: 6.75
  },
  contentButtonBottom: {
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  halfSized: {
    flexDirection: "column", 
    display: "flex",
    maxWidth: "49.25%",
    width: "49.25%"
  },
  topContainer: {
    flexDirection: "row", 
    display: "flex", 
    marginBottom: 22.25, 
    borderBottomWidth: 2, 
    paddingBottom: 22.25
  },
  hr: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 2,
    marginTop: 6.25,
    marginBottom: 6.25,
    width: "100%"
  },
  fullSized: {
    flexDirection: "column", 
    display: "flex",
    maxWidth: "100%",
    width: "100%"
  },
  nameHeader: {
    fontWeight: "400",
    fontSize: 22.25
  },
  nameSubheader: {
    fontSize: 18.75
  },
  columnOne: {
    display: "flex",
    flexDirection: "column",
    minWidth: width * 0.325,
    width: width * 0.325,
    justifyContent: "center", 
    alignContent: "center", 
    alignItems: "center"
  },
  columnTwo: {
    display: "flex",
    flexDirection: "column"
  },
  itemPrice: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  linePrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  iconRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
});

export default styles;