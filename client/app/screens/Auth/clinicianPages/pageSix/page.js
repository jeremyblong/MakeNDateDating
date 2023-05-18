import React, { Fragment, useState } from "react";
import { View } from "react-native";
import { Button } from "@components";
import styles from "./pageStyles.js";
import { useTheme } from '@config';
import CheckBox from 'react-native-check-box';

const PageSixDataRegisterClinician = ({ handleContinuation, businessAccountTempData, saveAuthenticationDetailsCounselor }) => {
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
            hoursPerWeekWorking: state.checked
        });

        setTimeout(() => {
            handleContinuation(7)
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
                                            label: "timespan-planning-spend-on-platform",
                                            value: "Up to 5 hours per week"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "Up to 5 hours per week" ? true : false}
                            rightText={"Up to 5 hours per week"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "timespan-planning-spend-on-platform",
                                            value: "5 to 10 hours a week"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "5 to 10 hours a week" ? true : false}
                            rightText={"5 to 10 hours a week"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "timespan-planning-spend-on-platform",
                                            value: "10 to 20 hours a week"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "10 to 20 hours a week" ? true : false}
                            rightText={"10 to 20 hours a week"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "timespan-planning-spend-on-platform",
                                            value: "20 to 30 hours a week"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "20 to 30 hours a week" ? true : false}
                            rightText={"20 to 30 hours a week"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "timespan-planning-spend-on-platform",
                                            value: "More than 30 hours a week (30+/week)"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "More than 30 hours a week (30+/week)" ? true : false}
                            rightText={"More than 30 hours a week (30+/week)"}
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
export default PageSixDataRegisterClinician;