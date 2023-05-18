import React, { useState, Fragment, useCallback } from "react";
import { View, TouchableOpacity, ScrollView, Image, TextInput as CustomTextInput, Dimensions, StatusBar, useColorScheme, Platform } from "react-native";
import _ from "lodash";
import { connect } from "react-redux"; 
import axios from "axios";
import { BASE_URL } from "@env";
import styles from "./indexStyles.js";
import { useNavigation } from "@react-navigation/native";
import { Images, useTheme} from '@config';
import { BASE_ASSET_URL } from "@env";
import {
    Header,
    SafeAreaView,
    Text,
    ProfileAuthor,
    PostListItem,
    Button,
    Tag, 
    Icon
  } from '@components';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Toast from "react-native-toast-message";
import MultiSelect from 'react-native-multiple-select';
import interestOptions from "./interestOptions.js";
import { useFocusEffect } from '@react-navigation/native';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

const primaryColor = "#D81159";

const { width, height } = Dimensions.get("window");

const BiographyAboutMeInterestsHelper = ({  userData}) => {

    const navigation = useNavigation();
    const { colors, theme } = useTheme();
    const {t} = useTranslation();
    const colorSchemeDark = theme.dark;

    const [aboutMeBio, setAboutMeState] = useState("");
    const [ meetups, setMeetups ] = useState([]);
 
    const [ selectedOptions, setSelected ] = useState([]);

    const calculateDisabled = () => {
        if ((typeof aboutMeBio !== "undefined" && aboutMeBio.length >= 50) && (typeof selectedOptions !== "undefined" && selectedOptions.length > 0)) {
            return false;
        } else {
            return true;
        }
    }

    const onSelectedItemsChange = useCallback((newValues) => {
        console.log("onSelectedItemsChange clicked/ran...", newValues);

        setSelected(newValues)
    })

    const removeItem = (data) => {
        console.log("removeItem clicked...!");

        setSelected(prevState => prevState.filter(item => item !== data))
    }

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

    const handleSubmission = () => {
        const config = {
            uniqueId: userData.uniqueId,
            selectedValue: {
                aboutMeBio,
                selectedOptions
            },
            field: "biographyAndInterests",
            accountType: userData.accountType
        }

        axios.post(`${BASE_URL}/adjust/profile/data`, config).then((res) => {
            if (res.data.message === "Successfully executed desired logic!") {
                console.log("resdata", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully adjusted your 'biography & interests settings'.`,
                    text2: `We've successfully uploaded your 'biography & interests settings' properly - you new data is now live!`,
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
                    text2: `We've experienced an error while adjusting your 'biography & interests settings' - please try this action again.`,
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
            axios.get(`${BASE_URL}/gather/meetups/randomized`, {
                params: {} 
            }).then((res) => {
                if (res.data.message === "Gathered list of meetings!") {
                    console.log("Gathered list of meetings!", res.data);
        
                    const { meetups } = res.data;
        
                    const shuffled = _.shuffle(meetups);
        
                    setMeetups(shuffled.slice(0, 5));
                } else {
                    console.log("Err", res.data);
                }
            }).catch((err) => {
                console.log(err.message);
            })
    }, []));


    return (
        <Fragment>
            <Header
                title="About Me & Interest(s)"
                subTitle={"Enter More About You!"}
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
                parallaxHeight={200}
                // headerBackgroundColor={""}
                renderParallaxBackground={({ animatedValue }) => <Image
                    source={require("../../../../../assets/images/about.jpg")}
                    style={styles.imgBanner}
                    resizeMode={"cover"}
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
                <StatusBar translucent={false} backgroundColor={colors.accent} />
                <ScrollView
                    scrollEventThrottle={8}
                >
                    <SafeAreaView style={colorSchemeDark ? {flex: 1, backgroundColor: "#000"} : {flex: 1, backgroundColor: "#fff"}} edges={['right', 'left', 'bottom']}>
                        <View
                            style={{
                                paddingHorizontal: 20,
                                marginBottom: 20,
                                marginTop: 10,
                            }}
                        >
                            <Text headline semibold blackColor numberOfLines={1}>
                                {t(`Complete your 'About Me/Bio' & Your Interest's`)}
                            </Text>
                            <ProfileAuthor
                                image={userData !== null ? { uri: `${BASE_ASSET_URL}/${userData.profilePictures[userData.profilePictures.length - 1].link}` } : Images.profile2}
                                name={userData !== null ? userData.firstName : "Unknown"}
                                description={userData !== null ? `@${userData.username}` : "Unknown"}
                                textRight={userData !== null ? `Born ${moment(userData.birthdateRaw).format("YYYY")}` : "Unknown"}
                                style={{ marginTop: 20 }}
                            />
                            <View style={styles.hrGrey} />
                            <Text style={styles.label}>What would you like people to know about you?</Text>
                            <CustomTextInput
                                maxLength={375}
                                multiline={true}
                                numberOfLines={10}
                                placeholderTextColor={colorSchemeDark ? "#fff" : "#000"}
                                style={colorSchemeDark ? { color: "#fff", backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 225, height: 225, padding: 7.25, marginTop: 12.25 } : { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 225, height: 225, padding: 7.25, marginTop: 12.25 }}
                                secureTextEntry={false}
                                placeholder="About-Me/Biography Details... (50 Character MIN.)"
                                value={aboutMeBio}
                                onChangeText={value => {
                                    setAboutMeState(value);
                                }}
                            />
                            <View style={styles.hrGrey} />
                            <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : styles.labeled}>Select your interests, passions & hobbies (can select multiple*)</Text>
                            <MultiSelect
                                hideTags={true}
                                items={interestOptions}
                                uniqueKey="title"
                                onSelectedItemsChange={onSelectedItemsChange}
                                selectedItems={selectedOptions}
                                selectText="Pick Your Interests/Hobbies..."
                                searchInputPlaceholderText="Search for item's..."
                                onChangeInput={ (text)=> console.log(text)}
                                // tagRemoveIconColor="#CCC"
                                // tagBorderColor="#CCC"
                                // tagTextColor="#CCC"
                                selectedItemTextColor="#000"
                                // selectedItemIconColor="#CCC"
                                // itemTextColor="#000"
                                displayKey="title"
                                searchInputStyle={{ color: '#CCC' }}
                                submitButtonColor={primaryColor}
                                submitButtonText="Submit"
                            />
                            <View style={{ display: "flex", flexDirection: "row", flexWrap: 'wrap' }}>
                                {typeof selectedOptions !== "undefined" && selectedOptions.length > 0 ? selectedOptions.map((item, index) => {
                                    return (
                                        <Tag
                                            key={'service' + index}
                                            icon={
                                                <TouchableOpacity onPress={() => removeItem(item)}>
                                                    <Image source={require("../../../../../assets/icons/close-large.png")} style={styles.iconCustomTag} />
                                                </TouchableOpacity>
                                            }
                                            chip
                                            style={{
                                                marginTop: 5,
                                                marginRight: 5,
                                                fontWeight: "bold",
                                                maxWidth: 275
                                            }}>
                                            {item}
                                        </Tag>
                                    );
                                }) : <Text style={{ fontWeight: "bold", textAlign: "center", color: colors.primary }}>You still need to select some hobbies/interests...</Text>}
                            </View>
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
                                <TouchableOpacity onPress={() => navigation.navigate('Post')}>
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
                            {typeof meetups !== "undefined" && meetups.length > 0 ? meetups.map((meetup, index) => {
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
                {/* </SafeAreaView> */}
            </ParallaxScroll>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {})(BiographyAboutMeInterestsHelper);