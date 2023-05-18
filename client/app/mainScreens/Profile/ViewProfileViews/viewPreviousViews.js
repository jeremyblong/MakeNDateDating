import React, { Fragment, useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { View, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { BaseColor, useTheme } from '@config';
import {
    Image,
    Header,
    Icon,
    Text, 
    Button
} from '@components';
import styles from "./viewPreviousViewsStyles.js";
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import Dialog from "react-native-dialog";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import _ from "lodash";
import { connect } from "react-redux";
import moment from "moment";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

const ViewProfileViewIndividualProfilewViewsOwn = ({ authData }) => {

    const navigation = useNavigation();
    const onEndReachedCalledDuringMomentum = useRef(true);
    const paginationRefs = useRef(true);
    const { colors, theme } = useTheme();

    const _myScroll = useRef(null);

    const [ state, setState ] = useState({
        pending: false,
        ready: false,
        tokenCount: 65,
        showDialog: false,
        profileViews: [],
        paginationItems: [],
        alreadyViewed: [],
        users: [],
        page: 1,
        user: null,
        enableScrollViewScroll: true,
        viewableItems: [],
        current: {
            start: 0,
            end: 10
        }
    });

    const handlePurchaseViewablitiy = () => {
        console.log("handlePurchaseViewablitiy clicked/ran...");

        const configuration = {
            uniqueId: authData.uniqueId,
            accountType: authData.accountType
        };

        axios.post(`${BASE_URL}/subscribe/profile/visibility/lifetime`, configuration).then((res) => {
            if (res.data.message === "Submitted subscribed to visibility lifetime!") {
                console.log("Submitted subscribed to visibility lifetime!", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully subscribed to profile visibility!`,
                    text2: "Successfully enrolled/subscribed to view all profile viewers for lifetime...",
                    visibilityTime: 3250,
                    position: "bottom",
                    onHide: () => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                page: 2,
                                ready: true
                            }
                        })
                    }
                });
            } else if (res.data.message === "You do NOT have enough tokens to purchase this ablitiy/advantage...") {
                Toast.show({
                    type: 'info',
                    text1: res.data.message,
                    text2: "You need to purchase more token's to be able to activate this feature/functionality!",
                    visibilityTime: 3250,
                    position: "bottom"
                });
            } else {
                console.log("Err", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while attempting to subscibe to profile visibility!`,
                    text2: "We encountered an error while attempting subscirbe to profile viewability, contact support if the problem persists...",
                    visibilityTime: 3250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);

            Toast.show({
                type: 'error',
                text1: `An error occurred while attempting to subscibe to profile visibility!`,
                text2: "We encountered an error while attempting subscirbe to profile viewability, contact support if the problem persists...",
                visibilityTime: 3250,
                position: "bottom"
            });
        });
    }

    useEffect(() => {

        const configurationOne = {
            params: {
                uniqueId: authData.uniqueId,
                accountType: authData.accountType
            }   
        }
        axios.get(`${BASE_URL}/gather/user/profile`, configurationOne).then((res) => {
            if (res.data.message === "Successfully gathered profile!") {
                console.log("Successfully gathered profile!", res.data);
    
                const { user } = res.data;
    
                if (_.has(user, "profileViewSubscription") && user.profileViewSubscription === true) {
                    setState(prevState => {
                        return {
                            ...prevState,
                            page: 2,
                            ready: true
                        }
                    })
                }
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })

        const config = {
            params: {
                sizeOfResults: 20,
                interestedIn: authData.interestedIn,
                uniqueId: authData.uniqueId
            }
        }
    
        axios.get(`${BASE_URL}/gather/users/limited`, config).then((ressss) => {
            if (ressss.data.message === "Gathered list of users!") {
                console.log("ressssdata", ressss.data.users.length);
    
                const { users } = ressss.data;
    
                setState(prevState => {
                    return {
                        ...prevState,
                        users,
                        ready: true
                    }
                })
            } else {
                console.log("errrorrrrrr", ressss.data);

                setState(prevState => {
                    return {
                        ...prevState,
                        ready: true
                    }
                })
            }
        }).catch((err) => {
            console.log(err.message);
        })

        const configuration = {
            sizeOfResults: 20,
            uniqueId: authData.uniqueId,
            idsAlreadyIncluded: state.alreadyViewed
        }
        // fetch the profile views per specific profile
        axios.post(`${BASE_URL}/gather/only/profile/views/subscribed`, configuration).then((ressss) => {
            if (ressss.data.message === "Gathered list of users!") {
                console.log("ressssdata", ressss.data);
    
                const { users } = ressss.data;
                
                const alreadyArr = [];

                for (let idxxx = 0; idxxx < users.length; idxxx++) {
                    const user = users[idxxx];
                    
                    alreadyArr.push(user.viewerID);

                    if ((users.length - 1) === idxxx) {
                        setState(prevState => {
                            return {
                                ...prevState,
                                profileViews: users,
                                alreadyViewed: alreadyArr
                            }
                        });

                        onEndReachedCalledDuringMomentum.current = false;
                    }
                }
            } else {
                console.log("errrorrrrrr", ressss.data);
            }
        }).catch((err) => {
            console.log(err.message);
        });

    }, []);

    console.log("alreadyViewed", state.alreadyViewed);

    const calculateBizzType = (type) => {
        switch (type) {
          case "bizz":
            return "BIZZ (business relationship's)"
            break;
          case "date":
            return "DATE (Looking for a partner)"
            break;
          case "bff":
            return "BFF (Looking for friend's)"
            break;
          default: 
            break;
        }
    }

    const fetchUserAndRedirect = (uniqueId) => {
        console.log("fetchUserAndRedirect clicked/ran...");

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

            Toast.show({
                type: 'error',
                text1: `An error occurred while attempting to fetch user details!`,
                text2: "We encountered an error while attempting to fetch this specific user's account details...",
                visibilityTime: 2375,
                position: "bottom"
            });
        });
    }

    const loadMoreResults = (info) => {
        console.log("loadMoreResults info :", info);

        const configuration = {
            sizeOfResults: 20,
            uniqueId: authData.uniqueId,
            idsAlreadyIncluded: state.alreadyViewed
        }
        // fetch the profile views per specific profile
        axios.post(`${BASE_URL}/gather/only/profile/views/subscribed`, configuration).then((ressss) => {
            if (ressss.data.message === "Gathered list of users!") {
                console.log("ressssdata", ressss.data);
    
                const { users } = ressss.data;
                
                const alreadyArr = [];

                for (let idxxx = 0; idxxx < users.length; idxxx++) {
                    const user = users[idxxx];
                    
                    alreadyArr.push(user.viewerID);

                    if ((users.length - 1) === idxxx) {
                        setState(prevState => {
                            return {
                                ...prevState,
                                profileViews: users,
                                alreadyViewed: [prevState.alreadyViewed, ...alreadyArr],
                                current: {
                                    ...prevState.current,
                                    end: prevState.current.end += 10
                                }
                            }
                        })
                    }
                }
            } else {
                console.log("errrorrrrrr", ressss.data);
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    const renderContentMain = () => {
        if (state.ready === true) {
            if (state.page === 1) {

                const renderEmptyList = () => {
                    return (
                        <Fragment>
                            <View style={styles.placeholderWrapper}>
                                <Image resizeMode={"contain"} source={require("../../../assets/images/noresult.png")} style={styles.placeholderImage} />
                            </View>
                        </Fragment>
                    );
                }
                return (
                    <Fragment>
                        <Text style={styles.title}>Purchase the ability to view your profile view(s)</Text>
                        <Image resizeMode={"cover"} source={require("../../../assets/images/tokens.jpg")} style={styles.image} />
                        <Text style={styles.content}>Would you like to see who views your profile? Well, you can by purchasing the 'Profile Visibility' upgrade! This will allow you to see who views your profile...</Text>
                        <Button full style={{ marginTop: 10, backgroundColor: colors.accent }} onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    showDialog: true
                                }
                            })
                        }}>
                            Purchase Upgrade & Profile Visibility
                        </Button>
                        <View style={styles.hr} />
                        <Text style={styles.costText}>The cost for <Text style={{ color: colors.primary }}>LIFETIME profile visibility</Text> at this current point in time is 65 tokens <Text style={{ color: BaseColor.greenColor }}>($13.00 ~ USD equivalent)</Text>. This offer is limited and will likely increase with time so get the lowest lifetime viewing ability while it's still low...!</Text>
                        <Text style={styles.sectionTitle}>Other Platform Users...</Text>
                        <FlatList
                            data={state.users}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            onStartShouldSetResponderCapture={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        enableScrollViewScroll: false
                                    }
                                });

                                if (_myScroll.current.contentOffset === 0 && state.enableScrollViewScroll === false) {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            enableScrollViewScroll: true
                                        }
                                    })
                                }
                            }}
                            ListEmptyComponent={renderEmptyList}
                            maxHeight={height * 0.475}
                            style={{ marginTop: 22.25 }}
                            contentContainerStyle={{ paddingBottom: 35, borderWidth: 1, borderColor: colors.primary, padding: 10, borderRadius: 12.25 }}
                            keyExtractor={item => `${item.firstName} ~ @${item.username}`}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => fetchUserAndRedirect(item.uniqueId)}>
                                    <View style={styles.relatedPostContainer}>
                                        <Image source={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }} style={styles.relatedPostImage} />
                                        <View style={{ flexDirection: "column", display: "flex" }}>
                                            <Text style={styles.relatedPostTitle}>{`${item.firstName} ~ @${item.username}`}</Text>
                                            <Text style={styles.relatedPostTitle}>{`${moment(item.birthdateRaw).fromNow(true)} old`} ~ {calculateBizzType(item.accountType)}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </Fragment>
                );
            } else if (state.page === 2) {

                const renderItem = ({ item, index }) => {
                    return (
                        <TouchableOpacity key={index} style={styles.videoItem} onPress={() => fetchUserAndRedirect(item.viewerID)}>
                            <Image resizeMode={"contain"} style={styles.thumbnailItem} source={{ uri: _.has(item, "lastProfilePic") ? `${BASE_ASSET_URL}/${item.lastProfilePic.link}` : "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/placeholder-loading.png" }} />
                            <View style={styles.detailsItem}>
                                <Text style={styles.titleItem}>{item.viewerDisplayName}</Text>
                                <Text style={styles.channelItem}>{calculateBizzType(item.viewerAccountType)}</Text>
                                <View style={styles.viewCountItem}>
                                    <Text style={styles.viewsItem}>Viewed: {moment(item.viewedOn).fromNow(false)}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                };

                return (
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={state.profileViews.slice(state.current.start, state.current.end)}
                            inverted={true}
                            onEndReachedThreshold={0.375}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={true}
                            extraData={state}
                            onEndReached={(info) => {
                                console.log("info", info);

                                if (typeof state.profileViews !== "undefined" && state.profileViews.length >= 10) {
                                    loadMoreResults(info);
                                }
                            }}
                            renderItem={renderItem}
                            keyExtractor={item => item.viewerID}
                        />
                    </View>
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
        <View style={styles.container}>
            <Spinner
                visible={state.pending}
                textContent={'Loading/Processing...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor={"rgba(0, 0, 0, 0.725)"}
	        />
            <Header
                title="View Profile Views"
                subTitle={"People who've viewed your profile..."}
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
            <Dialog.Container visible={state.showDialog}>
                <Dialog.Title style={{ color: "#000" }}>Are you sure you'd like to continue with this purchase?</Dialog.Title>
                <Dialog.Description>
                    By clicking 'confirm' on this dialog box, this will facilitate the transaction of {state.tokenCount} tokens to be used to purchase profile viewability capabilities ...
                </Dialog.Description>
                <Dialog.Button onPress={() => setState(prevState => {
                    return {
                        ...prevState,
                        showDialog: false
                    }
                })} style={{ color: "red" }} label="Cancel." />
                <Dialog.Button onPress={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            showDialog: false
                        }
                    })
                    handlePurchaseViewablitiy();
                }} style={{ color: "green" }} label="Purchase!" />
            </Dialog.Container>
            <View style={{ marginTop: 12.25 }} onStartShouldSetResponderCapture={() => {
                setState(prevState => {
                    return {
                        ...prevState,
                        enableScrollViewScroll: true
                    }
                })
            }}>
                <ScrollView ref={_myScroll} scrollEnabled={state.enableScrollViewScroll} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {renderContentMain()}
                </ScrollView>
            </View>
        </View>
    );
};

const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}

export default connect(mapStateToProps, {  })(ViewProfileViewIndividualProfilewViewsOwn);