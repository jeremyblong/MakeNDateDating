import React, { Fragment, useState, useEffect } from "react";
import { Text, View, SafeAreaView, ScrollView, StatusBar, StyleSheet, Platform, TouchableOpacity, Dimensions, Image } from "react-native";
import { withNavigation } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from "axios";
import { BASE_URL } from "@env";
import _ from "lodash";
import IntlPhoneInput from 'react-native-intl-phone-input';
import { saveAuthenticationDetailsCounselor } from "../../actions/auth.js";
import { connect } from "react-redux";
import * as Progress from 'react-native-progress';
import { useTheme } from '@config';
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PageTwoContentData from "./pages/PageTwo/Index.js";
import PageThreeDataRegisterClinician from "./clinicianPages/pageThree/page.js";
import PageFourDataRegisterClinician from "./clinicianPages/pageFour/page.js";
import PageFiveDataRegisterClinician from "./clinicianPages/pageFive/page.js";
import PageSixDataRegisterClinician from "./clinicianPages/pageSix/page.js";
import PageSevenDataRegisterClinician from "./clinicianPages/pageSeven/page.js";
import PageEightDataRegisterClinician from "./clinicianPages/pageEight/page.js";
import PageNineDataRegisterClinician from "./clinicianPages/pageNine/page.js";
import PageTenDataRegisterClinician from "./clinicianPages/pageTen/page.js";
import PageElevenDataRegisterClinician from "./clinicianPages/pageEleven/page.js";
import PageTwelveDataRegisterClinician from "./clinicianPages/pageTwelve/page.js";
import PageThirteenDataRegisterClinician from "./clinicianPages/pageThirteen/page.js";
import PageFourteenDataRegisterClinician from "./clinicianPages/pageFourteen/page.js";
import PageFifteenDataRegisterClinician from "./clinicianPages/pageFifteen/page.js";
import PageSixteenDataRegisterClinician from "./clinicianPages/pageSixteen/page.js";

Platform.OS === "ios" ? Icon.loadFont() : null;

const { width, height } = Dimensions.get("window"); 

