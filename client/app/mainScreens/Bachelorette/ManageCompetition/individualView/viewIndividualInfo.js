import React, { Fragment, useRef, useState } from 'react'
import { View, Image, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import styles from "./viewIndividualInfoStyles.js";
import { Text, Header, Icon, Button, ListThumbSquare } from "@components";
import { useTheme, BaseColor } from '@config';
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import RBSheet from "react-native-raw-bottom-sheet";
import RoundPersonalityQuestionareTestHelper from "../../RoundsGame/PersonalityTestRound/testMain.js";
import Toast from "react-native-toast-message";
import DialogInput from 'react-native-dialog-input';
import ConfettiCannon from 'react-native-confetti-cannon';
import _ from "lodash";
import Dialog from "react-native-dialog";
             
const { width, height } = Dimensions.get("window");

const IndividualGameCompetitionView = (props) => {
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const sheetManagement = useRef(null);
    const sheetMembers = useRef(null);
    const navigation = useNavigation();
    const listing = props.route.params.listing;

    console.log("listing", listing.listingData);

    const authData = props.authData;

    const [ state, setState ] = useState({
        dialog: false,
        page: Number(listing.page),
        showConfetti: false,
        selected: null,
        showConfirmationThree: false
    });

    const selectUserProceed = () => {
        console.log("selectUserProceed clicked/ran....", state.selected.uniqueId);

        const configuration = {
            selectedUserID: state.selected.uniqueId, 
            listingID: listing.id,
            signedInID: authData.uniqueId
        };

        axios.post(`${BASE_URL}/select/user/continue/round/four`, configuration).then((res) => {
            if (res.data.message === "Submitted user to round 4!") {
                console.log("Submitted user to round 4!", res.data);

                const { listing, completed } = res.data;

                if (completed === true) {
                    setState(prevState => {
                        return {
                            ...prevState,
                            listing,
                            selected: null,
                            page: 4
                        }
                    })
                    
                    sheetMembers.current.close();
                } else {
                    setState(prevState => {
                        return {
                            ...prevState,
                            listing,
                            selected: null
                        }
                    })
                    
                    sheetMembers.current.close();
                }

            } else {
                console.log("Err", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while attempting to select the user!`,
                    text2: "We encountered an error while attempting to select this user to proceed to round 4...",
                    visibilityTime: 2375,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    const headerComponent = () => {
        return (
            <Fragment>
                <Header
                    title={"Your Competitions"}
                    subTitle={"Your Active Games"}
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
                        navigation.navigate("MainViewCompetitionBacheloretteGame");
                    }}
                />  
            </Fragment>
        );
    }

    const handleRoundStartOne = (inputText) => {

        if (inputText.trim().toLowerCase() === "accept") { 
            console.log("handleRoundStartOne clicked/ran...");

            setState(prevState => {
                return {
                    ...prevState,
                    dialog: false
                }
            });

            setTimeout(() => {
                sheetManagement.current.close();
            }, 500)
    
            const config = {
                uniqueId: authData.uniqueId,
                accountType: authData.accountType,
                listingID: listing.id
            };
    
            axios.post(`${BASE_URL}/start/round/one/competition/game`, config).then((res) => {
                if (res.data.message === "Successfully started round!") {
                    console.log("Successfully started round!", res.data);

                    setState(prevState => {
                        return {
                            ...prevState,
                            showConfetti: true,
                            page: 2
                        }
                    });

                    setTimeout(() => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                showConfetti: false
                            }
                        });
                    }, 4500);
    
                    Toast.show({
                        type: 'success',
                        text1: `Successfully started the round!`,
                        text2: `We've successfully sent the questionares to the involved users...`,
                        visibilityTime: 3250,
                        position: "bottom"
                    });
                } else {
                    console.log("Err", res.data);
    
                    Toast.show({
                        type: 'error',
                        text1: `Error attempting start round one of the compeitition!`,
                        text2: `An error occurred while attempting start round one of the compeitition - please try again or report to support if persists...`,
                        visibilityTime: 3250,
                        position: "bottom"
                    });
                }
            }).catch((err) => {
                console.log(err.message);
    
                // Toast.show({
                //     type: 'error',
                //     text1: `Error attempting start round one of the compeitition!`,
                //     text2: `An error occurred while attempting start round one of the compeitition - please try again or report to support if persists...`,
                //     visibilityTime: 3250,
                //     position: "bottom"
                // });
            });
        }

        if (inputText.trim().toLowerCase() === "decline") {
            console.log("declined");

            setState(prevState => {
                return {
                    ...prevState,
                    dialog: false
                }
            })
        }
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

                sheetMembers.current.close();
    
                setTimeout(() => {
                    navigation.navigate('Profile1', { user });
                }, 825);
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
        });
    }

    const renderPagesContent = () => {
        switch (state.page) {
            case 1:
                return (
                    <Fragment>
                        <RBSheet 
                            ref={sheetManagement}
                            height={height * 0.845}
                            openDuration={250}
                            closeOnDragDown={false}
                            closeOnPressMask={false}
                            customStyles={{
                                draggableIcon: {
                                    minWidth: width * 0.625
                                },
                                container: {
                                    backgroundColor: colorSchemeDark ? "#000" : "#fff"
                                }
                            }}
                        >
                            <View style={{ margin: 12.25 }}>
                                <Button
                                    style={{ backgroundColor: colors.accent }}
                                    onPress={() => sheetManagement.current.close()}
                                >
                                    {"Cancel/Close..."}
                                </Button>
                                <View style={styles.hr} />
                                <Button
                                    style={{ backgroundColor: colors.primary }}
                                    onPress={() => {
                                        sheetManagement.current.close();

                                        setTimeout(() => {
                                            setState(prevState => {
                                                return {
                                                    ...prevState,
                                                    dialog: true
                                                }
                                            })
                                        }, 725);
                                    }}
                                >
                                    {"Start Round/Competition!"}
                                </Button>
                                <RoundPersonalityQuestionareTestHelper questionTwo={listing.listingData.prescreeningTwo} questionOne={listing.listingData.prescreeningOne} />
                            </View>
                        </RBSheet>
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <Text numberOfLines={3} style={styles.headerTitle}>{listing.listingData.title}</Text>
                            </View>

                            <View style={styles.postContent}>
                            <Text style={styles.postTitle}>
                                {listing.listingData.subtitle}
                            </Text>
                            <View style={styles.hr} />
                            <Text style={styles.postDescription}>
                                <Text style={{ fontWeight: "bold" }}>Round One Prescreening Question #1:</Text> {listing.listingData.prescreeningOne}
                            </Text>
                            <Text style={styles.postDescription}>
                                <Text style={{ fontWeight: "bold" }}>Round One Prescreening Question #2:</Text> {listing.listingData.prescreeningTwo}
                            </Text>
                            <View style={[styles.hr, { marginTop: 22.25 }]} />
                            <View style={[styles.centeredBox, { borderColor: colors.accent }]}>
                                <Text style={[styles.tags, { borderColor: colors.accent }]}>
                                    Currently On <Text style={{ textDecorationLine: "underline" }}>Round ONE (1)</Text>
                                </Text>
                            </View>

                            <Text style={styles.date}>Started/Starts On: {moment(listing.creationDate).add(7, "days").format("YYYY/MM/DD")}</Text>

                            {/* <TouchableOpacity onPress={() => {
                                sheetMembers.current.open();
                            }}>
                                <Text style={[styles.specialText, { color: "darkgreen" }]}>View members particpating in the event (active members)...</Text>
                            </TouchableOpacity> */}

                            <View style={styles.profile}>
                                <Image
                                style={styles.avatar}
                                source={require("../../../../assets/images/canidates.png")}
                                />

                                <Text style={styles.name}>{typeof listing.joined !== "undefined" ? listing.joined.length : "N/A"} canidates {"\n"}<Text style={{ color: colors.accent }}>{listing.listingData.rewardCountTokens} token reward</Text></Text>
                            </View>
                            <TouchableOpacity onPress={() => sheetManagement.current.open()} style={styles.shareButton}>
                                <Text style={styles.shareButtonText}>Manage This Compeitition</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </Fragment>
                );
                break;
            case 2:
                return (
                    <Fragment>
                        <RBSheet 
                            ref={sheetManagement}
                            height={height * 0.845}
                            openDuration={250}
                            closeOnDragDown={false}
                            closeOnPressMask={false}
                            customStyles={{
                                draggableIcon: {
                                    minWidth: width * 0.625
                                },
                                container: {
                                    backgroundColor: colorSchemeDark ? "#000" : "#fff"
                                }
                            }}
                        >
                            <View style={{ margin: 12.25 }}>
                                <Button
                                    style={{ backgroundColor: colors.accent }}
                                    onPress={() => sheetManagement.current.close()}
                                >
                                    {"Cancel/Close..."}
                                </Button>
                                <View style={styles.hr} />
                                <Button
                                    style={{ backgroundColor: colors.primary }}
                                    onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            dialog: true
                                        }
                                    })}
                                >
                                    {"Start Round TWO (2)!"}
                                </Button>
                                <View style={styles.centered}>
                                    <Image
                                        style={styles.roundTwoImage}
                                        source={require("../../../../assets/images/roundtwo.jpg")}
                                    />
                                </View>
                            </View>
                        </RBSheet>
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <Text numberOfLines={3} style={styles.headerTitle}>You're activly on round TWO, please click the link/button below to access your 'submitted questions'...</Text>
                            </View>
                            <View style={styles.postContent}>
                                <Button full style={{ backgroundColor: colors.accent }} onPress={() => navigation.navigate("ViewQuestionareResults", { listing })}>
                                    {"View Questionare Result(s)"}
                                </Button>
                            {/* <View style={styles.hr} /> */}
                            <View style={[styles.hr, { marginTop: 22.25 }]} />
                            <View style={[styles.centeredBox, { borderColor: colors.accent }]}>
                                <Text style={[styles.tags, { borderColor: colors.accent }]}>
                                    Currently On <Text style={{ textDecorationLine: "underline" }}>Round TWO (2)</Text>
                                </Text>
                            </View>

                            <Text style={styles.date}>Started/Starts On: {moment(listing.creationDate).add(7, "days").format("YYYY/MM/DD")}</Text>
                
                            <View style={styles.profile}>
                                <Image
                                style={styles.avatar}
                                source={require("../../../../assets/images/canidates.png")}
                                />

                                <Text style={styles.name}>{typeof listing.joined !== "undefined" ? listing.joined.length : "N/A"} canidates {"\n"}<Text style={{ color: colors.accent }}>{listing.listingData.rewardCountTokens} token reward</Text></Text>
                            </View>
                            <Button full outline style={{ marginTop: 17.25 }} onPress={() => sheetManagement.current.open()}>
                                {"Manage This Compeitition"}
                            </Button>
                            </View>
                        </View>
                    </Fragment>
                );                   
                break;
            case 3:
                const calculateSelectedDisabled = () => {
                    if (state.selected !== null) {
                        return false;
                    } else {
                        return true;
                    }
                };

                return (
                    <Fragment> 
                        <RBSheet 
                            ref={sheetManagement}
                            height={height * 0.925}
                            openDuration={250}
                            closeOnDragDown={false}
                            closeOnPressMask={false}
                            customStyles={{
                                draggableIcon: {
                                    minWidth: width * 0.625
                                },
                                container: {
                                    backgroundColor: colorSchemeDark ? "#000" : "#fff"
                                }
                            }}
                        >
                            <View style={{ margin: 12.25 }}>
                                <FlatList
                                    contentContainerStyle={{}}
                                    data={listing.joined}
                                    horizontal={false}
                                    showsVerticalScrollIndicator={false}
                                    ListHeaderComponent={() => (
                                        <Fragment>
                                            <Button
                                                style={{ backgroundColor: colors.accent }}
                                                onPress={() => {
                                                    setState(prevState => {
                                                        return {
                                                            ...prevState,
                                                            selected: null
                                                        }
                                                    });

                                                    sheetManagement.current.close()
                                                }}
                                            >
                                                {"Cancel/Close..."}
                                            </Button>
                                            <View style={styles.hr} />
                                            <Button
                                                style={calculateSelectedDisabled() ? { backgroundColor: "lightgrey" } : { backgroundColor: colors.primary }}
                                                onPress={() => {
                                                    sheetManagement.current.close();

                                                    setTimeout(() => {
                                                        navigation.navigate("VideoCallInstigateInAppGame", { user: state.selected })
                                                    }, 750);
                                                }}
                                                disabled={calculateSelectedDisabled()}
                                            >
                                                {"Initiate Video Call W/Selected User..."}
                                            </Button>
                                            <View style={styles.hr} />
                                            <Button
                                                style={calculateSelectedDisabled() ? { backgroundColor: "lightgrey" } : { backgroundColor: BaseColor.greenColor }}
                                                onPress={() => {

                                                    sheetManagement.current.close()

                                                    setTimeout(() => {
                                                        setState(prevState => {
                                                            return {
                                                                ...prevState,
                                                                showConfirmationThree: true
                                                            }
                                                        });
                                                    }, 625);
                                                }}
                                                disabled={calculateSelectedDisabled()}
                                            >
                                                {"Select User For Next Round!"}
                                            </Button>
                                            <View style={{ marginTop: 17.25 }} />
                                        </Fragment>
                                    )}
                                    keyExtractor={item => item.username}
                                    renderItem={({item, index}) => {
                                        const indexedMatch = _.has(listing, "acceptedOrDeniedRoundThree") ? listing.acceptedOrDeniedRoundThree.findIndex((data) => data.idOfUser === item.uniqueId) : -1;
                                        const match = _.has(listing, "acceptedOrDeniedRoundThree") ? listing.acceptedOrDeniedRoundThree[indexedMatch] : false;

                                        if (_.has(match, "accepted") && match.accepted === true) {
                                            return null;
                                        } else {
                                            return (
                                                <Fragment key={index}>
                                                    {(state.selected !== null && state.selected.uniqueId === item.uniqueId) ? <Fragment>
                                                        <View style={colorSchemeDark ? { borderWidth: 1.25, borderColor: "#fff" } : { borderWidth: 1.25, borderColor: "#000" }}>
                                                            <ListThumbSquare
                                                                onPress={() => {
                                                                    setState(prevState => {
                                                                        return {
                                                                            ...prevState,
                                                                            selected: item
                                                                        }
                                                                    })
                                                                }}
                                                                image={{ uri: _.has(item, "profilePictures") && item.profilePictures.length > 0 ? `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` : "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/placeholder-loading.png" }}
                                                                txtLeftTitle={`${item.firstName} ~ @${item.username}`}
                                                                txtContent={`Joined: ${moment(item.dateJoined).fromNow(false)}`}
                                                            />
                                                        </View>
                                                    </Fragment> : <ListThumbSquare
                                                        onPress={() => {
                                                            setState(prevState => {
                                                                return {
                                                                    ...prevState,
                                                                    selected: item
                                                                }
                                                            })
                                                        }}
                                                        image={{ uri: _.has(item, "profilePictures") && item.profilePictures.length > 0 ? `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` : "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/placeholder-loading.png" }}
                                                        txtLeftTitle={`${item.firstName} ~ @${item.username}`}
                                                        txtContent={`Joined: ${moment(item.dateJoined).fromNow(false)}`}
                                                    />}
                                                </Fragment>
                                            );
                                        }
                                    }}
                                />
                            </View>
                        </RBSheet>
                        <View style={[styles.container, { margin: 12.25 }]}>
                            <View style={[styles.header, { backgroundColor: colors.accent }]}>
                                <Text numberOfLines={3} style={styles.headerTitle}>You're activly on round THREE, This is the video interview stage.</Text>
                            </View>
                            <View style={[styles.hr, { marginTop: 22.25 }]} />
                            <Text style={styles.importantText}>You'll need to notify the user you're intending on interviewing or calling on the next screen (after selecting the desired user) so they answer when you call for the interview. We will also notify them when you're calling so wait at least 30 seconds and then you can hang-up.</Text>
                            <View style={[styles.hr, { marginTop: 22.25 }]} />
                            <View style={[styles.centeredBox, { borderColor: colors.accent }]}>
                                <Text style={[styles.tags, { borderColor: colors.accent }]}>
                                    Currently On <Text style={{ textDecorationLine: "underline" }}>Round THREE (3)</Text>
                                </Text>
                            </View>
                            <View style={styles.centered}>
                                <Image
                                    style={styles.roundTwoImage}
                                    source={require("../../../../assets/images/roundthree.jpg")}
                                />
                            </View>
                            <View style={styles.profile}>
                                <Image
                                style={styles.avatar}
                                source={require("../../../../assets/images/canidates.png")}
                                />

                                <Text style={styles.name}>{typeof listing.joined !== "undefined" ? listing.joined.length : "N/A"} canidates {"\n"}<Text style={{ color: colors.accent }}>{listing.listingData.rewardCountTokens} token reward</Text></Text>
                            </View>
                            <Button full outline style={{ marginTop: 17.25 }} onPress={() => sheetManagement.current.open()}>
                                {"Manage This Compeitition"}
                            </Button>
                        </View>
                    </Fragment>
                );  
                break;
            case 4:
                return (
                    <Fragment>
                        {/* <TouchableOpacity onPress={() => navigation.navigate('InAppGameCompetitionSubmitTalentVideo')}>
                            <Text>Page Four (4)</Text>
                        </TouchableOpacity> */}
                        <View style={[styles.container, { margin: 12.25 }]}>
                            <View style={[styles.header, { backgroundColor: colors.accent }]}>
                                <Text numberOfLines={3} style={[styles.headerTitle, { color: "#fff" }]}>You're activly on round FOUR, this is the final stage.</Text>
                            </View>
                            <View style={[styles.hr, { marginTop: 22.25 }]} />
                            <Text style={styles.importantText}>Once you receive all of the submissions, you'll need to pick a WINNER of the contest to go on dates with and to receive the token reward for particpating as well! We hope you've had a good time with this game/experience...</Text>
                            <View style={[styles.hr, { marginTop: 22.25 }]} />
                            <View style={[styles.centeredBox, { borderColor: colors.accent }]}>
                                <Text style={[styles.tags, { borderColor: colors.accent }]}>
                                    Currently On <Text style={{ textDecorationLine: "underline" }}>Round FOUR (Final Round!)</Text>
                                </Text>
                            </View>
                            <View style={styles.centered}>
                                <Image
                                    style={styles.roundTwoImage}
                                    source={require("../../../../assets/images/roundfour.jpg")}
                                />
                            </View>
                            <View style={styles.profile}>
                                <Image
                                style={styles.avatar}
                                source={require("../../../../assets/images/canidates.png")}
                                />

                                <Text style={styles.name}>{typeof listing.joined !== "undefined" ? listing.joined.length : "N/A"} canidates {"\n"}<Text style={{ color: colors.accent }}>{listing.listingData.rewardCountTokens} token reward</Text></Text>
                            </View>
                            {/* <Button full outline style={{ marginTop: 17.25 }} onPress={() => sheetManagement.current.open()}>
                                {"Manage This Compeitition"}
                            </Button> */}
                        </View>
                    </Fragment>
                );  
                break;
            default:
                break;
        }
    }

    const renderUsersData = () => {
        return (
            <Fragment>
                <DialogInput isDialogVisible={state.dialog}
                    title={"Are you sure you'd like to start ROUND ONE?!"}
                    message={"This will notify particpating user's and send them the questionare to be completed for round one! Please enter 'accept' to send the invites & start round ONE!"}
                    hintInput ={"ACCEPT/DECLINE"}
                    submitInput={(inputText) => handleRoundStartOne(inputText)}
                    closeDialog={() => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                dialog: false
                            }
                        })
                    }}>
                </DialogInput>
                <RBSheet 
                    ref={sheetMembers}
                    height={height * 0.845}
                    openDuration={250}
                    closeOnDragDown={false}
                    closeOnPressMask={false}
                    customStyles={{
                        draggableIcon: {
                            minWidth: width * 0.625
                        },
                        container: {
                            backgroundColor: colorSchemeDark ? "#000" : "#fff"
                        }
                    }}
                >
                    <View style={{ margin: 12.25 }}>
                        <FlatList
                            contentContainerStyle={{}}
                            data={listing.joined}
                            horizontal={false}
                            showsVerticalScrollIndicator={false}
                            ListHeaderComponent={() => (
                                <Fragment>
                                    <Button
                                        style={{ backgroundColor: colors.accent }}
                                        onPress={() => sheetMembers.current.close()}
                                    >
                                        {"Cancel/Close..."}
                                    </Button>
                                    <View style={styles.hr} />
                                </Fragment>
                            )}
                            keyExtractor={item => item.username}
                            renderItem={({item, index}) => { // 
                                const indexedMatch = _.has(listing, "acceptedOrDenied") ? listing.acceptedOrDenied.findIndex((data) => data.idOfUser === item.uniqueId) : -1;
                                const match = _.has(listing, "acceptedOrDenied") ? listing.acceptedOrDenied[indexedMatch] : false;

                                if (listing.page === "3") {
                                    console.log("page three");
                                    if (_.has(match, "accepted") && match.accepted === true) {
                                        return (
                                            <Fragment key={index}>
                                                <ListThumbSquare
                                                    onPress={() => fetchUserAndRedirect(item.uniqueId)}
                                                    image={{ uri: _.has(item, "profilePictures") && item.profilePictures.length > 0 ? `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` : "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/placeholder-loading.png" }}
                                                    txtLeftTitle={`${item.firstName} ~ @${item.username}`}
                                                    txtContent={`Joined: ${moment(item.dateJoined).fromNow(false)}`}
                                                />
                                            </Fragment>
                                        );
                                    } else {
                                        return null;
                                    }
                                } else {
                                    return (
                                        <Fragment key={index}>
                                            <ListThumbSquare
                                                onPress={() => fetchUserAndRedirect(item.uniqueId)}
                                                image={{ uri: _.has(item, "profilePictures") && item.profilePictures.length > 0 ? `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` : "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/placeholder-loading.png" }}
                                                txtLeftTitle={`${item.firstName} ~ @${item.username}`}
                                                txtContent={`Joined: ${moment(item.dateJoined).fromNow(false)}`}
                                            />
                                        </Fragment>
                                    );
                                }
                            }}
                        />
                    </View>
                </RBSheet>
                <TouchableOpacity onPress={() => {
                    sheetMembers.current.open();
                }}>
                    <View>
                        <Image source={require("../../../../assets/images/custom/world.jpg")} style={{ width: '100%', height: 200 }} />
                        <View style={styles.titleAbout}>
                            <View style={styles.backgroundContainer}>
                                <Text title1 semibold whiteColor>
                                    {"View Participating User's"}
                                </Text>
                                <Text subhead whiteColor>
                                    {"View the users that are still particpating in this event (the users that haven't been eliminated yet)"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Fragment>
        );
    }

    return (
        <ScrollView style={{ height: "100%", width }}>
            <Dialog.Container visible={state.showConfirmationThree}>
                <Dialog.Title>Allow user to proceed to round four (4)?! ({state.selected !== null ? `${state.selected.firstName}/@${state.selected.username}` : ""})</Dialog.Title>
                <Dialog.Description>
                    Are you sure you'd like to select this user to proceed to round four!? This action cannot be undone so choose carefully...
                </Dialog.Description>
                <Dialog.Button onPress={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            showConfirmationThree: false
                        }
                    })
                }} style={{ color: "darkred" }} label="Cancel" />
                <Dialog.Button onPress={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            showConfirmationThree: false
                        }
                    });

                    selectUserProceed();
                }} style={{ color: "green" }} label="Select User!" />
            </Dialog.Container> 
            {state.showConfetti ? <ConfettiCannon count={250} origin={{x: -10, y: 0}} /> : null}
            {headerComponent()}
            {renderPagesContent()}
            {renderUsersData()}
        </ScrollView>
    )
};

const mapStateToProps = (state) => {
	return {
		authData: state.auth.tempUserData
	}
};

export default connect(mapStateToProps, {  })(IndividualGameCompetitionView);