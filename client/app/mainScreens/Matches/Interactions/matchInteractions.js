import React, {useState, useEffect, Fragment, useRef } from 'react';
import { FlatList, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme, BaseColor } from '@config';
import { Header, SafeAreaView, Icon, Text, Button, Tag } from '@components';
import styles from './matchInteractionStyles.js';
import { useNavigation } from '@react-navigation/native';
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import _ from "lodash";
import moment from "moment";
import ActionSheet from 'react-native-actionsheet';
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const MatchInteractionsListMain = ({ authData }) => {

    const { colors, theme } = useTheme();
    const navigation = useNavigation();
    const actionSheetRef = useRef(null);
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        matches: [],
        showDialog: false,
        selectedUser: null,
    })

    useEffect(() => {
        const configuration = {
            params: {
                uniqueId: authData.uniqueId
            }
        };

        axios.get(`${BASE_URL}/gather/match/active/latest`, configuration).then((res) => {
            if (res.data.message === "Successfully gathered matches!") {
                console.log("resdata", res.data);

                const { matches } = res.data;
                
                setState(prevState => {
                    return {
                        ...prevState,
                        matches
                    }
                });
            } else {
                console.log("errrorrrrrr", ressss.data);
            } 
        }).catch((err) => {
            console.log(err.message);
        })
    }, []);

    const renderHeader = () => { // 
        return (
            <Fragment>
                <View>
                    <Image source={require("../../../assets/images/custom/dating-backing.jpg")} style={{ width: '100%', height: 150, backgroundColor: "#000", opacity: 0.5 }} />
                    <View style={styles.titleAbout}>
                    <Text title1 semibold style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}>
                        {"Manage your matches!"}
                    </Text>
                    <Text style={colorSchemeDark ? { color: "#fff", padding: 12.25, textAlign: "center" } : { color: "#000", padding: 12.25, textAlign: "center" }} subhead>
                        These are your active matches! Interact in more detail with these user's!
                    </Text>
                    </View>
                </View>
            </Fragment>
        );
    }

    const fetchUserAndRedirect = (uniqueId) => {
        const configuration = {
            params: {
                postedByID: uniqueId
            }
        };

        axios.get(`${BASE_URL}/gather/one/user/restricted/data`, configuration).then((res) => {
            if (res.data.message === "Submitted gathered user's info!") {
                console.log("Submitted gathered user's info!", res.data);
    
                const { user } = res.data;
    
                navigation.navigate('Profile1', { user });
            } else {
                console.log("Err", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while attempting to fetch user details!`,
                    text2: "We encountered an error while attempting to fetch this specific user's account details...",
                    visibilityTime: 2375,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);

            // Toast.show({ // 
            //     type: 'error',
            //     text1: `An error occurred while attempting to fetch user details!`,
            //     text2: "We encountered an error while attempting to fetch this specific user's account details...",
            //     visibilityTime: 2375,
            //     position: "bottom"
            // });
        });
    }

    const renderItem = ({ item, index }) => {
        return (
            <Fragment key={index}>
                <View style={styles.containerWrapper}>
                    <View style={styles.itemWrapper}>
                        <TouchableOpacity onPress={() => fetchUserAndRedirect(item.uniqueId)} activeOpacity={0.9}>
                            <Image source={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }} resizeMode={"cover"} style={styles.blockImage} />
                        </TouchableOpacity>
                        <View style={{ paddingHorizontal: 20 }}>
                        <Text title2 semibold style={{marginTop: 5}} numberOfLines={1}>
                            {`${item.firstName} ~ @${item.username}`}
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
                                {`${moment(new Date()).diff(item.birthdateRaw, 'years', false)} Years Old`}
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
                                {typeof item.followers !== "undefined" && item.followers.length > 0 ? `${item.followers.length} follower(s)` : "0 Follower(s)"}
                            </Text>
                        </View>
                        <View style={styles.blockContentDetail}>
                            <View style={{flex: 1}}>
                                <Text title3 semibold>
                                    {item.gender.label}
                                </Text>
                                <Text
                                    caption1
                                    accentColor
                                    style={{
                                    marginTop: 3,
                                    }}
                                    numberOfLines={1}
                                >
                                    {item.verficationCompleted ? "Account Verified!" : "Account Not Verified."}
                                </Text>
                                </View>
                                <View
                                style={{
                                    flexDirection: 'row',
                                }}>
                                <Tag onPress={() => {}} rate>
                                    {`${item.rank}`}
                                </Tag>
                            </View>
                        </View>
                        </View>
                        <View style={styles.contentService}>
                            <Button full style={{ backgroundColor: BaseColor.greenColor }} onPress={() => {

                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        selectedUser: item
                                    }
                                });

                                setTimeout(() => {
                                    actionSheetRef.current.show();
                                }, 1000);
                            }}>
                                {"View/Manage Match Options!"}
                            </Button>
                        </View>
                    </View>
                </View>
            </Fragment>
        );
    }

    const renderEmptyComponent = () => {
        return (
            <Fragment>
                <View style={{ margin: 12.25 }}>
                    <Text style={styles.label}>You do NOT have any pending match requests, try to send some match requests to people or wait for someone to send you a request to populate this data...</Text>
                    <View style={styles.hr} />
                    <Image source={require("../../../assets/images/custom/no-results.png")} style={styles.illustrationImage} />
                </View>
            </Fragment>
        );
    }

    const scheduleMeetupNextPage = () => {
        console.log("scheduleMeetupNextPage clicked/ran...");

        navigation.navigate("OrganizeLocalMeetupBetweenMatches", { otherUserData: state.selectedUser });
    }

    const handleRedirectVideoChatInit = () => {
        console.log("handleRedirectVideoChatInit clicked/ran...", state.selectedUser.uniqueId);

        const data = {
            otherUserID: state.selectedUser.uniqueId
        };

        navigation.navigate("MatchChatVideoCommunicationView", { data });
    }

    return (
        <Fragment>
            <ActionSheet
                ref={actionSheetRef}
                title={`Select which action you'd like to take with this specific user...`}
                options={['1v1 Video Chat', 'Schedule a date/meetup', "Cancel/Close Pane"]}
                cancelButtonIndex={2}
                destructiveButtonIndex={2}
                onPress={(index) => {
                switch (index) {
                    case 0:
                        handleRedirectVideoChatInit();
                        break;
                    case 1:
                        scheduleMeetupNextPage();
                        break;
                    default: 
                        break;
                }
                }}
            />
            <Header
                title={"Your Matches!"}
                subTitle="Explore your matches..."
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
                <FlatList
                    contentContainerStyle={styles.listContainerStyle}
                    data={state.matches}
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
  
export default connect(mapStateToProps, {  })(MatchInteractionsListMain);