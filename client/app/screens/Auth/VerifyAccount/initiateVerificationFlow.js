import React, { Fragment, useCallback, useState } from "react";
import { Text, Image, ProfileDescription, Header, Icon, Button } from "@components";
import { connect } from "react-redux";
import styles from "./initiateVerificationFlowStyles.js";
import _ from "lodash";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme, BaseColor } from '@config';
import axios from "axios";
import { BASE_URL } from "@env";
import Spinner from 'react-native-loading-spinner-overlay';
import { SafeAreaView, ScrollView, View } from "react-native";
import VeriffSdk from '@veriff/react-native-sdk';
// import { useStripeIdentity } from "@stripe/stripe-identity-react-native";

const InitiateVerificationFlowKYC = ({ authData }) => {

    const navigation = useNavigation();
    const { colors } = useTheme();

    const [ state, setState ] = useState({
        ready: false,
        link: null,
        spinner: false,
        link: null
    })

    const handleActivation = async () => {
        console.log("handleActivation clicked/ran...");

        const result = await VeriffSdk.launchVeriff({ sessionUrl: state.link });
        switch (result.status) {
            case VeriffSdk.statusDone:
                // user submitted the images and completed the flow
                console.log("Veriff verification DONE..." + result);

                const {
                    uniqueId,
                    accountType
                } = authData;

                const config = {
                    uniqueId,
                    accountType
                };
        
                axios.post(`${BASE_URL}/veriff/complete`, config).then((res) => {
                    if (res.data.message === "Successfully updated verification status!") {
                        console.log("Successfully updated verification status!", res.data);
                    } else {
                        console.log("Err", res.data);
                    }
                }).catch((err) => {
                    console.log(err.message);
                })
                break;
            case VeriffSdk.statusCanceled:
                // user canceled the flow before completing
                console.log("Veriff verification cancelled..." + result);
                break;
            case VeriffSdk.statusError:
                // the flow could not be completed due to an error
                console.log("Veriff verification failed with error=" + result.error);
                break;
            } 
    }

    useFocusEffect(
        useCallback(async () => {

            const {
                email, 
                phoneNumber, 
                birthdate, 
                firstName, 
                lastName, 
                uniqueId
            } = authData;

            const config = {
                email, 
                phoneNumber, 
                birthdate, 
                firstName, 
                lastName, 
                uniqueId
            };
    
            axios.post(`${BASE_URL}/activate/aquire/session/veriff`, config).then((res) => {
                if (res.data.message === "Successfully initiated!") {
                    console.log("Successfully gathered...", res.data);

                    const { 
                        session_link
                    } = res.data;

                    setState(prevState => {
                        return {
                            ...prevState,
                            link: session_link,
                            ready: true
                        }
                    })
                } else {
                    console.log("Err", res.data);
                }
            }).catch((err) => {
                console.log(err.message);
            })
    }, []));

    return (
        <Fragment>
            <Spinner
		          visible={state.spinner}
		          textContent={'Uploading File/Data...'}
		          textStyle={styles.spinnerTextStyle}
		          overlayColor={"rgba(0, 0, 0, 0.725)"}
	        />
            <Header
                title="Account Verification"
                subtitle="Verify Your Account W/Veriff"
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
            <SafeAreaView
                style={{ margin: 12.25, paddingBottom: 75 }}
                edges={['right', 'left', 'bottom']}>
                <ScrollView contentContainerStyle={{ paddingBottom: 125 }} showsVerticalScrollIndicator={false}>
                    <View>
                        <Image source={require("../../../assets/images/custom/world.jpg")} style={{width: '100%', height: 200 }} />
                        <View style={styles.titleAbout}>
                            <View style={styles.backgroundContainer}>
                                <Text title1 semibold whiteColor>
                                    {"Verify Your Account!"}
                                </Text>
                                <Text subhead whiteColor>
                                    {"Authenticate your account to prove your identity..."}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{padding: 20}}>
                        <ProfileDescription
                            image={require('../../../assets/icons/upload-2.png')}
                            name="Account Verification Flow"
                            subName="Going authentic!"
                            description="You will need to proceed through the following steps to authenticate your account..."
                            onPress={() => {}}
                        />
                            <View style={{marginTop: 20}}>
                            {/* <Image
                                source={Images.trip1}
                                style={{width: '100%', height: 100}}
                            /> */}
                            <View
                                style={[
                                    styles.titleAbout,
                                    {
                                        flexDirection: 'row',
                                        paddingHorizontal: 20,
                                    },
                                ]}>
                                <Icon
                                    name="creative-commons"
                                    solid
                                    size={24}
                                    color={BaseColor.whiteColor}
                                />
                                <View style={{marginLeft: 10}}>
                                <Text title3 semibold whiteColor>
                                    {"Start the verification flow..."}
                                </Text>
                                <Text footnote whiteColor numberOfLines={2}>
                                    You will need to walk-through each step completely to fully-authenticate your account & get the checkmark for your account
                                </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.labeled}>Getting the 'account verified' checkmark proves that you are who you say you are... This holds much importantance/weight and is vital to a good experience on our platform as other user's will be more trusting of you.</Text>
                    <View style={[styles.thinGreyHR, { marginBottom: 0 }]} />
                    <Fragment>
                        <View>
                            <Image resizeMode={"cover"} source={require("../../../assets/images/veificationandsec.png")} style={styles.illustrationImage} />
                        </View>
                    </Fragment>
                    <View style={styles.thinGreyHR} />
                    <View style={styles.thinGreyHR} />
                    <Button outline full onPress={() => handleActivation()}>
                        {'Start Process & Authenticate...'}
                    </Button>
                </ScrollView>
            </SafeAreaView>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {  })(InitiateVerificationFlowKYC);