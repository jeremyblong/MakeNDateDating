import React, { useState, useCallback, Fragment } from "react";
import { View, TouchableOpacity, ScrollView, Image, Dimensions, TextInput as CustomTextInput, Linking } from "react-native";
import _ from "lodash";
import { connect } from "react-redux"; 
import axios from "axios";
import { BASE_URL } from "@env";
import styles from "./selectMusicAnthemStyles.js";
import { useNavigation } from "@react-navigation/native";
import { BaseColor, Images, useTheme } from '@config';
import { BASE_ASSET_URL } from "@env";
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
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
import SearchableDropdown from 'react-native-searchable-dropdown';

const { width, height } = Dimensions.get("window");

const items = [
    {"id": 1, "name": "Beyoncé"},
    {"id": 2, "name": "Drake"},
    {"id": 3, "name": "Taylor Swift"},
    {"id": 4, "name": "Ed Sheeran"},
    {"id": 5, "name": "Adele"},
    {"id": 6, "name": "Kanye West"},
    {"id": 7, "name": "Eminem"},
    {"id": 8, "name": "Bruno Mars"},
    {"id": 9, "name": "Rihanna"},
    {"id": 10, "name": "Post Malone"},
    {"id": 11, "name": "Justin Bieber"},
    {"id": 12, "name": "Ariana Grande"},
    {"id": 13, "name": "The Weeknd"},
    {"id": 14, "name": "Kendrick Lamar"},
    {"id": 15, "name": "Lady Gaga"},
    {"id": 16, "name": "Maroon 5"},
    {"id": 17, "name": "Michael Jackson"},
    {"id": 18, "name": "Whitney Houston"},
    {"id": 19, "name": "Prince"},
    {"id": 20, "name": "Bob Dylan"},
    {"id": 21, "name": "The Beatles"},
    {"id": 22, "name": "Led Zeppelin"},
    {"id": 23, "name": "Queen"},
    {"id": 24, "name": "Pink Floyd"},
    {"id": 25, "name": "Elton John"},
    {"id": 26, "name": "David Bowie"},
    {"id": 27, "name": "Stevie Wonder"},
    {"id": 28, "name": "Madonna"},
    {"id": 29, "name": "Bob Marley"},
    {"id": 30, "name": "Nirvana"}
]

const MusicAnthemMainProfileEditHelper = ({ userData }) => {

    const navigation = useNavigation();
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const {t} = useTranslation();

    const [ state, setState ] = useState({
        searchingQuery: "",
        selected: null,
        meetups: [],
        isKeyboardVisible: true,
        description: "",
        user: null,
        data: [],
        page: 1,
        authorizeURL: "",
        showWebview: false
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
        
                    setState(prevState => {
                        return {
                            ...prevState,
                            meetups
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

    const renderConditionalMainContent = () => {
        if (state.page === 1) {
            return (
                <Fragment>
                    <Text style={[styles.labeled, { marginBottom: 12.25, color: colors.accent }]}>Click the button below to begin the authorization (spotify) flow to get your spotify information...</Text>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <Text style={[styles.labeled, { marginBottom: 12.25 }]}>Search for a specific artist (any genre)</Text>
                    <SearchableDropdown
                        onItemSelect={(item) => {
                            const items = this.state.selectedItems;
                            items.push(item)
                            // this.setState({ selectedItems: items });
                        }}
                        containerStyle={{ padding: 5 }}
                        onRemoveItem={(item, index) => {
                            const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
                            // this.setState({ selectedItems: items });
                        }}
                        itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            backgroundColor: '#ddd',
                            borderColor: '#bbb',
                            borderWidth: 1,
                            borderRadius: 5
                        }}
                        itemTextStyle={{ color: '#222' }}
                        itemsContainerStyle={{ maxHeight: 140 }}
                        items={items}
                        defaultIndex={2}
                        resetValue={false}
                        textInputProps={
                        {
                            placeholder: "Enter your artist's name...",
                            underlineColorAndroid: "transparent",
                            style: {
                                padding: 12,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 5,
                            },
                            onTextChange: text => alert(text)
                        }
                        }
                        listProps={
                        {
                            nestedScrollEnabled: true,
                        }
                        }
                    />
                </Fragment>
            );
        }
    };

    const initiateSpotifyFlowAuth = () => {
        console.log("initiateSpotifyFlowAuth clicked/ran!");

        const config = {
            uniqueId: userData.uniqueId,
            accountType: userData.accountType
        };

        axios.post(`${BASE_URL}/grant/access/flow/spotify`, config).then((res) => {
            if (res.data.message === "We've successfully enabled your profile's spotify history of recently played 'tracks' or songs! These will now display on your profile for now on...") {
                console.log("resdata authorizeURL request...: ", res.data);

                const { authorizeURL } = res.data;

                console.log("authorizeURL", authorizeURL);

                Linking.canOpenURL(authorizeURL).then(supported => {
                    if (supported) {
                        Linking.openURL(authorizeURL);

                        setTimeout(() => {
                            navigation.replace("BottomTabNavigator", { screen: "Profile" });
                        }, 1250);

                    } else {
                        console.log("Don't know how to open URI: " + authorizeURL);
                    }
                });
            } else {
                console.log("errrorrrrrr", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while processing your request.`,
                    text2: `We've experienced an error initializing the spotify verification flow  - please try this action again.`,
                    visibilityTime: 4250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);

            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while processing your request.`,
            //     text2: `We've experienced an error initializing the spotify verification flow  - please try this action again.`,
            //     visibilityTime: 4250,
            //     position: "bottom"
            // });
        })
    }

    const { user } = state;
    return (
        <View style={{flex: 1}}>
            <Header
                title="Music/Anthem Settings"
                subTitle="Select a song or songs"
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
                parallaxHeight={200}
                // headerBackgroundColor={""}
                renderParallaxBackground={({ animatedValue }) => <Image
                    source={require("../../../../../assets/images/concert.jpg")}
                    style={styles.imgBanner}
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
                    <SafeAreaView style={colorSchemeDark ? {flex: 1, backgroundColor: "#000" } : {flex: 1, backgroundColor: "#fff" }} edges={['right', 'left', 'bottom']}>
                        <View
                            style={{
                                paddingHorizontal: 15
                            }}
                        >
                            <Text headline semibold blackColor numberOfLines={1}>
                                {t(`Music Selection/Anthem (Profile Song)`)}
                            </Text>
                            <ProfileAuthor
                                image={user !== null ? { uri: `${BASE_ASSET_URL}/${user.profilePictures[user.profilePictures.length - 1].link}` } : Images.profile2}
                                name={user !== null ? user.firstName : "Unknown"}
                                description={user !== null ? `@${user.username}` : "Unknown"}
                                textRight={user !== null ? `Born ${moment(user.birthdateRaw).format("YYYY")}` : "Unknown"}
                                style={{ marginTop: 20 }}
                            />
                            <Text body2>
                                To personalize your profile further, you will need to choose a preferred 'anthem' or music track that you believe reflects your character and traits. A list of options is available for you to browse through and select from. It is essential to choose carefully as it will represent you on your profile.
                            </Text>
                            {renderConditionalMainContent()}
                            <View style={styles.hrGrey} />
                            <Fragment>
                                <Button style={{ backgroundColor: BaseColor.greenColor }} full onPress={() => initiateSpotifyFlowAuth()}> 
                                    {t('Activate Spotify History On Profile')}
                                </Button>
                            </Fragment>
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
export default connect(mapStateToProps, {})(MusicAnthemMainProfileEditHelper);