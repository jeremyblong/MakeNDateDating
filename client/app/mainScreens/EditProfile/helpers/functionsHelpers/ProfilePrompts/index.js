import React, { useState, useRef, Fragment, useCallback } from "react";
import { View, TouchableOpacity, ScrollView, Image, Dimensions, FlatList, StatusBar, TextInput } from "react-native";
import _ from "lodash";
import { connect } from "react-redux"; 
import axios from "axios";
import { BASE_URL } from "@env";
import styles from "./indexStyles.js";
import { useNavigation } from "@react-navigation/native";
import {BaseColor, Images, useTheme} from '@config';
import { BASE_ASSET_URL } from "@env";
import { useFocusEffect } from '@react-navigation/native';
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
import moment from 'moment';
import Toast from "react-native-toast-message";
import RBSheet from "react-native-raw-bottom-sheet";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
                         
const primaryColor = "#D81159";
const backColor = "#eee";

const selectableOptions = ["What makes a relationship great is...", "A non-negotiable...", "Something I learned way later than I should've was...", "My friend once said I was...", "My personal 'best life' is...", "My personal life-low was...", "My personal life-high was when...", "The quickest way to my heart is...", "Old dating traditions are out, my new tradition is...", "I find the most joy in...", "My favorite quality/qualities in a person are...", "I'm hoping you...", "Match with me if you...", "I guarentee you that...", "A pro & a con about me are...", "I'd like to travel to...", "I'm still not over...", "If I could have a superpower, it'd be...", "My real-life superpower is...", "I'm a great +1 because...", "I'm absolutely obsessed with...", "Let's break dating stereotypes by...", "It's meant to be if...", "Two truths & one lie...", "I quote too much from...", "I'm known most for being...", "The world would be a better place with...", "We'll get along if...", "As a child, I was really..", "I will never shutup about...", "My most useless skill is...", "I promise I won't judge if you...", "My perfect date is...", "After work, you can find me..."];

const { width, height } = Dimensions.get("window");

