import React, { Fragment, useState } from "react";
import { View } from "react-native";
import { Button } from "@components";
import styles from "./pageStyles.js";
import { useTheme } from '@config';
import CheckBox from 'react-native-check-box';

const PageSevenDataRegisterClinician = ({ handleContinuation, businessAccountTempData, saveAuthenticationDetailsCounselor }) => {
    const { colors } = useTheme();

    const [ state, setState ] = useState({
        checked: {
            label: null,
            value: null
        }
    });

    const calculateDisabled = () => {
        return state.checked.value !== null ? false : true;
    }

    const handleSubmission = () => {
        console.log("handleSubmission clicked/ran...");

        saveAuthenticationDetailsCounselor({
            ...businessAccountTempData,
            howHearAboutUs: state.checked
        });

        setTimeout(() => {
            handleContinuation(8)
        },  775);
    }

    return (
        <Fragment>
            <View style={{ margin: 12.25 }}>
                <View style={{ backgroundColor: "#fff", minWidth: "100%", width: "100%", borderRadius: 8.25 }}>
                    <View style={{ marginBottom: 12.25 }} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "referral-method-find-out-about-us",
                                            value: "Mail (Physical)"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "Mail (Physical)" ? true : false}
                            rightText={"Mail (Physical)"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "referral-method-find-out-about-us",
                                            value: "Friend or colleague"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "Friend or colleague" ? true : false}
                            rightText={"Friend or colleague"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "referral-method-find-out-about-us",
                                            value: "Internet Research / Googling"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "Internet Research / Googling" ? true : false}
                            rightText={"Internet Research / Googling"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "referral-method-find-out-about-us",
                                            value: "Podcast/Online-Influencing"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "Podcast/Online-Influencing" ? true : false}
                            rightText={"Podcast/Online-Influencing"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "referral-method-find-out-about-us",
                                            value: "Email Outreach"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "Email Outreach" ? true : false}
                            rightText={"Email Outreach"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "referral-method-find-out-about-us",
                                            value: "Other/Not-Listed"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "Other/Not-Listed" ? true : false}
                            rightText={"Other/Not-Listed"}
                        />
                        <View style={styles.bufferView} />
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
export default PageSevenDataRegisterClinician;