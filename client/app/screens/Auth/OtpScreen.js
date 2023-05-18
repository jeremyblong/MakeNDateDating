import React, { Component } from "react";
import { Text, View, Platform, SafeAreaView, StatusBar, StyleSheet, Keyboard, Image, TextInput, TouchableOpacity, Dimensions, BackHandler, ImageBackground } from "react-native";
import { withNavigation } from "react-navigation";
import { Fonts, Colors, Sizes } from "../../constants/styles";
import Icon from 'react-native-vector-icons/FontAwesome';
import Dialog from "react-native-dialog";
import { CircleFade } from 'react-native-animated-spinkit';
import SvgComponentAuth from "./helpers/signinScreen/logoSvg.js";
import axios from "axios";
import { connect } from "react-redux";
import { BASE_URL } from "@env";
import Toast from 'react-native-toast-message';

Platform.OS === "ios" ? Icon.loadFont() : null;

const { width, height } = Dimensions.get('screen');

class OTPScreen extends Component {

    state = {
        isLoading: false,
        code: "******"
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backColor }}>
                <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
                <ImageBackground source={require("../../assets/images/tinted-ewaste.jpeg")} style={styles.linearGradient}>
                    <Icon name="arrow-left" size={25} color="black"
                        style={{ position: 'absolute', left: 15.0, top: 20.0 }}
                    />
                    {logo()}
                    {otpText()}
                    {this.otpFields()}
                    {resendInfo()}
                    {this.continueButton()}
                </ImageBackground>
                {this.loading()}
            </SafeAreaView>
        )
    }

    loading() {
        return (
            <Dialog.Container
                visible={this.state.isLoading}
                contentStyle={styles.dialogContainerStyle}
            >
                <View style={{ backgroundColor: 'white', alignItems: 'center', }}>
                    <CircleFade size={48} color={Colors.primaryColor} />
                    <Text style={{ ...Fonts.gray15Medium, paddingBottom: Sizes.fixPadding - 5.0, marginTop: Sizes.fixPadding * 2.0 }}>
                        Please Wait...
                    </Text>
                </View>
            </Dialog.Container>
        );
    }
    
    handleSubmission = () => {
        console.log("handled submission...");

        const pad = (n, width, z) => {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }


        const config = {
            code: pad(this.state.code, 6),
            authyId: this.props.authData.authyId
        };
        axios.post(`${BASE_URL}/submit/authentication/code`, config).then((res) => {
            if (res.data.message === "Submitted successfully!") {
                console.log(res.data);

                this.setState({ isLoading: false }, () => {
                    this.props.navigation.replace('SecurePin');
                });
            } else {
                console.log("err", res.data);

                this.setState({ isLoading: false }, () => {
                    Toast.show({
                        type: 'error',
                        text1: `An error occurred while submitting your code!`,
                        text2: `An error has occurred or your pin does NOT match the appropriate code sent to your phone - please try this action again.`,
                        visibilityTime: 4250,
                        position: "bottom"
                    });
                })
            }
        }).catch((err) => {
            console.log(err.message);

            this.setState({ isLoading: false }, () => {
                Toast.show({
                    type: 'error',
                    text1: `An error occurred while submitting your code!`,
                    text2: `An error has occurred or your pin does NOT match the appropriate code sent to your phone - please try this action again.`,
                    visibilityTime: 4250,
                    position: "bottom"
                });
            });
        })
    }

    checkStyle = () => {
        const { code } = this.state;

        if (typeof code !== "undefined" && (code.length !== 6 && code.length !== 0)) {
            return true;
        } else {
            return false;
        }
    }

    continueButton() {
        const { code } = this.state;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    this.setState({ isLoading: true })
                    setTimeout(() => {
                        this.setState({ isLoading: false })
                        // this.props.navigation.replace('SecurePin');

                        this.handleSubmission();
                    }, 2000);
                }}
                style={styles.continueButtonStyle}>
                <Text style={{ ...Fonts.white16SemiBold }}>Continue</Text>
            </TouchableOpacity>
        )
    }

    setCharAt = (str, index, chr) => {
        if (index > str.length - 1) return str;
        return str.substring(0, index) + chr + str.substring(index + 1);
    }

    handleClear = () => {
        this.setState({
            code: "123456"
        }, () => {
            this.firstTextInput.focus();
        })
    }

    otpFields() {
        const { code } = this.state;

        return (
            <View style={styles.otpFieldsContainerStyle}>
                <View style={styles.textFieldContainerStyle}>
                    <TextInput  
                        value={code[0]}
                        ref={(input) => { this.firstTextInput = input; }}
                        style={{ ...Fonts.black17SemiBold, }}
                        onKeyPress={({ nativeEvent }) => {
                            console.log("nativeEvent", nativeEvent);

                            if (nativeEvent.key === 'Backspace') {
                                this.handleClear();
                            } else {
                                this.setState(prevState => {
                                    return {
                                        ...prevState,
                                        code: this.setCharAt(prevState.code, 0, nativeEvent.key)
                                    }
                                }, () => {
                                    this.secondTextInput.focus();
                                })
                            }
                        }}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.textFieldContainerStyle}>
                    <TextInput
                        value={code[1]}
                        style={{ ...Fonts.black17SemiBold, }}
                        ref={(input) => { this.secondTextInput = input; }}
                        keyboardType="numeric"
                        onKeyPress={({ nativeEvent }) => {
                            console.log("nativeEvent", nativeEvent);

                            if (nativeEvent.key === 'Backspace') {
                                this.handleClear();
                            } else {
                                this.setState(prevState => {
                                    return {
                                        ...prevState,
                                        code: this.setCharAt(prevState.code, 1, nativeEvent.key)
                                    }
                                }, () => {
                                    this.thirdTextInput.focus();
                                })
                            }
                        }}
                    />
                </View>
                <View style={styles.textFieldContainerStyle}>
                    <TextInput
                        value={code[2]}
                        style={{ ...Fonts.black17SemiBold, }}
                        ref={(input) => { this.thirdTextInput = input; }}
                        keyboardType="numeric"
                        onKeyPress={({ nativeEvent }) => {
                            console.log("nativeEvent", nativeEvent);

                            if (nativeEvent.key === 'Backspace') {
                                this.handleClear();
                            } else {
                                this.setState(prevState => {
                                    return {
                                        ...prevState,
                                        code: this.setCharAt(prevState.code, 2, nativeEvent.key)
                                    }
                                }, () => {
                                    this.fourthTextInput.focus();
                                })
                            }
                        }}
                    />
                </View>
                <View style={styles.textFieldContainerStyle}>
                    <TextInput
                        value={code[3]}
                        style={{ ...Fonts.black17SemiBold, }}
                        ref={(input) => { this.fourthTextInput = input; }}
                        keyboardType="numeric"
                        onKeyPress={({ nativeEvent }) => {
                            console.log("nativeEvent", nativeEvent);

                            if (nativeEvent.key === 'Backspace') {
                                this.handleClear();
                            } else {
                                this.setState(prevState => {
                                    return {
                                        ...prevState,
                                        code: this.setCharAt(prevState.code, 3, nativeEvent.key)
                                    }
                                }, () => {
                                    this.fifthTextInput.focus();
                                })
                            }
                        }}
                    />
                </View>

                <View style={styles.textFieldContainerStyle}>
                    <TextInput 
                        value={code[4]}
                        style={{ ...Fonts.black17SemiBold, }}
                        keyboardType="numeric"
                        ref={(input) => { this.fifthTextInput = input; }}
                        onKeyPress={({ nativeEvent }) => {
                            console.log("nativeEvent", nativeEvent);

                            if (nativeEvent.key === 'Backspace') {
                                this.handleClear();
                            } else {
                                this.setState(prevState => {
                                    return {
                                        ...prevState,
                                        code: this.setCharAt(prevState.code, 4, nativeEvent.key)
                                    }
                                }, () => {
                                    this.sixthTextInput.focus();
                                })
                            }
                        }}
                    />
                </View>

                <View style={styles.textFieldContainerStyle}>
                    <TextInput 
                        value={code[5]}
                        style={{ ...Fonts.black17SemiBold, }}
                        keyboardType="numeric"
                        ref={(input) => { this.sixthTextInput = input; }}
                        onKeyPress={({ nativeEvent }) => {
                            console.log("nativeEvent", nativeEvent);

                            if (nativeEvent.key === 'Backspace') {
                                this.handleClear();
                            } else {
                                this.setState(prevState => {
                                    return {
                                        ...prevState,
                                        code: this.setCharAt(prevState.code, 5, nativeEvent.key)
                                    }
                                }, () => {
                                    Keyboard.dismiss();
                                })
                            }
                        }}
                    />
                </View>
            </View>
        )
    }
}

