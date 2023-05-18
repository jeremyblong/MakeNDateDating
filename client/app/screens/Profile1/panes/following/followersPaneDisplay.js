import React, { Fragment, useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Dimensions, ScrollView, useColorScheme } from "react-native";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from "axios";
import Dialog from "react-native-dialog";
import styles from "./followersPaneDisplayStyles.js";
import {
    Image,
    Text,
    Button,
    ListThumbSquare
} from '@components';
import { useTheme} from '@config';
import { connect } from "react-redux";
import _ from "lodash";
import SearchBar from 'react-native-search-bar';
import moment from "moment";


const { height, width } = Dimensions.get("window");

const FollowingUsersCurrentListPane = ({ setPassedData, followers, authenticatedData, passedData, viewFollowersPaneRef }) => {

    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const searchBarRef = useRef(null);

    const [ state, setState ] = useState({
        followers: typeof followers !== "undefined" && followers.length > 0 ? followers : [],
        searchingValue: "",
        ready: false
    });

    const fetchCommentsToAddProfilePic = (followers) => {

        const promises = [];
    
        if (typeof followers !== "undefined" && followers.length > 0) {
            for (let idxxxxx = 0; idxxxxx < followers.length; idxxxxx++) {
                const member = followers[idxxxxx];
                
                const { followerID } = member;
    
                promises.push(new Promise((resolve, reject) => {
                    // update comments state
                    const config = {
                        params: {
                            postedByID: followerID
                        }
                    };
                    axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
                        if (res.data.message === "Submitted gathered user's picture/file!") {

                            const { user } = res.data; 
    
                            member["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
    
                            resolve(member);
                        } else {
    
                            member["lastProfilePic"] = null;
    
                            resolve(member);
                        }
                    }).catch((err) => {
                        member["lastProfilePic"] = null;
    
                        resolve(member);
                    })
                }));
            };
    
            Promise.all(promises).then((passedValues) => {
    
                console.log("Promise passedValues passedValues passedValues passedValues....:", passedValues);
    
                setState(prevState => {
                    return {
                        ...prevState,
                        followers: passedValues,
                        ready: true
                    }
                });
            });
        } else {
            console.log("NO followers available...!");
        }
    }
    
    useEffect(() => {
        console.log("Effect followers list-related re-mounted...");
    
        fetchCommentsToAddProfilePic(state.followers);
    
    }, [...state.followers.map((member) => {
        return member.followerID;
    })])
    
    const renderCommentConfirmationDialog = () => {
        return (
            <Dialog.Container visible={state.modalState}
                contentStyle={styles.dialogContainerStyle}
            >
                <View style={{ backgroundColor: 'white', alignItems: 'center', }}>
                    <Text style={colorSchemeDark ? { paddingBottom: 15.0, fontSize: 17.25, color: "#fff" } : { paddingBottom: 15.0, fontSize: 17.25, color: "#000" }}>
                        Are you sure you'd like to post this comment? This is a comment on the 'meeting' selected, please click continue if you're ready to post your message...
                    </Text>
                    <View style={styles.modalHrLine} />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 20
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        modalState: false
                                    }
                                })
                            }}
                            style={styles.cancelButtonStyle}
                        >
                            <Text style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Cancel.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9}
                            onPress={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        modalState: false,
                                        activityLoading: true
                                    }
                                })
                                setTimeout(() => {
                                    sendPrivateMessage();
                                },  375);
                            }}
                            style={styles.logOutButtonStyle}
                        >
                            <Text style={{ textAlign: "center", fontWeight: "bold", color: "#fff" }}>Post Message!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog.Container>
        )
    }
    const handleSearchValue = () => {
        console.log("handleSearchValue clicked/ran...");
    }

    const unfollowUser = () => {
        console.log("unfollowUser clicked/ran...");

        const config = {
            postedByID: passedData.uniqueId,
            authedUserID: authenticatedData.uniqueId
        }
        axios.post(`${BASE_URL}/unsubscribe/follower/profile/removal`, config).then((res) => {
            if (res.data.message === "Submitted un-subscribed as follower!") {
                console.log(res.data);

                const { otherUser } = res.data;
    
                setPassedData(otherUser);

                viewFollowersPaneRef.current.close();
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }
    // return pane logic/JSX data...
    return (
        <Fragment>
            <View style={styles.mainWrapper}>
                {renderCommentConfirmationDialog()}
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' contentContainerStyle={{ paddingBottom: 125 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, height: height * 0.875 }}>
                    <SearchBar
                        ref={searchBarRef}
                        placeholder="Search for follower's..."
                        textFieldBackgroundColor={useColorScheme() === "dark" ? "#000" : null}
                        onChangeText={value => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    searchingValue: value
                                }
                            })
                        }}
                        onSearchButtonPress={handleSearchValue}
                        onCancelButtonPress={() => {}}
                        />
                        <View style={styles.hr} />
                        {typeof state.followers !== "undefined" && state.followers.length > 0 && state.ready ? state.followers.map((item, index) => {
                            console.log("item", item);
                            return (
                                <Fragment key={index}>
                                    <ListThumbSquare
                                        onPress={() => {}}
                                        image={{ uri: `${BASE_ASSET_URL}/${item.lastProfilePic.link}` }}
                                        txtLeftTitle={`${item.followerFirstName} ~ @${item.followerUsername}`}
                                        txtContent={`Member since ${moment(item.dateFollowed).fromNow(false)}`}
                                    />
                                </Fragment>
                            );
                        }) : null}
                        </ScrollView>
                        <Button outline onPress={() => unfollowUser()}>
                            {"Unfollow This User.."}
                        </Button>
                </KeyboardAwareScrollView>
            </View>
        </Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, { })(FollowingUsersCurrentListPane);