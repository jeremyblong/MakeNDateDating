import React, { Fragment, useState, useRef } from "react";
import { View, useColorScheme, TextInput as CustomTextInput, TouchableOpacity, ScrollView } from "react-native";
import { Text, Header, Icon, TextInput, Button } from "@components";
import { useNavigation } from "@react-navigation/native";
import styles from "./reviewMeetupExpStyles.js";
import RBSheet from "react-native-raw-bottom-sheet";
import {BaseColor, Images, useTheme} from '@config';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Toast from "react-native-toast-message";
import axios from "axios";
import { BASE_URL } from "@env";
import _ from "lodash";
import { connect } from "react-redux";

const LeaveAReviewMeetupGroup = (props) => {

    const authenticatedData = props.authenticatedData;
    const meetingData = props.route.params.meetingData;
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const navigation = useNavigation();

    const [ state, setState ] = useState({
        title: "",
        description: "",
        remarks: [],
        review: 3
    })

    const submitReview = () => {
        console.log("submitReview clicked/ran...!");

        const { remarks, description, title, review } = state;

        const config = {
            remarks, 
            description, 
            title,
            review,
            uniqueId: authenticatedData.uniqueId,
            reviewerUsername: authenticatedData.username,
            reviewerName: authenticatedData.firstName,
            meetingID: meetingData.id
        };
    
        axios.post(`${BASE_URL}/meetup/leave/review`, config).then((res) => {
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
    
            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while submitting your review!`,
            //     text2: `We've experienced technical difficulties while submitting your review - please try this action again or contact support if the problem persists...`,
            //     visibilityTime: 3250,
            //     position: "bottom"
            // });
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
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}>
            <Header
                title="Review This Meetup!"
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
                <Text style={styles.topText}>We will now review this group - please make sure to ONLY review groups/meetups you've ACTUALLY attended (preferably multiple times but single attendences is fine)...</Text>
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
                    style={colorSchemeDark ? { backgroundColor: colors.card, textAlignVertical: 'top', color: "#fff", padding: 10 } : { backgroundColor: colors.card, textAlignVertical: 'top', padding: 10 }}
                    secureTextEntry={false}
                    placeholder="Enter your take/review on this meetup group, Please only review if you've attended the meeting at least once..."
                    value={state.description}
                />
                <Text style={[styles.label, { marginTop: 25 }]}>Please rate this group on a 1-5 (with 5 being the best!)</Text>
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
                <View style={{ marginTop: 20 }} />
                <Text title3 semibold style={{ marginTop: 20, marginBottom: 5 }}>
                    Give compliements about things this meeting did well...
                </Text>
                <View style={styles.hr} />
                <View style={[styles.itemPrice, {borderColor: colors.border, marginVertical: 15 }]}>
                    <Text headline semibold>
                        Give compliement on your experience overall/generally
                    </Text>
                    <View style={styles.linePrice}>
                        <Text title3 primaryColor semibold>
                            Generally Positive experience
                        </Text>
                        <View style={styles.iconRight}>
                        <TouchableOpacity onPress={() => setState(prevState => {
                            return {
                                ...prevState,
                                remarks: prevState.remarks.filter(item => item !== "positive-experience")
                            }
                        })}>
                            <Icon
                                name="minus-circle"
                                size={24}
                                color={BaseColor.grayColor}
                            />
                        </TouchableOpacity>
                        <Text title1 style={{ paddingHorizontal: 10 }}>
                            {typeof state.remarks !== "undefined" && state.remarks.includes("positive-experience") ? 1 : 0}
                        </Text>
                        <TouchableOpacity onPress={() => setState(prevState => {
                            return {
                                ...prevState,
                                remarks: [...prevState.remarks, "positive-experience"]
                            }
                        })}>
                            <Icon name="plus-circle" size={24} color={colors.primary} />
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={[styles.itemPrice, {borderColor: colors.border, marginVertical: 15 }]}>
                    <Text headline semibold>
                        Everyone was mostly friendly & welcoming
                    </Text>
                    <View style={styles.linePrice}>
                        <Text title3 accentColor semibold>
                            Friendly & Welcoming
                        </Text>
                        <View style={styles.iconRight}>
                            <TouchableOpacity onPress={() => setState(prevState => {
                                return {
                                    ...prevState,
                                    remarks: prevState.remarks.filter(item => item !== "friendly-and-welcoming")
                                }
                            })}>
                                <Icon
                                    name="minus-circle"
                                    size={24}
                                    color={BaseColor.grayColor}
                                />
                            </TouchableOpacity>
                            <Text title1 style={{ paddingHorizontal: 10 }}>
                                {typeof state.remarks !== "undefined" && state.remarks.includes("friendly-and-welcoming") ? 1 : 0}
                            </Text>
                            <TouchableOpacity onPress={() => setState(prevState => {
                                return {
                                    ...prevState,
                                    remarks: [...prevState.remarks, "friendly-and-welcoming"]
                                }
                            })}>
                                <Icon name="plus-circle" size={24} color={colors.accent} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={[styles.itemPrice, {borderColor: colors.border, marginVertical: 15 }]}>
                    <Text headline semibold>
                        I had an overall fun & engaging experience!
                    </Text>
                    <View style={styles.linePrice}>
                        <Text title3 primaryColor semibold>
                            Fun & Engaging Experience
                        </Text>
                        <View style={styles.iconRight}>
                            <TouchableOpacity onPress={() => setState(prevState => {
                                return {
                                    ...prevState,
                                    remarks: prevState.remarks.filter(item => item !== "fun-and-engaging-experience")
                                }
                            })}>
                                <Icon
                                    name="minus-circle"
                                    size={24}
                                    color={BaseColor.grayColor}
                                />
                            </TouchableOpacity>
                            <Text title1 style={{ paddingHorizontal: 10 }}>
                                {typeof state.remarks !== "undefined" && state.remarks.includes("fun-and-engaging-experience") ? 1 : 0}
                            </Text>
                            <TouchableOpacity onPress={() => setState(prevState => {
                                return {
                                    ...prevState,
                                    remarks: [...prevState.remarks, "fun-and-engaging-experience"]
                                }
                            })}>
                                <Icon name="plus-circle" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={[styles.itemPrice, {borderColor: colors.border, marginVertical: 15 }]}>
                    <Text headline semibold>
                        I had a good time and plan to attend or would attend again if the opportunity arrises..
                    </Text>
                    <View style={styles.linePrice}>
                        <Text title3 accentColor semibold>
                            I'd return to this group again
                        </Text>
                        <View style={styles.iconRight}>
                            <TouchableOpacity onPress={() => setState(prevState => {
                                return {
                                    ...prevState,
                                    remarks: prevState.remarks.filter(item => item !== "id-return-repeat-again")
                                }
                            })}>
                                <Icon
                                    name="minus-circle"
                                    size={24}
                                    color={BaseColor.grayColor}
                                />
                            </TouchableOpacity>
                            <Text title1 style={{ paddingHorizontal: 10 }}>
                                {typeof state.remarks !== "undefined" && state.remarks.includes("id-return-repeat-again") ? 1 : 0}
                            </Text>
                            <TouchableOpacity onPress={() => setState(prevState => {
                                return {
                                    ...prevState,
                                    remarks: [...prevState.remarks, "id-return-repeat-again"]
                                }
                            })}>
                                <Icon name="plus-circle" size={24} color={colors.accent} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.hr} />
                <Button disabled={calculateDisabled()} outline style={calculateDisabled() ? { marginTop: 12.25, marginBottom: 12.25, backgroundColor: "lightgrey" } : { marginTop: 12.25, marginBottom: 12.25 }} onPress={() => submitReview()}>
                    {"Submit My Review!"}
                    </Button>
            </View>
        </ScrollView>
    );
}
const mapStateToProps = (state) => {
	return {
        authenticatedData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
	}
}
export default connect(mapStateToProps, { })(LeaveAReviewMeetupGroup);