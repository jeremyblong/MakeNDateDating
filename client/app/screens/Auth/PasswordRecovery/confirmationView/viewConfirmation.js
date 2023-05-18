import React, { Fragment, useState } from "react";
import styles from "./viewConfirmationStyles.js";
import { Text, Button, Header, Icon } from "@components";
import { View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@config';
import axios from "axios";
import { BASE_URL } from "@env";
import Toast from 'react-native-toast-message';

const PasswordConfirmationShow = (props) => {

    const emailPassed = props.route.params.email;
    const navigation = useNavigation();
    const { colors } = useTheme();
    
    const [ state, setState ] = useState({
        passwordHidden: {
            first: true,
            second: true
        },
        firstTextInput: "",
        code: "",
        secondTextInput: ""
    });

    const handleSubmission = () => {
        console.log("handleSubmission clicked/ran...");

        const { firstTextInput, secondTextInput, code } = state;

        if (typeof code !== "undefined" && code.length >= 8) {
            if (firstTextInput.trim() === secondTextInput.trim()) {
                const config = {
                    password: state.firstTextInput.trim(),
                    email: emailPassed,
                    code
                };
    
                axios.post(`${BASE_URL}/submit/confirmation/code/emailed/password/recovery`, config).then((res) => {
                    if (res.data.message === "Successfully submitted password change!") {
                        console.log("Successfully submitted password change!", res.data);

                        Toast.show({
                            type: 'success',
                            text1: 'Successfully recovered account!',
                            text2: "Successfully set your new password - you may now log-in!",
                            visibilityTime: 5000,
                            position: "bottom",
                            onHide: () => {
                                navigation.navigate('SignIn');
                            }
                        });
                    } else if (res.data.message === "Error - Enter a valid email/password-reset code to authorize the password change.") {
                        Toast.show({
                            type: 'info',
                            text1: 'Enter a VALID email auth-code!',
                            text2: "Please enter the code we went via email - code must match...",
                            visibilityTime: 4250,
                            position: "bottom"
                        });
                    } else {
                        console.log("Err", res.data);
    
                        Toast.show({
                            type: 'error',
                            text1: 'An error occurred while processing your request!',
                            text2: "We've encountered an error while attempting to process your request...",
                            visibilityTime: 4250,
                            position: "bottom"
                        });
                    }
                }).catch((err) => {
                    console.log(err.message);
    
                    // Toast.show({
                    //     type: 'error',
                    //     text1: 'An error occurred while processing your request!',
                    //     text2: "We've encountered an error while attempting to process your request...",
                    //     visibilityTime: 4250,
                    //     position: "bottom"
                    // });
                })
            } else {
                Toast.show({
                    type: 'info',
                    text1: 'Passwords did NOT match!',
                    text2: "Must enter matching passwords in the provided fields...",
                    visibilityTime: 4250,
                    position: "bottom"
                });
            }
        } else {
            Toast.show({
                type: 'info',
                text1: 'Enter a proper email code!',
                text2: "Code MUST be 8 characters in length...",
                visibilityTime: 4250,
                position: "bottom"
            });
        }
    }

    const calculateDisabled = () => {
        const { firstTextInput, secondTextInput, code } = state;

        if ((typeof firstTextInput !== "undefined" && firstTextInput.length >= 8) && (typeof secondTextInput !== "undefined" && secondTextInput.length >= 8)) {
            return false;
        } else {
            return true;
        }
    }

    return (
        <Fragment>
            <Header
                title={"Email Confirmation"}
                subTitle="Confirm Your Email..."
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
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require("../../../../assets/images/mail.png")}
                    />
                </View>
                <Text style={styles.title}>Check your email</Text>
                <Text style={styles.description}>
                    We have sent 'password reset' instructions to your email, check your email for further instructions...
                </Text>
                <View style={styles.cardFirst}>
                    <TextInput
                        style={styles.inputFirst}
                        placeholder="Code (emailed to you)..."
                        value={state.code}
                        onChangeText={(value) => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    code: value
                                }
                            })
                        }}
                        maxLength={8}
                    />
                </View>
                <View style={styles.card}>
                    <TextInput
                        style={styles.input}
                        placeholder="Initial Password (min 8 char.)"
                        value={state.firstTextInput}
                        onChangeText={(value) => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    firstTextInput: value
                                }
                            })
                        }}
                        secureTextEntry={state.passwordHidden.first}
                        maxLength={14}
                    />
                    <TouchableOpacity style={styles.buttonEye} onPress={() => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                passwordHidden: {
                                    ...prevState.passwordHidden,
                                    first: !prevState.passwordHidden.first,
                                    second: prevState.passwordHidden.second
                                }
                            }
                        })
                    }}>
                        <Image
                            style={styles.eyeIconed}
                            source={require("../../../../assets/icons/hidden.png")}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.card}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password Re-Entry (min 8 char.)"
                        value={state.secondTextInput}
                        onChangeText={(value) => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    secondTextInput: value
                                }
                            })
                        }}
                        secureTextEntry={state.passwordHidden.second}
                        maxLength={14}
                    />
                    <TouchableOpacity style={styles.buttonEye} onPress={() => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                passwordHidden: {
                                    ...prevState.passwordHidden,
                                    first: prevState.passwordHidden.first,
                                    second: !prevState.passwordHidden.second
                                }
                            }
                        })
                    }}>
                        <Image
                            style={styles.eyeIconed}
                            source={require("../../../../assets/icons/hidden.png")}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.hr} />
                <Button disabled={calculateDisabled()} style={calculateDisabled() ? { backgroundColor: "lightgrey" } : {}} full outline onPress={() => handleSubmission()}>
                    {"Submit Password Change"}
                </Button>
            </View>
        </Fragment>
    );
};

export default PasswordConfirmationShow;