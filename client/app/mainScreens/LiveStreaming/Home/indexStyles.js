import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';

const { width, height } = Dimensions.get("window");


const styles = StyleSheet.create({
  post: {
    marginHorizontal:10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom:20,
    borderBottomWidth:0.5,
    borderBottomColor:'#808080',
    backgroundColor: "#fff",
    borderWidth: 1.25,
    borderColor: "lightgrey",
    padding:10,
  },
  middlePlaceholder: {
    width: "92.25%",
    minWidth: "92.25%",
    height: 275,
    maxHeight: 275,
    marginTop: 32.25,
    marginBottom: 32.25
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  date: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 10,
  },
  description: {
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 18,
    color: '#3b5998',
  },
  actionCount: {
    fontSize: 18,
    marginLeft: 5,
  },
  contain: {
    flex: 1,
  },
  mappedVideo: {
    minWidth: "100%",
    maxWidth: "100%",
    minHeight: 275,
    maxHeight: 275
  },  
  notextAvailable: {
    fontSize: 22.25,
    textAlign: "center",
    marginBottom: 12.25
  },
  bottomImage: {
    maxWidth: width * 0.9,
    maxHeight: 250,
    borderRadius: 7.25
  },
  centeredOnly: {
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 17.25,
    marginVertical: 17.75,
    alignItems: "center"
  },
  centered: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    maxWidth: width,
    maxHeight: 240
  },
  touchableText: {
    fontWeight: "bold",
    textAlign: "right",
    fontSize: 16.25,
    color: "#000",
    position: "absolute",
    top: 10,
    right: 22.25,
    zIndex: 9999999
  },
  topRightTouchable: {
    position: "absolute",
    top: 0,
    zIndex: 9999999,
    right: 0
  },
  touchableIcon: {
    maxWidth: 22.25,
    maxHeight: 22.25,
    height: 22.25,
    width: 22.25
  },
  topRightTouchableOne: {
    position: "absolute",
    top: 10,
    zIndex: 9999999,
    left: 22.25
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
});
export default styles;