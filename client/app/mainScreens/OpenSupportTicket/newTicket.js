import React, {Fragment, useState} from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView, useColorScheme, TouchableOpacity, Image} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {useTranslation} from 'react-i18next';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import styles from './newTicketStyles.js';
import axios from "axios";
import { connect } from "react-redux";
import { BASE_URL, FRESHDESK_API_TICKETING_KEY, BASE_ASSET_URL } from "@env";
import Toast from 'react-native-toast-message';
import RNPickerSelect from 'react-native-picker-select';
import _ from "lodash";
import reportingTemplate from "./helpers/ticketRequest.js";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { BottomSheet } from 'react-native-elements';

const ticketingCategories = [{
    label: "Authentication Flow/Process",
    value: "authentication"
}, {
    label: "Feature Request",
    value: "feature-request"
}, {
    label: "Dangerous Interactions/User",
    value: "dangerous-user-interactions"
}, {
    label: "Broken/Not-Working Feature",
    value: "broken-feature"
}, {
    label: "Report A Bot",
    value: "report-bot"
}, {
    label: "Sexual Misconduct",
    value: "sexual-misconduct"
}, {
    label: "Report Duplicate Account(s)",
    value: "duplicate-accounts"
}, {
    label: "Bug Report (Free tokens for accurate report)",
    value: "bug-report"
}, {
    label: "*My* Account Management",
    value: "my-account-management"
}, {
    label: "Refund/Refunds",
    value: "refunds"
}, {
    label: "Harassment/Misconduct",
    value: "harassment-misconduct"
}, {
    label: "User(s) Under 18 (Free tokens for accurate report)",
    value: "under-18-user"
}, {
    label: "Other/Not-Listed",
    value: "other-not-listed"
},]