const RegisterTherapistCompanionScreen = ({ saveAuthenticationDetailsCounselor, businessAccountTempData }) => {
    
    const { colors } = useTheme();
    const navigation = useNavigation();

    const [ state, setState ] = useState({
        file: null,
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        sid: "",
        confirm: "",
        page: 1,
        phoneNumber: "",
        loading: false,
        progressNumber: 0
    });

    const handleBackButton = () => {
        navigation.goBack();
        return true;
    };

    const updateMainState = (newData) => setState(prevState => {
        return {
            ...prevState,
            ...newData
        }
    })

    useEffect(() => {
        updateMainState({ progressNumber: state.page / 16 })
    }, [state.page])

    const phoneNumberTextField = () => {
        return (
            <IntlPhoneInput
                value={state.phoneNumber}
                onChangeText={(phoneNumber) => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            phoneNumber
                        }
                    })
                }}
                defaultCountry="US"
                style={{ color: "#000" }}
                placeholder="Phone Number"
                placeholderTextColor={"grey"}
                containerStyle={styles.phoneNumberContainerStyle}
                dialCodeTextStyle={{ }}
                phoneInputStyle={{ flex: 1, marginLeft: 15, color: "#000" }}
            />
        )
    }

    const renderTopTitleSubTitle = (str1, str2) => {
        return (
            <Fragment>
                <Text style={styles.titleTop}>{str1}</Text>
                <View style={styles.centered}>
                    <View style={styles.whiteThinHR} />
                </View>
                <Text style={styles.subtitleTop}>{str2}</Text>
            </Fragment>
        );
    }

    const handleCodeRequest = () => {
        const config = {
            phoneNumber: `+1${state.phoneNumber.unmaskedPhoneNumber}`
        }

        axios.post(`${BASE_URL}/send/registration/code`, config).then((res) => {
            if (res.data.message === "Successfully sent code!") {
                console.log("Successfully sent code!", res.data);

                const { sid } = res.data;

                updateMainState({ sid });

                handleContinuation(2);
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    const calculateReadiness = () => {
        const { phoneNumber } = state;

        console.log("phoneNumber", phoneNumber);

        if (typeof phoneNumber !== "undefined" && phoneNumber.isVerified === true) {
            return false;
        } else {
            return true;
        }
    }
    const handleContinuation = (page) => {
        updateMainState({ progressNumber: page / 16, page });
    }
    const renderButtonSelection = () => {
        return (
            <Fragment>
                <TouchableOpacity
                    disabled={calculateReadiness()}
                    activeOpacity={0.9}
                    onPress={() => handleCodeRequest()}
                    style={!calculateReadiness() ? [styles.continueButtonStyle, { backgroundColor: colors.accent, borderWidth: 1.25, borderColor: "#fff" }] : styles.disabledContinueButtonStyle}>
                    <Text style={!calculateReadiness() ? { color: "#fff" } : { color: "black" }}>Continue</Text>
                </TouchableOpacity>
            </Fragment>
        )
    }
    const renderMainContent = () => {
        switch (state.page) {
            case 1: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => handleBackButton()}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("What's your phone number?", "We protect our community & data by making sure everyone on our platform is real, this is part of that process. Know who you're talking to...")}
                                </View>
                                {phoneNumberTextField()} 
                                <View style={{ margin: 12.25, marginTop: 30 }}>
                                    <Text style={styles.smallsubText}>By submitting your phone number & completing the registration process, you agree to our <TouchableOpacity onPress={() => {
                                        navigation.navigate("TermsOfUse");
                                    }}><Text style={{ fontWeight: "bold", fontSize: 12.25, bottom: -2.5, color: "#fff", textDecorationLine: "underline" }}>Terms of Use</Text></TouchableOpacity>. Learn about how we process and use your data in our <TouchableOpacity onPress={() => {
                                        navigation.navigate("PrivacyPolicy");
                                    }}><Text style={{ fontWeight: "bold", fontSize: 12.25, bottom: -2.5, color: "#fff", textDecorationLine: "underline" }}>Privacy Policy</Text></TouchableOpacity>, and how we use cookies and similar technologies.</Text>
                                </View>                  
                                {renderButtonSelection()}
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 2: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("Verify your number", `Enter the code we've sent to +1${state.phoneNumber.unmaskedPhoneNumber}`)}
                                </View>
                                <PageTwoContentData phoneNumber={state.phoneNumber} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} therapist={true} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 3: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("Where do you currently spend most of your time?", `Please inform us as to what you typically do with most of your time regarding your work skills & enviorment...`)}
                                </View>
                                <PageThreeDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 4: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("How is your time allocated?", `How much of your time is currently spent on administrative and/or billing related tasks?`)}
                                </View>
                                <PageFourDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 5: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("What makes you most interested in our services/platform?", `Why are you intereseted in working with us particularly? We ONLY specialize in relationship counseling & enhancing personal relationships between couples, singles & others in the dating scene...`)}
                                </View>
                                <PageFiveDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 6: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("How much time do you plan to spend on MakeNDate?", `Please inform us on how much time per week you intend on spending on our platform working, mentoring & counseling people on the platform...`)}
                                </View>
                                <PageSixDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 7: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("How did you hear about MakeNDate?", `Please let us know how you found out about us - we know this question is annoying but we appreciate your leniency as it improves the experience for other users...`)}
                                </View>
                                <PageSevenDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 8: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("Experience & Preferences", `We will now collect your experience, preferences & other additional core-information...`)}
                                </View>
                                <PageEightDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 9: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("Licensing Information", `We will need to collect your licensing information to be processed/verified by our moderators/staff...`)}
                                </View>
                                <PageNineDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 10: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("Professional Background (Educational)", `We will need to collect your professional educational experience & background...`)}
                                </View>
                                <PageTenDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 11: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("Add your first photo", `Choose a photo of you where you can clearly see your face. You can change this later, this is only the first main profile picture (others are added later)...`)}
                                </View>
                                <PageElevenDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 12: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("Enable the 'services'", `Enable the following services, these enhance the platform experience and are mandatory for operations in-app`)}
                                </View>
                                <PageTwelveDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 13: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("Please complete your name & username", `We'll now need you to complete your first/last name and username - your last name will NOT be available anywhere publically on our platform`)}
                                </View>
                                <PageThirteenDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 14: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("How do you identify?", `Everyone's welcome on our platform! Please select 'more gender options' if you don't see your desired selection`)}
                                </View>
                                <PageFourteenDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 15: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("Select your birthdate & address info", `Please choose your birthdate from the picker by clicking the button below - this is publically. We will also need to collect your address information which is COMPLETELY restricted/private to only MakeNDate Employee's...`)}
                                </View>
                                <PageFifteenDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            case 16: 
                return (
                    <Fragment>
                        <View style={[styles.linearGradient, { backgroundColor: colors.primary }]}>
                            <View style={styles.backedIconWrapper}>
                                <TouchableOpacity hitSlop={22.5} onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        page: prevState.page - 1
                                    }
                                })}>
                                    <Image style={styles.backedIconCustom} source={require("../../assets/icons/arrow72.png")} /> 
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.contentContainer} style={{ flexGrow: 1 }}>
                                <View style={{ margin: 12.25 }}>
                                    {renderTopTitleSubTitle("What is your email & password?", `We use this to recover your account if you can't login. You will also need to set a 'password'...`)}
                                </View>
                                <PageSixteenDataRegisterClinician businessAccountTempData={businessAccountTempData} saveAuthenticationDetailsCounselor={saveAuthenticationDetailsCounselor} mainData={state} handleContinuation={handleContinuation} renderTopTitleSubTitle={renderTopTitleSubTitle} updateMainState={updateMainState} />
                            </ScrollView>
                        </View>
                    </Fragment>
                );
                break;
            default: 
                break;
        }
    }
    return (
        <SafeAreaView style={{ backgroundColor: colors.primary }}>
            <StatusBar translucent={false} backgroundColor={colors.primary} />
            <Progress.Bar progress={state.progressNumber} unfilledColor={"lightgrey"} borderRadius={0} height={7.5} color={"#0BDA51"} width={width} />
            <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {renderMainContent()}
                </ScrollView>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    subtitleTop: {
        fontSize: 20.25,
        color: "#fff",
        marginTop: 4.25
    },
    smallsubText: {
        color: "#fff",
        fontSize: 12.25
    },
    titleTop: {
        fontSize: 30,
        color: "#fff",
        fontWeight: "400"
    },
    textFieldContainerStyle: {
        marginHorizontal: 20,
        backgroundColor: "#ffffff",
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderRadius: 10,
        elevation: 1.0,
        marginTop: 20
    },
    centered: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
        alignContent: "flex-start"
    },
    whiteThinHR: {
        marginTop: 11.25,
        marginBottom: 11.25,
        minWidth: "80%",
        borderBottomWidth: 1.25,
        borderBottomColor: "#fff"
    },
    linearGradient: {
        width,
        minWidth: width,
        height: "100%"
    }, 
    backedIconWrapper: {
        position: 'absolute', 
        left: 15.0, 
        top: 15.0, 
        zIndex: 99999999999999999
    },
    backedIcon: {
        backgroundColor: "white", 
        padding: 5.25, 
        paddingLeft: 8.25,
        paddingRight: 8.25,
        borderRadius: 75, 
        borderWidth: 1.5, 
        borderColor: "#000"
    },
    disabledContinueButtonStyle: {
        backgroundColor: "#ffffff",
        paddingVertical: 10 + 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        borderRadius: 10,
        marginTop: 20
    },
    continueButtonStyle: {
        paddingVertical: 10 + 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        borderRadius: 10,
        marginTop: 20
    },
    contentContainer: {
        justifyContent: 'center',
        flexGrow: 1,
        paddingBottom: 62.5,
        paddingTop: 25,
        width,
        minHeight: height,
        marginTop: 62.25
    },
    selectableIcon: {
        maxWidth: 132.5,
        maxHeight: 132.5,
        minHeight: 132.5,
        minWidth: 132.5,
        borderRadius: 100
    },
    phoneNumberContainerStyle: {
        backgroundColor: "#ffffff",
        marginTop: 22.5,
        borderRadius: 10,
        marginHorizontal: 20,
        elevation: 1.0,
        height: 55.0,
    },
    backedIconCustom: {
        maxWidth: 55,
        maxHeight: 55,
        height: 55,
        width: 55
    }
})

RegisterTherapistCompanionScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}
const mapStateToProps = (state) => {
    console.log("businessAccountTempData ---------------------------------------- :", state.auth.businessAccountTempData);
    return {
        businessAccountTempData: _.has(state, "auth") && _.has(state.auth, "businessAccountTempData") ? state.auth.businessAccountTempData : null
    }
}
export default connect(mapStateToProps, { saveAuthenticationDetailsCounselor })(withNavigation(RegisterTherapistCompanionScreen));