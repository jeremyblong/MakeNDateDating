import React, { Fragment, useState, useCallback } from "react";
import { Text, Header, Icon } from "@components";
import styles from "./mainScreenStyles.js";
import Toast from "react-native-toast-message";
import _ from "lodash";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@config';
import { View, Image, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { APPROX_VALUE_PER_COIN } from "@env";
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import { BASE_URL } from "@env";
import axios from "axios";
import ConfettiCannon from 'react-native-confetti-cannon';
import { connect } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';
import { ScratchCard } from 'rn-scratch-card'

const { width, height } = Dimensions.get("window");

const imageRewardArr = [{
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/scratch-1.png",
    winner: true,
    credits: Math.round(1 / APPROX_VALUE_PER_COIN)
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/scratch-2.png",
    winner: true,
    credits: Math.round(1.5 / APPROX_VALUE_PER_COIN)
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/scratch-3.png",
    winner: true,
    credits: Math.round(2 / APPROX_VALUE_PER_COIN)
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/scratch-4.png",
    winner: true,
    credits: Math.round(2.25 / APPROX_VALUE_PER_COIN)
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/scratch-5.png",
    winner: true,
    credits: Math.round(2.5 / APPROX_VALUE_PER_COIN)
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/scratch-6.png",
    winner: true,
    credits: Math.round(2.75 / APPROX_VALUE_PER_COIN)
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/scratch-7.png",
    winner: true,
    credits: Math.round(3 / APPROX_VALUE_PER_COIN)
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/scratch-8.png",
    winner: true,
    credits: Math.round(3.25 / APPROX_VALUE_PER_COIN)
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/scratch-9.png",
    winner: true,
    credits: Math.round(3.5 / APPROX_VALUE_PER_COIN)
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}, {
    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
    winner: false,
    credits: 0
}]

const FreeDailyLotterySpin = ({ authData }) => {

    const [ state, setState ] = useState({
        loading: false,
        scrollEnabled: false,
        selected: null,
        showConfetti: false,
        loading: false,
        hide: true,
        scratchAmount: 0
    })

    const { colors, theme } = useTheme();
    const navigation = useNavigation();
    const colorSchemeDark = theme.dark;

    const handleRewardSubmission = () => {
        console.log("handleRewardSubmission clicked/ran...");

        if (state.selected.winner === true) {

            setState(prevState => {
                return {
                    ...prevState,
                    showConfetti: true
                }
            })

            const config = {
                winningItem: state.selected,
                uniqueId: authData.uniqueId,
                firstName: authData.firstName,
                username: authData.username,
                accountType: authData.accountType
            }

            axios.post(`${BASE_URL}/submit/scratcher/reward/points`, config).then((res) => {
                if (res.data.message === "Successfully won lottery!") {
                    console.log(res.data);

                    Toast.show({
                        type: 'success',
                        text1: `YOU WON ${state.selected.credits} tokens!`,
                        visibilityTime: 3250,
                        position: "bottom",
                        onHide: () => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    showConfetti: false
                                }
                            })
                        }
                    });
                } else {
                    console.log("Err", res.data);

                    Toast.show({
                        type: 'success',
                        text1: `YOU WON ${state.selected.credits} tokens but there was an error!`,
                        text2: "You won but there was an error saving the data in the database, please try this action again - you have another free spin/scratch!",
                        visibilityTime: 3250,
                        position: "bottom",
                        onHide: () => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    showConfetti: false
                                }
                            })
                        }
                    });
                }
            }).catch((err) => {
                console.log(err.message);

                Toast.show({
                    type: 'success',
                    text1: `YOU WON ${state.selected.credits} tokens but there was an error!`,
                    text2: "You won but there was an error saving the data in the database, please try this action again - you have another free spin/scratch!",
                    visibilityTime: 3250,
                    position: "bottom",
                    onHide: () => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                showConfetti: false
                            }
                        })
                    }
                });
            })
            
        } else {

            const config = {
                winningItem: state.selected,
                uniqueId: authData.uniqueId,
                firstName: authData.firstName,
                username: authData.username,
                accountType: authData.accountType
            }

            axios.post(`${BASE_URL}/submit/scratcher/reward/points`, config).then((res) => {
                if (res.data.message === "Successfully won lottery!") {
                    console.log(res.data);

                    Toast.show({
                        type: 'error',
                        text1: `You did NOT win...`,
                        text2: `Unfortunately you did not win on this round - please checkin every 24 hours for another roll-of-the-dice!`,
                        visibilityTime: 3250,
                        position: "bottom"
                    });
                } else {
                    console.log("Err", res.data);

                    Toast.show({
                        type: 'error',
                        text1: `You did NOT win...`,
                        text2: `Unfortunately you did not win on this round - please checkin every 24 hours for another roll-of-the-dice!`,
                        visibilityTime: 3250,
                        position: "bottom"
                    });
                }
            }).catch((err) => {
                console.log(err.message);

                // Toast.show({
                //     type: 'error',
                //     text1: `You did NOT win...`,
                //     text2: `Unfortunately you did not win on this round - please checkin every 24 hours for another roll-of-the-dice!`,
                //     visibilityTime: 3250,
                //     position: "bottom"
                // });
            })
        }
    }

    useFocusEffect(
        useCallback(() => {

            const config = {
                winningItem: {
                    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/pexels-shamia-casiano-944737.jpg",
                    winner: false,
                    credits: 0
                },
                uniqueId: authData.uniqueId,
                firstName: authData.firstName,
                username: authData.username
            }
    
            axios.post(`${BASE_URL}/initialize/scrather/daily`, config).then((res) => {
                if (res.data.message === "Successfully initialized lottery!") {
                    console.log(res.data);
    
                    setState(prevState => {
                        return {
                            ...prevState,
                            selected: imageRewardArr[Math.floor(Math.random() * imageRewardArr.length)],
                            hide: false
                        }
                    });
                    
                } else if (res.data.message === "Already used your scratch-off for the day! Come back in 24 hours from you last use...") {
                    Toast.show({
                        type: 'info',
                        text1: `You've already used your daily scratcher!`,
                        text2: `You've already used your once-in-24-hrs promotional scrather/boost - come back later when your current scratcher count expires...`,
                        visibilityTime: 3250,
                        position: "bottom"
                    });
                } else {
                    console.log("Err", res.data);
    
                    setState(prevState => {
                        return {
                            ...prevState,
                            selected: imageRewardArr[Math.floor(Math.random() * imageRewardArr.length)],
                            hide: false
                        }
                    })
                }
            }).catch((err) => {
                console.log(err.message);
    
                setState(prevState => {
                    return {
                        ...prevState,
                        selected: imageRewardArr[Math.floor(Math.random() * imageRewardArr.length)]
                    }
                })
            })
    }, [])); 

    const handleScratch = (scratchData) => {
        console.log("handleScratch clicked/ran... ", scratchData);

        if (Platform.OS === "android") {
            if (scratchData >= 35) {
                setState(prevState => {
                    return {
                        ...prevState,
                        scratchAmount: scratchData
                    }
                })
                // handle reward
                handleRewardSubmission();
            } else {
                setState(prevState => {
                    return {
                        ...prevState,
                        scratchAmount: scratchData
                    }
                })
            }
        } else {
            if (scratchData >= 45) {
                setState(prevState => {
                    return {
                        ...prevState,
                        scratchAmount: scratchData
                    }
                })
                // handle reward
                handleRewardSubmission();
            } else {
                setState(prevState => {
                    return {
                        ...prevState,
                        scratchAmount: scratchData
                    }
                })
            }
        }
    }

    const renderScratcher = () => {
        if (Platform.OS === "ios") {
            return (
                <Fragment>
                    {typeof state.scratchAmount !== "undefined" && state.scratchAmount <= 45 ? <ScratchCard
                        source={require("../../assets/images/scratcher-1.jpeg")} // state.selected.image
                        brushWidth={50}
                        onScratch={handleScratch}
                        style={styles.scratcherViewImageTop}
                        resizeMode={"contain"}
                    /> : <Image source={{ uri: state.selected.image }} resizeMode={"contain"} style={styles.scratcherViewImage} />}
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    {typeof state.scratchAmount !== "undefined" && state.scratchAmount <= 35 ? <ScratchCard
                        source={require("../../assets/images/scratcher-1.jpeg")} // state.selected.image
                        brushWidth={20}
                        onScratch={handleScratch}
                        style={styles.scratcherViewImageTop}
                        resizeMode={"contain"}
                    /> : <Image source={{ uri: state.selected.image }} resizeMode={"contain"} style={styles.scratcherViewImage} />}
                </Fragment>
            );
        }
    }
    
    const renderMapUnauthedCentered = () => {
        return (
            <Fragment>
                <View style={colorSchemeDark ? [styles.containerMiddle, { backgroundColor: "#000" }] : [styles.containerMiddle, { backgroundColor: "#fff" }]}>
                    <View style={colorSchemeDark ? [styles.cardMiddle, { borderColor: "#fff" }] : [styles.cardMiddle, { borderColor: "#000" }]}>
                        <Text style={styles.titleMiddle}>You can only scratch a new card once every 24 hours...</Text>
                        <View style={styles.hr} />
                        <Text style={styles.subTextMiddle}>You will only be allowed a new scratcher card once every 24 hours (once a day) - check back tomorrow to see if you win!</Text>
                        <TouchableOpacity style={[styles.buttonMiddle, { backgroundColor: colors.accent }]} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonTextMiddle}>Go Back...</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Header
                title="Lottery Scratcher"
                subTitle={"Daily free tokens"}
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
            {state.showConfetti ? <ConfettiCannon count={250} origin={{x: -10, y: 0}} /> : null}
            <View style={styles.scratcherView}>
            {state.selected !== null && !state.hide ? <Fragment>{renderScratcher()}</Fragment> : <Fragment>
                    {renderMapUnauthedCentered()}
                    <View style={{ margin: 12.25 }}>
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
                            <PlaceholderLine width={width * 0.225} />
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
                            <PlaceholderLine width={width * 0.225} />
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
                            <PlaceholderLine width={width * 0.225} />
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
                            <PlaceholderLine width={width * 0.225} />
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
                            <PlaceholderLine width={width * 0.225} />
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
                            <PlaceholderLine width={width * 0.225} />
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
                            <PlaceholderLine width={width * 0.225} />
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
                            <PlaceholderLine width={width * 0.225} />
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
                            <PlaceholderLine width={width * 0.225} />
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
                            <PlaceholderLine width={width * 0.225} />
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
                            <PlaceholderLine width={width * 0.225} />
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
                            <PlaceholderLine width={width * 0.225} />
                            <PlaceholderLine width={30} />
                        </Placeholder> 
                    </View>
                </Fragment>}
            </View>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}

export default connect(mapStateToProps, {  })(FreeDailyLotterySpin);