const ProfilePromptsEditModify = ({ userData }) => {

    const rbSheetRef = useRef(null);
    const textInput = useRef(null);
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const navigation = useNavigation();
    const {t} = useTranslation();
    const [ current, setCurrent ] = useState(null);
    const [ selected, setSelected ] = useState(null);
    const [ completedPrompts, setCompletedPrompts ] = useState([]);
    const [ answer, setAnswer ] = useState("");
    const [ ready, setReady ] = useState(false);
    const [ index, setIndex ] = useState(null);
    const [ meetups, setMeetups ] = useState([]);
    
    const calculateDisabled = () => {
        if (typeof completedPrompts !== "undefined" && completedPrompts.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    console.log("completedPrompts", completedPrompts.length);

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
        
                    setCompletedPrompts(_.has(user, "coreProfileData") && _.has(user.coreProfileData, "aboutPrompts") ? user.coreProfileData.aboutPrompts : []);

                    setReady(true);
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

                    setMeetups(shuffled.slice(0, 5));
                } else {
                    console.log("Err", res.data);
                }
            }).catch((err) => {
                console.log(err.message);
            })
    }, []));

    const handleSubmission = () => {
        const config = {
            uniqueId: userData.uniqueId,
            selectedValue: {
                completedPrompts
            },
            field: "profilePromptData",
            accountType: userData.accountType
        }

        axios.post(`${BASE_URL}/adjust/profile/data`, config).then((res) => {
            if (res.data.message === "Successfully executed desired logic!") {
                console.log("resdata", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully adjusted your 'prompt/prompts'.`,
                    text2: `We've successfully uploaded your 'prompt/prompts' properly - you new data is now live!`,
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
                    text2: `We've experienced an error while adjusting your 'prompt/prompts' - please try this action again.`,
                    visibilityTime: 4250,
                    position: "bottom",
                    bottomOffset: -50
                });
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    const handleSubmissionAdditionalPrompt = () => {
        console.log("index", index);

        const matchingIndex = completedPrompts.findIndex((data) => data.selected === selected);

        if (index !== null) {
            setCompletedPrompts(prevState => {
                prevState[matchingIndex] = {
                    answer,
                    selected
                };
                return prevState;
            });
            rbSheetRef.current.close();
            setSelected(null);
            setIndex(null);
            setAnswer("");  
        } else {
            setCompletedPrompts(prevState => [{
                answer,
                selected
            }, ...prevState])
            rbSheetRef.current.close();
            setSelected(null)
            setAnswer("");  
        }
    }

    const renderItem = ({ item, index }) => {
        if (selected === null) {
            return (
                <TouchableOpacity onPress={() => setSelected(item)} style={styles.fullwidthTextContainer}>
                    <Text style={styles.innerTextCustom}>{item}</Text>
                </TouchableOpacity>
            );
        } else {
            if (selected === item) {
                return (
                    <Fragment>
                        <View style={styles.fullwidthTextContainerLarger}>
                            <Text style={styles.innerTextCustomLarger}>{item}</Text>
                            <TextInput
                                style={styles.customTextInput}
                                ref={textInput}
                                value={answer}
                                multiline={true}
                                numberOfLines={12}
                                placeholderTextColor={"#fff"}
                                textColor={"#fff"}
                                contentContainerStyle={{ paddingTop: 22.25, maxHeight: 275 }}
                                placeholder={"Tell us..."}
                                onChangeText={(value) => {
                                    setAnswer(value)
                                }}
                            />
                        </View>
                        <View style={styles.leftAbsolute}>
                            <TouchableOpacity onPress={() => {
                                setSelected(null)
                                setAnswer("");    
                            }}>
                                <Text style={{ fontWeight: "bold", color: "red", textAlign: "center", fontSize: 20 }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rightAbsolute}>
                            <TouchableOpacity onPress={() => handleSubmissionAdditionalPrompt()}>
                                <Text style={{ fontWeight: "bold", color: "#00AD0D", textAlign: "center", fontSize: 20 }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </Fragment>
                );
            }
        }
    }

    const renderFooterComponent = () => {
        return (
            <Fragment>

            </Fragment>
        );
    }

    const renderSelectedPrompts = () => {
        if (ready) {
            switch (completedPrompts.length) {
                case 3:
                    return (
                        <Fragment>
                            {typeof completedPrompts !== "undefined" && completedPrompts.length > 0 ? completedPrompts.map((item, index) => {
                                return (
                                    <Fragment>
                                        <TouchableOpacity onPress={() => {
                                            setSelected(item.selected);
                                            setIndex(index);
                                            rbSheetRef.current.open();
                                        }} style={styles.wrapperSelectableLarger}>
                                            <View style={styles.row}>
                                                <View style={styles.smallestCol}>
                                                    <Image
                                                        source={index === 0 ? require("../../../../../assets/icons/1.png") : index === 1 ? require("../../../../../assets/icons/2.png") : require("../../../../../assets/icons/3.png")}
                                                        style={colorSchemeDark ? [styles.numberIcon, { tintColor: "#fff" }] : styles.numberIcon}
                                                    />
                                                </View>
                                                <View style={styles.largestCol}>
                                                    <Text style={styles.topText}>{item.selected}</Text>
                                                    <Text style={styles.bottomText}>{item.answer}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Fragment>
                                );
                            }) : null}
                        </Fragment>
                    );
                    break;
                case 2:
                    return (
                        <Fragment>
                            <TouchableOpacity onPress={() => {
                                setCurrent(1);
                                rbSheetRef.current.open();
                            }} style={styles.wrapperSelectable}>
                                <View style={styles.row}>
                                    <View style={styles.smallestCol}>
                                        <Image
                                            source={require("../../../../../assets/icons/1.png")}
                                            style={colorSchemeDark ? [styles.numberIcon, { tintColor: "#fff" }] : styles.numberIcon}
                                        />
                                    </View>
                                    <View style={styles.largestCol}>
                                        <Text style={styles.topText}>Select a question/prompt</Text>
                                        <Text style={styles.bottomText}>You have NOT selected a prompt/answer yet for this tier...</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {typeof completedPrompts !== "undefined" && completedPrompts.length > 0 ? completedPrompts.map((item, index) => {
                                return (
                                    <Fragment>
                                        <TouchableOpacity onPress={() => {
                                            setSelected(item.selected);
                                            setIndex(index);
                                            rbSheetRef.current.open();
                                        }} style={styles.wrapperSelectableLarger}>
                                            <View style={styles.row}>
                                                <View style={styles.smallestCol}>
                                                    <Image
                                                        source={index === 0 ? require("../../../../../assets/icons/2.png") : require("../../../../../assets/icons/3.png")}
                                                        style={colorSchemeDark ? [styles.numberIcon, { tintColor: "#fff" }] : styles.numberIcon}
                                                    />
                                                </View>
                                                <View style={styles.largestCol}>
                                                    <Text style={styles.topText}>{item.selected}</Text>
                                                    <Text style={styles.bottomText}>{item.answer}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Fragment>
                                );
                            }) : null}
                        </Fragment>
                    );
                    break;
                case 1:
                    return (
                        <Fragment>
                            <TouchableOpacity onPress={() => {
                                setCurrent(1);
                                rbSheetRef.current.open();
                            }} style={styles.wrapperSelectable}>
                                <View style={styles.row}>
                                    <View style={styles.smallestCol}>
                                        <Image
                                            source={require("../../../../../assets/icons/1.png")}
                                            style={colorSchemeDark ? [styles.numberIcon, { tintColor: "#fff" }] : styles.numberIcon}
                                        />
                                    </View>
                                    <View style={styles.largestCol}>
                                        <Text style={styles.topText}>Select a question/prompt</Text>
                                        <Text style={styles.bottomText}>You have NOT selected a prompt/answer yet for this tier...</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setCurrent(2);
                                rbSheetRef.current.open();
                            }} style={styles.wrapperSelectable}>
                                <View style={styles.row}>
                                    <View style={styles.smallestCol}>
                                        <Image
                                            source={require("../../../../../assets/icons/2.png")}
                                            style={colorSchemeDark ? [styles.numberIcon, { tintColor: "#fff" }] : styles.numberIcon}
                                        />
                                    </View>
                                    <View style={styles.largestCol}>
                                        <Text style={styles.topText}>Select a question/prompt</Text>
                                        <Text style={styles.bottomText}>You have NOT selected a prompt/answer yet for this tier...</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {typeof completedPrompts !== "undefined" && completedPrompts.length > 0 ? completedPrompts.map((item, index) => {
                                return (
                                    <Fragment>
                                        <TouchableOpacity onPress={() => {
                                            setSelected(item.selected);
                                            setIndex(index);
                                            rbSheetRef.current.open();
                                        }} style={styles.wrapperSelectableLarger}>
                                            <View style={styles.row}>
                                                <View style={styles.smallestCol}>
                                                    <Image
                                                        source={require("../../../../../assets/icons/3.png")}
                                                        style={colorSchemeDark ? [styles.numberIcon, { tintColor: "#fff" }] : styles.numberIcon}
                                                    />
                                                </View>
                                                <View style={styles.largestCol}>
                                                    <Text style={styles.topText}>{item.selected}</Text>
                                                    <Text style={styles.bottomText}>{item.answer}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Fragment>
                                );
                            }) : null}
                        </Fragment>
                    );
                    break;
                case 0:
                    return (
                        <Fragment>
                            <TouchableOpacity onPress={() => {
                                setCurrent(1);
                                rbSheetRef.current.open();
                            }} style={styles.wrapperSelectable}>
                                <View style={styles.row}>
                                    <View style={styles.smallestCol}>
                                        <Image
                                            source={require("../../../../../assets/icons/1.png")}
                                            style={colorSchemeDark ? [styles.numberIcon, { tintColor: "#fff" }] : styles.numberIcon}
                                        />
                                    </View>
                                    <View style={styles.largestCol}>
                                        <Text style={styles.topText}>Select a question/prompt</Text>
                                        <Text style={styles.bottomText}>You have NOT selected a prompt/answer yet for this tier...</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setCurrent(2);
                                rbSheetRef.current.open();
                            }} style={styles.wrapperSelectable}>
                                <View style={styles.row}>
                                    <View style={styles.smallestCol}>
                                        <Image
                                            source={require("../../../../../assets/icons/2.png")}
                                            style={colorSchemeDark ? [styles.numberIcon, { tintColor: "#fff" }] : styles.numberIcon}
                                        />
                                    </View>
                                    <View style={styles.largestCol}>
                                        <Text style={styles.topText}>Select a question/prompt</Text>
                                        <Text style={styles.bottomText}>You have NOT selected a prompt/answer yet for this tier...</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setCurrent(3);
                                rbSheetRef.current.open();
                            }} style={styles.wrapperSelectable}>
                                <View style={styles.row}>
                                    <View style={styles.smallestCol}>
                                        <Image
                                            source={require("../../../../../assets/icons/2.png")}
                                            style={colorSchemeDark ? [styles.numberIcon, { tintColor: "#fff" }] : styles.numberIcon}
                                        />
                                    </View>
                                    <View style={styles.largestCol}>
                                        <Text style={styles.topText}>Select a question/prompt</Text>
                                        <Text style={styles.bottomText}>You have NOT selected a prompt/answer yet for this tier...</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Fragment>
                    );
                    break;
                default:
                    break;
            }
        } else {
            return (
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
                </View>
            );
        }
    };

    return (
        <Fragment>
            <StatusBar translucent={false} backgroundColor={colors.accent} />
            <Header
                title="Profile Prompt's"
                subTitle={"Edit W/Your Responses..."}
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
                    source={require("../../../../../assets/images/custom/freshstart.jpg")}
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
                    scrollEventThrottle={8
                }>
                    <SafeAreaView style={colorSchemeDark ? {flex: 1, backgroundColor: "#000" } : {flex: 1, backgroundColor: "#fff" }} edges={['right', 'left', 'bottom']}>
                        <View
                        style={{
                            paddingHorizontal: 20,
                            marginBottom: 20,
                            marginTop: 10
                        }}>
                            <Text headline semibold blackColor numberOfLines={1}>
                                {t(`Manage your profile 'prompts' giving other users a quick way to get to know who you are`)}
                            </Text>
                            <ProfileAuthor
                                image={userData !== null ? { uri: `${BASE_ASSET_URL}/${userData.profilePictures[userData.profilePictures.length - 1].link}` } : Images.profile2}
                                name={userData !== null ? userData.firstName : "Unknown"}
                                description={userData !== null ? `@${userData.username}` : "Unknown"}
                                textRight={userData !== null ? `Born ${moment(userData.birthdateRaw).format("YYYY")}` : "Unknown"}
                                style={{ marginTop: 20 }}
                            />
                            <View style={styles.hrGrey} />
                            <Text style={[styles.labeled, { fontSize: 22.25, color: colors.accent }]}>Profile Prompt's</Text>
                            <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : styles.labeled}>Make your personality stand-out from the crowd</Text>
                            {renderSelectedPrompts()}
                            <View style={styles.hrGrey} />
                            <Button style={calculateDisabled() ? { backgroundColor: "lightgrey" } : { backgroundColor: colors.primary }} disabled={calculateDisabled()} full onPress={() => handleSubmission()}> 
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
            </ParallaxScroll>
            <RBSheet
                ref={rbSheetRef}
                height={height}
                openDuration={250}
                closeOnDragDown={false}
                customStyles={{
                    draggableIcon: {
                        minWidth: width * 0.625
                    }
                }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Button full outline onPress={() => rbSheetRef.current.close()}>
                        Close/Cancel
                    </Button>
                    <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 225 }} keyboardShouldPersistTaps='always'>
                        <View style={{ margin: 12.25 }}>
                            <View style={styles.centered}>
                                <Image style={styles.toppedIcon} source={require("../../../../../assets/icons/quotes.png")} />
                            </View>
                            <Text style={{ fontSize: 23.25, color: primaryColor, marginBottom: 17.25, textAlign: "center", fontWeight: "bold" }}>Select a question/opener!</Text>
                            <Text style={{ fontSize: 20, color: "#000", textAlign: "center" }}>Max out the personality that shines through your profile enticing other's to connect with you!</Text>
                            <View style={styles.hr} />
                            <FlatList
                                contentContainerStyle={styles.selectableList}
                                data={selectableOptions}
                                style={{ flexGrow: 1 }}
                                keyExtractor={(item) => item}
                                renderItem={renderItem}
                                ListFooterComponent={renderFooterComponent}
                                horizontal={false}
                                showsVerticalScrollIndicator={true}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                </ScrollView>
            </RBSheet>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {})(ProfilePromptsEditModify);