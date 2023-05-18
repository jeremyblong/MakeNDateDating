import React, { useState, useCallback, Fragment } from "react";
import { View, TouchableOpacity, ScrollView, Image, Dimensions, TextInput as CustomTextInput } from "react-native";
import _ from "lodash";
import { connect } from "react-redux"; 
import axios from "axios";
import { BASE_URL } from "@env";
import styles from "./indexStyles.js";
import { useNavigation } from "@react-navigation/native";
import { BaseStyle, Images, useTheme } from '@config';
import occupationAvailability from "./Helpers/options.js";
import { BASE_ASSET_URL } from "@env";
import RNPickerSelect from 'react-native-picker-select';
import {
    Header,
    SafeAreaView,
    Icon,
    Text,
    ProfileAuthor,
    PostListItem,
    Button
  } from '@components';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import Toast from "react-native-toast-message";
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

const { width, height } = Dimensions.get("window");

const OccupationAssistingHelper = ({ userData }) => {

    const navigation = useNavigation();
    const { colors, theme } = useTheme();
    const colorSchemeDark = theme.dark;
    const {t} = useTranslation();

    const [ state, setState ] = useState({
        searchingQuery: "",
        selected: null,
        meetups: [],
        isKeyboardVisible: true,
        description: "",
        user: null,
        data: occupationAvailability.map((item) => {
            return {
                label: item,
                value: item
            }
        })
    });

    console.log("searchingQuery", state.isKeyboardVisible);

    const calculateDisabled = () => {
        const { selected, description } = state;

        if (selected !== null && (typeof description !== "undefined" && description.length > 0)) {
            return false;
        } else {
            return true;
        }
    }

    const handleSubmission = () => {
        console.log("handleSubmission clicked/ran...");

        const { selected, description } = state;

        const config = {
            uniqueId: userData.uniqueId,
            selectedValue: {
                description,
                selected
            },
            field: "occupationalSettings",
            accountType: userData.accountType
        }

        axios.post(`${BASE_URL}/adjust/profile/data`, config).then((res) => {
            if (res.data.message === "Successfully executed desired logic!") {
                console.log("resdata", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully adjusted your 'occupational settings'.`,
                    text2: `We've successfully uploaded your 'occupational settings' properly - you new data is now live!`,
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
                    text2: `We've experienced an error while adjusting your 'occupational settings' - please try this action again.`,
                    visibilityTime: 4250,
                    position: "bottom",
                    bottomOffset: -50
                });
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }
  
    useFocusEffect(
        useCallback(() => {
            const config = {
                params: {
                    uniqueId: userData.uniqueId,
                    accountType: userData.accountType
                }   
            }
            axios.get(`${BASE_URL}/gather/user/profile`, config).then((res) => {
                if (res.data.message === "Successfully gathered profile!") {
                    console.log("Successfully gathered profile!", res.data);
        
                    const { user } = res.data;
        
                    setState(prevState => {
                        return {
                            ...prevState,
                            user
                        }
                    })
                } else {
                    console.log("Err", res.data);
                }
            }).catch((err) => {
                console.log(err.message);
            })

            axios.get(`${BASE_URL}/gather/meetups/randomized`, {
                params: {} 
            }).then((res) => {
                if (res.data.message === "Gathered list of meetings!") {
                    console.log("Gathered list of meetings!", res.data);
        
                    const { meetups } = res.data;
        
                    const shuffled = _.shuffle(meetups);

                    setState(prevState => {
                        return {
                            ...prevState,
                            meetups: shuffled.slice(0, 5)
                        }
                    })
                } else {
                    console.log("Err", res.data);
                }
            }).catch((err) => {
                console.log(err.message);
            })
    }, []));

    const calculatePicToDisplay = (images) => {
        if (_.has(images, "imageOne")) {
            return { uri: images.imageOne };
        } else if (_.has(images, "imageTwo")) {
            return { uri: images.imageTwo };
        } else if (_.has(images, "imageThree")) {
            return { uri: images.imageThree };
        } else if (_.has(images, "imageFour")) {
            return { uri: images.imageFour };
        } else if (_.has(images, "imageFive")) {
            return { uri: images.imageFive }
        } else {
            return require("../../../../../assets/images/custom/placeholder-loading.png")
        }
    }

    const { user } = state;
    return (
        <View style={{flex: 1}}>
            <Header
                title="Occupation Settings"
                subTitle={"Select Your Current Occupation"}
                style={colorSchemeDark ? { backgroundColor: "#000" } : { backgroundColor: "#fff" }}
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
            <ParallaxScroll
                headerBackgroundColor={"#fff"}
                height={height}
                style={{ flex: 1 }}
                isHeaderFixed={false}
                parallaxHeight={150}
                // headerBackgroundColor={""}
                renderParallaxBackground={({ animatedValue }) => <Image
                    source={require("../../../../../assets/images/custom/occupation.jpg")}
                    style={[
                    styles.imgBanner,
                    
                    ]}
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
            <ScrollView
                scrollEventThrottle={8}>
                <SafeAreaView style={colorSchemeDark ? {flex: 1, backgroundColor: "#000" } : {flex: 1, backgroundColor: "#fff" }} edges={['right', 'left', 'bottom']}>
                    <View
                    style={{
                        paddingHorizontal: 20,
                        marginBottom: 20,
                        marginTop: 32.5,
                    }}>
                        <Text headline semibold blackColor numberOfLines={1}>
                            {t(`Modify your occupational settings (work/job)`)}
                        </Text>
                        <ProfileAuthor
                            image={user !== null ? { uri: `${BASE_ASSET_URL}/${user.profilePictures[user.profilePictures.length - 1].link}` } : Images.profile2}
                            name={user !== null ? user.firstName : "Unknown"}
                            description={user !== null ? `@${user.username}` : "Unknown"}
                            textRight={user !== null ? `Born ${moment(user.birthdateRaw).format("YYYY")}` : "Unknown"}
                            style={{ marginTop: 20 }}
                        />
                        <Text body2>
                            You will need to select various settings to accurately depict what you do for work - other user's will see this. You do NOT have to complete this section however it gives other user's a better understanding of what/who you are & what you like to do...
                        </Text>
                        <Text style={styles.labeled}>Please select your occupational sector</Text>
                        <RNPickerSelect 
                            onValueChange={(value) => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        selected: value
                                    }
                                })
                            }}
                            textInputProps={colorSchemeDark ? { color: "#fff", minHeight: 62.25 } : { color: "#000", minHeight: 62.25 }}
                            items={state.data}
                            useNativeAndroidPickerStyle={false}
                        />
                        <View style={styles.hrGrey} />
                        <Text style={styles.labeled}>What do you do at your work?</Text>
                        <CustomTextInput
                            style={colorSchemeDark ? [BaseStyle.textInput, { marginTop: 12.25, backgroundColor: colors.card, minHeight: 225, textAlignVertical: "top", color: "#fff", paddingTop: 12.25 }] : [BaseStyle.textInput, { marginTop: 12.25, backgroundColor: colors.card, color: "#000", minHeight: 225, textAlignVertical: "top", paddingTop: 12.25 }]}
                            autoCorrect={false}
                            placeholder={"I'm a software engineer looking to expand my business horizons by building & creating innovative software solutions that impact people's lives in positive ways..."}
                            placeholderTextColor={"#909090"}
                            maxLength={425}
                            value={state.description}
                            onChangeText={value => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        description: value
                                    }
                                })
                            }}
                            multiline={true}
                            numberOfLines={7}
                            selectionColor={colors.primary}
                        />
                        <View style={styles.hrGrey} />
                        <Button style={calculateDisabled() ? { backgroundColor: "lightgrey" } : { backgroundColor: colors.accent }} disabled={calculateDisabled()} full onPress={() => handleSubmission()}> 
                            {t('Submit Change(s)')}
                        </Button>
                        <View style={styles.hrGrey} />
                        <View
                            style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 20,
                            }}>
                            <Text headline semibold>
                        
                            </Text>
                            <TouchableOpacity onPress={() => {}}>
                                <Text footnote grayColor>
                                    {t('show_more')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            headline
                            semibold
                            style={{
                            marginTop: 20,
                            }}>
                            {"Nearby Groups/Meet-Ups"}
                        </Text>
                        {typeof state.meetups !== "undefined" && state.meetups.length > 0 ? state.meetups.map((meetup, index) => {
                            return (
                                <Fragment key={index}>
                                    <PostListItem
                                        title={`${meetup.title.slice(0, 50)}${typeof meetup.title !== "undefined" && meetup.title.length > 50 ? "..." : ""}`}
                                        description={meetup.description}
                                        style={{ marginTop: 10, width: '100%' }}
                                        image={calculatePicToDisplay(meetup.meetupPics)}
                                        onPress={() => {
                                            navigation.navigate('HotelDetail', { meetingData: meetup });
                                        }}
                                    />
                                </Fragment>
                            );
                        }) : null}
                    </View>
                </SafeAreaView> 
            </ScrollView>
        </ParallaxScroll>
      </View>
    );
}

const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {})(OccupationAssistingHelper);