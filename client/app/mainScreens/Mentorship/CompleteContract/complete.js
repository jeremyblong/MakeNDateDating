import React, { Fragment, useState } from "react";
import { Text, Header, Image, Icon, Button } from "@components"; 
import { View, ScrollView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme, BaseColor } from '@config';
import styles from "./completeStyles.js";
import axios from "axios";
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import { BASE_ASSET_URL, BASE_URL } from "@env";
import _ from "lodash";
import Dialog from "react-native-dialog";
        
const { width, height } = Dimensions.get("window");

const MarkCompletedMentorshipContract = (props) => {

    const passedData = props.route.params.data.data.data;
    const authenticatedData = props.authenticatedData;

    const [ state, setState ] = useState({
        showDialogConfirm: false,
        showDialogDeny: false
    })

    console.log("passedData", passedData);

    const navigation = useNavigation();

    const {colors, theme} = useTheme();

    const markAsComplete = () => {
        console.log("markAsComplete clicked/ran...");

        const configuration = {
            relevantListingID: passedData.id,
            authedID: authenticatedData.uniqueId,
            otherUserID: passedData.designatedTargetUserID,
            notificationID: props.route.params.data.id
        };

        axios.post(`${BASE_URL}/confirm/mentorship/sesssions/complete/request`, configuration).then((res) => {
            if (res.data.message === "Successfully confirmed response!") {
                console.log("res.ddata", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully confirmed/completed mentorship contract!`,
                    text2: `We're successfully ended the contract & completed your mentorship sessions...`,
                    visibilityTime: 3275,
                    position: "bottom",
                    onHide: () => navigation.goBack()
                });
            } else {
                console.log("Error inner res.data: ", res.data);

                Toast.show({
                    type: 'error',
                    text1: `Error occurred while processing your request!`,
                    text2: "We've encountered an error while attempting to process your request - try the action again or contact support if the problem persists...",
                    visibilityTime: 3275,
                    position: "bottom"
                });
            }
        }).catch((error) => {
            console.log("Error...:", error);

            Toast.show({
                type: 'error',
                text1: `Error occurred while processing your request!`,
                text2: "We've encountered an error while attempting to process your request - try the action again or contact support if the problem persists...",
                visibilityTime: 3275,
                position: "bottom"
            });
        })
    }

    const markAsNotCompleteYet = () => {
        console.log("markAsNotCompleteYet clicked/ran...");
    }

    return (
        <Fragment>
            <Dialog.Container visible={state.showDialogConfirm}>
                <Dialog.Title style={{ color: "#000" }}>Are you sure you'd like 'confirm' the completion of these mentorship sessions?</Dialog.Title>
                <Dialog.Description>
                    Confirm if the services were properly rendered by the therapist. This includes showing up for scheduled appointments and providing beneficial services as expected. It serves as a confirmation that the mentorship services were provided as agreed upon.
                </Dialog.Description>
                <Dialog.Button onPress={() => setState(prevState => {
                    return {
                        ...prevState,
                        showDialogConfirm: false
                    }
                })} style={{ color: "darkred" }} label="Cancel.." />
                <Dialog.Button onPress={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            showDialogConfirm: false
                        }
                    })
                    markAsComplete();
                }} style={{ color: "green" }} label="Agree, Conclude!" />
            </Dialog.Container>
            <Dialog.Container visible={state.showDialogDeny}>
                <Dialog.Title style={{ color: "#000" }}>Are you sure the therapist has not yet rendered the agreed services?</Dialog.Title>
                <Dialog.Description>
                    Please select 'Services not rendered yet' if the therapist/mentor has NOT yet rendered the agreed upon services. This includes but is not limited to showing up for appointments, responding in reasonable timespans, etc... 
                </Dialog.Description>
                <Dialog.Button onPress={() => setState(prevState => {
                    return {
                        ...prevState,
                        showDialogDeny: false
                    }
                })} style={{ color: "darkred" }} label="Cancel.." />
                <Dialog.Button onPress={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            showDialogDeny: false
                        }
                    })
                    markAsNotCompleteYet();
                }} style={{ color: "green" }} label="Not Rendered Yet!" />
            </Dialog.Container>
            <Header
                title="Manage/Confirm Contract"
                subTitle={"Confirm Or Deny Response"}
                renderLeft={() => {
                    return (
                        <Icon
                            name="arrow-left"
                            size={25}
                            color={theme.dark ? "#fff" : "#000"}
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View>
                        <Image source={require("../../../assets/images/complete.jpg")} style={{width: '100%', height: height * 0.35 }} />
                        <View style={styles.titleAbout}>
                            <View style={styles.backgroundContainer}>
                                <Text style={{ marginBottom: 10 }} title1 semibold whiteColor>
                                    {"Confirm that your business has concluded!"}
                                </Text>
                                <Text subhead whiteColor>
                                    {"Confirm that you've concluded your business with this counselor and that they provided/rendered the services you both agreeed upon..."}
                                </Text>
                            </View>
                        </View>
                        <Button full style={{ backgroundColor: BaseColor.greenColor, marginTop: 15 }} onPress={() => setState(prevState => {
                            return {
                                ...prevState,
                                showDialogConfirm: true
                            }
                        })}>
                            {"Mark As Complete!"}
                        </Button>
                    </View>
                    <View style={[styles.hr, { marginTop: 22.25 }]} />
                    <View>
                        <Image source={require("../../../assets/images/incomplete.jpg")} style={{width: '100%', height: height * 0.35 }} />
                        <View style={styles.titleAbout}>
                            <View style={styles.backgroundContainer}>
                                <Text style={{ marginBottom: 10 }} title1 semibold whiteColor>
                                    {"DENY the completion or rendering of services..."}
                                </Text>
                                <Text subhead whiteColor>
                                    {"Deny that the agreed services have already been rendered - this could mean that they haven't been rendered YET so this will ensure the other user (the mentor/therapist) will need to reiniate the services conclussion request & you'll get another notification once the services are fully-rendered."}
                                </Text>
                            </View>
                        </View>
                        <Button full style={{ backgroundColor: colors.accent, marginTop: 15 }} onPress={() => setState(prevState => {
                            return {
                                ...prevState,
                                showDialogDeny: true
                            }
                        })}>
                            {"Mark As NOT Complete!"}
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
	return {
		authenticatedData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
	}
}
export default connect(mapStateToProps, { })(MarkCompletedMentorshipContract);