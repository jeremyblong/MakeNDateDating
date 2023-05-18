import React, { useEffect, Fragment, useState } from "react";
import { Text, View, Button, TouchableOpacity, ScrollView } from "react-native";
import _ from "lodash";
import { bodyTypeOptions } from "../../options/editProfile.js";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@env";
import { ListItem, Badge } from '@rneui/themed';

const primaryColor = "#D81159";
const secondaryColor = "#0496FF";
const blackColor = "#000";
const backColor = "#eee";
const greenColor = "#58D68D";

const BodyTypeHelperComponent = (props) => {

    const profileData = props.profileData;
    const styles = props.styles;
    const navigation = props.navigation;

    const [bodyType, setBodyType] = useState({
        label: null,
        value: null
    });

    useEffect(() => {
        if (_.has(profileData, "bodyType")) {
            setBodyType(profileData.bodyType);
        }
    }, [])

    const handleSubmisison = () => {
        console.log("handleSubmisison clicked/ran...");

        const config = {
            uniqueId: props.userData.uniqueId,
            selectedValue: bodyType,
            field: "bodyType",
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

    const calculateDisabledBodyType = () => {
        if (bodyType.value !== null) {
            return false;
        } else {
            return true;
        }
    }
    const calculateStyles = (option) => {
        // "thin", "athletic", "average", "few-extra-pounds", "big-and-tall-bbw", "perfer-not-to-say" //

        switch (option.value) {
            case "thin":
                return { backgroundColor: "#C7C7CD", minWidth: 32.5, minHeight: 32.5, borderRadius: 5, minWidth: 10, maxWidth: 10 };
                break;
            case "athletic":
                return { backgroundColor: "#C7C7CD", minWidth: 32.5, minHeight: 32.5, borderRadius: 5, minWidth: 20, maxWidth: 20 };
                break;
            case "average":
                return { backgroundColor: "#C7C7CD", minWidth: 32.5, minHeight: 32.5, borderRadius: 5, minWidth: 30, maxWidth: 30 };
                break;
            case "few-extra-pounds":
                return { backgroundColor: "#C7C7CD", minWidth: 32.5, minHeight: 32.5, borderRadius: 5, minWidth: 40, maxWidth: 40 };
                break;
            case "big-and-tall-bbw":
                return { backgroundColor: "#C7C7CD", minWidth: 32.5, minHeight: 32.5, borderRadius: 5, minWidth: 50, maxWidth: 50 };
                break;
            case "perfer-not-to-say":
                return { backgroundColor: "#C7C7CD", minWidth: 32.5, minHeight: 32.5, borderRadius: 5, minWidth: 60, maxWidth: 60 };
                break;
            default:return { backgroundColor: "#C7C7CD", minWidth: 32.5, minHeight: 32.5, borderRadius: 5, minWidth: 100, maxWidth: 100 };
                break;
        }
    }
    return (
        <Fragment>
            <View style={styles.container}>
                <Text style={styles.title}>Eye Color</Text>
                <Text style={styles.subtitle}>Select your eye color (or your best guess)</Text>
                <View style={{ marginBottom: 17.5 }}>
                    {bodyTypeOptions.map((option, index) => {
                        return (
                            <ListItem bottomDivider key={index} onPress={() => setBodyType(option)} containerStyle={bodyType.value !== null && option.value === bodyType.value ? { backgroundColor: "#ffdeea" } : {}}>
                                <View style={calculateStyles(option)} />
                                <ListItem.Content>
                                    <ListItem.Title style={styles.breakerSection}>{option.label}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        );
                    })}
                </View>
                <Button disabled={calculateDisabledBodyType()} color={primaryColor} onPress={() => {
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
export default connect(mapStateToProps, {})(BodyTypeHelperComponent);