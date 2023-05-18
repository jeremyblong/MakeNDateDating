import React, { Fragment, useState } from "react";
import { View } from "react-native";
import { Button } from "@components";
import CheckBox from 'react-native-check-box'
import styles from "./pageStyles.js";
import { useTheme } from '@config';


const PageFourDataRegisterClinician = ({ handleContinuation, businessAccountTempData, saveAuthenticationDetailsCounselor }) => {
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
            billingTimeAllocation: state.checked
        });

        setTimeout(() => {
            handleContinuation(5)
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
                                            label: "billing-time-allocation",
                                            value: "Up to 10% of my time"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "Up to 10% of my time" ? true : false}
                            rightText={"Up to 10% of my time"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "billing-time-allocation",
                                            value: "10% to 30% of my time"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "10% to 30% of my time" ? true : false}
                            rightText={"10% to 30% of my time"}
                        />
                        <View style={styles.bufferView} />
                        <CheckBox
                            style={{ flex: 1, padding: 10 }}
                            onClick={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        checked: {
                                            label: "billing-time-allocation",
                                            value: "More than 30% of my time"
                                        }
                                    }
                                })
                            }}
                            isChecked={state.checked.value === "More than 30% of my time" ? true : false}
                            rightText={"More than 30% of my time"}
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
export default PageFourDataRegisterClinician;