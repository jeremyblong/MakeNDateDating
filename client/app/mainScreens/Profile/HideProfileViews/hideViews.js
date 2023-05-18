import React, { Fragment, useState, useEffect } from "react";
import { View, TouchableOpacity, Image, Dimensions } from "react-native";
import { Text, Icon, Header, Card, Button } from "@components";
import { useNavigation } from "@react-navigation/native";
import styles from "./hideViewsStyles.js";
import { useTheme } from '@config'; 
import Dialog from "react-native-dialog";
import Toast from "react-native-toast-message";
import axios from "axios";
import { BASE_URL } from "@env";
import { connect } from "react-redux";
import _ from "lodash";
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
         

const { width, height } = Dimensions.get("window");

const PayToRemoveProfileViewHistoryHelper = ({ authenticatedData }) => {

    const navigation = useNavigation();
    const { colors, theme } = useTheme();

    const [ state, setState ] = useState({
        tokens: 50,
        showDialog: false,
        alreadySubbed: false,
        ready: false
    });

    useEffect(() => {
        const configuration = {
            params: {
                uniqueId: authenticatedData.uniqueId,
                accountType: authenticatedData.accountType
            }
        };

        axios.get(`${BASE_URL}/check/already/purchased/permission/feature/profile/views`, configuration).then((res) => {
            if (res.data.message === "Successfully gathered!") {
                console.log("Successfully gathered!", res.data);

                const { alreadySubbed } = res.data;

                setState(prevState => {
                    return {
                        ...prevState,
                        alreadySubbed,
                        ready: true
                    }
                })
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
                console.log(err.message);
        
                Toast.show({
                    type: 'error',
                    text1: `An error occurred while processing request.`,
                    text2: "Could NOT fetch purchase upgrade/ability - please try this action again by reloading the page...",
                    visibilityTime: 2375,
                    position: "bottom"
                });
        })
    }, []);

    const purchaseUpgrade = () => {
        console.log("purchaseUpgrade clicked/ran...");

        const config = {
            uniqueId: authenticatedData.uniqueId,
            accountType: authenticatedData.accountType
        }
    
        axios.post(`${BASE_URL}/purchase/hiding/profile/visibility`, config).then((res) => {
            if (res.data.message === "Successfully purchased!") {
                console.log("Successfully purchased!", res.data);
    
                Toast.show({
                    type: 'success',
                    text1: `You've successfully purchased this upgrade to hide your profile views!`,
                    text2: "Your profile views will no longer be visible or public...",
                    visibilityTime: 2375,
                    position: "bottom",
                    onHide: () => {
                        navigation.goBack();
                    }
                });
            } else if (res.data.message === "You do NOT have enough boosts to take this action - please buy more boosts and try again.") {
                Toast.show({
                    type: 'error',
                    text1: `You do NOT have enough boosts to boost!`,
                    text2: res.data.message,
                    visibilityTime: 2375,
                    position: "bottom"
                });
            } else {
                console.log("Err", res.data);
    
                Toast.show({
                    type: 'error',
                    text1: `An error occurred while processing request.`,
                    text2: "Could NOT purchase upgrade/ability - please try this action again...",
                    visibilityTime: 2375,
                    position: "bottom"
                });
            }
        }).catch((err) => {
                console.log(err.message);
        
                Toast.show({
                    type: 'error',
                    text1: `An error occurred while processing request.`,
                    text2: "Could NOT purchase upgrade/ability - please try this action again...",
                    visibilityTime: 2375,
                    position: "bottom"
                });
        })
    }

    const renderContentMain = () => {
        if (state.ready === true) {
            if (state.alreadySubbed === true) {
                return (
                    <Fragment>
                        <View style={styles.container}>
                            <Text style={styles.title}>You've already did the one-time subscription...</Text>
                            <View style={styles.meta}>
                                <Text style={styles.author}>You've already subscribed to this feature! You cannot double subscribe as it is only a one-time event/action.</Text>
                            </View>
                            <Image source={require("../../../assets/images/subemail.png")} style={theme.dark ? [styles.imageCustomized, { borderColor: "#fff" }] : [styles.imageCustomized, { color: "#000" }]} />
                        </View>
                    </Fragment>
                );
            } else {
                return (
                    <Fragment>
                        <View style={styles.container}>
                            <Text style={styles.title}>Hide your views...</Text>
                            <View style={styles.meta}>
                                <Text style={styles.author}>Hide your views when viewing other peoples profile's - an additional level of privacy!</Text>
                            </View>
                            <Image source={require("../../../assets/images/profile-hide.png")} style={theme.dark ? [styles.image, { borderColor: "#fff" }] : [styles.image, { color: "#000" }]} />
                            <Text style={styles.content}>Upgrade your account with the "Hide Views" option to ensure complete privacy while browsing other users' profiles. This feature allows you to prevent others from seeing your profile views, thus providing a secure browsing experience on any profile.</Text>
                            <View style={styles.hr} />
                            <Button
                                outline
                                style={{ borderWidth: 1, borderColor: colors.accent, marginTop: 22.25 }}
                                onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        showDialog: true
                                    }
                                })}
                            >
                                Purchase Upgrade...
                            </Button>
                        </View>
                    </Fragment>
                );
            }
        } else {
            return (
                <Fragment>
                    <View style={{ margin: 12.25, marginTop: 32.25 }}>
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
                </Fragment>
            );
        }
    }

    return (
        <Fragment>
            <Dialog.Container visible={state.showDialog}>
                <Dialog.Title>Are you sure you'd like to purchase this upgrade/ability for {state.tokens} tokens ($10 USD)?</Dialog.Title>
                <Dialog.Description>
                    This will HIDE your profile view's when you view other user's profiles so they cannot see your view when you visit random profiles. Press 'confirm' if you'd like to make this purchase...
                </Dialog.Description>
                <Dialog.Button onPress={() => setState(prevState => {
                    return {
                        ...prevState,
                        showDialog: false
                    }
                })} style={{ color: "darkred" }} label="Cancel.." />
                <Dialog.Button onPress={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            showDialog: false
                        }
                    })
                    purchaseUpgrade();
                }} style={{ color: "green" }} label="Purchase!" />
            </Dialog.Container>
            <Header
                title={"Hide Your View's"}
                subTitle="Hide Who's Profiles You View..."
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
            {renderContentMain()}
        </Fragment>
    );
}

const mapStateToProps = (state) => {
	return {
		authenticatedData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
	}
}
export default connect(mapStateToProps, { })(PayToRemoveProfileViewHistoryHelper);