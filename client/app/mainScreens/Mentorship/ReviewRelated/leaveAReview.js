import React, { Fragment, useState, useRef } from "react";
import { View, useColorScheme, TextInput as CustomTextInput, TouchableOpacity, ScrollView, Platform } from "react-native";
import { Text, Header, Icon, TextInput, Button } from "@components";
import { useNavigation } from "@react-navigation/native";
import styles from "./leaveAReviewStyles.js";
import { useTheme} from '@config';
import { AirbnbRating } from 'react-native-ratings';
import Toast from "react-native-toast-message";
import axios from "axios";
import { BASE_URL } from "@env";
import _ from "lodash";
import { connect } from "react-redux";


const LeaveAReviewForMentorActiveOnly = (props) => {

    const authenticatedData = props.authenticatedData;
    const requestData = props.requestData;
    const rbsheetLeaveReviewRef = props.rbsheetLeaveReviewRef;
    const { colors, theme } = useTheme();
    const colorSchemeDark = theme.dark;
    const navigation = useNavigation();

    const [ state, setState ] = useState({
        title: "",
        description: "",
        review: 3
    })

    const submitReview = () => {
        console.log("submitReview clicked/ran...!");

        const { description, title, review } = state;

        const config = {
            description, 
            title,
            review,
            uniqueId: authenticatedData.uniqueId,
            reviewerUsername: authenticatedData.username,
            reviewerName: authenticatedData.firstName,
            mentorID: requestData.designatedTargetUserID
        };
    
        axios.post(`${BASE_URL}/mentor/leave/review`, config).then((res) => {
            if (res.data.message === "Successfully left review!") {
                console.log(res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully submitted your review!`,
                    visibilityTime: 3250,
                    position: "bottom",
                    onHide: () => {
                        navigation.goBack();
                    }
                });
            } else {
                console.log("Err", res.data);
    
                Toast.show({
                    type: 'error',
                    text1: `An error occurred while submitting your review!`,
                    text2: `We've experienced technical difficulties while submitting your review - please try this action again or contact support if the problem persists...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);
    
            Toast.show({
                type: 'error',
                text1: `An error occurred while submitting your review!`,
                text2: `We've experienced technical difficulties while submitting your review - please try this action again or contact support if the problem persists...`,
                visibilityTime: 3250,
                position: "bottom"
            });
        })
    }
    const calculateDisabled = () => {
        const { description, title } = state;

        if ((typeof description !== "undefined" && description.length > 0) && (typeof title !== "undefined" && title.length > 0)) {
            return false;
        } else {
            return true;
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={Platform.OS === "ios" ? { flexGrow: 1, paddingBottom: 225, marginTop: 50 } : { flexGrow: 1, paddingBottom: 225 }}>
                <Header
                    title="Review This Mentor!"
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
                    style={{ color: "#000" }}
                    onPressLeft={() => {
                        rbsheetLeaveReviewRef.current.close();
                    }}
                />
                <View style={styles.container}>
                    <Text style={styles.topText}>We will now review this mentor - Please make sure to leave an accurate review as other user's will use or see this</Text>
                    <Text style={styles.label}>Enter your review title</Text>
                    <TextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                title: text
                            }
                        })}
                        secureTextEntry={false}
                        placeholder="Review Title/Header..."
                        value={state.title}
                    />
                    <Text style={styles.label}>Enter your review description text</Text>
                    <CustomTextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                description: text
                            }
                        })}
                        multiline={true}
                        numberOfLines={10}
                        placeholderTextColor={"darkgrey"}
                        style={colorSchemeDark ? { color: "#fff", backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 225, height: 225, padding: 11.25 } : { color: "#000", backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 225, height: 225, padding: 11.25 }}
                        secureTextEntry={false}
                        placeholder="Enter your take/review on this mentor, Please leave an accurate & thorough review"
                        value={state.description}
                    />
                    <Text style={[styles.label, { marginTop: 25 }]}>Please rate this mentor on a 1-5 (with 5 being the best!)</Text>
                    <View style={styles.hr} />
                    <AirbnbRating
                        count={5}
                        reviews={["Terrible/Not-Good", "Ok/Fine", "Normal/Average", "Great/Awesome!", "Amazing/THE-BEST!"]}
                        defaultRating={3}
                        value={state.review}
                        onFinishRating={(value) => setState(prevState => {
                            return {
                                ...prevState,
                                review: value
                            }
                        })}
                        size={30}
                    />
                    <View style={[styles.hr, { marginBottom: 32.25 }]} />
                    <Button disabled={calculateDisabled()} outline style={calculateDisabled() ? { marginTop: 12.25, marginBottom: 12.25, backgroundColor: "lightgrey" } : { marginTop: 12.25, marginBottom: 12.25 }} onPress={() => submitReview()}>
                        {"Submit My Review!"}
                        </Button>
                </View>
            </ScrollView>
        </View>
    );
}
const mapStateToProps = (state) => {
	return {
        authenticatedData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
	}
}
export default connect(mapStateToProps, { })(LeaveAReviewForMentorActiveOnly);