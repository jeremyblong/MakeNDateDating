import React, { Fragment, useState, useEffect } from "react";
import { View, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { Text, Image, ProfileDescription, Header, Icon, Button, TextInput } from "@components";
import styles from "./initiateBackgroundCheckStyles.js";
import { useNavigation } from "@react-navigation/native";
import { useTheme, BaseColor } from '@config';
import axios from "axios";
import { BASE_URL } from "@env";
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from "react-redux";
import _ from "lodash";
import { Switch } from 'react-native-switch';
import Toast from "react-native-toast-message";
              
const InitiateBackgroundSecurityCheckProcess = ({ authData }) => {

    const navigation = useNavigation();
    const { colors } = useTheme();

    const [ state, setState ] = useState({
        spinner: false,
        requestCopy: false, 
        socialSecurityNumber: "", 
        zipcode: "",
        showSsn: true
    })

    const handleActivation = () => {
        console.log("handleActivation clicked/ran...");

        const { requestCopy, socialSecurityNumber, zipcode } = state;

        const config = {
            uniqueId: authData.uniqueId, 
            requestCopy, 
            socialSecurityNumber, 
            zipcode
        }
        axios.post(`${BASE_URL}/initiate/background/check/checkr`, config).then((res) => {
            if (res.data.message === "Successfully executed!") {
                console.log("Successfully executed!", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully initiated your background-check!`,
                    text2: `We have initialized your background check - check your email...`,
                    visibilityTime: 2750,
                    position: "bottom",
                    onHide: () => {
                        navigation.goBack();
                    }
                });
            } else {
                console.log("Err", res.data);

                Toast.show({
                    type: 'error',
                    text1: `Error initiating background check...`,
                    text2: `WE've encountered an error processing/requesting your background check - please try again or contact support!`,
                    visibilityTime: 2750,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);

            Toast.show({
                type: 'error',
                text1: `Error initiating background check...`,
                text2: `WE've encountered an error processing/requesting your background check - please try again or contact support!`,
                visibilityTime: 2750,
                position: "bottom"
            });
        })
    }
    const formatSSN = (value) => {
        // if input value is falsy eg if the user deletes the input, then just return
        if (!value) return value;
        // clean the input for any non-digit values.
        const ssn = value.replace(/[^\d]/g, '');
        // ssnLength is used to know when to apply our formatting for the ssn
        const ssnLength = ssn.length;
        // we need to return the value with no formatting if its less then four digits
        if (ssnLength < 4) return ssn;
        // if ssnLength is greater than 4 and less the 6 we start to return
        // the formatted number
        if (ssnLength < 6) {
          return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
        }
        // finally, if the ssnLength is greater then 6, we add the last
        // bit of formatting and return it.
        return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
    }
    const calculateDisabled = (value) => {
        const { socialSecurityNumber, zipcode } = state;

        if ((typeof zipcode !== "undefined" && zipcode.length >= 5) && (typeof socialSecurityNumber !== "undefined" && socialSecurityNumber.length >= 9)) {
            return false;
        } else {
            return true;
        }
    }
    return (
        <Fragment>
            <Header
                title={"Security Check..."}
                subTitle="Initiate Background-Check"
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
            <Spinner
		          visible={state.spinner}
		          textContent={'Uploading File/Data...'}
		          textStyle={styles.spinnerTextStyle}
		          overlayColor={"rgba(0, 0, 0, 0.725)"}
	        />
            <SafeAreaView
                style={{ margin: 12.25 }}
                edges={['right', 'left', 'bottom']}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 75 }}>
                    <View>
                        <Image source={require("../../../assets/images/custom/world.jpg")} style={{width: '100%', height: 200 }} />
                        <View style={styles.titleAbout}>
                            <View style={styles.backgroundContainer}>
                                <Text title1 semibold whiteColor>
                                    {"Background Check"}
                                </Text>
                                <Text subhead whiteColor>
                                    {"Prove who you are with a CHECKR background check today! We cover the costs..."}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{padding: 20}}>
                        <ProfileDescription
                            image={require('../../../assets/icons/upload-2.png')}
                            name="Background Check-Flow"
                            subName="Build security & transparency"
                            description="This is a simple process & is easy as 1, 2, 3... This is a vital function of our platform."
                            onPress={() => {}}
                        />
                    </View>
                    <View style={styles.thinGreyHR} />
                    <Text style={styles.labeled}>Having users that are who they actually say they are is VITAL to a trusting & transparent platform in the dating space.</Text>
                    <View style={styles.thinGreyHR} />
                    <Text style={styles.labeled}>Many platform's have bots, fake account and more fake users than real. We take transparency & forthcoming behavior very seriously. These background checks cost us money (we cover the costs entirely!) but we believe that having user's who are who they say they are is vital to a working dating marketplace. Start the process below by clicking the button!</Text>
                    <View style={styles.thinGreyHR} />
                    <Text style={[styles.labeledTwo, { color: colors.accent }]}>Enter your SSN (social security number)</Text>
                    <TextInput
                        onChangeText={(value) => setState(prevState => {
                            return {
                                ...prevState,
                                socialSecurityNumber: formatSSN(value)
                            }
                        })}
                        maxLength={9}
                        keyboardType={"number-pad"}
                        secureTextEntry={state.showSsn}
                        placeholder="Enter your SSN (social security number)"
                        value={state.socialSecurityNumber}
                    />
                    <TouchableOpacity hitStop={15} onPress={() => setState(prevState => {
                        return {
                            ...prevState,
                            showSsn: !prevState.showSsn
                        }
                    })}>
                        <Text style={{ fontWeight: "bold", textAlign: "left", textDecorationLine: "underline", color: "#fff", marginTop: 12.25, marginLeft: 7.25 }}>{!state.showSsn ? "Hide Password Text" : "Show Password Text"}</Text>
                    </TouchableOpacity>
                    <View style={styles.thinGreyHR} />
                    <Text style={[styles.labeledTwo, { color: colors.accent }]}>Enter your primary/home zip-code</Text>
                    <TextInput
                        onChangeText={(value) => setState(prevState => {
                            return {
                                ...prevState,
                                zipcode: value
                            }
                        })}
                        maxLength={5}
                        keyboardType={"number-pad"}
                        secureTextEntry={false}
                        placeholder="Your ZipCode..."
                        value={state.zipcode}
                    />
                    <View style={styles.thinGreyHR} />
                    <Text style={[styles.labeledTwo, { marginBottom: 17.25, color: colors.accent }]}>Would you like a copy of your background check/report?</Text>
                    <Switch
                        value={state.requestCopy}
                        onValueChange={(val) => setState(prevState => {
                            return {
                                ...prevState,
                                requestCopy: val
                            }
                        })}
                        disabled={false}
                        activeText={'Yes, Please!'}
                        inActiveText={'No Thanks..'}
                        circleSize={35}
                        barHeight={25}
                        circleBorderWidth={3}
                        backgroundActive={"#000"}
                        backgroundInactive={'gray'}
                        circleActiveColor={"green"}
                        circleInActiveColor={colors.primary}
                        changeValueImmediately={true}
                        innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                        outerCircleStyle={{}}
                        renderActiveText={true}
                        renderInActiveText={true}
                        switchLeftPx={2}
                        switchRightPx={2}
                        switchWidthMultiplier={4.25}
                        switchBorderRadius={30}
                    />
                    <View style={styles.spacer}/>
                    <Button disabled={calculateDisabled()} style={calculateDisabled() ? { backgroundColor: "lightgrey" } : {}} outline full onPress={() => handleActivation()}>
                        {'Start Process & Initiate Check...'}
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
export default connect(mapStateToProps, {  })(InitiateBackgroundSecurityCheckProcess);