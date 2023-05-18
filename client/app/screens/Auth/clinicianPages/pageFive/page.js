import React, { Fragment, useState } from "react";
import { View } from "react-native";
import { Text, Image, Button } from "@components";
import styles from "./pageStyles.js";
import { useTheme } from '@config';
import CheckBox from 'react-native-check-box';

const PageFiveDataRegisterClinician = ({ handleContinuation, businessAccountTempData, saveAuthenticationDetailsCounselor }) => {
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
            intentInterest: state.checked
        });

        setTimeout(() => {
            handleContinuation(6)
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
                                            label: "intent-interest",
                                            value: "To build my own private practice"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "To build my own private practice" ? true : false}
                            rightText={"To build my own private practice"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "intent-interest",
                                            value: "To supplement my private practice"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "To supplement my private practice" ? true : false}
                            rightText={"To supplement my private practice"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "intent-interest",
                                            value: "To supplement my full-time job"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "To supplement my full-time job" ? true : false}
                            rightText={"To supplement my full-time job"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "intent-interest",
                                            value: "To supplement my part-time job"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "To supplement my part-time job" ? true : false}
                            rightText={"To supplement my part-time job"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "intent-interest",
                                            value: "other"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "other" ? true : false}
                            rightText={"other"}
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
export default PageFiveDataRegisterClinician;