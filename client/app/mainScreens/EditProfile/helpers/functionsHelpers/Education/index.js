import React, { useState, useCallback, Fragment } from "react";
import { View, TouchableOpacity, ScrollView, Image, StatusBar, Platform, Dimensions } from "react-native";
import _ from "lodash";
import { connect } from "react-redux"; 
import axios from "axios";
import { BASE_URL } from "@env";
import styles from "./indexStyles.js";
import { useNavigation } from "@react-navigation/native";
import {BaseColor, BaseStyle, Images, useTheme} from '@config';
import { BASE_ASSET_URL } from "@env";
import {
    Header,
    SafeAreaView,
    Icon,
    Text,
    ProfileAuthor,
    PostListItem,
    Button,
    TextInput
  } from '@components';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import Toast from "react-native-toast-message";
import RNPickerSelect from 'react-native-picker-select';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

const { width, height } = Dimensions.get("window");

const primaryColor = "#D81159";
const backColor = "#eee";

const statesAvailable = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
];

const degreeOptions = [{
    label: "Some College",
    value: "some-college-incomplete"
}, {
    label: "Associate's Degree",
    value: "associates-completed"
}, {
    label: "Bachelor's Degree",
    value: "bachelors-completed"
}, {
    label: "Master's Degree",
    value: "masters-completed"
}, {
    label: "Doctorate Degree",
    value: "doctorate-completed"
}, {
    label: "Only High-School Completion",
    value: "high-school-incomplete"
}]

