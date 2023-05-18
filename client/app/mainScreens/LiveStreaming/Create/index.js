import React, { Fragment, useState, useRef, useEffect } from "react";
import { View, Text, Image, Platform, PermissionsAndroid, useColorScheme } from "react-native";
import { TextInput, Header, Icon, SafeAreaView, Button } from "@components";
import styles from "./indexStyles.js";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import { useTheme} from '@config';
import _ from "lodash";
import { connect } from "react-redux";
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';

const CreateNewLiveStream = ({ authData }) => {

    const navigation = useNavigation();
    const { colors, theme } = useTheme();
    const colorSchemeDark = theme.dark;
    const {t} = useTranslation();

    const [ state, setState ] = useState({
        streamTitle: "",
        selectedAddress: null,
    });

    useEffect(() => {
        if (Platform.OS === "android") {
            const requestCameraPermission = async () => {
                try {
                await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
                    {
                      title: "We need to access these permissions to stream your live-content.",
                      message:
                        "Our app needs permission so we can live-stream " +
                        "your content to other users! You MUST accept this to continue...",
                      buttonNeutral: "Ask Me Later",
                      buttonNegative: "Cancel",
                      buttonPositive: "OK"
                    }
                ).then((passed) => {
                    if (passed["android.permission.CAMERA"] !== "granted" || passed["android.permission.RECORD_AUDIO"] !== "granted") {
                        navigation.goBack();
                    } 
                });
                } catch (err) {
                  console.warn(err);
    
                  navigation.goBack();
                }
            }
            requestCameraPermission();
        } else {
            requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE]).then((statuses) => {
                console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
                console.log('FaceID', statuses[PERMISSIONS.IOS.MICROPHONE]);
            });
        }
    }, []);

    const handleContinuation = () => {
        navigation.navigate("LiveStreamFeedIndividual", { 
            streamData: {
                streamData: {
                    stream_key: ""
                },
                streamTitle: state.streamTitle
            } 
        });
    }

    const calculateDisabled = () => {
        const { streamTitle } = state;
        if ((typeof streamTitle !== "undefined" && streamTitle.length > 10)) {
            return false;
        } else {    
            return true;
        }
    }
    return (
        <Fragment>
            <SafeAreaView style={{flex: 1 }} edges={['right', 'left', 'bottom']}>
                <Header
                    title={"Create Stream"}
                    subTitle="Create New LIVE-Stream"
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
                <View style={styles.container}>
                    <Text style={colorSchemeDark ? [styles.mainTitle, { color: "#fff" }] : styles.mainTitle}>Start A New Live-Stream!</Text>
                    <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : styles.labeled}>Create a live-stream to promote yourself and/or meet new peeps! We will need some information to get ya started...</Text>
                    <View style={styles.hr} />
                    <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : styles.labeled}>Enter the title for your live stream</Text>
                    <TextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                streamTitle: text
                            }
                        })}
                        secureTextEntry={false}
                        placeholder="Enter your stream title..."
                        value={state.streamTitle}
                    />
                    <View style={[styles.hr, { marginTop: 32.25 }]} />
                    <Button disabled={calculateDisabled()} style={calculateDisabled() ? { backgroundColor: "lightgrey", width: "100%", minWidth: "100%" } : { backgroundColor: colors.primary, width: "100%", minWidth: "100%" }} onPress={() => handleContinuation()}>
                        {t('Submit & Continue')}
                    </Button>
                    <View style={styles.hr} />
                    <View style={styles.centered}>
                        <Image resizeMode={"contain"} source={require("../../../assets/images/movie.png")} style={styles.streamImage} />
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
  }
  
  export default connect(mapStateToProps, {  })(CreateNewLiveStream);