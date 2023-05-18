import React, { Fragment, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import styles from "./organizeStyles.js";
import { BaseStyle, useTheme, BaseColor } from '@config';
import { Header, SafeAreaView, Icon, Text, Button, TextInput } from '@components';
import { Calendar } from 'react-native-calendars';
import moment from "moment";
import { View, ScrollView, TextInput as CustomTextInput, useColorScheme } from "react-native";
import _ from "lodash";
import DatePicker from 'react-native-modern-datepicker';
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@env";
import Toast from "react-native-toast-message";
import Spinner from 'react-native-loading-spinner-overlay';

const OrganizeMeetupsBetweenParties = (props) => {

    const authData = props.authData;
    const otherUser = props.route.params.otherUserData;

    const { colors, theme } = useTheme();

    console.log("otherUser", otherUser);

    const [ state, setState ] = useState({
        markedDatesIn: {},
        currentDate: new Date(),
        time: "",
        description: "",
        loading: false,
        waggedAmount: 0
    })

    const colorSchemeDark = theme.dark;

    const setDaySelected = (selected) => {
        let markedIn = {};
    
        markedIn[selected] = {
            selected: true,
            marked: true,
            selectedColor: colors.accent,
        };
        setState(prevState => {
            return {
                ...prevState,
                markedDatesIn: markedIn
            }
        })
    };

    const navigation = useNavigation();

    const handleFinalSubmission = () => {
        console.log("handleFinalSubmission clicked/ran...");

        const { time, markedDatesIn, description, waggedAmount } = state;

        const configuration = {
            uniqueId: authData.uniqueId,
            otherUserID: otherUser.uniqueId,
            time, 
            markedDatesIn, 
            description,
            firstName: authData.firstName,
            username: authData.username,
            waggedAmount
        };

        setState(prevState => {
            return {
                ...prevState,
                loading: true
            }
        })

        axios.post(`${BASE_URL}/send/notification/meetup/match`, configuration).then((res) => {
            if (res.data.message === "Successfully sent notification for meetup!") {
                console.log("resdata", res.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })

                Toast.show({
                    type: 'success',
                    text1: `Successfully sent your meetup request!`,
                    text2: `Successfully sent your request - you will now need to wait for their response - stay tuned!`,
                    visibilityTime: 3250,
                    position: "bottom",
                    onHide: () => {
                        navigation.goBack();
                    }
                });
            } else {
                console.log("errrorrrrrr", ressss.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })

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

            setState(prevState => {
                return {
                    ...prevState,
                    loading: false
                }
            })

            // Toast.show({
            //     type: 'error',
            //     text1: `Error occurred while processing your request!`,
            //     text2: `An error has occurred while processing your request - contact support if the problem persists or try this action again...`,
            //     visibilityTime: 3250,
            //     position: "bottom"
            // });
        })
    }

    const calculateDisabled = () => {
        if (!_.isEmpty(state.markedDatesIn) && (typeof state.description !== "undefined" && state.description.length >= 25) && (typeof state.time !== "undefined" && state.time.length >= 0) && (state.waggedAmount !== 0)) {
            return false;
        } else {
            return true;
        }
    }

    console.log("state.time", state.time);

    const renderSecondPortionTime = () => {
        if (!_.isEmpty(state.markedDatesIn)) {
            return (
                <Fragment>
                    <DatePicker
                        mode="time"
                        minuteInterval={5}
                        onTimeChange={selectedTime => setState(prevState => {
                            return {
                                ...prevState,
                                time: selectedTime
                            }
                        })}
                        style={{ marginTop: 22.25 }}
                    />
                    <View style={{ marginTop: 17.25 }} />
                    {typeof state.time !== "undefined" && state.time.length > 0 ? <Text style={styles.selectedTime}>Selected Time (military time): {state.time}</Text> : null}
                    <View style={[styles.hr, { marginTop: 32.25, marginBottom: 32.25 }]} />
                    <Text style={{ fontSize: 16.25, marginBottom: 10 }} semibold>Enter a description for your request/message...</Text>
                    <CustomTextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                description: text
                            }
                        })}
                        multiline={true}
                        numberOfLines={8}
                        style={colorSchemeDark ? { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 325, padding: 12.25, height: 325, color: "#fff", borderWidth: 0.75, borderColor: "#fff" } : { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 325, paddingTop: 12.25, height: 325, color: "#000" }}
                        secureTextEntry={false}
                        placeholderTextColor={"darkgrey"}
                        placeholder="Enter your message for this request - this can be personal as this is private (only between you and your match) but please include at least 25 charectors to continue otherwise you will not be able to proceed..."
                        value={state.description}
                    />
                    <Text style={styles.labeled}>You need to enter an amount of tokens to deposit to be forfeited if you don't show up to your date - if you show up, they will be returned to you!</Text>
                    <TextInput
                        style={[BaseStyle.textInput, { backgroundColor: colors.card }]}
                        placeholder={"Enter a token count..."}
                        placeholderTextColor={"#909090"}
                        maxLength={15}
                        value={state.waggedAmount}
                        keyboardType={"number-pad"}
                        onChangeText={value => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    waggedAmount: value
                                }
                            })
                        }}
                        selectionColor={colors.primary}
                    />
                    <View style={[styles.hr, { marginTop: 22.25, marginBottom: 22.25 }]} />
                    <Text style={colorSchemeDark ? styles.warningStaking : [styles.warningStaking, { color: "#000" }]}>You will be depositing {state.waggedAmount} tokens saying that you'll show up for your date. If you do NOT show up, these token's are forfeited as a penalty for wasting the other user's time. These tokens will go to the OTHER user for their time & energy.</Text>
                    <View style={[styles.hr, { marginTop: 22.25, marginBottom: 22.25 }]} />
                    <Button
                        full
                        onPress={() => {
                            handleFinalSubmission();
                        }}
                        style={calculateDisabled() ? { backgroundColor: "lightgrey" } : {}}
                        disabled={calculateDisabled()}
                    >
                        Submit Request!    
                    </Button>
                    <View style={[styles.hr, { marginTop: 32.25, marginBottom: 32.25 }]} />
                </Fragment>
            );
        }
    }
    return (
        <Fragment>
            <Header
                title={"Organize Your Meeting/Meetup!"}
                subTitle="Meet in real-life..."
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
            <SafeAreaView
                style={BaseStyle.safeAreaView}
                edges={['right', 'left', 'bottom']}
            >
                <Spinner
                    visible={state.loading}
                    textContent={'Loading/Processing...'}
                    textStyle={styles.spinnerTextStyle}
                    overlayColor={"rgba(0, 0, 0, 0.725)"}
                />
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ margin: 12.25 }}>
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
                        markedDates={state.markedDatesIn}
                        current={state.currentDate}
                        minDate={new Date()}
                        maxDate={new Date(moment(new Date()).add(2, "weeks"))}
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
                    {renderSecondPortionTime()}
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
  
export default connect(mapStateToProps, {  })(OrganizeMeetupsBetweenParties);