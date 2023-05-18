import React, {useState, useEffect, Fragment, useRef } from 'react';
import { FlatList, View, Dimensions, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { BaseStyle, useTheme, BaseColor } from '@config';
import { Header, SafeAreaView, Icon, Text, Button, Tag } from '@components';
import styles from './viewListMeetupsStyles.js';
import { useNavigation } from '@react-navigation/native';
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import _ from "lodash";
import ActionSheet from 'react-native-actionsheet';
import Dialog from "react-native-dialog";
import Spinner from 'react-native-loading-spinner-overlay';
            
const ViewManagePersonalMeetups = ({ authData }) => {

    const {colors} = useTheme();
    const navigation = useNavigation();
    const actionsheetMeetup = useRef(null);
    const colorSchemeDark = useColorScheme() === "dark" ? true : false;

    const [ state, setState ] = useState({
        meetups: [],
        showDialog: false,
        selectedUser: null,
        showConfirmation: false,
        loading: false
    })
    
    const fetchCommentsToAddProfilePic = (passedComments) => {

        const promises = [];
    
        if (typeof passedComments !== "undefined" && passedComments.length > 0) {
            for (let idxxxxx = 0; idxxxxx < passedComments.length; idxxxxx++) {
                const userDataMapped = passedComments[idxxxxx];
                
                const { sendingID, recievingUserID } = userDataMapped;

                console.log("userDataMapped", userDataMapped) // recievingUserID
    
                promises.push(new Promise((resolve, reject) => {
                    // update comments state
                    const config = {
                        params: {
                            postedByID: sendingID === authData.uniqueId ? recievingUserID : sendingID
                        }
                    };
                    axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
                        if (res.data.message === "Submitted gathered user's picture/file!") {

                            const { user } = res.data; 
    
                            userDataMapped["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
    
                            resolve(userDataMapped);
                        } else {
    
                            userDataMapped["lastProfilePic"] = null;
    
                            resolve(userDataMapped);
                        }
                    }).catch((err) => {
                        userDataMapped["lastProfilePic"] = null;
    
                        resolve(userDataMapped);
                    })
                }));
            };
    
            Promise.all(promises).then((passedValues) => {
    
                console.log("Promise passedValues current/pending meetups.... : ", passedValues);
    
                setState(prevState => {
                    return {
                        ...prevState,
                        meetups: passedValues
                    }
                })
            });
        } else {
            console.log("NO comments available...!");
        }
    }
    
    useEffect(() => {
        console.log("Effect subcomments-related re-mounted...");
    
        fetchCommentsToAddProfilePic(state.meetups);
    
    }, [...state.meetups.map((meetup) => {
        return meetup.sendingID;
    })])

    useEffect(() => {
        const config = {
            params: {
                uniqueId: authData.uniqueId,
                accountType: authData.accountType,
                returnTokens: false
            }
        }

        axios.get(`${BASE_URL}/gather/user/profile`, config).then((res) => {
            if (res.data.message === "Successfully gathered profile!") {
                console.log(res.data);

                const { user } = res.data;

                fetchCommentsToAddProfilePic(user.meetupRequestsPending);
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }, []);

    const renderEmptyComponent = () => {
        return (
            <Fragment>
                <View style={{ margin: 12.25 }}>
                    <Text style={styles.label}>You do NOT have any pending match requests, try to send some match requests to people or wait for someone to send you a request to populate this data...</Text>
                    <View style={styles.hr} />
                    <Image source={require("../../../assets/images/errorcatus.png")} style={styles.illustrationImage} />
                </View>
            </Fragment>
        );
    }

    const renderItem = ({ item, index }) => {
        const dateSelected = Object.keys(item.selectedMeetupData)[0];
        return (
            <Fragment key={index}>
                <View style={styles.containerWrapper}>
                    <View style={styles.itemWrapper}>
                        <TouchableOpacity onPress={() => {}} activeOpacity={0.9}>
                            <Image source={{ uri: `${BASE_ASSET_URL}/${item.lastProfilePic.link}` }} resizeMode={"cover"} style={styles.blockImage} />
                        </TouchableOpacity>
                        <View style={{ paddingHorizontal: 20 }}>
                        <Text title2 semibold style={{marginTop: 5}} numberOfLines={1}>
                            {item.sendingID === authData.uniqueId ? `${item.recieverName} ~ @${item.recieverUsername}` : `${item.firstName} ~ @${item.username}`}
                        </Text>
                        <View style={styles.blockContentAddress}>
                            <Text
                                caption1
                                accentColor
                                style={{
                                    marginLeft: 0,
                                    fontSize: 15
                                }}
                                numberOfLines={1}
                            >
                                {dateSelected}
                            </Text>
                            <Text
                                caption1
                                accentColor
                                style={{
                                    position: "absolute",
                                    right: 0,
                                    fontSize: 15
                                }}
                                numberOfLines={1}
                            >
                                {item.accepted ? "Meetup Completed!" : "Meetup Not Completed..."}
                            </Text>
                        </View>
                        <View style={styles.blockContentDetail}>
                            <View style={{flex: 1}}>
                                <Text title3 semibold>
                                    {item.reacted ? "User Responded!" : "Still Pending..."}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}>
                                <Tag onPress={() => {}} rate>
                                    Meetup Time: {item.meetupTime}
                                </Tag>
                            </View>
                        </View>
                        <View style={styles.blockContentDetail}>
                            <Text
                                caption1
                                style={colorSchemeDark ? {
                                    marginTop: 3,
                                    color: "#fff"
                                } : {
                                    marginTop: 3,
                                    color: "#000"
                                }}
                                numberOfLines={7}
                            >
                                {item.meetupDescription}
                            </Text>
                        </View>
                        </View>
                        {item.sendingID !== authData.uniqueId ? <View style={styles.contentService}>
                            <Button full style={{ backgroundColor: colors.primary }} onPress={() => {
                                
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        selectedUser: item
                                    }
                                })

                                actionsheetMeetup.current.show();
                            }}>
                                {"Respond To This Request..."}
                            </Button>
                        </View> : null}
                    </View>
                </View>
            </Fragment>
        );
    }

    const renderHeader = () => {
        return (
            <Fragment>
                <View>
                    <Image source={require("../../../assets/images/custom/dating-backing.jpg")} style={{ width: '100%', height: 150, backgroundColor: "#000", opacity: 0.5 }} />
                    <View style={styles.titleAbout}>
                    <Text title1 semibold whiteColor>
                        {"View your 'meetup' requests"}
                    </Text>
                    <Text style={{ padding: 12.25, textAlign: "center" }} subhead whiteColor>
                        Below you'll find you "meetups", these are your active/pending meetups coming up...
                    </Text>
                    </View>
                </View>
            </Fragment>
        );
    }
    const confirmSuccessfulMeeting = (value) => {
        console.log("confirmSuccessfulMeeting clicked/ran...");

        const config = {
            uniqueId: authData.uniqueId,
            accountType: authData.accountType,
            selectedID: state.selectedUser.id,
            meetup: value,
            otherUserID: state.selectedUser.sendingID
        }

        setState(prevState => {
            return {
                ...prevState,
                loading: true
            }
        })

        axios.post(`${BASE_URL}/confirm/meetup/successful/or/not`, config).then((res) => {
            if (res.data.message === "Successfully deleted/removed match!") {
                console.log(res.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        showConfirmation: false,
                        meetups: prevState.meetups.filter(item => item.id !== state.selectedUser.id),
                        selectedUser: null,
                        loading: false
                    }
                })
            } else {
                console.log("Err", res.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        showConfirmation: false,
                        loading: false
                    }
                })
            }
        }).catch((err) => {
            console.log(err.message);

            setState(prevState => {
                return {
                    ...prevState,
                    showConfirmation: false,
                    loading: false
                }
            })
        })
    }

    const handleRequestRemoval = () => {
        console.log("handleRequestRemoval clicked/ran...");

        const config = {
            uniqueId: authData.uniqueId,
            accountType: authData.accountType,
            selectedID: state.selectedUser.id
        }

        axios.post(`${BASE_URL}/remove/meetup/request/match`, config).then((res) => {
            if (res.data.message === "Successfully deleted/removed match!") {
                console.log(res.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        meetups: prevState.meetups.filter(item => item.id !== state.selectedUser.id),
                        selectedUser: null
                    }
                })
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    };

    return (
        <Fragment>
            <Header
                title={"Manage Your Meetups!"}
                subTitle="Manage Your 'Match' Meetup's"
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
                <Dialog.Container visible={state.showConfirmation}>
                <Dialog.Title>Please confirm whether or not you met up with this user</Dialog.Title>
                    <Dialog.Description>
                        Did you meetup with this user? Please confirm whether or not ya'll met up and the other party showed up for the date. This holds people accountable and encourages showing up for dates.
                    </Dialog.Description>
                    <Dialog.Button onPress={() => confirmSuccessfulMeeting(false)} style={{ color: "darkred" }} label="Did Not Meetup..." />
                    <Dialog.Button onPress={() => confirmSuccessfulMeeting(true)} style={{ color: "green" }} label="We Met-Up!" />
                </Dialog.Container>
                <ActionSheet
                    ref={actionsheetMeetup}
                    title={`Select an action for this user`}
                    options={['Delete/Remove Request', "Confirm If Meetup Was Successful Or Not", "Cancel/Close Pane"]}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => {
                    switch (index) {
                        case 0:
                            handleRequestRemoval();
                            break;
                        case 1:
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    showConfirmation: true
                                }
                            })
                            break;
                        default: 
                            break;
                    }
                    }}
                />
                <Spinner
                    visible={state.loading}
                    textContent={'Uploading File...'}
                    textStyle={styles.spinnerTextStyle}
                    overlayColor={"rgba(0, 0, 0, 0.725)"}
                />
                <FlatList
                    contentContainerStyle={styles.listContainerStyle}
                    data={state.meetups}
                    style={{ flexGrow: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmptyComponent}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={null}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
  
export default connect(mapStateToProps, {  })(ViewManagePersonalMeetups);