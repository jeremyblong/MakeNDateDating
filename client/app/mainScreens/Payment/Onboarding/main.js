import React, { Fragment, useEffect, useState } from "react";
import { View, useColorScheme } from "react-native";
import { Text, Header, Icon } from "@components";
import { useNavigation } from "@react-navigation/native";
import {BaseStyle, useTheme} from '@config';
import axios from "axios";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import _ from "lodash";
import { BASE_URL } from "@env";
import { WebView } from 'react-native-webview';
import styles from "./styles.js";
import { Bars } from 'react-native-loader';


const StripeOnboardingFlowProcess = ({ authData }) => {

    const navigation = useNavigation();

    const {colors} = useTheme();
    const colorSchemeDark = useColorScheme() === "dark" ? true : false;

    const [ state, setState ] = useState({
        url: null
    })

    useEffect(async () => {

        const configuration = {
            uniqueId: authData.uniqueId,
            accountType: authData.accountType
        }
      
        axios.post(`${BASE_URL}/onboarding/flow/stripe/links`, configuration).then((res) => {
            if (res.data.message === "Successfully executed related logic!") {
                console.log("Successfully executed related logic! ", res.data);
        
                const { url } = res.data;

                setState(prevState => {
                    return {
                        ...prevState,
                        url
                    }
                })
            } else {
                console.log("Err", res.data);
        
                Toast.show({
                    type: 'error',
                    text1: `An error occurred while processing your request.`,
                    text2: `An error occurred while attempting onboard your account, please try this action again or contact support if the problem persists...`,
                    visibilityTime: 2375,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);
    
            Toast.show({
                type: 'error',
                text1: `An error occurred while processing your request.`,
                text2: `An error occurred while attempting onboard your account, please try this action again or contact support if the problem persists...`,
                visibilityTime: 2375,
                position: "bottom"
            });
        })
    }, [])

    const renderContent = () => {
        if (state.url !== null) {
            return (
                <Fragment>
                    <WebView onNavigationStateChange={(navState) => {
                        if (navState.title.includes("https://makendate.us/finished/authentication/stripe/onboarding")) {
                            navigation.goBack();

                            Toast.show({
                                type: 'success',
                                text1: `Successfully VERIFIED your account w/stripe!`,
                                text2: `We've successfully authenticated your account with stripe & you may now 'cashout payouts' going forward...`,
                                visibilityTime: 4250,
                                position: "bottom"
                            });
                        }
                    }} containerStyle={styles.containerStyleViewview} source={{ uri: state.url }} />
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <View style={styles.centered}>
                        <View style={styles.centeredInside}>
                            <Text style={styles.loadingText}>Loading Content...</Text>
                            <Bars size={35} color={colors.accent} />
                        </View>
                    </View>
                </Fragment>
            );
        }
    }

    return (
        <Fragment>
            <Header
                title={"Onboarding Process/Flow"}
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
            {renderContent()}
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, { })(StripeOnboardingFlowProcess);