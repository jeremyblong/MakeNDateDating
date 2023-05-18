import React, { useState, useCallback, Fragment } from "react";
import { View, TouchableOpacity, ScrollView, useColorScheme, StatusBar, Image, Dimensions } from "react-native";
import _ from "lodash";
import { connect } from "react-redux"; 
import axios from "axios";
import { BASE_URL } from "@env";
import styles from "./numOfChildrenStyles.js";
import { useNavigation } from "@react-navigation/native";
import { Images, BaseColor, useTheme} from '@config';
import { BASE_ASSET_URL } from "@env";
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

const NumberOfChildrenHelperComponent = (props) => {

    const userData = props.userData;
    const navigation = useNavigation();
    const {colors, theme} = useTheme();
    const {t} = useTranslation();
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        user: null,
        meetups: [],
        numberOfFullTimeChildren: 0,
        numberOfPartialCustody: 0
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

    const handleSubmisison = () => {
        console.log("handleSubmisison clicked/ran...");

        const {
            numberOfFullTimeChildren,
            numberOfPartialCustody
        } = state;

        const config = {
            uniqueId: props.userData.uniqueId,
            selectedValue: {
                numberOfFullTimeChildren,
                numberOfPartialCustody
            },
            field: "numberOfChildren",
            accountType: props.userData.accountType
        }

        axios.post(`${BASE_URL}/adjust/profile/data`, config).then((res) => {
            if (res.data.message === "Successfully executed desired logic!") {
                console.log("resdata", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully adjusted your 'hair-color settings'.`,
                    text2: `We've successfully uploaded your 'hair-color settings' properly - you new data is now live!`,
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
                    text2: `We've experienced an error while adjusting your 'hair-color settings' - please try this action again.`,
                    visibilityTime: 4250,
                    position: "bottom",
                    bottomOffset: -50
                });
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    const { user } = state;

    const calculateDisabled = () => {
        if (state.numberOfFullTimeChildren !== 0 || state.numberOfPartialCustody !== 0) {
            return false;
        } else {
            return true;
        }
    }
    return (
        <Fragment>
            <Header
                title={"Children Selection"}
                subTitle="Children (Custody) Count..."
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
                renderParallaxBackground={({ animatedValue }) => <Image
                    source={require("../../../../../assets/images/custom/children.jpg")}
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
                        <SafeAreaView style={colorSchemeDark ? {flex: 1, backgroundColor: "#000" } : {flex: 1, backgroundColor: "#fff"}} edges={['right', 'left', 'bottom']}>
                            <View
                            style={{
                                paddingHorizontal: 20,
                                marginBottom: 20,
                                marginTop: 10
                            }}>
                                <Text headline semibold blackColor numberOfLines={1}>
                                    {t(`Modify/Select your custody/children situation...`)}
                                </Text>
                                <ProfileAuthor
                                    image={user !== null ? { uri: `${BASE_ASSET_URL}/${user.profilePictures[user.profilePictures.length - 1].link}` } : Images.profile2}
                                    name={user !== null ? user.firstName : "Unknown"}
                                    description={user !== null ? `@${user.username}` : "Unknown"}
                                    textRight={user !== null ? `Born ${moment(user.birthdateRaw).format("YYYY")}` : "Unknown"}
                                    style={{ marginTop: 20 }}
                                />
                                <View style={styles.hrGrey} />
                                <View style={{padding: 20}}>
                                    <Text style={styles.label}>You need to select how many children (if any children) that you have partial & full-custody. This helps our user's get a better deep understanding of their potential partner's and their lifestyle...</Text>
                                    <Text headline semibold>
                                    {t(`Children (Custody Full/Partial)`).toUpperCase()}
                                    </Text>
                                    <View style={styles.contentQuest}>
                                    <View style={styles.lineRow}>
                                        <View>
                                        <Text body1>{t('child (full-custody)')}</Text>
                                        <Text caption1 grayColor>
                                            {t('Aged up-to 18')}
                                        </Text>
                                        </View>
                                        <View style={styles.iconRight}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setState(prevState => {
                                                    return {
                                                        ...prevState,
                                                        numberOfFullTimeChildren: state.numberOfFullTimeChildren - 1 > 0 ? state.numberOfFullTimeChildren - 1 : 0
                                                    }
                                                })
                                            }}>
                                            <Icon
                                                name="minus-circle"
                                                size={24}
                                                color={BaseColor.grayColor}
                                            />
                                        </TouchableOpacity>
                                        <Text title1>{state.numberOfFullTimeChildren}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setState(prevState => {
                                                    return {
                                                        ...prevState,
                                                        numberOfFullTimeChildren: state.numberOfFullTimeChildren + 1
                                                    }
                                                })
                                            }}>
                                            <Icon name="plus-circle" size={24} color={colors.primary} />
                                        </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.lineRow}>
                                        <View>
                                        <Text body1>{t('child (partial-custody)')}</Text>
                                        <Text caption1 grayColor>
                                            {t('Aged up-to 18')}
                                        </Text>
                                        </View>
                                        <View style={styles.iconRight}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setState(prevState => {
                                                    return {
                                                        ...prevState,
                                                        numberOfPartialCustody: state.numberOfPartialCustody - 1 > 0 ? state.numberOfPartialCustody - 1 : 0
                                                    }
                                                })
                                            }}>
                                            <Icon
                                            name="minus-circle"
                                            size={24}
                                            color={BaseColor.grayColor}
                                            />
                                        </TouchableOpacity>
                                        <Text title1>{state.numberOfPartialCustody}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setState(prevState => {
                                                    return {
                                                        ...prevState,
                                                        numberOfPartialCustody: state.numberOfPartialCustody + 1
                                                    }
                                                })
                                            }}>
                                            <Icon name="plus-circle" size={24} color={colors.primary} />
                                        </TouchableOpacity>
                                        </View>
                                    </View>
                                    </View>
                                </View>
                                <View style={styles.hrGrey} />
                                <Button onPress={() => handleSubmisison()} style={calculateDisabled() ? { backgroundColor: "lightgrey" } : { backgroundColor: colors.accent }} disabled={calculateDisabled()}>
                                    {"Submit Your Selection"}
                                </Button>
                                {/* <View
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
                                </View> */}
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
export default connect(mapStateToProps, {})(NumberOfChildrenHelperComponent);