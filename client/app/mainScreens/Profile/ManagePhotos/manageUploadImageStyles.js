import {StyleSheet, Dimensions } from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';


const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 20,
    },
    minItem: { 
      maxWidth: 50, 
      maxHeight: 50,
      minHeight: 50,
      minWidth: 50
    },
    label: {
      fontSize: 17.75,
      marginBottom: 20,
      marginTop: 10,
      fontWeight: "400"
    },
    subscriptionItem: {
      maxWidth: width * 0.925, 
      maxHeight: 425,
      minHeight: 425,
      minWidth: width * 0.925
    },
    item: {
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
    positionRightTop: {
      position: "absolute",
      top: 12.25,
      right: 22.25
    },
    itemInvisible: {
      backgroundColor: 'transparent',
    },
    spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
    },
    blackThinHR: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2
    },
    sortableContentContainer: {
      flex: 1
    }, 
    sortableContentContainerOriginalStyle: {
      flex: 1
    },
    containerSortable: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#eee',
  
      ...Platform.select({
        ios: {
          paddingTop: 20,
        },
      }),
    },
    title: {
      fontSize: 20,
      paddingVertical: 20,
      color: '#999999',
    },
    list: {
      paddingTop: 12.25,
      width: window.width,
    },
    contentContainer: {
      ...Platform.select({
        ios: {
          paddingVertical: 0,
          paddingBottom: 175
        },
  
        android: {
          paddingVertical: 0,
          paddingBottom: 175
        },
      }),
    },
    row: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: "center",
      alignContent: "center",
      backgroundColor: '#fff',
      width: 175,
      maxWidth: 175,
      height: 175,
      marginRight: 0,
      borderRadius: 4,
      ...Platform.select({
        ios: {
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowOpacity: 1,
          shadowOffset: {height: 2, width: 2},
          shadowRadius: 2,
        },
  
        android: {
          elevation: 0,
          marginHorizontal: 0
        },
      }),
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: "center"
    },
    centeredMargin: {
      backgroundColor: "#fff",
      padding: 17.25,
      borderWidth: 4.25,
      borderColor: BaseColor.blueColor,
      maxHeight: height * 0.85
    },
    placeholderMediaSmaller: {
      backgroundColor:  BaseColor.blueColor, width: 52.5, height: 52.5
    },
    placeholderMedia: {
        backgroundColor:  BaseColor.blueColor, width: 82.5, height: 82.5
    },
    videoModal: {
      width: width * 0.775,
      height: height * 0.425,
      maxHeight: height * 0.425
    },
    modalPreview: {
      width: width * 0.875,
      height: height * 0.875
    },
    mediumHR: {
      borderBottomColor: "lightgrey",
      borderBottomWidth: 2,
      marginTop: 12.25,
      marginBottom: 2.25,
      width: "100%"
    },
    emphizedText: {
      fontWeight: "400",
      fontSize: 17.75
    },  
    backgroundVideo: {
      maxWidth: width / 3,
      minHeight: "100%",
      height: "100%",
      backgroundColor: "lightgrey",
      width: "100%",
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    },
    image: {
      width: 162.5,
      height: 162.5,
      borderWidth: 3,
      borderColor: "#000",
      borderRadius: 11.25,
      paddingTop: 7.25
    },
    text: {
      fontSize: 18,
      color: '#222222',
    },
});

export default styles;