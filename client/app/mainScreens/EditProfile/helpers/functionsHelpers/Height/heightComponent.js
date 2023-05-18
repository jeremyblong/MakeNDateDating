import React, { Fragment, useState, useEffect } from "react";
import { Text, View, Button, Image, StatusBar, SafeAreaView, Dimensions } from "react-native";
import Slider from 'react-native-slider';
import _ from "lodash";
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@env";
import styles from "./heightComponentStyles.js";
import { Header, Icon } from "@components";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@config';

const primaryColor = "#D81159";
const backColor = "#eee";

const { width, height } = Dimensions.get("window");

const HeightHelperComponent = (props) => {
    console.log("props HeightHelperComponent", props);

    const navigation = useNavigation();
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const [heightSize, setHeight] = useState(0);
    const [setGuessedValue, setGuessedValueState] = useState(0);
    const second = 0;
    const third = 213;

    const profileData = props.profileData;

    const cmToInFt = (cm, inches = Math.round(cm / 2.54)) => {
        return {
            feet: Math.floor(inches / 12),
            inches: inches % 12
        }
    }

    
    const submitNewHeight = () => {
        console.log("submitNewHeight clicked/ran...");

        const newHeightDetails = {
            height: `${cmToInFt(setGuessedValue).feet}'${cmToInFt(setGuessedValue).inches}"`,
            CMHeight: setGuessedValue
        }

        const config = {
            uniqueId: props.userData.uniqueId,
            selectedValue: newHeightDetails,
            field: "heightProfileData",
            accountType: props.userData.accountType
        }

        axios.post(`${BASE_URL}/adjust/profile/data`, config).then((res) => {
            if (res.data.message === "Successfully executed desired logic!") {
                console.log("resdata", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully adjusted your 'height settings'.`,
                    text2: `We've successfully uploaded your 'height settings' properly - you new data is now live!`,
                    visibilityTime: 4250,
                    position: "bottom"
                });

                setTimeout(() => {
                    navigation.goBack();
                }, 2500);
            } else {
                console.log("errrorrrrrr", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while processing your request.`,
                    text2: `We've experienced an error while adjusting your 'height settings' - please try this action again.`,
                    visibilityTime: 4250,
                    position: "bottom",
                    bottomOffset: -50
                });
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    useEffect(() => {
        if (typeof profileData !== "undefined" && _.has(profileData, "heightProfileData")) {
            setGuessedValueState(profileData.heightProfileData.CMHeight);
        }
    }, [])

    return (
        <Fragment>
            <View style={{ flex: 1 }}>
                <StatusBar translucent={false} backgroundColor={colors.accent} />
                <Header
                    title="Edit Height"
                    subTitle="Select/Modify Your Height"
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
                    style={colorSchemeDark ? { backgroundColor: "#000" } : { backgroundColor: "#fff" }}
                    onPressLeft={() => {
                        navigation.goBack();
                    }}
                />
                <ParallaxScroll
                    headerBackgroundColor={"#fff"}
                    height={height}
                    style={{ flex: 1 }}
                    isHeaderFixed={false}
                    parallaxHeight={150}
                    // headerBackgroundColor={""}
                    renderParallaxBackground={({ animatedValue }) => <Image
                        source={require("../../../../../assets/images/height.png")}
                        style={styles.imgBanner}
                        resizeMode={"contain"}
                    />}
                    renderParallaxForeground={({ animatedValue }) => {
                        return (
                            <Fragment>
                                
                            </Fragment>
                        );
                    }}
                    parallaxBackgroundScrollSpeed={3}
                    parallaxForegroundScrollSpeed={1.25}
                >
                    <SafeAreaView style={colorSchemeDark ? { flex: 1, backgroundColor: "#000" } : { flex: 1, backgroundColor: backColor }}>
                        <View style={styles.container}>
                            <Text style={colorSchemeDark ? [styles.title, { color: "#fff" }] : styles.title}>Height (Approx.)</Text>
                            <View style={{ marginTop: 12.25 }} />
                            <Text style={colorSchemeDark ? [styles.subtext, { color: "#fff" }] : styles.subtext}>Drag the bar to adjust your height <Text style={{ color: colors.primary, fontWeight: "bold" }}>(measured in FT/IN - " ')</Text></Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12.5, marginBottom: 12.5 }}>
                                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                                <View>
                                    <Text style={{ width: 200, textAlign: 'center', color: primaryColor }}>*Drag* to adjust height/settings</Text>
                                </View>
                                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                            </View>
                            <Slider
                                value={typeof profileData !== "undefined" && _.has(profileData, "heightProfileData") ? profileData.heightProfileData.CMHeight : heightSize}
                                onValueChange={setGuessedValueState} 
                                minimumValue={second}
                                step={1}
                                thumbImage={() => <Image source={require("../../../../../assets/icons/drag.png")} style={{ minWidth: 27.5, minHeight: 27.5, height: 27.5, width: 27.5 }} />}
                                maximumValue={third}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12.5, marginBottom: 12.5 }}>
                                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                                <View>
                                    <Text style={{ width: 200, textAlign: 'center', color: primaryColor }}>Your selected height is <Text style={{ color: colors.primary, fontWeight: "bold" }}>{cmToInFt(setGuessedValue).feet}' {cmToInFt(setGuessedValue).inches}"</Text></Text>
                                </View>
                                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button disabled={setGuessedValue !== 0 ? false : true} color={primaryColor} onPress={submitNewHeight} titleStyle={{ color: 'white' }} title={setGuessedValue !== 0 ? "Submit your NEW height measurement!" : "Select a NEW HEIGHT measurement first..."} />
                            </View>
                            <View style={styles.centered}>
                                <Image source={require("../../../../../assets/images/custom/height-woman.jpg")} style={styles.illustrationImg} />
                            </View>
                        </View>
                    </SafeAreaView>
                </ParallaxScroll>
            </View>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {})(HeightHelperComponent);