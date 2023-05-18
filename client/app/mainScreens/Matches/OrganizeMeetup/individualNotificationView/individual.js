import React, { Fragment, useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import styles from "./individualStyles.js";
import { BaseStyle, useTheme, BaseColor } from '@config';
import { Header, SafeAreaView, Icon, Text, Button, Tag } from '@components';
import { Calendar } from 'react-native-calendars';
import moment from "moment";
import { View, ScrollView, useColorScheme, Dimensions } from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@env";
import Toast from "react-native-toast-message";
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import Dialog from "react-native-dialog";
            
const { width, height } = Dimensions.get("window");

const ManageIndividualMeetupRequestFromNotification = (props) => {
    const authData = props.authData;
    const notification = props.route.params.notification;
    const navigation = useNavigation();
    const {colors} = useTheme();
    const colorSchemeDark = useColorScheme() === "dark" ? true : false;

    const [ state, setState ] = useState({
        ready: false,
        meetingData: null,
        showDialog: false
    })

    useFocusEffect(
        useCallback(async () => {
            const config = {
                meetupID: notification.data.meetupID,
                uniqueId: authData.uniqueId
            };
    
            axios.post(`${BASE_URL}/fetch/pending/invite/meetup/notification`, config).then((res) => {
                if (res.data.message === "Successfully gathered notification data!") {
                    console.log("Successfully gathered...", res.data);

                    const { result } = res.data;

                    setState(prevState => {
                        return {
                            ...prevState,
                            meetingData: result,
                            ready: true
                        }
                    })
                } else {
                    console.log("Err", res.data);
                }
            }).catch((err) => {
                console.log(err.message);
            })
    }, []));

    const handleFinalSubmission = (accepted) => {
        console.log("handleFinalSubmission clicked/ran...", accepted);

        // check if accepted === true - acccpted request...!
        const config = {
            meetupID: notification.data.meetupID,
            uniqueId: authData.uniqueId,
            otherUserID: state.meetingData.sendingID,
            accepted,
            username: authData.username,
            firstName: authData.firstName
        };

        axios.post(`${BASE_URL}/accept/decline/request/meetup/irl`, config).then((res) => {
            if (res.data.message === "Successfully accepted the request!") {
                console.log("Successfully accepted the request!", res.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        showDialog: false
                    }
                })

                Toast.show({
                    type: 'success',
                    text1: `Successfully reacted to meetup request!`,
                    text2: `Successfully reacted to request and notified the user of your decision...!`,
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
                    text1: `Error occurred while processing your request!`,
                    text2: `An error has occurred while processing your request - contact support if the problem persists or try this action again...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);

            // Toast.show({
            //     type: 'error',
            //     text1: `Error occurred while processing your request!`,
            //     text2: `An error has occurred while processing your request - contact support if the problem persists or try this action again...`,
            //     visibilityTime: 3250,
            //     position: "bottom"
            // });
        })
    }

    console.log("notification props", state.meetingData);

    const renderContentConditionally = () => {
        if (state.ready === true) {
            return (
                <Fragment>
                    <Calendar
                        style={{
                            borderRadius: 8,
                            backgroundColor: colors.card,
                        }}
                        renderArrow={direction => {
                            return (
                            <Icon
                                name={direction == 'left' ? 'angle-left' : 'angle-right'}
                                size={14}
                                color={colors.primary}
                                enableRTL={true}
                            />
                            );
                        }}
                        markedDates={state.meetingData.selectedMeetupData}
                        current={new Date()}
                        onDayPress={day => {
                            console.log("day", day);
                            
                            setDaySelected(day.dateString);
                        }}
                        monthFormat={'dd-MM-yyyy'}
                        theme={{
                            calendarBackground: colors.card,
                            textSectionTitleColor: colors.text,
                            selectedDayBackgroundColor: colors.primary,
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: colors.primary,
                            dayTextColor: colors.text,
                            textDisabledColor: BaseColor.grayColor,
                            dotColor: colors.primary,
                            selectedDotColor: '#ffffff',
                            arrowColor: colors.primary,
                            monthTextColor: colors.text,
                            textMonthFontWeight: 'bold',
                            textDayFontSize: 14,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 14,
                        }}
                    />
                    <Text style={styles.selectedTime}>Desired Meetup Time (military time): {state.meetingData.meetupTime}</Text>     
                    <View style={styles.hr} />     
                    <Text style={styles.label}>Description/Included-Message</Text>  
                    <Text style={styles.paragraphText}>{state.meetingData.meetupDescription}</Text>
                    <View style={styles.hr} />    
                    <Button
                        full
                        onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    showDialog: true
                                }
                            })
                        }}
                        style={{ backgroundColor: colors.accent }}
                    >
                        Accept Or Deny Request... 
                    </Button>
                    <View style={styles.hr} />    
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <View style={{ margin: 17.25 }}>
                        <Placeholder
                            Animation={Fade}
                            Left={props => (
                                <PlaceholderMedia
                                    isRound={true}
                                    style={[styles.placeholderMediaSmaller, props.style]}
                                />
                            )}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine width={width * 0.25} />
                            <PlaceholderLine width={30} />
                        </Placeholder>
                        <Placeholder
                            Animation={Fade}
                            Left={props => (
                                <PlaceholderMedia
                                    isRound={true}
                                    style={[styles.placeholderMediaSmaller, props.style]}
                                />
                            )}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine width={width * 0.25} />
                            <PlaceholderLine width={30} />
                        </Placeholder>
                        <Placeholder
                            Animation={Fade}
                            Left={props => (
                                <PlaceholderMedia
                                    isRound={true}
                                    style={[styles.placeholderMediaSmaller, props.style]}
                                />
                            )}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine width={width * 0.25} />
                            <PlaceholderLine width={30} />
                        </Placeholder>
                        <Placeholder
                            Animation={Fade}
                            Left={props => (
                                <PlaceholderMedia
                                    isRound={true}
                                    style={[styles.placeholderMediaSmaller, props.style]}
                                />
                            )}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine width={width * 0.25} />
                            <PlaceholderLine width={30} />
                        </Placeholder>
                        <Placeholder
                            Animation={Fade}
                            Left={props => (
                                <PlaceholderMedia
                                    isRound={true}
                                    style={[styles.placeholderMediaSmaller, props.style]}
                                />
                            )}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine width={width * 0.25} />
                            <PlaceholderLine width={30} />
                        </Placeholder>
                        <Placeholder
                            Animation={Fade}
                            Left={props => (
                                <PlaceholderMedia
                                    isRound={true}
                                    style={[styles.placeholderMediaSmaller, props.style]}
                                />
                            )}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine width={width * 0.25} />
                            <PlaceholderLine width={30} />
                        </Placeholder> 
                        <Placeholder
                            Animation={Fade}
                            Left={props => (
                                <PlaceholderMedia
                                    isRound={true}
                                    style={[styles.placeholderMediaSmaller, props.style]}
                                />
                            )}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine width={width * 0.25} />
                            <PlaceholderLine width={30} />
                        </Placeholder>
                        <Placeholder
                            Animation={Fade}
                            Left={props => (
                                <PlaceholderMedia
                                    isRound={true}
                                    style={[styles.placeholderMediaSmaller, props.style]}
                                />
                            )}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine width={width * 0.25} />
                            <PlaceholderLine width={30} />
                        </Placeholder>
                        <Placeholder
                            Animation={Fade}
                            Left={props => (
                                <PlaceholderMedia
                                    isRound={true}
                                    style={[styles.placeholderMediaSmaller, props.style]}
                                />
                            )}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine width={width * 0.25} />
                            <PlaceholderLine width={30} />
                        </Placeholder>
                        <Placeholder
                            Animation={Fade}
                            Left={props => (
                                <PlaceholderMedia
                                    isRound={true}
                                    style={[styles.placeholderMediaSmaller, props.style]}
                                />
                            )}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine width={width * 0.25} />
                            <PlaceholderLine width={30} />
                        </Placeholder>
                        <Placeholder
                            Animation={Fade}
                            Left={props => (
                                <PlaceholderMedia
                                    isRound={true}
                                    style={[styles.placeholderMediaSmaller, props.style]}
                                />
                            )}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine width={width * 0.25} />
                            <PlaceholderLine width={30} />
                        </Placeholder>
                        <Placeholder
                            Animation={Fade}
                            Left={props => (
                                <PlaceholderMedia
                                    isRound={true}
                                    style={[styles.placeholderMediaSmaller, props.style]}
                                />
                            )}
                        >
                            <PlaceholderLine width={80} />
                            <PlaceholderLine width={width * 0.25} />
                            <PlaceholderLine width={30} />
                        </Placeholder> 
                    </View>
                </Fragment>
            );
        }
    }
    return (
        <Fragment>
            <Header
                title={"Manage This Invitation..."}
                subTitle="Accept/Deny This Meetup Request..."
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
            <Dialog.Container visible={state.showDialog}>
                <Dialog.Title style={{ color: "#000" }}>Would you like to 'accept' or 'reject' this request?</Dialog.Title>
                <Dialog.Description>
                    If you'd like to meetup IRL (in real life) with this user - click 'accept'! If not, feel free to take no action or click 'deny request' if you wish to reject this request...
                </Dialog.Description>
                <Dialog.Button onPress={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            showDialog: false
                        }
                    })
                    handleFinalSubmission(false);
                }} style={{ color: "darkred" }} label="Deny Request." />
                <Dialog.Button onPress={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            showDialog: false
                        }
                    })
                    handleFinalSubmission(true);
                }} style={{ color: "green" }} label="Accept Request!" />
		    </Dialog.Container>
            <SafeAreaView
                style={BaseStyle.safeAreaView}
                edges={['right', 'left', 'bottom']}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} style={{ margin: 12.25 }}>
                    {renderContentConditionally()}
                </ScrollView>
            </SafeAreaView>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
  
export default connect(mapStateToProps, {  })(ManageIndividualMeetupRequestFromNotification);