const resendInfo = () => {
    return (
        <View style={styles.resendInfoContainerStyle}>
            <Text style={{ ...Fonts.gray15Medium, color: "#fff" }}>
                Didn't receive OTP Code!
            </Text>
            <Text style={{ ...Fonts.black19Bold, marginLeft: Sizes.fixPadding, color: "#fff" }}>
                Resend
            </Text>
        </View>
    )
}

const otpText = () => {
    return (
        <Text style={{
            ...Fonts.gray16Bold, alignSelf: 'center',
            ...styles.otpTextContainerStyle,
            color: "#fff"
        }}>
            Enter the otp code from the phone we just sent you - Give it up to 30s as sometimes there is a delay from the server sending the code...
        </Text>
    )
}

const logo = () => {
    return (
        <SvgComponentAuth />
    )
}

const styles = StyleSheet.create({
    textFieldContainerStyle: {
        height: 55.0,
        width: 55.0,
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: Colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1.0
    },
    resendInfoContainerStyle: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 4.0,
    },
    otpTextContainerStyle: {
        textAlign: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding + 5.0
    },
    continueButtonStyleDisabled: {
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 2.5
    },
    continueButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 2.5
    },
    otpFieldsContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Sizes.fixPadding * 7.0,
        marginHorizontal: Sizes.fixPadding * 2.0
    },
    dialogContainerStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 90,
        paddingHorizontal: Sizes.fixPadding * 3.0,
        paddingTop: -Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding * 2.0,
    },
    linearGradient: {
        flex: 1, 
        justifyContent: 'center',
        width,
        height
    }
})

OTPScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

const mapStateToProps = (state) => {
    return {
        authData: state.auth.data
    }
}

export default connect(mapStateToProps,  {})(withNavigation(OTPScreen));