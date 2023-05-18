import React, { Fragment, useState } from "react";
import { Text, Header, Icon, Button } from "@components";
import { useTheme, BaseColor } from '@config';
import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity, Image, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import styles from "./submitTalentShowVideoStyles.js";
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import axios from "axios";
import Spinner from 'react-native-loading-spinner-overlay';
import Video from 'react-native-video';
import * as Progress from 'react-native-progress';
import uuid from "react-native-uuid";
import Toast from "react-native-toast-message";
import { launchImageLibrary } from 'react-native-image-picker';
import { connect } from "react-redux";
import _ from "lodash";
import { BASE_URL, BASE_ASSET_URL } from "@env";

const { width, height } = Dimensions.get("window");

const InAppGameCompetitionSubmitTalentVideoHelper = ({ userData }) => {

    const { colors, theme } = useTheme();
    const navigation = useNavigation();
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        loading: false,
        video: null,
        activeSection: null,
        uploadProgress: 0,
        snapshot: null
    });

    const sections = [
        {
            title: `What is this talent show?!`,
            content: `This is a talent show, submit anything you think will impress the competition leader/creator (the person you're competing for). You can submit a video of any type of talents like guitar, dance, music, etc...`,
            image: require("../../../../assets/icons/talent-1.png")
        },
        {
            title: 'How do I pass this final round?',
            content: `You need to be picked by the competitior creator/leader (who you're competing for) to be the WINNER of this competition and win one-on-one dates with the competition creator along with TOKENS as well!`,
            image: require("../../../../assets/icons/talent-2.png")
        },
        {
            title: 'What happens since this is the final round of the compeitition??',
            content: `The competition leader or creator will CHOOSE one of you in the final round of the elimination process. Congrats for making it this far, submit your video and see if you're picked as the winner... \n\nStay tuned as we'll let you know if you're selected or not as the winner.`,
            image: require("../../../../assets/icons/talent-3.png")
        }
    ];
    
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

    const handleFinalSubmission = () => {
        console.log("handleFinalSubmission clicked/ran...")
    }

    const calculateDisabled = () => {
        if (true) { 
            return false;
        } else {
            return true;
        }
    }

    console.log("activeSection", state.activeSection);

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
                        <Text style={styles.titleeee}>Click to upload a video...</Text>
                        <Text style={styles.contenttttt}>Upload a video about you, your interest's, beliefs, etc... Whatever you'd like to share!</Text>
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
                    <ActivityIndicator
                        size="large"
                        color={BaseColor.whiteColor}
                        style={{
                            marginTop: 20
                        }}
                    />
                    <View style={{ marginTop: 22.25 }} />
                    <Text style={styles.spinnerTextStyle}>Loading/Uploading Video...</Text>
                </View>
            </Spinner>
            <Header
                title={"Talent Show!"}
                subTitle="Submit Your Talent..."
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
            <ScrollView contentContainerStyle={{ paddingBottom: 75 }}>
                <View style={{ margin: 12.25 }}>
                    <Text style={styles.headerText}>To learn how to play this stage of the game, click through the list below to get an understanding of what needs to be done.</Text>
                    <View style={styles.accordionContainer}>
                        <AccordionList
                            list={sections}
                            header={(section, index) => (
                                <Fragment key={index}>
                                    <CollapseHeader style={{ margin: 7.25 }}>
                                        <Text style={styles.title}>{section.title}</Text>
                                    </CollapseHeader>
                                </Fragment>
                            )}
                            body={(section, index) => (
                                <Fragment key={index}>
                                    <CollapseBody style={{ margin: 7.25 }}>
                                        <View style={{ flexDirection: "row", display: "flex" }}>
                                            <View style={{ width: "20%", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                                <Image style={styles.sectionImage} source={section.image} />
                                            </View>
                                            <View style={{ width: "80%" }}>
                                                <Text style={styles.content}>{section.content}</Text>
                                            </View>
                                        </View>
                                    </CollapseBody>
                                </Fragment>
                            )}
                            keyExtractor={item => item.content}
                        />
                    </View>
                </View>
                <View style={styles.specialContainer}>
                    <View style={[styles.redband, { backgroundColor: colors.accent }]}>
                        <Text style={[styles.titleTop, { color: "#fff" }]}>Upload your 'Talent Video' (up-to 1 min long)</Text>
                        <Text style={[styles.labeled, { color: "#fff" }]}>Upload an talent video about whatever talents you may have, you can upload up-to 1 min video time!</Text>
                    </View>
                    <View style={{ marginTop: 12.25 }} />
                    <TouchableOpacity onPress={() => handleVideoSelection()} style={styles.itemContainer}>
                        {conditionalRender()}
                    </TouchableOpacity>
                    <View style={{ marginTop: 16.25 }} />
                    <Button style={calculateDisabled() ? { backgroundColor: "lightgrey" } : { backgroundColor: colors.primary }} disabled={calculateDisabled()} full onPress={() => handleFinalSubmission()}> 
                        {'Submit Talent Video Clip!'}
                    </Button>
                </View>
            </ScrollView>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
};

export default connect(mapStateToProps, {})(InAppGameCompetitionSubmitTalentVideoHelper);