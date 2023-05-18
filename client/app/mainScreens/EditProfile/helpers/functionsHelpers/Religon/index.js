import React, { useEffect, Fragment, useState } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import _ from "lodash";
import { religionOptions } from "../../options/editProfile.js";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@env";
import { ListItem } from "@rneui/base";
import styles from "./indexStyles.js";
import { Text, Button, Header, Icon } from "@components";
import { useTheme} from '@config'; 

const { width, height } = Dimensions.get("window");

const ReglionSelectionHelper = (props) => {

    const profileData = props.profileData;
    const navigation = props.navigation;
    const {colors} = useTheme();

    const [selectedReligion, setSelectedReligion] = useState({
        label: null,
        value: null
    });

    useEffect(() => {
        if (_.has(profileData, "religion")) {
            setSelectedReligion(profileData.religion);
        }
    }, [])

    const handleSubmisison = () => {
        console.log("handleSubmisison clicked/ran...");

        const config = {
            uniqueId: props.userData.uniqueId,
            selectedValue: selectedReligion,
            field: "religion",
            accountType: props.userData.accountType
        }

        axios.post(`${BASE_URL}/adjust/profile/data`, config).then((res) => {
            if (res.data.message === "Successfully executed desired logic!") {
                console.log("resdata", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully adjusted your 'religion settings'.`,
                    text2: `We've successfully uploaded your 'religion settings' properly - you new data is now live!`,
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
                    text2: `We've experienced an error while adjusting your 'religion settings' - please try this action again.`,
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
        if (selectedReligion.value !== null) {
            return false;
        } else {
            return true;
        }
    }
    return (
        <Fragment>
            <Header
                title={"Profile Selection"}
                subTitle="Religion Selection!"
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
            <ScrollView horizontal={true} style={{ flexGrow: 1, flex: 1 }} contentContainerStyle={{ flexGrow: 1, flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.title}>Religion Selection</Text>
                    <Text style={styles.subtitle}>Select the your relgion if you prefer (will be publically available to view from your profile)</Text>
                    <View style={{ marginBottom: 17.5 }}>
                        {religionOptions.map((option, index) => {
                            if (selectedReligion.value !== null && option.value === selectedReligion.value) {
                                return (
                                    <ListItem bottomDivider key={index} onPress={() => setSelectedReligion(option)} containerStyle={selectedReligion.value !== null && option.value === selectedReligion.value ? { backgroundColor: "#ffdeea", minWidth: width } : { width: width }}>
                                        <View style={{ backgroundColor: colors.accent, minWidth: 32.5, minHeight: 32.5, borderRadius: 35, borderWidth: 1.5, borderColor: "#000" }} />
                                        <ListItem.Content>
                                            <ListItem.Title style={styles.breakerSection}>{option.label}</ListItem.Title>
                                        </ListItem.Content>
                                    </ListItem>
                                );
                            } else {
                                return (
                                    <ListItem bottomDivider key={index} onPress={() => setSelectedReligion(option)} containerStyle={selectedReligion.value !== null && option.value === selectedReligion.value ? { backgroundColor: "#ffdeea", minWidth: width } : { width: width }}>
                                        <View style={{ minWidth: 32.5, minHeight: 32.5, borderRadius: 35, borderWidth: 1.5, borderColor: "#000" }} />
                                        <ListItem.Content>
                                            <ListItem.Title style={styles.breakerSection}>{option.label}</ListItem.Title>
                                        </ListItem.Content>
                                    </ListItem>
                                );
                            }
                        })}
                    </View>
                    <Button onPress={() => handleSubmisison()} style={calculateDisabledEyeColor() ? { backgroundColor: "lightgrey" } : { backgroundColor: colors.accent }} disabled={calculateDisabledEyeColor()}>
                        {"Submit Your Selection"}
                    </Button>
                </View>
            </ScrollView>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {})(ReglionSelectionHelper);