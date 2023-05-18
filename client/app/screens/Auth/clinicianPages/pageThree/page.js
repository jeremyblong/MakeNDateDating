import React, { Fragment, useState } from "react";
import { View } from "react-native";
import { Button } from "@components";
import CheckBox from 'react-native-check-box'
import styles from "./pageStyles.js";
import { useTheme } from '@config';


const PageThreeDataRegisterClinician = ({ handleContinuation, businessAccountTempData, saveAuthenticationDetailsCounselor }) => {
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
            allocationOfTime: state.checked
        });

        setTimeout(() => {
            handleContinuation(4)
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
                                        label: "spending-of-time-primarily",
                                        value: "Other online platforms for online therapy"
                                    }
                                }
                            })
                        }}
                        isChecked={state.checked.value === "Other online platforms for online therapy" ? true : false}
                        rightText={"Other online platforms for online therapy"}
                    />
                    <View style={styles.bufferView} />
                    <CheckBox
                        style={{ flex: 1, padding: 10 }}
                        onClick={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    checked: {
                                        label: "spending-of-time-primarily",
                                        value: "Clinic or hospital"
                                    }
                                }
                            })
                        }}
                        isChecked={state.checked.value === "Clinic or hospital" ? true : false}
                        rightText={"Clinic or hospital"}
                    />
                    <View style={styles.bufferView} />
                    <CheckBox
                        style={{ flex: 1, padding: 10 }}
                        onClick={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    checked: {
                                        label: "spending-of-time-primarily",
                                        value: "Private practice"
                                    }
                                }
                            })
                        }}
                        isChecked={state.checked.value === "Private practice" ? true : false}
                        rightText={"Private practice"}
                    />
                    <View style={styles.bufferView} />
                    <CheckBox
                        style={{ flex: 1, padding: 10 }}
                        onClick={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    checked: {
                                        label: "spending-of-time-primarily",
                                        value: "Community mental health agency"
                                    }
                                }
                            })
                        }}
                        isChecked={state.checked.value === "Community mental health agency" ? true : false}
                        rightText={"Community mental health agency"}
                    />
                    <View style={styles.bufferView} />
                    <CheckBox
                        style={{ flex: 1, padding: 10 }}
                        onClick={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    checked: {
                                        label: "spending-of-time-primarily",
                                        value: "Teaching or counseling in an academic setting/enviorment"
                                    }
                                }
                            })
                        }}
                        isChecked={state.checked.value === "Teaching or counseling in an academic setting/enviorment" ? true : false}
                        rightText={"Teaching or counseling in an academic setting/enviorment"}
                    />
                    <View style={styles.bufferView} />
                    <CheckBox
                        style={{ flex: 1, padding: 10 }}
                        onClick={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    checked: {
                                        label: "spending-of-time-primarily",
                                        value: "Other clinical settings or enviorments"
                                    }
                                }
                            })
                        }}
                        isChecked={state.checked.value === "Other clinical settings or enviorments" ? true : false}
                        rightText={"Other clinical settings or enviorments"}
                    />
                    <View style={styles.bufferView} />
                    <CheckBox
                        style={{ flex: 1, padding: 10 }}
                        onClick={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    checked: {
                                        label: "spending-of-time-primarily",
                                        value: "Not currently practicing"
                                    }
                                }
                            })
                        }}
                        isChecked={state.checked.value === "Not currently practicing" ? true : false}
                        rightText={"Not currently practicing"}
                    />
                    <View style={{ marginBottom: 12.25 }} />
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
export default PageThreeDataRegisterClinician;