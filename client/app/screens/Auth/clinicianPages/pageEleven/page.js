import React, { useState } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import styles from "./pageStyles.js";
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import _ from "lodash";
import axios from "axios";
import { BASE_URL } from "@env";
import { useTheme } from '@config';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import { request, PERMISSIONS } from 'react-native-permissions';


const PageElevenDataRegisterClinician = ({ handleContinuation, businessAccountTempData, saveAuthenticationDetailsCounselor }) => {

	const { colors } = useTheme();

	const [ state, setState ] = useState({
		loading: false,
		file: null
	})

	const handleImageSelection = async () => {

        const result = await launchImageLibrary({
            mediaType: "photo",
            quality: 1,
            includeBase64: true,
            selectionLimit: 1
        });

        if (!_.has(result, "didCancel")) {

            setState(prevState => {
            	return {
            		...prevState,
            		loading: true
            	}
            })
            const asset = result.assets[0];

            const config = {
                base64: asset.base64,
                contentType: asset.type,
                filename: asset.fileName
            }

            axios.post(`${BASE_URL}/upload/misc/file/wo/saving`, config).then((res) => {
                if (res.data.message === "Uploaded successfully!") {
                    console.log(res.data);

                    const { file } = res.data;

                    Toast.show({
					    type: 'success',
					    text1: `Successfully uploaded/selected your photo!`,
					    text2: `We've successfully uploaded your profile photo - you will be redirectly momentarily...`,
					    visibilityTime: 2375,
					    position: "bottom",
					    onHide: () => {

					    	saveAuthenticationDetailsCounselor({ ...businessAccountTempData, profilePic: file });
					    	handleContinuation(12);
					    }
					});

                    setState(prevState => {
		            	return {
		            		...prevState,
		            		loading: false
		            	}
		            })
                } else {
                    console.log("Err", res.data);

                    Toast.show({
					    type: 'error',
					    text1: `Error attempting to upload your image/photo!`,
					    text2: `Uploading your photo failed, please try this action again or contact support if the problem persists...`,
					    visibilityTime: 2375,
					    position: "bottom"
					});

                    setState(prevState => {
		            	return {
		            		...prevState,
		            		loading: false
		            	}
		            })
                }
            }).catch((err) => {
                console.log(err.message);

                Toast.show({
				    type: 'error',
				    text1: `Error attempting to upload your image/photo!`,
				    text2: `Uploading your photo failed, please try this action again or contact support if the problem persists...`,
				    visibilityTime: 2375,
				    position: "bottom"
				});

                setState(prevState => {
		            	return {
		            		...prevState,
		            		loading: false
		            	}
		            })
            })
        }
    }

    const handleTakeNewImage = () => {
		request(PERMISSIONS.ANDROID.CAMERA).then(async (result) => {
 			console.log("result location request...:", result);

			if (result === "granted") {
				const result = await launchCamera({
		            mediaType: "photo",
		            quality: 1,
		            includeBase64: true,
		            selectionLimit: 1
		        });

		        console.log("result", result);

		        if (!_.has(result, "didCancel")) {

		            setState({
		                loading: true
		            })
		            const asset = result.assets[0];

		            const config = {
		                base64: asset.base64,
		                contentType: asset.type,
		                filename: asset.fileName
		            }

		             axios.post(`${BASE_URL}/upload/misc/file/wo/saving`, config).then((res) => {
		                if (res.data.message === "Uploaded successfully!") {
		                    console.log(res.data);

		                    const { file } = res.data;

		                    Toast.show({
							    type: 'success',
							    text1: `Successfully uploaded/selected your photo!`,
							    text2: `We've successfully uploaded your profile photo - you will be redirectly momentarily...`,
							    visibilityTime: 2375,
							    position: "bottom",
							    onHide: () => {
							    	saveAuthenticationDetailsCounselor({ ...businessAccountTempData, profilePic: file });

							    	handleContinuation(12);
							    }
							});

		                    setState(prevState => {
				            	return {
				            		...prevState,
				            		loading: false
				            	}
				            })
		                } else {
		                    console.log("Err", res.data);

		                    Toast.show({
							    type: 'error',
							    text1: `Error attempting to upload your image/photo!`,
							    text2: `Uploading your photo failed, please try this action again or contact support if the problem persists...`,
							    visibilityTime: 2375,
							    position: "bottom"
							});

		                    setState(prevState => {
				            	return {
				            		...prevState,
				            		loading: false
				            	}
				            })
		                }
		            }).catch((err) => {
		                console.log(err.message);

		                Toast.show({
						    type: 'error',
						    text1: `Error attempting to upload your image/photo!`,
						    text2: `Uploading your photo failed, please try this action again or contact support if the problem persists...`,
						    visibilityTime: 2375,
						    position: "bottom"
						});

		                setState(prevState => {
				            	return {
				            		...prevState,
				            		loading: false
				            	}
				            })
		            });
		        }
			}
		});
    }
	return (
		<View style={{ margin: 11.25 }}>
			<Spinner
	          visible={state.loading}
	          textContent={'Loading/Uploading...'}
	          textStyle={styles.spinnerTextStyle}
	          overlayColor={"rgba(0, 0, 0, 0.725)"}
	        />
			<TouchableOpacity onPress={() => handleImageSelection()} style={styles.whiteRoundedBtn}>
				<Text style={styles.btnText}>Choose a photo</Text>
				<Image source={require("../../../../assets/icons/plus-add-new.png")} style={styles.iconButton} />
			</TouchableOpacity>
			<View style={styles.whiteThinHR} />
			<TouchableOpacity onPress={() => handleTakeNewImage()} style={styles.whiteRoundedBtn}>
				<Text style={styles.btnText}>Take a photo</Text>
				<Image source={require("../../../../assets/icons/camera.png")} style={styles.iconButton} />
			</TouchableOpacity>
		</View>
	);
}
export default PageElevenDataRegisterClinician;