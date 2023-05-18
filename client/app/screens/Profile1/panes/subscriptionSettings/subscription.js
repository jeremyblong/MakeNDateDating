import React, { Fragment, useState } from "react";
import { View, Text, TextInput as CustomTextInput, Dimensions, ScrollView, useColorScheme } from "react-native";
import { BASE_URL } from "@env";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from "axios";
import styles from "./subscriptionStyles.js";
import {
    Image,
    TextInput,
    Button
} from '@components';
import { useTheme} from '@config';
import { connect } from "react-redux";
import _ from "lodash";
import Toast from "react-native-toast-message";

const { height, width } = Dimensions.get("window");

const ManageEditProfileSubscriptionRestrictedSettings = ({ subscriptionSheetRef, authenticatedData, passedData }) => {
    
    const colorSchemeDark = useColorScheme() === "dark" ? true : false;
    const {colors} = useTheme();

    const [ state, setState ] = useState({
        subscriptionAmount: 0,
        welcomeMessage: ""
    });

    const handleSubmission = () => {
        console.log("handleSubmission clicked/ran...");

        const { subscriptionAmount, welcomeMessage } = state;

        const config = {
            uniqueId: authenticatedData.uniqueId,
            welcomeMessage,
            subscriptionAmount
        };

        axios.post(`${BASE_URL}/post/subscription/amount/welcome/message`, config).then((res) => {
            if (res.data.message === "Submitted subscription data!") {
                console.log(res.data);
    
                subscriptionSheetRef.current.close();

                Toast.show({
                    type: 'success',
                    text1: `Successfully updated your subscription cost + welcome message!`,
                    text2: `We've successfully altered/changed your subscription cost and welcome message...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    const calculateDisabledButton = () => {
        const { subscriptionAmount, welcomeMessage } = state;

        if ((subscriptionAmount !== 0) && (typeof welcomeMessage !== "undefined" && welcomeMessage.length > 0)) {
            return false;
        } else {
            return true;
        }
    }
    // return pane logic/JSX data...
    return (
        <Fragment>
            <View style={styles.mainWrapper}>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' style={{ flexGrow: 1 }} contentContainerStyle={{ paddingBottom: 212.25, flexGrow: 1  }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, minHeight: height * 0.825 }}>
                        <Text style={[styles.header, { color: colors.primaryDark }]}>User's will <Text style={{ color: colors.accent, fontWeight: "400", textDecorationLine: "underline" }}>purchase/subscribe</Text> via a one-time purchase which gives them access to your restricted content. Please enter a welcome message & cost for this one-time subscription purchase fee - this can be any value but remember, larger values will have less subs.</Text>
                        <View style={styles.hr} />
                        <Text style={styles.label}>Enter the subscription amount in <Text style={{ color: colors.accent, fontWeight: "400", textDecorationLine: "underline" }}>USD ($$$) </Text>- We'll automatically convert that to our $MND crypto-tokens behind the scenes</Text>
                        <TextInput
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    subscriptionAmount: text.replace(/[^0-9]/g, '')
                                }
                            })}
                            keyboardType={"number-pad"}
                            secureTextEntry={false}
                            placeholder="Enter the one-time cost to subscribe..."
                            value={state.subscriptionAmount}
                        />
                        <Text style={styles.label}>Enter the subscription amount in $USD (Usd that'll convert into our $MND crypto-tokens) that user's must use to subscribe with...</Text>
                        <CustomTextInput
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    welcomeMessage: text
                                }
                            })}
                            secureTextEntry={false}
                            blurOnSubmit={true}
                            multiline={true}
                            numberOfLines={8}
                            style={colorSchemeDark ? { backgroundColor: colors.card, color: "#fff", textAlignVertical: 'top', padding: 10 } : { backgroundColor: colors.card, textAlignVertical: 'top', padding: 10 }}
                            placeholder="Enter your 'welcome message' once a user subscribes/purchases access to your restricted content..."
                            placeholderTextColor={colorSchemeDark ? "grey" : "black"}
                            value={state.welcomeMessage}
                        />
                        <View style={styles.bottomContainer}>
                            <Button onPress={() => handleSubmission()} style={calculateDisabledButton() ? { backgroundColor: "lightgrey" } : { backgroundColor: colors.accent }} disabled={calculateDisabledButton()}>
                                {"Submit Subscription Cost Setting's"}
                            </Button>
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
            </View>
        </Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, { })(ManageEditProfileSubscriptionRestrictedSettings);