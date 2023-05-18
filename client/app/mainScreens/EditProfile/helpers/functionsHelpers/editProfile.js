import React, { Fragment, useRef, useState, useEffect } from "react";
import { promptPaneOptions } from "../options/editProfile.js";
import RBSheet from "react-native-raw-bottom-sheet";
import { View, Dimensions, StyleSheet, Text, Image, ScrollView, TouchableOpacity, FlatList, Platform } from "react-native";
import { ListItem, Header } from '@rneui/themed'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Button } from "@rneui/base";
import * as Progress from 'react-native-progress';
import _ from "lodash";
import RNFS from 'react-native-fs';
import Toast from "react-native-toast-message";
import axios from "axios";
import uuid from 'react-native-uuid';
import { BASE_URL } from "@env";
import { connect } from "react-redux";


const { width, height } = Dimensions.get('screen');

const primaryColor = "#D81159";
const secondaryColor = "#0496FF";
const backColor = "#eee";

const audioRecorderPlayer = new AudioRecorderPlayer();

const RenderVoiceRecordingLogicSheet = ({ refSheetVoiceRecord, selection, userData }) => {

    console.log("refSheetVoiceRecord", refSheetVoiceRecord);

    const [ active, setActive ] = useState(0);
    const [ finalized, setFinalized ] = useState(false);
    const [ clicked, setClicked ] = useState(false);
    const [ recordingData, setRecordingData ] = useState(null);
    const [ result, setResult ] = useState(null);

    const onStartRecord = async () => { 

        setFinalized(false);

        const result = await audioRecorderPlayer.startRecorder();
        audioRecorderPlayer.addRecordBackListener((e) => {
            if (Math.floor(e.currentPosition / 1000) >= 30) {
                onStopRecord();
                setClicked(false);
            } else {
                setRecordingData({
                    recordSecs: e.currentPosition,
                    recordTime: audioRecorderPlayer.mmssss(
                        Math.floor(e.currentPosition),
                    ),
                })
                setActive(Math.floor(e.currentPosition / 1000)); 
            }
            return;
        });
        console.log(result);
    };

    const onStopRecord = async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setRecordingData(prevState => {
            return {
                ...prevState,
                recordSecs: 0
            }
        })
        setActive(0);
        if (result) {
            setResult(result);
            setFinalized(true);
        } 
    };

    const onStartPlay = async () => {
        console.log('onStartPlay');
        const msg = await audioRecorderPlayer.startPlayer();
        console.log(msg);
        audioRecorderPlayer.addPlayBackListener((e) => {
            setRecordingData(prevState => {
                return {
                    ...prevState,
                    currentPositionSec: e.currentPosition,
                    currentDurationSec: e.duration,
                    playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
                    duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
                }
            })
            return;
        });
    };

    // const onPausePlay = async () => {
    //     await audioRecorderPlayer.pausePlayer();
    // };

    const onStopPlay = async () => {
        console.log('onStopPlay');
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();

        setRecordingData(prevState => {
            return {
                recordSecs: 0
            }
        })

        handleSubmisisonFile();
    };

    useEffect(() => () => {
        console.log("unmount");

        setActive(0);
        setRecordingData(null);
    }, []);

    const checkIfPlaying = () => {
        if (!_.has(recordingData, "playTime")) {
            return true;
        } else {
            return false;
        }
    }

    const handleSubmisisonFile = () => {
        console.log("handleSubmisisonFile clicked/ran...");

        // readFile(filepath: string, encoding?: string)
        RNFS.readFile(result, 'base64').then(base64 => {
            console.log("resssssssssssssssss", base64);

            const config = {
                base64, 
                contentType: "video/mp4", 
                filename: uuid.v4(),
                uniqueId: userData.uniqueId,
                selection,
                accountType: userData.accountType
            }
     
            axios.post(`${BASE_URL}/upload/audio/file/profile/about`, config).then((ressss) => {
                if (ressss.data.message === "Uploaded successfully!") {
                    console.log("ressssdata", ressss.data);

                    const { file } = ressss.data;

                    refSheetVoiceRecord.current.close();

                    setTimeout(() => {
                        Toast.show({
                            type: 'success',
                            text1: `Successfully uploaded your MP3/Audio file!`,
                            text2: `We've successfully uploaded your current or selected file to our cloud hosting - please continue...`,
                            visibilityTime: 4250,
                            position: "bottom"
                        });
                    }, 2250);
                } else {
                    console.log("errrorrrrrr", ressss.data);

                    Toast.show({
                        type: 'error',
                        text1: `An error occurred while processing your file upload.`,
                        text2: `We've experienced an error while uploading your selected MP3/audio file - please try this action again.`,
                        visibilityTime: 4250,
                        position: "bottom",
                        bottomOffset: -50
                    });
                }
            }).catch((err) => {
                console.log(err.message);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while processing your file upload.`,
                    text2: `We've experienced an error while uploading your selected MP3/audio file - please try this action again.`,
                    visibilityTime: 4250,
                    position: "bottom",
                    bottomOffset: -25
                });
            })
        }).catch (err => {
            console.log(err.message, err.code);

            Toast.show({
                type: 'error',
                text1: `An error occurred while processing your file upload.`,
                text2: `We've experienced an error while uploading your selected MP3/audio file - please try this action again.`,
                visibilityTime: 4250,
                position: "bottom",
                bottomOffset: -25
            });
        });
    }

    return (
        <Fragment>
            <RBSheet
                ref={refSheetVoiceRecord}
                closeOnDragDown={false}
                closeOnPressMask={true}
                dragFromTopOnly={true}
                height={height}
                closeDuration={35}
                openDuration={35}
                customStyles={{
                    container: {
                        paddingHorizontal: 10 * 2.0,
                    },
                    draggableIcon: {
                        width: width * 0.725
                    }
                }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                    <View style={styles.container}>
                        {Platform.OS === "ios" ? <View style={{ marginTop: 32.25 }} /> : null}
                        <Header
                            backgroundColor={"#fff"}
                            centerComponent={<View><Text style={styles.centeredHeaderText}>Record Answer</Text></View>}
                            leftComponent={<TouchableOpacity onPress={() => refSheetVoiceRecord.current.close()}><Text style={styles.headerText}>Cancel</Text></TouchableOpacity>}
                            rightComponent={<TouchableOpacity onPress={handleSubmisisonFile}><Text style={styles.headerText}>Submit</Text></TouchableOpacity>}
                        />
                        <ListItem style={styles.listitemSettingsBoxed}>
                            <ListItem.Content>
                                <ListItem.Title style={styles.breakerSection}>{selection.value}</ListItem.Title>
                            </ListItem.Content>
                            <Image source={require("../../../../assets/icons/write.png")} style={styles.pencil} />
                        </ListItem>
                        <Progress.Bar progress={recordingData !== null ? Math.floor((recordingData.recordSecs / 1000)) / 30 : 0} color={primaryColor} width={width * 0.9} />
                        <View style={styles.mainContainer}>
                            <Text style={styles.secondsText}>{active === 0 ? `0:${(active).toString().padStart(2, 0)}` : recordingData.recordTime}/{`0:30`}</Text>

                            <TouchableOpacity style={styles.positionCenterBottom} onPress={() => {
                                if (clicked === false) {
                                    setClicked(true);

                                    onStartRecord();
                                } else {
                                    setClicked(false);

                                    onStopRecord();
                                }
                            }}>
                                <Text style={styles.absoluteTextAbove}>{!clicked ? "Tap to START recording..." : "Tap to STOP recording..."}</Text>
                                {!clicked ? <Image source={require("../../../../assets/icons/record.png")} style={styles.recording} /> : <Image source={require("../../../../assets/icons/stop-recording.png")} style={styles.recordingInactive} />}
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.absoluteBottomContain}>
                            <Button onPress={() => {
                                if (checkIfPlaying()) {
                                    onStartPlay();
                                } else {
                                    onStopPlay();

                                    handleSubmisisonFile();
                                }
                            }} disabled={finalized === false ? true : false} titleStyle={{ color: 'white' }} title={checkIfPlaying() ? "Review/Preview your audio recording" : "Click to stop the 'audio'- track"} buttonStyle={checkIfPlaying() ? styles.buttonStyledCustom : styles.buttonStyledCustomDark} />
                        </View>
                        <Toast />
                    </View>
                </ScrollView>
            </RBSheet>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}

