import React, { useEffect, Fragment, useState } from "react";
import { Text, View, Button, TouchableOpacity, ScrollView } from "react-native";
import _ from "lodash";
import { eyeColorOptions } from "../../options/editProfile.js";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@env";
import LinearGradient from 'react-native-linear-gradient';
import { ListItem, Badge } from '@rneui/themed';

const primaryColor = "#D81159";
const secondaryColor = "#0496FF";
const blackColor = "#000";
const backColor = "#eee";
const greenColor = "#58D68D";

const EyeColorSelectionHelperComponent = (props) => {

    const profileData = props.profileData;
    const styles = props.styles;
    const navigation = props.navigation;

    const [ selectedColor, setSelectedColor ] = useState({
        label: null,
        value: null
    });

    useEffect(() => {
        if (_.has(profileData, "eyeColor")) {
            setSelectedColor(profileData.eyeColor);
        }
    }, [])

    const handleSubmisison = () => {
        console.log("handleSubmisison clicked/ran...");

        const config = {
            uniqueId: props.userData.uniqueId,
            selectedValue: selectedColor,
            field: "eyeColor",
            accountType: props.userData.accountType
        }

        axios.post(`${BASE_URL}/adjust/profile/data`, config).then((res) => {
            if (res.data.message === "Updated successfully!") {
                console.log("resdata", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully adjusted your 'eye-color settings'.`,
                    text2: `We've successfully uploaded your 'eye-color settings' properly - you new data is now live!`,
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
                    text2: `We've experienced an error while adjusting your 'eye-color settings' - please try this action again.`,
                    visibilityTime: 4250,
                    position: "bottom",
                    bottomOffset: -50
                });
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    const calculateDisabledEyeColor = () => {
        if (selectedColor.value !== null) {
            return false;
        } else {
            return true;
        }
    }
    return (
        <Fragment>
            <View style={styles.container}>
                <Text style={styles.title}>Eye Color</Text>
                <Text style={styles.subtitle}>Select your eye color (or your best guess)</Text>
                <View style={{ marginBottom: 17.5 }}>
                    {eyeColorOptions.map((option, index) => {
                        if (option.value === "other") {
                            return (
                                <ListItem bottomDivider key={index} onPress={() => setSelectedColor(option)} containerStyle={selectedColor.value !== null && option.value === selectedColor.value ? { backgroundColor: "#ffdeea" } : {}}>
                                    <LinearGradient style={{ minWidth: 32.5, minHeight: 32.5, borderRadius: 35 }} colors={[primaryColor, secondaryColor, greenColor]} />
                                    <ListItem.Content>
                                        <ListItem.Title style={styles.breakerSection}>{option.label}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            );
                        } else {
                            return (
                                <ListItem bottomDivider key={index} onPress={() => setSelectedColor(option)} containerStyle={selectedColor.value !== null && option.value === selectedColor.value ? { backgroundColor: "#ffdeea" } : {}}>
                                    <View style={{ backgroundColor: option.color, minWidth: 32.5, minHeight: 32.5, borderRadius: 35 }} />
                                    <ListItem.Content>
                                        <ListItem.Title style={styles.breakerSection}>{option.label}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            );
                        }
                    })}
                </View>
                <Button disabled={calculateDisabledEyeColor()} color={primaryColor} onPress={() => {
                    handleSubmisison();
                }} titleStyle={{ color: 'white' }} title={"Submit your selection"} />
            </View>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {})(EyeColorSelectionHelperComponent);