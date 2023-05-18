import {StyleSheet} from 'react-native';

export default StyleSheet.create({
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
  cateredText: {
    fontSize: 17.25,
    marginTop: 22.25,
    color: "#000"
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