const EducationalDataChanger = ({ userData }) => {

    const navigation = useNavigation();
    const { colors, theme } = useTheme();
    const {t} = useTranslation();
    const colorSchemeDark = theme.dark;

    let num = 1950;

    const [ state, setState ] = useState({
        user: null,
        years: new Array((2023 - num)).fill(null).map((item, index) => {
            const numberConverted = num += 1;
            return {
                label: numberConverted.toString(),
                value: numberConverted.toString()
            }
        }),
        schoolName: "",
        startedYear: null,
        endingYear: null,
        meetups: [],
        locationState: null,
        degreeAquired: null,
        states: statesAvailable.map((item, index) => {
            return {
                label: item.name,
                value: item.abbreviation
            }
        })
    });

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

    const calculateDisabled = () => {
        const { startedYear, endingYear, locationState, degreeAquired, schoolName } = state;

        if (startedYear !== null && endingYear !== null && locationState !== null && degreeAquired !== null && (typeof schoolName !== "undefined" && schoolName.length > 0)) {
            return false;
        } else {
            return true;
        }
    }

    const handleSubmission = () => {
        const { startedYear, endingYear, locationState, degreeAquired, schoolName } = state;

        const config = {
            uniqueId: userData.uniqueId,
            selectedValue: {
                startedYear, 
                endingYear, 
                locationState, 
                degreeAquired, 
                schoolName
            },
            field: "educationalSettings",
            accountType: userData.accountType
        }

        axios.post(`${BASE_URL}/adjust/profile/data`, config).then((res) => {
            if (res.data.message === "Successfully executed desired logic!") {
                console.log("resdata", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully adjusted your 'educational/education settings'.`,
                    text2: `We've successfully uploaded your 'educational/education settings' properly - you new data is now live!`,
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
                    text2: `We've experienced an error while adjusting your 'educational/education settings' - please try this action again.`,
                    visibilityTime: 4250,
                    position: "bottom",
                    bottomOffset: -50
                });
            }
        }).catch((err) => {
            console.log(err.message);
        })
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

    const { user } = state;

    return (
        <Fragment>
            <StatusBar translucent={false} backgroundColor={colors.accent} />
            <Header
                title="Educational Data"
                subTitle="Enter Recent Academic Attendance"
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
                style={colorSchemeDark ? { backgroundColor: "#000" } : { backgroundColor: "#fff" }}
                onPressLeft={() => {
                    navigation.goBack();
                }}
            />
            <ParallaxScroll
                headerBackgroundColor={"#fff"}
                height={height}
                style={{ flex: 1 }}
                isHeaderFixed={false}
                parallaxHeight={162.25}
                // headerBackgroundColor={""}
                renderParallaxBackground={({ animatedValue }) => <Image
                    source={require("../../../../../assets/images/custom/books.jpg")}
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
                <ScrollView
                    scrollEventThrottle={8}
                >
                    <SafeAreaView style={colorSchemeDark ? {flex: 1, backgroundColor: "#000" } : {flex: 1, backgroundColor: "#fff"}} edges={['right', 'left', 'bottom']}>
                        <View
                            style={{
                                paddingHorizontal: 20,
                                marginBottom: 20,
                                paddingTop: 15
                            }}
                        >
                            <Text headline semibold blackColor numberOfLines={1}>
                                {t(`Modify your educational exp./settings`)}
                            </Text>
                            <ProfileAuthor
                                image={user !== null ? { uri: `${BASE_ASSET_URL}/${user.profilePictures[user.profilePictures.length - 1].link}` } : Images.profile2}
                                name={user !== null ? user.firstName : "Unknown"}
                                description={user !== null ? `@${user.username}` : "Unknown"}
                                textRight={user !== null ? `Born ${moment(user.birthdateRaw).format("YYYY")}` : "Unknown"}
                                style={{ marginTop: 20 }}
                            />
                            <View style={styles.hrGrey} />
                            <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : [styles.labeled, { color: "#000" }]}>Where did you go to school?</Text>
                            <TextInput
                                style={[BaseStyle.textInput, { marginTop: 12.25 }]}
                                autoCorrect={false}
                                placeholder={"Asheville-Buncome Community College"}
                                placeholderTextColor={"#909090"}
                                value={state.schoolName}
                                maxLength={100}
                                onChangeText={value => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            schoolName: value
                                        }
                                    })
                                }}
                                selectionColor={colors.primary}
                            />
                            <View style={styles.hrGrey} />
                            <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : [styles.labeled]}>Please the <Text style={{ color: colors.primary, fontWeight: "bold" }}>START YEAR</Text> of attendance</Text>
                            <RNPickerSelect 
                                onValueChange={(value) => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            startedYear: value
                                        }
                                    })
                                }}
                                useNativeAndroidPickerStyle={false}
                                style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}
                                items={state.years}
                                textInputProps={{ color: colors.accent, paddingVertical: 15, minHeight: 47.25, height: 47.25 }}
                            />
                            <View style={styles.hrGrey} />
                            <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : [styles.labeled]}>Please the <Text style={{ color: colors.primary, fontWeight: "bold" }}>END YEAR</Text> of graduation or attendance</Text>
                            <RNPickerSelect 
                                onValueChange={(value) => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            endingYear: value
                                        }
                                    })
                                }}
                                useNativeAndroidPickerStyle={false}
                                style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}
                                items={state.years}
                                textInputProps={{ color: colors.accent, paddingVertical: 15, minHeight: 47.25, height: 47.25 }}
                            />
                            <View style={styles.hrGrey} />
                            <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : [styles.labeled]}>Please select the <Text style={{ color: colors.primary, fontWeight: "bold" }}>location</Text> of the attended school</Text>
                            <RNPickerSelect 
                                onValueChange={(value) => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            locationState: value
                                        }
                                    })
                                }}
                                items={state.states}
                                useNativeAndroidPickerStyle={false}
                                style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}
                                textInputProps={{ color: colors.accent, paddingVertical: 15, minHeight: 47.25, height: 47.25 }}
                            />
                            <View style={styles.hrGrey} />
                            <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : [styles.labeled]}>Please select the <Text style={{ color: colors.primary, fontWeight: "bold" }}>degree aquired</Text> (if applicable)</Text>
                            <RNPickerSelect 
                                onValueChange={(value) => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            degreeAquired: value
                                        }
                                    })
                                }}
                                items={degreeOptions}
                                useNativeAndroidPickerStyle={false}
                                style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}
                                textInputProps={{ color: colors.accent, paddingVertical: 15, minHeight: 47.25, height: 47.25 }}
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
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {})(EducationalDataChanger);