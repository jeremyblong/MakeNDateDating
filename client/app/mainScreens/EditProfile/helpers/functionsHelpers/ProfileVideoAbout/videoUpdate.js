import React, { Fragment, useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image, StatusBar, SafeAreaView, Dimensions } from "react-native";
import RNFS from 'react-native-fs';
import _ from "lodash";
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import styles from "./videoUpdateStyles.js";
import { Header, Icon } from "@components";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@config';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import Video from 'react-native-video';
import * as Progress from 'react-native-progress';
import uuid from "react-native-uuid";

const { width, height } = Dimensions.get("window");

const IntroductoryVideoMainHelper = (props) => {
    console.log("props IntroductoryVideoMainHelper", props);

    const [ state, setState ] = useState({
        loading: false,
        video: null,
        uploadProgress: 0,
        snapshot: null
    });

    const navigation = useNavigation();
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const profileData = props.profileData;
    const userData = props.userData;
    
    const submitNewDataSubmission = () => {
        console.log("submitNewDataSubmission clicked/ran...");

        // const newHeightDetails = {
        //     height: `${cmToInFt(setGuessedValue).feet}'${cmToInFt(setGuessedValue).inches}"`,
        //     CMHeight: setGuessedValue
        // }

        // const config = {
        //     uniqueId: props.userData.uniqueId,
        //     selectedValue: newHeightDetails,
        //     field: "heightProfileData",
        //     accountType: props.userData.accountType
        // }

        // axios.post(`${BASE_URL}/adjust/profile/data`, config).then((res) => {
        //     if (res.data.message === "Successfully executed desired logic!") {
        //         console.log("resdata", res.data);

        //         Toast.show({
        //             type: 'success',
        //             text1: `Successfully adjusted your 'height settings'.`,
        //             text2: `We've successfully uploaded your 'height settings' properly - you new data is now live!`,
        //             visibilityTime: 4250,
        //             position: "bottom"
        //         });

        //         setTimeout(() => {
        //             navigation.goBack();
        //         }, 2500);
        //     } else {
        //         console.log("errrorrrrrr", res.data);

        //         Toast.show({
        //             type: 'error',
        //             text1: `An error occurred while processing your request.`,
        //             text2: `We've experienced an error while adjusting your 'height settings' - please try this action again.`,
        //             visibilityTime: 4250,
        //             position: "bottom",
        //             bottomOffset: -50
        //         });
        //     }
        // }).catch((err) => {
        //     console.log(err.message);
        // })
    }

    useEffect(() => {
        // if (typeof profileData !== "undefined" && _.has(profileData, "heightProfileData")) {
        //     setGuessedValueState(profileData.heightProfileData.CMHeight);
        // }
    }, []);

    const handleVideoSelection = async () => {
        const options = {
            mediaType: "video",
            videoQuality: "medium",
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

            console.log("result", result);
            
            const assetURI = result.assets[0].uri;
            const formData = new FormData();
            const generatedID = uuid.v4() + ".mp4";

            formData.append("video", { uri: assetURI, name: generatedID, type: "video/mp4" });
            formData.append("uniqueId", userData.uniqueId)

            axios({
                method: "post",
                url: `${BASE_URL}/upload/new/profile/video/introduction`,
                data: formData,
                headers: { 
                    "Content-Type": "multipart/form-data" 
                },
                onUploadProgress: progress => {
                    const { total, loaded } = progress; 
                    const totalSizeInMB = total / 1000000;
                    const loadedSizeInMB = loaded / 1000000;
                    const uploadPercentage = (loadedSizeInMB / totalSizeInMB);

                    setState(prevState => {
                        return {
                            ...prevState,
                            uploadProgress: uploadPercentage
                        }
                    })
                    console.log("total size in MB ==> ", totalSizeInMB);
                    console.log("uploaded size in MB ==> ", loadedSizeInMB);
                }
            }).then((res) => {
                if (res.data.message === "Uploaded successfully!") {
                    console.log(res.data);

                    const { file, snapshot } = res.data;

                    setState(prevState => {
                        return {
                            ...prevState,
                            loading: false,
                            video: file,
                            uploadProgress: 0,
                            snapshot
                        }
                    })
                } else {
                    console.log("Err", res.data);

                    setState(prevState => {
                        return {
                            ...prevState,
                            loading: false,
                            uploadProgress: 0
                        }
                    })

                    Toast.show({
                        type: 'error',
                        text1: `Error attempting to upload your video!`,
                        text2: `Uploading your video failed, please try this action again or contact support if the problem persists...`,
                        visibilityTime: 2375,
                        position: "bottom"
                    });
                }
            }).catch((err) => {
                console.log(err.message);

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })

                // Toast.show({
                //     type: 'error',
                //     text1: `Error attempting to upload your video!`,
                //     text2: `Uploading your video failed, please try this action again or contact support if the problem persists...`,
                //     visibilityTime: 2375,
                //     position: "bottom"
                // });
            })
        }
    }

    console.log("state.video", state.video);

    const conditionalRender = () => {
        if (typeof state.video !== "undefined" && state.video !== null) {
            return (
                <Fragment>
                    <View style={styles.centered}>
                        <Video 
                            source={{ uri: `${BASE_ASSET_URL}/${state.video.link}` }}
                            style={styles.resizedVideoStyle} 
                            onError={(err) => console.log("err", err)}
                            onLoad={() => console.log("loaded...")}
                            onReadyForDisplay={() => console.log("video ready...:", `${BASE_ASSET_URL}/${state.video.link}`)}
                            resizeMode={"cover"}
                            paused={false}
                        /> 
                    </View>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Click to upload a video...</Text>
                        <Text style={styles.content}>Upload a video about you, your interest's, beliefs, etc... Whatever you'd like to share!</Text>
                    </View>
                </Fragment>
            );
        }
    }

    return (
        <Fragment>
            <Spinner
                visible={state.loading}
                overlayColor={"rgba(0, 0, 0, 0.725)"}
            >
                {state.uploadProgress !== 0 ? <Progress.Bar progress={state.uploadProgress} unfilledColor={"lightgrey"} borderRadius={0} height={10} color={"#0BDA51"} width={width} /> : null}
                <View style={styles.centeredAbsolute}>
                    <View style={{ marginTop: 22.25 }} />
                    <Text style={styles.spinnerTextStyle}>Loading/Uploading Video...</Text>
                </View>
            </Spinner>
            <StatusBar translucent={false} backgroundColor={colors.accent} />
            <Header
                title="Upload Profile Video"
                subTitle="Upload a personalized video..."
                style={colorSchemeDark ? { backgroundColor: "#000" } : { backgroundColor: "#fff" }}
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
            <ParallaxScroll
            headerBackgroundColor={"#fff"}
            height={height}
            style={{ flex: 1 }}
            isHeaderFixed={false}
            parallaxHeight={150}
            // headerBackgroundColor={""}
            renderParallaxBackground={({ animatedValue }) => <Image
                source={require("../../../../../assets/images/video.jpg")}
                style={styles.imgBanner}
                resizeMode={"contain"}
            />}
            renderParallaxForeground={({ animatedValue }) => {
                return (
                    <Fragment>
                        
                    </Fragment>
                );
            }}
            parallaxBackgroundScrollSpeed={3}
            parallaxForegroundScrollSpeed={1.25}
        >
            <SafeAreaView style={colorSchemeDark ? { flex: 1, backgroundColor: "#000" } : { flex: 1, backgroundColor: "#eee" }}>
                <View style={styles.container}>
                    <Text style={colorSchemeDark ? [styles.title, { color: "#fff" }] : styles.titleTop}>Upload Profile 'About Me' Video</Text>
                    <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : styles.labeled}>Upload an introductory video about whatever you'd like to introduce about yourself</Text>
                    <View style={{ marginTop: 12.25 }} />
                    <TouchableOpacity onPress={() => handleVideoSelection()} style={styles.itemContainer}>
                        {conditionalRender()}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ParallaxScroll>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
};

export default connect(mapStateToProps, {})(IntroductoryVideoMainHelper);