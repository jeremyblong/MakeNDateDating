import React, { Fragment, useEffect, useRef, useState } from "react";
import { View, useColorScheme, TouchableOpacity, Platform } from "react-native";
import { Button, Text, TextInput } from "@components";
import styles from "./pageStyles.js";
import { useTheme } from '@config';
import helpers from "./helpers/mappedListOptions.js";
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-modern-datepicker';
import moment from "moment";
import ActionSheet from 'react-native-actionsheet';
import Toast from "react-native-toast-message";
import axios from "axios";
import { BASE_URL } from "@env";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import _ from "lodash";
import { request, PERMISSIONS } from 'react-native-permissions';

const { stateList, licenseOptions } = helpers;
const currenDate = moment(new Date()).format("YYYY-MM-DD");

const PageNineDataRegisterClinician = ({ handleContinuation, businessAccountTempData, saveAuthenticationDetailsCounselor }) => {
    const { colors, theme } = useTheme();
    const colorSchemeDark = theme.dark;
    const actionSheetRef = useRef(null);

    const [ state, setState ] = useState({
        licenseNumber: "",
        expirationDate: null,
        licenseType: null,
        stateOptions: [],
        files: [],
        selectedState: null,
        loading: false
    });

    useEffect(() => {
        const newArr = [];
        for (let idx = 0; idx < stateList.length; idx++) {
            const item = stateList[idx];
            newArr.push({ label: item.name, value: item.abbreviation });
            if ((stateList.length - 1) === idx) {
                setState(prevState => {
                    return {
                        ...prevState,
                        stateOptions: newArr
                    }
                })
            }
        }
    }, [])

    const calculateDisabled = () => {
        const { licenseNumber, expirationDate, selectedState, licenseType, files } = state;

        if ((typeof licenseNumber !== "undefined" && licenseNumber.length >= 5) && (selectedState !== null) && (expirationDate !== null) && (licenseType !== null) && (typeof files !== "undefined" && files.length > 0)) {
            return false;
        } else {    
            return true;
        }
    }

    const handleSubmission = () => {
        console.log("handleSubmission clicked/ran...");

        const { licenseNumber, expirationDate, selectedState, licenseType, files } = state;

        saveAuthenticationDetailsCounselor({
            ...businessAccountTempData,
            licensingInformation: {
                licenseNumber, 
                expirationDate, 
                selectedState, 
                licenseType,
                proofPics: files
            }
        });

        setTimeout(() => {
            handleContinuation(10)
        },  775);
    }
    const handleImageSelection = async () => {

        if (Platform.OS === "ios") {
            request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(async (result) => {
                console.log("result location request...:", result);
    
                if (result === "granted" || result === "limited") {
                    const result = await launchImageLibrary({
                        mediaType: "photo",
                        quality: 1,
                        includeBase64: true,
                        selectionLimit: 1
                    });
            
                    if (!_.has(result, "didCancel")) {
                        // saveAuthenticationDetails(data, oldData)
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
                                        setState(prevState => {
                                            return {
                                                ...prevState,
                                                files: [...prevState.files, file],
                                                loading: false
                                            }
                                        })
                                    }
                                });
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
            });
        } else {
            request(PERMISSIONS.ANDROID.CAMERA).then(async (result) => {
                console.log("result location request...:", result);
    
                if (result === "granted") {
                    const result = await launchImageLibrary({
                        mediaType: "photo",
                        quality: 1,
                        includeBase64: true,
                        selectionLimit: 1
                    });
            
                    if (!_.has(result, "didCancel")) {
                        // saveAuthenticationDetails(data, oldData)
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
                                        setState(prevState => {
                                            return {
                                                ...prevState,
                                                files: [...prevState.files, file],
                                                loading: false
                                            }
                                        })
                                    }
                                });
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
            });
        }
    }

    const handleTakeNewImage = async () => {
        request(PERMISSIONS.ANDROID.CAMERA).then(async (result) => {
            console.log("result location request...:", result);

            if (result === "granted" || result === "limited") {
                const result = await launchCamera({
                    mediaType: "photo",
                    quality: 1,
                    includeBase64: true,
                    selectionLimit: 1
                });
        
                console.log("result", result);
        
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
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            files: [...prevState.files, file],
                                            loading: false
                                        }
                                    })
                                }
                            });
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
        <Fragment>
            <View style={{ margin: 12.25 }}>
                <ActionSheet
                    ref={actionSheetRef}
                    title={`Select which type of upload you'd like to make..`}
                    options={['Select an existing photo', 'Take a new photo', "Cancel/Close Pane"]}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => {
                        switch (index) {
                            case 0:
                                handleImageSelection();
                                break;
                            case 1:
                                handleTakeNewImage();
                                break;
                            default: 
                                break;
                        }
                    }}
                />
                <Spinner
                    visible={state.loading}
                    textContent={'Uploading File...'}
                    textStyle={styles.spinnerTextStyle}
                    overlayColor={"rgba(0, 0, 0, 0.725)"}
	            />
                <View style={colorSchemeDark ? { backgroundColor: "#000", minWidth: "100%", width: "100%", borderRadius: 8.25 } : { backgroundColor: "#fff", minWidth: "100%", width: "100%", borderRadius: 8.25 }}>
                    <View style={{ marginBottom: 12.25 }}>
                        <View style={[styles.itemPrice, { borderColor: colors.border, paddingHorizontal: 12.25 }]}>
                            <Text headline semibold>
                                Licensing state
                            </Text>
                            <Text body2 grayColor style={{ marginVertical: 10 }}>
                                Select your the state you're actively licensed in...
                            </Text>
                            <RNPickerSelect
                                onValueChange={(value) => setState(prevState => {
                                    return {
                                        ...prevState,
                                        selectedState: value
                                    }
                                })}
                                style={colorSchemeDark ? {
                                    inputAndroid: {
                                        color: "#fff"
                                    }
                                } : {}}
                                items={state.stateOptions}
                            />
                        </View>
                        <View style={[styles.itemPrice, { borderColor: colors.border, paddingHorizontal: 12.25 }]}>
                            <Text headline semibold>
                                Select your license
                            </Text>
                            <Text body2 grayColor style={{ marginVertical: 10 }}>
                                What license from your schooling have you acquired? 
                            </Text>
                            <RNPickerSelect
                                onValueChange={(value) => setState(prevState => {
                                    return {
                                        ...prevState,
                                        licenseType: value
                                    }
                                })}
                                style={colorSchemeDark ? {
                                    inputAndroid: {
                                        color: "#fff"
                                    }
                                } : {}}
                                items={licenseOptions}
                            />
                        </View>
                        <View style={{ margin: 12.25 }}>
                            <Text style={styles.label}>What is your license number?</Text>
                            <TextInput
                                onChangeText={text => setState(prevState => {
                                    return {
                                        ...prevState,
                                        licenseNumber: text
                                    }
                                })}
                                secureTextEntry={false}
                                placeholder="Enter your license number..."
                                value={state.licenseNumber}
                            />
                            <Text style={styles.label}>Expiration Date</Text>
                            <DatePicker
                                onDateChange={(date) => setState(prevState => {
                                    return {
                                        ...prevState,
                                        expirationDate: date
                                    }
                                })}
                                current={currenDate}
                                selected={moment(state.expirationDate).format("YYYY-MM-DD")}
                                mode="calendar"
                                options={{
                                    backgroundColor: '#090C08',
                                    textHeaderColor: colors.accent,
                                    textDefaultColor: colors.primary,
                                    selectedTextColor: '#fff',
                                    mainColor: colors.primary,
                                    textSecondaryColor: colors.primary,
                                    borderColor: 'rgba(122, 146, 165, 0.1)',
                                }}
                            />
                        </View>
                        <View style={[styles.itemPrice, { borderColor: colors.border, paddingHorizontal: 12.25 }]}>
                            <Text headline semibold>
                                Upload a picture
                            </Text> 
                            <Text body2 grayColor style={{ marginVertical: 10 }}>
                                Upload a picture of your license for verification
                            </Text>
                            <TouchableOpacity onPress={() => actionSheetRef.current.show()} style={[styles.touchable, { borderColor: colors.accent }]}>
                                <Text style={styles.labeledWo}>Select a photo to upload</Text>
                            </TouchableOpacity>
                            <View style={styles.bufferView} />
                            <View style={styles.centered}>
                                {typeof state.files !== "undefined" && state.files.length > 0 ? state.files.map((file, index) => {
                                    return (
                                        <Fragment>
                                            <TouchableOpacity onPress={() => {
                                                setState(prevState => {
                                                    return {
                                                        ...prevState,
                                                        files: prevState.files.filter(item => item.link !== file.link)
                                                    }
                                                })
                                            }}>
                                                <Text style={styles.labeledWo} key={index}>{`${index + 1}) ${file.name}`}</Text>
                                            </TouchableOpacity>
                                        </Fragment>
                                    );
                                }) : <Text style={styles.labeledWo}>No files uploaded yet...</Text>}
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.bufferView} />
                <Button
                    full
                    disabled={calculateDisabled()}
                    style={calculateDisabled() ? { marginTop: 10, marginBottom: 20, backgroundColor: "lightgrey" } : { marginTop: 10, marginBottom: 20, backgroundColor: colors.accent }}
                    onPress={() => handleSubmission()}>
                    {"Submit & Continue"}
                </Button>
            </View>
        </Fragment>
    );
}
export default PageNineDataRegisterClinician;