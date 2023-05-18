import React, { Fragment, useState } from "react";
import { View, TouchableOpacity, useColorScheme } from "react-native";
import { Button, TextInput, Text } from "@components";
import styles from "./pageStyles.js";
import { useTheme } from '@config';
import DocumentPicker from "react-native-document-picker";
import RNFS from 'react-native-fs';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from "react-native-toast-message";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import _ from "lodash";


const PageTenDataRegisterClinician = ({ handleContinuation, businessAccountTempData, saveAuthenticationDetailsCounselor }) => {
    const { colors, theme } = useTheme();
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        schoolName: "",
        graduationYear: "",
        file: null
    });

    const calculateDisabled = () => {
        const { schoolName, graduationYear, file } = state;

        if ((typeof schoolName !== "undefined" && schoolName.length > 0) && (typeof graduationYear !== "undefined" && graduationYear.length >= 4) && (file !== null)) {
            return false;
        } else {
            return true;
        }
    }

    const handleSubmission = () => {
        console.log("handleSubmission clicked/ran...");

        const { schoolName, graduationYear, file } = state;

        saveAuthenticationDetailsCounselor({
            ...businessAccountTempData,
            schoolAndResume: {
                schoolName, 
                graduationYear, 
                file
            }
        });

        setTimeout(() => {
            handleContinuation(11)
        },  775);
    }

    const pickDocument = () => {

        DocumentPicker.pickSingle({
            type: ["application/pdf", DocumentPicker.types.docx, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        }).then((values) => {
            console.log("values documentpicker", values);

            setState(prevState => {
                return {
                    ...prevState,
                    loading: true
                }
            })

            const { name, type } = values;

            RNFS.readFile(values.uri, 'base64').then(base64 => {

                const config = {
                    base64: base64,
                    contentType: type,
                    filename: name
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
                                        file,
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
            });
        });
    }

    return (
        <Fragment>
            <Spinner
                visible={state.loading}
                textContent={'Uploading Document...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor={"rgba(0, 0, 0, 0.725)"}
            />
            <View style={{ margin: 12.25 }}>
                <View style={colorSchemeDark ? { backgroundColor: "#000", minWidth: "100%", width: "100%", borderRadius: 8.25 } : { backgroundColor: "#fff", minWidth: "100%", width: "100%", borderRadius: 8.25 }}>
                    <View style={{ marginBottom: 12.25 }} />
                        <View style={{ margin: 12.25 }}>
                            <Text style={styles.label}>What is your school name?</Text>
                            <TextInput
                                onChangeText={text => setState(prevState => {
                                    return {
                                        ...prevState,
                                        schoolName: text
                                    }
                                })}
                                secureTextEntry={false}
                                placeholder="Enter your professional school name..."
                                value={state.schoolName}
                            />
                            <Text style={styles.label}>Graduation Year (YYYY)</Text>
                            <TextInput
                                onChangeText={text => setState(prevState => {
                                    return {
                                        ...prevState,
                                        graduationYear: text.replace(/[^0-9]/g, '')
                                    }
                                })}
                                keyboardType={"number-pad"}
                                secureTextEntry={false}
                                placeholder="YYYY"
                                value={state.graduationYear}
                            />
                            <View style={[styles.itemPrice, { borderColor: colors.border, paddingHorizontal: 12.25, marginTop: 20 }]}>
                                <Text headline semibold>
                                    Upload your resume
                                </Text>
                                <Text body2 grayColor style={{ marginVertical: 10 }}>
                                    We will review your resume to make sure you're a good match - feel free to reach out after submitting your information (more-than 48 hours from submission) to check on the progress of your application
                                </Text>
                                <TouchableOpacity onPress={() => pickDocument()} style={state.file !== null ? [styles.touchable, { borderColor: colors.primary, marginVertical: 20 }] : [styles.touchable, { borderColor: colors.accent, marginVertical: 20 }]}>
                                    <Text style={styles.labeledWo}>{state.file !== null ? "Re-Select Another Document" : "Select your resume"}</Text>
                                </TouchableOpacity>
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
export default PageTenDataRegisterClinician;