const OpenNewSupportTicketClaim = ({navigation, authData}) => {
    const {colors, theme} = useTheme();
    const {t} = useTranslation();
    const colorSchemeDark = theme.dark;
    const offsetKeyboard = Platform.select({
        ios: 0,
        android: 20,
    });

    const [ state, setState ] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
        comment: "",
        category: null,
        loading: false,
        token: null,
        files: [],
        showBottomSheet: false
    });

    const onSubmit = async () => {
        if ((typeof state.comment !== "undefined" && state.comment.length > 0) && (state.category !== null)) {

            if (typeof state.files !== "undefined" && state.files.length > 0) {
                // files exist
                let imagesArr = "";

                for (let index = 0; index < state.files.length; index++) {
                    const file = state.files[index];
                    imagesArr += `${BASE_ASSET_URL}/${file.link} \n`;
                }

                const response = await axios.post('https://makendate.freshdesk.com/api/v2/tickets', {
                    'subject': state.category,
                    "priority": 2,
                    // "attachments": [],
                    "status": 2,
                    "description": reportingTemplate(state.comment, imagesArr, authData.uniqueId),
                    "requester_id": Number(authData._id),
                    "email": authData.email
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    auth: {
                        username: FRESHDESK_API_TICKETING_KEY,
                        password: 'X'
                    }
                });

                console.log("response.data", response);
    
                if (response.status === 201 || response.status === 200) {
                    console.log("response.data", response.status);

                    Toast.show({
                        type: 'success',
                        text1: `Successfully submitted your ticket!`,
                        text2: `We will circle back here soon with a response to your ticket.`,
                        visibilityTime: 3250,
                        position: "bottom",
                        onHide: () => {
                            navigation.goBack();
                        }
                    })
                } else {
                    Toast.show({
                        type: 'error',
                        text1: `Error occurred while submitting ticket!`,
                        text2: `We could NOT submit your ticket successfully - contact support if the problem persists (contact form)`,
                        visibilityTime: 3250,
                        position: "bottom"
                    })
                }
            } else {
                // no files exist

                const response = await axios.post('https://makendate.freshdesk.com/api/v2/tickets', {
                    'subject': state.category,
                    "priority": 2,
                    // "attachments": [],
                    "status": 2,
                    "description": reportingTemplate(state.comment, "", authData.uniqueId),
                    "requester_id": Number(authData._id),
                    "email": authData.email
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    auth: {
                        username: FRESHDESK_API_TICKETING_KEY,
                        password: 'X'
                    }
                });

                console.log("response.data", response);

                if (response.status === 201 || response.status === 200) {
                    console.log("response.data", response.status);

                    Toast.show({
                        type: 'success',
                        text1: `Successfully submitted your ticket!`,
                        text2: `We will circle back here soon with a response to your ticket.`,
                        visibilityTime: 3250,
                        position: "bottom",
                        onHide: () => {
                            navigation.goBack();
                        }
                    })
                } else {
                    Toast.show({
                        type: 'error',
                        text1: `Error occurred while submitting ticket!`,
                        text2: `We could NOT submit your ticket successfully - contact support if the problem persists (contact form)`,
                        visibilityTime: 3250,
                        position: "bottom"
                    })
                }
            }
        }
    };

    const handleImagePickSelection = async () => {

        const options = {
            includeBase64: true,
            saveToPhotos: true,
            mediaType: "photo",
            selectionLimit: 1
        };

        const result = await launchImageLibrary(options);

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

                axios.post(`${BASE_URL}/upload/misc/file/wo/saving`, config).then(async (res) => {
                if (res.data.message === "Uploaded successfully!") {
                    console.log(res.data);

                    const { file } = res.data;

                    Toast.show({
                        type: 'success',
                        text1: `Successfully uploaded/selected your photo!`,
                        text2: `We've successfully uploaded your profile photo - you will be redirectly momentarily...`,
                        visibilityTime: 2375,
                        position: "bottom",
                        onHide: () => {}
                    });

                    setState(prevState => {
                        return {
                            ...prevState,
                            loading: false,
                            files: [...prevState.files, file],
                            showBottomSheet: false
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
                            loading: false,
                            showBottomSheet: false
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
                        loading: false,
                        showBottomSheet: false
                    }
                })
            });
        }
    }

    const handleTakeNewPhoto = async () => {
        const options = {
            includeBase64: true,
            saveToPhotos: true,
            mediaType: "photo",
            selectionLimit: 1
        };

        const result = await launchCamera(options);

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
                        onHide: () => {}
                    });

                    setState(prevState => {
                        return {
                            ...prevState,
                            loading: false,
                            files: [...prevState.files, file],
                            showBottomSheet: false
                        }
                    })

                    callFileAttachement(file);
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
                            loading: false,
                            showBottomSheet: false
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
                        loading: false,
                        showBottomSheet: false
                    }
                })
            });
        }
    }

    const viewBottomSheet = () => {
        return (
            <BottomSheet
                isVisible={state.showBottomSheet}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.50, 0, 0.50)' }}
            >
                
                <View
                    activeOpacity={0.9}
                    onPress={() => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                showBottomSheet: false
                            }
                        })
                    }}
                    style={styles.bottomSheetStyle}
                >
                    <Text style={{ textAlign: 'center', color: "#000" }}>
                        Select An Option
                    </Text>
                    <View style={{ height: 0.80, backgroundColor: 'gray', marginVertical: 10 }}>
                    </View>
                    <TouchableOpacity onPress={() => handleTakeNewPhoto()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require("../../assets/icons/camera-2.png")} style={styles.iconCustom} />
                        <Text style={{ marginLeft: 10, color: "#000" }}>
                            Camera
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleImagePickSelection()} style={{ flexDirection: 'row', marginVertical: 10 * 2.0 }}>
                        <Image source={require("../../assets/icons/upload-2.png")} style={styles.iconCustom} />
                        <Text style={{ marginLeft: 10, color: "#000", marginTop: 7.25 }}>
                            Upload from Gallery
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setState(prevState => {
                        return {
                            ...prevState,
                            showBottomSheet: false
                        }
                    })} style={{ flexDirection: 'row' }}>
                        <Image source={require("../../assets/icons/close-large.png")} style={styles.iconCustom} />
                        <Text style={{ marginLeft: 10, marginTop: 7.25, color: "darkred" }}>
                            Cancel/Close Pane
                        </Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        )
    }

    return (
        <View style={{flex: 1}}>
            <Header
                title={t('contact_us')}
                renderLeft={() => {
                    return (
                        <Icon
                        name="arrow-left"
                        size={20}
                        color={colors.primary}
                        enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}
            />
            {viewBottomSheet()}
            <Spinner
                visible={state.loading}
                textContent={'Loading/Uploading...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor={"rgba(0, 0, 0, 0.725)"}
            />
            <SafeAreaView
                style={BaseStyle.safeAreaView}
                edges={['right', 'left', 'bottom']}>
                <KeyboardAvoidingView
                behavior={Platform.OS === 'android' ? 'height' : 'padding'}
                keyboardVerticalOffset={offsetKeyboard}
                style={{flex: 1}}>
                <ScrollView contentContainerStyle={{paddingHorizontal: 20}}>
                    <Text headline style={{marginVertical: 10, fontSize: 24.25, textAlign: "center", textDecorationLine: "underline" }}>
                    Open a new support ticket
                    </Text>
                    <Text style={styles.labeledTier}>Enter your name (full name)</Text>
                    <TextInput
                    onChangeText={text => setState(prevState => {
                        return {
                            ...prevState,
                            name: text
                        }
                    })}
                    placeholder={t('name')}
                    value={state.name}
                    />  
                    <Text style={styles.labeledTier}>Select your reporting claim 'category' that is closest to what you'd like to report</Text>
                    <RNPickerSelect 
                        onValueChange={(value) => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    category: value
                                }
                            })
                        }}
                        useNativeAndroidPickerStyle={false}
                        textInputProps={colorSchemeDark ? { backgroundColor: colors.card, padding: 12.25, color: "#fff" } : { backgroundColor: colors.card, padding: 12.25, color: "#000" }}
                        value={state.category}
                        items={ticketingCategories}
                    />
                    {/* <TextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                subject: text
                            }
                        })}
                        placeholder={'Subject'}
                        value={state.subject}
                        style={{ marginTop: 12.75 }}
                    /> */}
                    {/* <TextInput
                        style={{ marginTop: 12.75 }}
                        onChangeText={text => setEmail(text)}
                        placeholder={t('email')}
                        keyboardType="email-address"
                        value={email}
                    /> */}
                    <Text style={styles.labeledTier}>Enter your message/complaint</Text>
                    <TextInput
                        style={{marginTop: 12.75, height: 225}}
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                comment: text
                            }
                        })}
                        textAlignVertical="top"
                        multiline={true}
                        placeholder={t('message')}
                        value={state.comment}
                    />
                    <View style={styles.hr} />
                    <TouchableOpacity onPress={() => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                showBottomSheet: true
                            }
                        })
                    }} style={[styles.uploadContainer, { borderColor: colors.primary }]}>
                        <View style={styles.centered}>
                            <Text style={{ fontSize: 15, color: colors.accent }}>Select an image to upload...</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.hr} />
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
                                        <Text style={styles.fileNameText} key={index}>{`${index + 1}) ${file.name}`}</Text>
                                    </TouchableOpacity>
                                </Fragment>
                            );
                        }) : <Text style={styles.fileNameText}>No files uploaded yet...</Text>}
                    </View>
                </ScrollView>
                <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
                    <Button
                        full
                        onPress={() => {
                            onSubmit();
                        }}
                    >
                    {t('send')}
                    </Button>
                </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {  })(OpenNewSupportTicketClaim)