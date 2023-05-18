import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import * as Utils from '@utils';


const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    slide: {
	    alignItems: 'center',
	    justifyContent: 'center',
	    flex: 1,
	    backgroundColor: "rgba(0, 0, 0, 0.625)",
	    borderRadius: 22.25,
	    marginTop: 12.25,
	    borderWidth: 1.5,
	    borderColor: "#000",
	    paddingBottom: 22.5,
	    padding: 6.75,
	    margin: 32.5
	},
	spinnerTextStyle: {
    	fontSize: 24.75,
    	textAlign: "center",
    	fontWeight: "bold",
    	color: "#fff"
    },
  	textSlide: {
    	marginTop: 30,
    	color: "#fff"
  	},
  	wrapper: {
	    width: '100%',
	    height: 325
  	},
  	img: {
	    width: Utils.scaleWithPixel(60),
	    height: Utils.scaleWithPixel(60)
	},
	contentPage: {
	    bottom: 0,
	}
})

export default styles;