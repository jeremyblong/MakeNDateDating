import React, { Fragment, useEffect, useState } from "react";
import { BaseStyle, BaseColor, useTheme } from '@config';
import { Text, Header, Icon } from "@components";
import { View, FlatList, Image, TouchableOpacity } from 'react-native'
import styles from "./viewAllFollowersProfileStyles.js";
import axios from "axios";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import _ from "lodash";
import Toast from "react-native-toast-message";

const ViewAllFollowersProfileViewMore = (props) => {

    console.log("followers", props.route.params.followers);

    const followers = props.route.params.followers;

    const navigation = useNavigation();
    const {colors, theme} = useTheme();

    const [ state, setState ] = useState({
        followers,
        current: {
            start: 0,
            end: 10
        }
    })

    useEffect(() => {
        // if (_.has(userData, "followers")) {
        //     const followers = userData.followers;

        //     const promises = [];

        //     const handleResolve = () => {
        //         console.log("handle resolution...");

        //         Promise.all(promises).then((passedData) => {
        //             console.log("passedData", passedData);

        //             setState(prevState => {
        //                 return {
        //                     ...prevState,
        //                     followers: passedData
        //                 }
        //             })
        //         })
        //     }

        //     for (let idxxxxx = 0; idxxxxx < followers.length; idxxxxx++) {
        //         const followerData = followers[idxxxxx];

        //         console.log("followerData", followerData);

        //         promises.push(new Promise((resolve, reject) => {
        //             // update user images/photos profile pictures...
        //             const config = {
        //                 params: {
        //                     postedByID: followerData.followerID
        //                 }
        //             };
        //             axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
        //                 if (res.data.message === "Submitted gathered user's picture/file!") {

        //                     const { user } = res.data; 

        //                     followerData["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;

        //                     resolve(followerData);
        //                 } else {

        //                     followerData["lastProfilePic"] = null;

        //                     resolve(followerData);
        //                 }
        //             }).catch((err) => {
        //                 followerData["lastProfilePic"] = null;

        //                 resolve(followerData);
        //             })
        //         }));

        //         if ((followers.length - 1) === idxxxxx) {
        //             handleResolve();
        //         }
        //     }
        // }
    }, []);

    const handleFetchAndRedirect = (followerID) => {

        const configuration = {
            params: {
                postedByID: followerID
            }
        };
    
        axios.get(`${BASE_URL}/gather/one/user/restricted/data`, configuration).then((res) => {
            if (res.data.message === "Submitted gathered user's info!") {
                console.log("Submitted gathered user's info!", res.data);
    
                const { user } = res.data;
    
                navigation.push('Profile1', { user });
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
    
            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while attempting to fetch user details!`,
            //     text2: "We encountered an error while attempting to fetch this specific user's account details...",
            //     visibilityTime: 2375,
            //     position: "bottom"
            // });
        });
    }
    
    const renderItem = ({ item }) => {
        console.log("iteeeeeeeem", item);

        const followerID = item.followerID;
        return (
            <TouchableOpacity style={styles.video} onPress={() => {
                handleFetchAndRedirect(followerID);
            }}>
                <Image style={styles.thumbnail} source={{ uri: _.has(item, "lastProfilePic") ? `${BASE_ASSET_URL}/${item.lastProfilePic.link}` : "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/placeholder-loading.png" }} />
                <View style={styles.details}>
                    <Text style={styles.title}>{item.followerFirstName}</Text>
                    <Text style={styles.channel}>@{item.followerUsername}</Text>
                    <View style={styles.viewCount}>
                        <Text style={styles.views}>Following Since {moment(item.dateFollowed).fromNow()}</Text>
                        <Text style={styles.duration}>{item.duration}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderEmptyComponentDetails = () => {
        return (
            <Fragment>
                <View style={styles.placeholderWrapper}>
                    <Image resizeMode={"contain"} source={require("../../../../../assets/images/noresult.png")} style={styles.placeholderImage} />
                </View>
                <View style={styles.hr} />
                <Text style={styles.placeholderTexted}>No results could be found for this user's followers - they do NOT have any follower's at the moment...</Text>
            </Fragment>
        );
    }

    const renderHeaderHelper = () => {
        return (
            <Fragment>
                <Header
                    title={"Follower's of this user!"}
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
            </Fragment>
        );
    }

    const loadMoreResults = (info) => {
        console.log("loadMoreResults info :", info);

        setState(prevState => {
            return {
                ...prevState,
                current: {
                    ...prevState.current,
                    end: prevState.current.end += 10
                }
            }
        })
    }
    
    return (
        <FlatList
            style={styles.container}
            data={typeof state.followers !== "undefined" && state.followers.length > 0 ? state.followers.slice(state.current.start, state.current.end) : state.followers}
            renderItem={renderItem}
            onEndReachedThreshold={0.01}
            onEndReached={info => {
                if (typeof state.followers !== "undefined" && state.followers.length >= 10) {
                    loadMoreResults(info);
                }
            }}
            ListHeaderComponent={renderHeaderHelper}
            ListEmptyComponent={renderEmptyComponentDetails}
            keyExtractor={item => item.id}
        />
    )
};

export default ViewAllFollowersProfileViewMore;