const ConnectedVoiceRecordingHelper = connect(mapStateToProps, {})(RenderVoiceRecordingLogicSheet);


export const RenderPromptPane = (props) => {

    const [ selection, setSelection ] = useState(null);

    const refRBSheet = props.refRBSheet;

    const refSheetVoiceRecord = useRef(null);

    return (
        <Fragment>
            {selection !== null ? <ConnectedVoiceRecordingHelper selection={selection} props={props} refSheetVoiceRecord={refSheetVoiceRecord} /> : null}
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={false}
                closeOnPressMask={true}
                dragFromTopOnly={true}
                height={height}
                closeDuration={0}
                openDuration={35}
                customStyles={{
                    container: {
                        paddingHorizontal: 10 * 2.0,
                    },
                    draggableIcon: {
                        width: width * 0.725
                    }
                }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                    {Platform.OS === "ios" ? <View style={{ marginTop: 35 }} /> : null}
                    <View style={styles.container}>
                        <Text style={styles.title}>Select a prompt</Text>
                        <TouchableOpacity style={styles.iconHeightened} onPress={() => {
                            console.log("refRBSheet", refRBSheet);
                            refRBSheet.current.close();
                        }}>
                            <Image source={require("../../../../assets/icons/close.png")} style={styles.iconed} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={promptPaneOptions}
                        style={{ flexGrow: 1 }}
                        contentContainerStyle={{ paddingBottom: 75 }}
                        keyExtractor={(item) => item}
                        renderItem={({ item, index }) => (
                            <Fragment key={index}>
                                <ListItem onPress={() => {
                                    setSelection(item);

                                    refRBSheet.current.close();

                                    setTimeout(() => {
                                        refSheetVoiceRecord.current.open();
                                    }, 500);
                                }} style={styles.listitemSettings}>
                                    <ListItem.Content>
                                        <ListItem.Title style={styles.breakerSection}>{item.value}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            </Fragment>
                        )}
                        horizontal={false}
                        showsVerticalScrollIndicator={true}
                    />
                </ScrollView>
            </RBSheet>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    listitemSettings: {
        maxWidth: width,
        width
    },
    buttonStyledCustomDark: {
        minWidth: width * 0.825,
        marginBottom: 22.5,
        backgroundColor: "#000"
    },
    buttonStyledCustom: {
        minWidth: width * 0.825, 
        marginBottom: 22.5, 
        backgroundColor: primaryColor
    },
    positionCenterBottom: {
        position: 'absolute', 
        left: 0, 
        right: 0, 
        bottom: -52.5, 
        justifyContent: 'center', 
        alignItems: 'center'
    },  
    absoluteTextAbove: {
        color: "lightgray",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 12.5
    },  
    recordingInactive: {
        minWidth: 90,
        minHeight: 90,
        maxHeight: 90,
        maxWidth: 90,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6
    },
    recording: {
        minWidth: 112.5,
        minHeight: 112.5,
        maxHeight: 112.5,
        maxWidth: 112.5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6
    },
    secondsText: {
        textAlign: "center",
        marginTop: 22.5,
        fontSize: 26.5,
        color: "lightgray"
    },
    mainContainer: {
        width: "100%",
        height: height * 0.425,
        borderRadius: 25,
        backgroundColor: backColor,
        marginTop: 12.5,
        marginBottom: 125, // remove this later... further dev bottom
        borderWidth: 1.25,
        borderColor: "lightgray",
        minHeight: height * 0.425
    },  
    listitemSettingsBoxed: {
        maxWidth: width - 42.5,
        width,
        borderWidth: 1.5,
        borderColor: primaryColor,
        borderStyle: "dashed"
    },
    pencil: {
        maxWidth: 22.5,
        maxHeight: 22.5,
        minWidth: 22.5,
        minHeight: 22.5
    },
    centeredHeaderText: {
        fontWeight: "bold",
        fontSize: 20,
        color: "black"
    },
    headerText: {
        color: primaryColor,
        fontWeight: "bold"
    },
    title: {
        fontWeight: "bold", 
        fontSize: 22.5, 
        textAlign: "center", 
        color: primaryColor, 
        textDecorationLine: "underline" 
    },
    container: {
        marginTop: 32.5,
        flex: 1
    },
    breakerSection: {
        maxWidth: width * 0.825,
        flexWrap: "wrap",
        flexDirection: "row"
    },
    iconHeightened: {
        zIndex: 9999999,
        top: -27.5
    },
    absoluteRight: {
        position: "absolute",
        right: 3.5,
        top: 0,
        flex: 1
    },
    iconed: {
        maxWidth: 32.5,
        maxHeight: 32.5,
        height: 32.5,
        minWidth: 32.5,
        minHeight: 32.5,
        width: 32.5
    }
})