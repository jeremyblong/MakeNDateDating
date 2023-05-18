import React, { useEffect, useState } from "react";
import { Text, View, Button, TouchableOpacity, ScrollView } from "react-native";
import _ from "lodash";
import { Switch } from 'react-native-switch';
import { maritialOptions, preferencesOptions, idealType, intentOptionsPreferred } from "../../options/editProfile.js";
import { Badge } from "@rneui/base";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@env";

const primaryColor = "#D81159";
const secondaryColor = "#0496FF";
const blackColor = "#000";
const backColor = "#eee";
const greenColor = "#58D68D";


const GenderAndIntentHelper = (props) => {
    console.log("props GenderAndIntentHelper", props);

    const [ data, setData ] = useState({
        showGender: false,
        maritialStatus: null,
        typeOfRelationship: null,
        intent: null,
        preference: null
    });

    const profileData = props.profileData;
    const styles = props.styles;
    const navigation = props.navigation;

    useEffect(() => {
        if (_.has(profileData, "intents")) {
            setData({
                showGender: profileData.intents.showGender,
                maritialStatus: profileData.intents.maritialStatus,
                typeOfRelationship: profileData.intents.typeOfRelationship,
                intent: profileData.intents.intent,
                preference: profileData.intents.preference
            })
        }
    }, [])


    const handleSubmisison = () => {
        console.log("handleSubmisison clicked/ran...");

        const config = {
            uniqueId: props.userData.uniqueId,
            data
        }

        axios.post(`${BASE_URL}/adjust/intents/profile/data`, config).then((res) => {
            if (res.data.message === "Updated successfully!") {
                console.log("resdata", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully adjusted your 'intent(s) settings'.`,
                    text2: `We've successfully uploaded your 'intent(s) settings' properly - you new data is now live!`,
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
                    text2: `We've experienced an error while adjusting your 'intent(s) settings' - please try this action again.`,
                    visibilityTime: 4250,
                    position: "bottom",
                    bottomOffset: -50
                });
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    const calculateReadiness = () => {
        const { maritialStatus, typeOfRelationship, intent, preference } = data;
        
        if (maritialStatus !== null && typeOfRelationship !== null && intent !== null & preference !== null) {
            return false;
        } else {
            return true;
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
                <View style={styles.container}>
                    <Text style={styles.title}>Gender, Intent & More</Text>
                    <View style={{ flexDirection: "row",  marginTop: 12.5 }}>
                        <View style={{ maxWidth: "65%", minWidth: "65%" }}>
                            <Text style={{ position: "absolute", left: 0, top: 0 }}>Show Gender on my profile?</Text>
                        </View>
                        <View style={{ maxWidth: "35%", minWidth: "35%" }}>
                            <View style={{ position: "absolute", right: 20, top: 0 }}>
                                <Switch
                                    value={data.showGender}
                                    onValueChange={(val) => setData(prevState => {
                                        return {
                                            ...prevState,
                                            showGender: val
                                        }
                                    })}
                                    disabled={false}
                                    activeText={'Yes!'}
                                    inActiveText={'No.'}
                                    circleSize={30}
                                    barHeight={25}
                                    circleBorderWidth={3}
                                    backgroundActive={"#000"}
                                    backgroundInactive={'gray'}
                                    circleActiveColor={greenColor}
                                    circleInActiveColor={primaryColor}
                                    changeValueImmediately={true}
                                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                    outerCircleStyle={{}}
                                    renderActiveText={true}
                                    renderInActiveText={true}
                                    switchLeftPx={2}
                                    switchRightPx={2}
                                    switchWidthMultiplier={2}
                                    switchBorderRadius={30}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 12.5 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                        <View>
                            <Text style={{ width: 180, textAlign: 'center', color: primaryColor }}>Maritial Status</Text>
                        </View>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                    </View>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {maritialOptions.map((option, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => setData(prevState => {
                                    return {
                                        ...prevState,
                                        maritialStatus: option
                                    }
                                })}>
                                    <Badge
                                        badgeStyle={data.maritialStatus !== null && data.maritialStatus.value === option.value ? styles.selectedBadge : styles.badgeCollege}
                                        // badgeStyle={styles.badgeCollege}
                                        value={option.label}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 12.5 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                        <View>
                            <Text style={{ width: 180, textAlign: 'center', color: primaryColor }}>What's your preference?</Text>
                        </View>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                    </View>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {preferencesOptions.map((option, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => setData(prevState => {
                                    return {
                                        ...prevState,
                                        preference: option
                                    }
                                })}>
                                    <Badge
                                        badgeStyle={data.preference !== null && data.preference.value === option.value ? styles.selectedBadge : styles.badgeCollege}
                                        // badgeStyle={styles.badgeCollege}
                                        value={option.label}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 12.5 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                        <View>
                            <Text style={{ width: 180, textAlign: 'center', color: primaryColor }}>What type of relationship do you want?</Text>
                        </View>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                    </View>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {idealType.map((option, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => setData(prevState => {
                                    return {
                                        ...prevState,
                                        typeOfRelationship: option
                                    }
                                })}>
                                    <Badge
                                        badgeStyle={data.typeOfRelationship !== null && data.typeOfRelationship.value === option.value ? styles.selectedBadge : styles.badgeCollege}
                                        // badgeStyle={styles.badgeCollege}
                                        value={option.label}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 12.5 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                        <View>
                            <Text style={{ width: 180, textAlign: 'center', color: primaryColor }}>What is your intent (honestly)?</Text>
                        </View>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                    </View>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {intentOptionsPreferred.map((option, index) => {
                            return (
                                <TouchableOpacity key={index} onPress={() => setData(prevState => {
                                    return {
                                        ...prevState,
                                        intent: option
                                    }
                                })}>
                                    <Badge
                                        badgeStyle={data.intent !== null && data.intent.value === option.value ? [styles.selectedBadge, { minHeight: 40, marginTop: 27.5 }] : [styles.badgeCollege, { minHeight: 40, marginTop: 27.5 }]}
                                        // badgeStyle={[styles.badgeCollege, { minHeight: 40, marginTop: 27.5 }]}
                                        value={option.label}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
            <View>
                <Button disabled={calculateReadiness()} color={secondaryColor} onPress={() => {
                    handleSubmisison();
                }} titleStyle={{ color: 'white' }} title={"Submit modified/new changes & data"} />
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, { })(GenderAndIntentHelper);