import React, { Fragment, useState, useEffect, useRef } from "react";
import { View, FlatList, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import styles from "./viewStyles.js";
import { Text, Header, Icon, Button } from "@components";
import { useTheme, BaseColor } from '@config';
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import RBSheet from "react-native-raw-bottom-sheet";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import Toast from "react-native-toast-message";
import _ from "lodash";
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import moment from "moment";
import Dialog from "react-native-dialog";

const { width, height } = Dimensions.get("window");

const ViewQuestionareResultsSubmitted = (props) => {

    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const sheetManagement = useRef(null);
    const navigation = useNavigation();
    const authData = props.authData;

    const [ state, setState ] = useState({
        results: [],
        selected: null,
        fullSelected: null,
        listing: props.route.params.listing,
        confirmationSecond: false,
        confirmation: false
    })

    console.log("state.fullSelected", state.fullSelected);

    const renderEmpty = () => {
        return (
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
                <View style={styles.centeredMargin}>
                    <Text style={styles.noneAvailableText}>No data is available, please check back at a later time when updates are available...</Text>
                    <Image resizeMode={"contain"} source={require("../../../../../assets/images/empty_folder.png")} style={styles.placeholderImage} />
                </View>
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
        );
    };

    const fetchCommentsToAddProfilePic = (users) => {

        const promises = [];
    
        if (typeof users !== "undefined" && users.length > 0) {
            for (let idxxxxx = 0; idxxxxx < users.length; idxxxxx++) {
                const userrrr = users[idxxxxx];
                
                promises.push(new Promise((resolve, reject) => {
                    // update comments state
                    const configuration = {
                        params: {
                            postedByID: userrrr.submittingUserID
                        }
                    };
                    axios.get(`${BASE_URL}/gather/one/user/restricted/data`, configuration).then((res) => {
                        if (res.data.message === "Submitted gathered user's info!") {
        
                            const { user } = res.data; 
        
                            userrrr["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
                            userrrr["name"] = user.firstName;
                            userrrr["username"] = user.username;
                            
                            resolve(userrrr);
                        } else {
                            userrrr["lastProfilePic"] = null;
                            userrrr["name"] = null;
                            userrrr["username"] = null;
        
                            resolve(userrrr);
                        }
                    }).catch((err) => {
        
                        userrrr["lastProfilePic"] = null;
                        userrrr["name"] = null;
                        userrrr["username"] = null;
        
                        resolve(userrrr);
                    })
                }));
            };
    
            Promise.all(promises).then((passedValues) => {
    
                console.log("Promise passedValues passedValues passedValues passedValues....:", passedValues);
    
                setState(prevState => {
                    return {
                        ...prevState,
                        results: passedValues
                    }
                })
            });
        } else {
            console.log("NO notifications available...!");
        }
    }

    const renderPaneItem = ({ item, index }) => {
        console.log("iteeeeeeeeeeemmmm", item);

        return (
            <Fragment>
                <View style={styles.fullwidthTextContainer}>
                    <Text style={styles.innerTextCustom}>{item.label}</Text>
                    <View style={styles.mediumHR} />
                    <View style={[styles.fullwidthTextContainerBlue, { backgroundColor: "#fff" }]}>
                        <Text style={[styles.innerTextCustom, { color: "#000" }]}>{item.value}</Text>
                    </View>
                </View>
            </Fragment>
        );
    }

    const renderItem = ({ item, index }) => {
        return (
          <TouchableOpacity key={index} style={styles.video} onPress={() => {

            const arr = [];
            let indexed = 0;

            let totalKeyCount = 0;
            for (const _ in item.responses) {
                totalKeyCount++;
            }

            for (const key in item.responses) {
                const element = item.responses[key];
                indexed++;
                if (key === "customOne") {
                    arr.push({ label: state.listing.listingData.prescreeningOne, value: element })
                } else if (key === "customTwo") {
                    arr.push({ label: state.listing.listingData.prescreeningTwo, value: element })
                } else {
                    arr.push(element);
                }

                if (indexed === totalKeyCount) {
                    setState(prevState => {
                        return {
                            ...prevState,
                            selected: arr,
                            fullSelected: item
                        }
                    });
                }
            }

            setTimeout(() => {
                sheetManagement.current.open();
            }, 725)
          }}>
            <Image style={styles.thumbnail} source={{ uri: `${BASE_ASSET_URL}/${item.lastProfilePic.link}` }} />
            <View style={styles.details}>
              <Text style={styles.title}>{item.fullName}</Text>
              <Text style={styles.channel}>{item.username}</Text>
              <View style={styles.viewCount}>
                <Text style={styles.views}>{item.accountType}</Text>
                <Text style={styles.duration}>Submitted: {moment(item.submittedDate).fromNow(false)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      }

    useEffect(() => {
        const configuration = {
            params: {
                listingID: state.listing.id
            }
        };
    
        axios.get(`${BASE_URL}/gather/individual/listing/bachelor/bachelorette/game`, configuration).then((res) => {
            if (res.data.message === "Gathered listing!") {
                console.log("Gathered listing!", res.data);
    
                const { listing } = res.data;
    
                fetchCommentsToAddProfilePic(listing.pageTwoQuestionareResults);
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
    }, []);

    const selectAndAddToRoundTwo = () => {
        console.log("selectAndAddToRoundTwo clicked/ran...");

        const configuration = {
            listingID: state.listing.id,
            selectedUserID: state.fullSelected.submittingUserID,
            signedInID: authData.uniqueId
        };
    
        axios.post(`${BASE_URL}/select/user/compeitition/second/round`, configuration).then((res) => {
            if (res.data.message === "Selected user for round two!") {
                console.log("Selected user for round two!", res.data);

                const { listing, completed } = res.data;

                if (completed === true) {
                    sheetManagement.current.close()

                    setState(prevState => {
                        return {
                            ...prevState,
                            confirmationSecond: false,
                            listing,
                            results: prevState.results.filter((item) => item.submittingUserID !== state.fullSelected.submittingUserID)
                        }
                    });

                    Toast.show({
                        type: 'success',
                        text1: `Successfully added user to next round of compeitition!`,
                        text2: "User added to next round of compeititon!",
                        visibilityTime: 2375,
                        position: "bottom",
                        onHide: () => navigation.replace("MainViewCompetitionBacheloretteGame")
                    });
                } else {
                    sheetManagement.current.close()

                    setState(prevState => {
                        return {
                            ...prevState,
                            confirmationSecond: false,
                            listing,
                            results: prevState.results.filter((item) => item.submittingUserID !== state.fullSelected.submittingUserID)
                        }
                    });

                    Toast.show({
                        type: 'success',
                        text1: `Successfully added user to next round of compeitition!`,
                        text2: "User added to next round of compeititon!",
                        visibilityTime: 2375,
                        position: "bottom"
                    });
                }
            } else {
                console.log("Err", res.data);
    
                const { listing } = res.data;

                sheetManagement.current.close()

                setState(prevState => {
                    return {
                        ...prevState,
                        confirmationSecond: false,
                        listing,
                        results: prevState.results.filter((item) => item.submittingUserID !== state.fullSelected.submittingUserID)
                    }
                });

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while attempting to process your request!`,
                    text2: "We encountered an error while attempting to process your desired request...",
                    visibilityTime: 2375,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);

            sheetManagement.current.close()

            setState(prevState => {
                return {
                    ...prevState,
                    confirmationSecond: false
                }
            });
    
            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while attempting to process your request!`,
            //     text2: "We encountered an error while attempting to process your desired request...",
            //     visibilityTime: 2375,
            //     position: "bottom"
            // });
        });
    }

    const rejectRoundAndEliminate = () => {
        console.log("rejectRoundAndEliminate clicked/ran...");

        const configuration = {
            listingID: state.listing.id,
            selectedUserID: state.fullSelected.submittingUserID
        };
    
        axios.post(`${BASE_URL}/deny/user/competition/bachelor/round`, configuration).then((res) => {
            if (res.data.message === "Successfully removed user from competition!") {
                console.log("Successfully removed user from competition!", res.data);

                const { listing, completed } = res.data;

                if (completed === true) {
                    sheetManagement.current.close()

                    setState(prevState => {
                        return {
                            ...prevState,
                            confirmation: false,
                            listing,
                            results: prevState.results.filter((item) => item.submittingUserID !== state.fullSelected.submittingUserID)
                        }
                    });

                    Toast.show({
                        type: 'success',
                        text1: `Successfully removed user from compeitition!`,
                        visibilityTime: 2375,
                        position: "bottom",
                        onHide: () => navigation.replace("MainViewCompetitionBacheloretteGame")
                    });
                } else {
                    sheetManagement.current.close()

                    setState(prevState => {
                        return {
                            ...prevState,
                            confirmation: false,
                            listing,
                            results: prevState.results.filter((item) => item.submittingUserID !== state.fullSelected.submittingUserID)
                        }
                    });

                    Toast.show({
                        type: 'success',
                        text1: `Successfully removed user from compeitition!`,
                        visibilityTime: 2375,
                        position: "bottom"
                    });
                }
            } else {
                console.log("Err", res.data);

                const { listing } = res.data;

                sheetManagement.current.close()

                setState(prevState => {
                    return {
                        ...prevState,
                        confirmation: false,
                        listing,
                        results: prevState.results.filter((item) => item.submittingUserID !== state.fullSelected.submittingUserID)
                    }
                });
    
                Toast.show({
                    type: 'error',
                    text1: `An error occurred while attempting deny/reject user.`,
                    text2: "We encountered an error while attempting to remove this user from the competition...",
                    visibilityTime: 2375,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);

            sheetManagement.current.close()

            setState(prevState => {
                return {
                    ...prevState,
                    confirmation: false
                }
            });
    
            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while attempting to fetch user details!`,
            //     text2: "We encountered an error while attempting to fetch this specific user's account details...",
            //     visibilityTime: 2375,
            //     position: "bottom"
            // });
        });
    }

    const renderHeaderComponent = () => {
        return (
            <Fragment>
                <View style={styles.mediumHR} />
                    <Button
                        style={{ backgroundColor: colors.accent }}
                        onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    confirmation: true
                                }
                            });
                        }}
                    >
                        {"Reject/Deny user from future rounds..."}
                    </Button>
                    <View style={styles.mediumHR} />
                    <Button
                        style={{ backgroundColor: BaseColor.greenColor }}
                        onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    confirmationSecond: true
                                }
                            });
                        }}
                    >
                        {"Select/Choose For Round Two"}
                    </Button>
                <View style={styles.mediumHR} />
            </Fragment>
        );
    }

    const renderFooterComponent = () => {
        return (
            <Fragment>
                <View style={[styles.mediumHR, { marginTop: -5 }]} />
                    <Button
                        style={{ backgroundColor: BaseColor.greenColor }}
                        onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    confirmationSecond: true
                                }
                            });
                        }}
                    >
                        {"Select/Choose For Round Two"}
                    </Button>
                    <View style={styles.mediumHR} />
                    <Button
                        style={{ backgroundColor: colors.accent }}
                        onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    confirmation: true
                                }
                            });
                        }}
                    >
                        {"Reject/Deny user from future rounds..."}
                    </Button>
                <View style={styles.mediumHR} />
            </Fragment>
        );
    }

    return (
        <Fragment>
            <ScrollView contentContainerStyle={{  }}>
                <Header
                    title={"Round 1 Responses"}
                    subTitle={"Responses from your user's..."}
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
                <View>
                    <Image resizeMode="cover" source={require("../../../../../assets/images/neon.jpg")} style={{ width: '100%', height: 200 }} />
                    <View style={styles.titleAbout}>
                        <View style={styles.backgroundContainer}>
                            <Text title1 semibold whiteColor>
                                {"Select Who Will Continue!"}
                            </Text>
                            <Text subhead whiteColor>
                                {"Once you select 1/4 of the users to continue, the round will be completed/concluded. You can also deny/reject a user too for a more rapid response..."}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ margin: 12.25 }}>
                    <Text style={styles.helpfulText}>These user's have already submitted the questionare results...</Text>
                    <View style={styles.hr} />
                </View>
                <View>
                    <Dialog.Container visible={state.confirmation}>
                        <Dialog.Title>Are you sure you'd like to <Text style={{ textDecorationLine: "underline", fontWeight: "bold" }}>eliminate user from competition</Text>?</Dialog.Title>
                        <Dialog.Description>
                            This action is irreversable, please click 'continue' if you wish to proceed or click 'cancel' to abort this action...
                        </Dialog.Description>
                        <Dialog.Button onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    confirmation: false
                                }
                            });
                        }} label="Cancel" />
                        <Dialog.Button onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    confirmation: false
                                }
                            });
                            // proceed with action
                            rejectRoundAndEliminate();
                        }} label="Continue!" />
                    </Dialog.Container>
                    <Dialog.Container visible={state.confirmationSecond}>
                        <Dialog.Title>Are you sure you'd like to <Text style={{ textDecorationLine: "underline", fontWeight: "bold" }}>move this user to the next round</Text>?</Dialog.Title>
                        <Dialog.Description>
                            If you wish to mark this user as 'moving to next round' click continue, otherwise click 'cancel' and reject the user from the competition if you wish to eliminate them...
                        </Dialog.Description>
                        <Dialog.Button onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    confirmationSecond: false
                                }
                            });
                        }} label="Cancel" />
                        <Dialog.Button onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    confirmationSecond: false
                                }
                            });
                            // proceed with action
                            selectAndAddToRoundTwo();
                        }} label="Continue!" />
                    </Dialog.Container>
                </View>
                <View style={styles.container}>
                    <FlatList
                        ListEmptyComponent={renderEmpty}
                        data={state.results}
                        contentContainerStyle={{ paddingBottom: 75 }}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
            </ScrollView>
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
                    <Button
                        style={{ backgroundColor: colors.primary }}
                        onPress={() => sheetManagement.current.close()}
                    >
                        {"Cancel/Close..."}
                    </Button>
                    {state.selected !== null ? <FlatList
                        // contentContainerStyle={styles.selectableList}
                        data={state.selected}
                        ListHeaderComponent={renderHeaderComponent}
                        style={{ flexGrow: 1 }}
                        contentContainerStyle={{ paddingTop: 25, paddingBottom: 100 }}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={renderPaneItem}
                        ListFooterComponent={renderFooterComponent}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                    /> : null}
                </View>
            </RBSheet>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
	return {
		authData: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, {  })(ViewQuestionareResultsSubmitted);