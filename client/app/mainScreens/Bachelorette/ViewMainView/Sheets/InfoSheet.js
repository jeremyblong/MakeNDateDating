import React, { Fragment, useRef, useState, useEffect } from "react";
import { View, Image, Platform, FlatList, ScrollView, Dimensions } from 'react-native'
import Toast from "react-native-toast-message";
import styles from "./InfoSheetStyles.js";
import { Text, Header, Icon, Button, Tag } from "@components";
import { useTheme, BaseColor } from '@config';
import RBSheet from "react-native-raw-bottom-sheet";
import Dialog from "react-native-dialog";
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import moment from "moment";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import axios from "axios";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

const ShowDetailsPaneBachelorette = ({ refSheet, selected, authData, updateOutterState }) => {

    const { colors, theme } = useTheme();
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        showConfirmation: false
    })

    const renderContent = () => {
        if (typeof selected !== "undefined" && selected !== null) {
            return (
                <Fragment>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                        <View style={styles.container}>
                            <View style={[styles.hr, { marginTop: 22.25 }]} />
                            <Button style={{ backgroundColor: "#df4759", marginVertical: 12.25 }} full onPress={() => refSheet.current.close()}> 
                                {`Close/Cancel...`}
                            </Button>
                            <View style={styles.hr} />
                            <View style={styles.container}>
                                <View style={styles.header}>
                                    <Image style={colorSchemeDark ? [styles.avatar, { borderColor: "#fff" }] : [styles.avatar, { borderColor: "#000" }]} source={{ uri: `${BASE_ASSET_URL}/${selected.bachelor.profilePictures[selected.bachelor.profilePictures.length - 1].link}` }} />
                                    <View style={styles.info}>
                                    <Text style={styles.name}>{`${selected.postedName.charAt(0).toUpperCase()}${selected.postedName.slice(1)}`}</Text>
                                    <Text style={styles.username}>@{selected.posterUsername}</Text>
                                        <Button full style={{ backgroundColor: colors.accent }} onPress={() => {

                                            refSheet.current.close();

                                            setTimeout(() => {
                                                setState(prevState => {
                                                    return {
                                                        ...prevState,
                                                        showConfirmation: true
                                                    }
                                                })
                                            }, 725)
                                        }}>Register/Particpate!</Button>
                                    </View>
                                </View>
                                <View style={styles.stats}>
                                    <View style={styles.stat}>
                                        <Text style={[styles.statLabel, { color: colors.accent }]}>Joined User's</Text>
                                        <Text style={styles.statValue}>{typeof selected.joined !== "undefined" && selected.joined.length > 0 ? selected.joined.length : 0} user's</Text>
                                    </View>
                                    <View style={styles.stat}>
                                        <Text style={[styles.statLabel, { color: colors.accent }]}>Reward</Text>
                                        <Text style={styles.statValue}>{selected.listingData.rewardCountTokens} Token's</Text>
                                    </View>
                                    <View style={styles.stat}>
                                        <Text style={[styles.statLabel, { color: colors.accent }]}>Days Till Start</Text>
                                        <Text style={styles.statValue}>{moment(selected.creationDate).add(7, "d").fromNow(true)}</Text>
                                    </View>
                                </View>
                                <Text style={styles.bio}>
                                    In case you decide to take part in this occasion, your name will be enlisted and you will receive a notification when the event commences. The 'bachelorette' events involve a <Text style={{ color: colors.accent }}>sequence of activities where you will contend for tokens and the chance to go on a date with the bachelor</Text>, as the ultimate reward
                                </Text>
                                <View style={styles.hr} />
                                <Text style={styles.bioGreen}>
                                    NOTE: You'll be automatically granted access IF the maximum user count is met when you send your invite
                                </Text>
                                <View style={styles.hr} />
                                <Text style={styles.bio}>
                                    In our events, you will participate in activities and games similar to those in the <Text style={{ color: colors.primary }}>TV show 'The Bachelorette'</Text> to determine if you are compatible with the main player. We organize events for both males and females, allowing both genders to have a chance to participate and potentially find a match, so make sure you choose which game you join wisely.
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <View style={{ margin: 12.25 }}>
                        <View style={[styles.hr, { marginTop: 22.25 }]} />
                        <Button style={{ backgroundColor: "#df4759", marginVertical: 12.25, marginBottom: 32.25 }} full onPress={() => refSheet.current.close()}> 
                            {`Close/Cancel...`}
                        </Button>
                        <View style={[styles.hr, { marginTop: -10.25, marginBottom: 25 }]} />
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

    const joinCohort = () => {
        console.log("JoinCohort clicked/ran....");

        const configuration = {
            uniqueId: authData.uniqueId,
            accountType: authData.accountType,
            listingID: selected.id
        };

        axios.post(`${BASE_URL}/send/competition/request/invite`, configuration).then((res) => {
            if (res.data.message === "Successfully sent invitiation request!") {
                console.log("Successfully sent invitiation request!", res.data);

                const { listing, eliminate } = res.data;

                if (eliminate === true) {
                    console.log("ran!!!");

                    updateOutterState(prevState => {
                        return {
                            ...prevState,
                            listings: prevState.listings.filter((item) => item.id !== listing.id)
                        }
                    })
    
                    setTimeout(() => {
                        refSheet.current.close();
                    }, 725);
    
                    Toast.show({
                        type: 'success',
                        text1: `Successfully sent your competition request!`,
                        text2: `We've successfully sent the invite...`,
                        visibilityTime: 3250,
                        position: "bottom"
                    });
                } else {
                    console.log("this other one ran...");

                    updateOutterState(prevState => {
                        const copy = [...prevState.listings];
                        const indexMatch = copy.findIndex(item => item.id === listing.id);
                        copy[indexMatch] = listing;
                        return {
                            ...prevState,
                            listings: copy
                        }
                    })
    
                    setTimeout(() => {
                        refSheet.current.close();
                    }, 725);
    
                    Toast.show({
                        type: 'success',
                        text1: `Successfully sent your competition request!`,
                        text2: `We've successfully sent the invite...`,
                        visibilityTime: 3250,
                        position: "bottom"
                    });
                }
            } else if (res.data.message === "You've ALREADY joined this game/competition!") {

                refSheet.current.close();
                
                Toast.show({
                    type: 'error',
                    text1: res.data.message,
                    text2: `You have ALREADY joined this competition/game - you cannot rejoin...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            } else {
                console.log("Err", res.data);

                Toast.show({
                    type: 'error',
                    text1: `Error attempting to send request...`,
                    text2: `An error occurred while attempting to send your request - please try again or report to support if persists...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);
        });
    };

    return (
        <Fragment>
            <Dialog.Container visible={state.showConfirmation}>
                <Dialog.Title>Please confirm whether or not you do want to join this cohort...</Dialog.Title>
                <Dialog.Description>
                    Are you sure you'd like to join this cohort? You will be updated via notifications when the event starts and upon specific changes relevant to you during the event proceedings...
                </Dialog.Description>
                <Dialog.Button onPress={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            showConfirmation: false
                        }
                    })
                }} style={{ color: "darkred" }} label="Cancel" />
                <Dialog.Button onPress={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            showConfirmation: false
                        }
                    });

                    joinCohort();
                }} style={{ color: "green" }} label="Join!" />
            </Dialog.Container>     
            <RBSheet
                ref={refSheet}
                closeOnDragDown={false}
                closeOnPressMask={true}
                dragFromTopOnly={true}
                height={height * 0.925}
                closeDuration={35}
                openDuration={35}
                customStyles={{
                    container: {
                        paddingHorizontal: 10 * 2.0,
                        backgroundColor: colorSchemeDark ? "#000" : "#fff",
                        borderTopColor: "#fff",
                        borderTopWidth: 0.75,
                        width: "100%"
                    },
                    draggableIcon: {
                        width: width * 0.725
                    }
                }}
            >
                {renderContent()}
            </RBSheet>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
	return {
		authData: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, {  })(ShowDetailsPaneBachelorette);