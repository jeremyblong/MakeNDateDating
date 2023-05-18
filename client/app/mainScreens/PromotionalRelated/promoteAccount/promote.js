import React, { Fragment, useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Image, ScrollView } from "react-native";
import { Text, Icon, Header, PackageItem, Button } from "@components";
import { useNavigation } from "@react-navigation/native";
import { useTheme, BaseColor, Images } from '@config'; 
import styles from "./promoteStyles.js";
import Dialog from "react-native-dialog";
import axios from "axios";		
import { connect } from "react-redux";
import { BASE_URL } from "@env";
import _ from "lodash";
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';

const PromoteAccountPersonal = ({ authData }) => {

    const navigation = useNavigation();
    const { colors } = useTheme();

    const [ state, setState ] = useState({
        showDialog: false,
        tier: null,
        loading: false
    })

    const handlePurchase = () => {
        console.log("handlePurchase clicked/ran....");

        const { tier } = state;

        const config = {
            uniqueId: authData.uniqueId,
            tier
        }

        setState(prevState => {
            return {
                ...prevState,
                loading: true
            }
        })
    
        axios.post(`${BASE_URL}/boost/account/promote/tiered`, config).then((res) => {
            if (res.data.message === "Submitted promoted/boosted account!") {
                console.log("resdata", res.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })

                Toast.show({
                    type: 'success',
                    text1: 'Successfully boosted your account!',
                    visibilityTime: 3250,
                    position: "bottom",
                    onHide: () => {
                        navigation.replace("BottomTabNavigator", { screen: "Home" });
                    }
                });
            } else if (res.data.message === "You do NOT have enough tokens/coins available in your in-app balance...") {

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })

                Toast.show({
                    type: 'error',
                    text1: 'You do NOT have enough in-app tokens! Purchase more...',
                    text2: res.data.message,
                    visibilityTime: 3250,
                    position: "bottom" 
                });
            } else {
                console.log("errrorrrrrr", res.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })

                Toast.show({
                    type: 'error',
                    text1: 'An error occurred while attempting to process your request...',
                    text2: "We've encountered an error while attempting to process your request - please try again or contact support if the problem persists!",
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
            
            Toast.show({
                type: 'error',
                text1: 'An error occurred while attempting to process your request...',
                text2: "We've encountered an error while attempting to process your request - please try again or contact support if the problem persists!",
                visibilityTime: 3250,
                position: "bottom" 
            });
        })

        setState(prevState => {
            return {
                ...prevState,
                tier: null,
                showDialog: false
            }
        })
    }

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 50, flexGrow: 1 }}>
            <Dialog.Container visible={state.showDialog}>
		      <Dialog.Title>Are you sure you'd like to purchase this upgrade/tier?</Dialog.Title>
			      <Dialog.Description>
			        We will purchase/activate your boost if you choose to purchase this - keep in mind, one boost will be used immediately and any others will be saved for later!
			      </Dialog.Description>
			      <Dialog.Button onPress={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            tier: null,
                            showDialog: false
                        }
                    })
                  }} label="Cancel.." />
		      	<Dialog.Button onPress={handlePurchase} label="Purchase!" />
		    </Dialog.Container>
            <Spinner
                visible={state.loading}
                textContent={'Purchasing/Loading...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor={"rgba(0, 0, 0, 0.725)"}
            />
            <Header
                title={"Individual Promotion"}
                subTitle="Promote your individual account"
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
            <View style={styles.container}>
                <Text style={styles.label}>These are the various 'boost' options available to our clients. These will give you a competitive advantage over other normal user's not capitalizing on these perks...{"\n"}{"\n"}Simply select a boost and proceed with the payment - your benifits will then be active (ONE boost is automatically used - all others are saved/reserved for later use)</Text>
                <PackageItem
                    packageName={"Standard Profile Boost"}
                    price={"40"}
                    detail
                    type={"in-app tokens"}
                    description={"This will BOOST your account for a set period of time (see notes below). This allows your profile to be MORE visible and public leading to more connections/matches. Use your earned tokens to purchase more visibility amoung other advantages/features!"}
                    onPressIcon={() => {
                       
                    }}
                    services={[{
                        desc: "Your profile will be drastically more visible for approx 1 hour (60 minutes) at which it will then revert back to normal visibility", 
                        name: "1 Hour Profile Boost"
                    }, {
                        desc: "You will also recieve 'super message requests' which are PRIORITY message requests when you want to REALLY STAND OUT from the competition. These are inboxed in a specific/seperate message thread/area.", 
                        name: "3 Extra Super Message Request(s)"
                    }]}
                    onPress={() => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                tier: 1,
                                showDialog: true
                            }
                        })
                    }}
                    style={{marginBottom: 10}}
                />
                <PackageItem
                    packageName={"Step-Up Profile Boost"}
                    price={"100"}
                    detail
                    type={"in-app tokens"}
                    description={"This will BOOST your account for a set period of time (see notes below). This allows your profile to be MORE visible and public leading to more connections/matches. Use your earned tokens to purchase more visibility amoung other advantages/features!"}
                    onPressIcon={() => {
                       
                    }}
                    services={[{
                        desc: "Your profile will be drastically more visible for approx 1 hour (120 minutes) at which it will then revert back to normal visibility. You will recieve TWO of these boosts (One will be applied immediately)...", 
                        name: "TWO (2) 1 Hour Profile Boosts"
                    }, {
                        desc: "You will also recieve indication 'likes/pokes' which will nudge another user that you're interested in potentially speaking or getting to know eachother...", 
                        name: "5 Super 'Likes' Indicating interest"
                    }, {
                        desc: "You will also recieve 'super message requests' which are PRIORITY message requests when you want to REALLY STAND OUT from the competition. These are inboxed in a specific/seperate message thread/area.", 
                        name: "5 Extra Super Message Request(s)"
                    }]}
                    onPress={() => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                tier: 2,
                                showDialog: true
                            }
                        })
                    }}
                    style={{marginBottom: 10}}
                />
                <PackageItem
                    packageName={"Maxed-Out Profile Boost!"}
                    price={"140"}
                    detail
                    type={"in-app tokens"}
                    description={"This will BOOST your account for a set period of time (see notes below). This allows your profile to be MORE visible and public leading to more connections/matches. Use your earned tokens to purchase more visibility amoung other advantages/features!"}
                    onPressIcon={() => {
                       
                    }}
                    services={[{
                        desc: "Your profile will be drastically more visible for approx 1 hour (120 minutes) at which it will then revert back to normal visibility. You will recieve THREE of these boosts (One will be applied immediately)...", 
                        name: "THREE (3) 1 Hour Profile Boosts"
                    }, {
                        desc: "You will also recieve indication 'likes/pokes' which will nudge another user that you're interested in potentially speaking or getting to know eachother...", 
                        name: "10 Super 'Likes' Indicating interest"
                    }, {
                        desc: "You will also recieve 'super message requests' which are PRIORITY message requests when you want to REALLY STAND OUT from the competition. These are inboxed in a specific/seperate message thread/area.", 
                        name: "8 Extra Super Message Request(s)"
                    }]}
                    onPress={() => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                tier: 3,
                                showDialog: true
                            }
                        })
                    }}
                    style={{marginBottom: 10}}
                />
            </View>
        </ScrollView>
    );
} 
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {  })(PromoteAccountPersonal);