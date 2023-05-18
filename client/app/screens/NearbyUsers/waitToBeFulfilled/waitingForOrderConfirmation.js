import React, { Fragment, useEffect, useState, useRef } from "react";
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from "react-native";
import styles from "./waitingForOrderConfirmationStyles.js";
import { io } from "socket.io-client";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import axios from "axios";
import uuid from "react-native-uuid";
import { connect } from "react-redux";
import _ from "lodash";
import { useNavigation } from "@react-navigation/native";
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import Geolocation from '@react-native-community/geolocation';
import moment from "moment";                        

const { width, height } = Dimensions.get("window");
const COST_PER_MILE = 2.15;
const socket = io(BASE_URL, { transports: ["websocket"] });

const WaitingToHaveDeliveryAcceptedHelper = ({ currentLocation, userData }) => {

    const navigation = useNavigation();
    
    const [ state, setState ] = useState({
        available: []
    })

    const { available } = state;

    const newSocketEmissionReceived = (listing) => {
                
        console.log("newSocketEmissionReceived listening...", listing);

        const config = {
            params: {
                postedByID: listing.newPostPostedByID
            }
        };

        axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
            if (res.data.message === "Submitted gathered user's picture/file!") {

                console.log("Succcccccccesssss: ", res.data);

                const { user } = res.data; 

                listing["avatarImage"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;

                setState(prevState => {
                    return {
                        ...prevState,
                        available: [...prevState.available, listing]
                    }
                })
            } else {
                console.log("Else ran upon axios request...:", res.data);

                listing["avatarImage"] = null;

                setState(prevState => {
                    return {
                        ...prevState,
                        available: [...prevState.available, listing]
                    }
                })
            }
        }).catch((err) => {

            console.log("Errrrrrrrrrrrrrr", err);

            listing["avatarImage"] = null;

            setState(prevState => {
                return {
                    ...prevState,
                    available: [...prevState.available, listing]
                }
            })
        });
    };

    useEffect(() => {
        socket.on('new-available-electronic-delivery', newSocketEmissionReceived);
    }, [socket]);

    useEffect(() => () => {
        console.log("unmount");

        socket.off('new-available-electronic-delivery', newSocketEmissionReceived);
    }, []);

    useEffect(() => {
        navigation.addListener('focus', () => {

            
            socket.on("new-available-electronic-delivery", (data) => {
                console.log("Websocket success data new-available-electronic-delivery is.....:", data);
            });

            console.log("currentLocation", currentLocation);

            if (currentLocation !== null && typeof currentLocation !== "undefined") {
                
                const { latitude, longitude } = currentLocation.coords;

                const currentLoc = { latitude, longitude, latitudeDelta: 0.00875, longitudeDelta: 0.00875 };

                const config = { 
                    params: {
                        currentLoc
                    }
                };

                axios.get(`${BASE_URL}/fetch/available/electronics/pending/selection/delivery`, config).then((res) => {
                    
                    console.log("RESSSSSSSSSSsssss.data", res.data);

                    if (res.data.message === "Successfully gathered related items based on geo-location!") {

                        const { listings } = res.data;

                        const promises = [];

                        for (let idxxxx = 0; idxxxx < listings.length; idxxxx++) {
                            const listing = listings[idxxxx];
                            
                            promises.push(new Promise((resolve, reject) => {
                                const config = {
                                    params: {
                                        postedByID: listing.newPostPostedByID
                                    }
                                };
                                axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
                                    if (res.data.message === "Submitted gathered user's picture/file!") {
                        
                                        console.log("Succcccccccesssss: ", res.data);
                        
                                        const { user } = res.data; 

                                        listing["avatarImage"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;

                                        resolve(listing);

                                    } else {
                                        console.log("Else ran upon axios request...:", res.data);

                                        listing["avatarImage"] = null;

                                        resolve(listing);
                                    }
                                }).catch((err) => {

                                    console.log("Errrrrrrrrrrrrrr", err);

                                    listing["avatarImage"] = null;

                                    resolve(listing);
                                });
                            }))
                        }

                        Promise.all(promises).then((passedValues) => {
                            console.log("passedValues.......", passedValues);

                            setState(prevState => {
                                return {
                                    ...prevState,
                                    available: passedValues
                                }
                            })
                        })
                        

                        setState(prevState => {
                            return {
                                ...prevState,
                                available: listings
                            }
                        })
                    } else {
                        console.log("Else within proper response ran...", res.data);
                    }
                }).catch((err) => {
                    console.log("err with request...: ", err);
                });
            } else {
                Geolocation.getCurrentPosition(info => {
                    console.log("Gathered information correctly - geo: ", info);

                    const currentLoc = { latitude: info.coords.latitude, longitude: info.coords.longitude, latitudeDelta: 5, longitudeDelta: 5 };

                    const config = { 
                        params: {
                            currentLoc
                        }
                    };

                    axios.get(`${BASE_URL}/fetch/available/electronics/pending/selection/delivery`, config).then((res) => {
                        
                        console.log("RESSSSSSSSSSsssss.data", res.data);

                        if (res.data.message === "Successfully gathered related items based on geo-location!") {

                            const { listings } = res.data;

                            const promises = [];

                            for (let idxxxx = 0; idxxxx < listings.length; idxxxx++) {
                                const listing = listings[idxxxx];
                                
                                promises.push(new Promise((resolve, reject) => {
                                    const config = {
                                        params: {
                                            postedByID: listing.newPostPostedByID
                                        }
                                    };
                                    axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
                                        if (res.data.message === "Submitted gathered user's picture/file!") {
                            
                                            console.log("Succcccccccesssss: ", res.data);
                            
                                            const { user } = res.data; 

                                            listing["avatarImage"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;

                                            resolve(listing);

                                        } else {
                                            console.log("Else ran upon axios request...:", res.data);

                                            listing["avatarImage"] = null;

                                            resolve(listing);
                                        }
                                    }).catch((err) => {

                                        console.log("Errrrrrrrrrrrrrr", err);

                                        listing["avatarImage"] = null;

                                        resolve(listing);
                                    });
                                }))
                            }

                            Promise.all(promises).then((passedValues) => {
                                console.log("passedValues.......", passedValues);

                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        available: passedValues
                                    }
                                })
                            })
                            

                            setState(prevState => {
                                return {
                                    ...prevState,
                                    available: listings
                                }
                            })
                        } else {
                            console.log("Else within proper response ran...", res.data);
                        }
                    }).catch((err) => {
                        console.log("err with request...: ", err);
                    });
                });
            }
        });
    }, []);

    const renderItem = ({ item, index }) => {
        const { newPostPostedByID, newPostPostedByName, newPostPostedByUsername, date, avatarImage } = item;

        console.log("item", item.avatarImage);

        // const { selectedInterval, distanceAndDuration, _id, id, postedByID, newlyConstructedCoordsRandomizedNearby, postedByName, postedByUsername, alreadyAccepted, latestAvailableSelectionTimeDate } = item.mainData;

        const calculateValuePerMile = (miles) => {
            return (COST_PER_MILE * miles).toFixed(2);
        }
        return (
            <Fragment key={index}>
                <View style={styles.boxedContainer}>
                    <View style={styles.rowOnly}>
                        <View style={styles.oneQuarterCol}>
                            <TouchableOpacity onPress={() => navigation.navigate("MainProfileViewScreen", { user: { uniqueId: item.newPostPostedByID } })} style={styles.avatarImageTouchable}>
                                {avatarImage !== null && typeof avatarImage !== "undefined" ? <Image source={{ uri: `${BASE_ASSET_URL}/${avatarImage.link}` }} style={styles.avatarListItem} /> : <Image source={require("../../../assets/images/blank-profile-pic.png")} style={styles.avatarListItem} />}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.threeQuarterCol}>
                            <Text style={styles.largerPriceText}><Text style={{ textDecorationLine: "underline" }}>${calculateValuePerMile(item.mainData.distanceAndDuration.distance)}</Text><Text style={styles.blackUnderlinedText}> Upon Delivery</Text></Text>
                        </View>
                    </View>
                    <Text style={styles.nameText}>Posted by: {newPostPostedByName} Aka {newPostPostedByUsername}</Text>
                    <View style={styles.rowOnly}>
                        <Text style={styles.secondRowHeaderText}>Active for another {moment(date).add(item.mainData.selectedInterval.minutes, 'minutes').fromNow()}...</Text>
                    </View>
                    <View style={styles.rowOnlyMaxed}>
                        <View style={styles.oneThirdColumn}>
                            <TouchableOpacity onPress={() => {}} style={styles.avatarImageTouchable}>
                                <View style={styles.rowOnly}>
                                    <View style={styles.smallerRowContainer}>
                                        <Image source={require("../../../assets/images/icon/cart-64.png")} style={styles.superSmallIconImage} />
                                        <Text style={styles.rightTextAlongImage}><Text style={{ color: colors.primary }}>{item.mainData.distanceAndDuration.distance.toFixed(2)}</Text> mi's</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.twoThirdColumn}>
                            <TouchableOpacity onPress={() => {}} style={styles.avatarImageTouchable}>
                                <View style={styles.rowOnly}>
                                    <View style={styles.smallerRowContainerLonger}>
                                        <Image source={require("../../../assets/images/icon/cart-64.png")} style={styles.superSmallIconImage} />
                                        <Text style={styles.rightTextAlongImage}><Text style={{ color: colors.secondary }}>{item.mainData.distanceAndDuration.duration.toFixed(2)}</Text> Est. Min(s)</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Fragment>
        );
    }
    const renderSkelatonEmpty = () => {
        return (
            <Fragment>
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <View style={styles.hr} />
                <View style={styles.centered}>
                    <Text style={styles.mainTextPlaceholder}>No results could be found ~ check back soon for newly posted listings...</Text>
                    <Image source={require("../../../assets/images/illustrations/no-results-1.png")} style={styles.maxedDesignedIcon} />
                </View>
                <View style={[styles.hr, { marginBottom: 32.25 }]} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
            </Fragment>
        );
    }
    return (
        <Fragment>
            <FlatList
                data={available}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.id}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, margin: 7.25, backgroundColor: "#fff", paddingBottom: 70 }}
                ListEmptyComponent={renderSkelatonEmpty}
            />
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    console.log("state loc", state.location.currentLoc);

    if (typeof state.location.currentLoc !== "undefined" && state.location.currentLoc !== "string" && typeof state.location.currentLoc === "object") {
        return {
            authData: state.auth.data,
            currentLocation: JSON.parse(JSON.parse(JSON.stringify(state.location.currentLoc)))
        }
    } else {
        console.log("else in TRY ran...", state.location);
        return {
            authData: state.auth.data,
            currentLocation: null
        }
    }
}
export default connect(mapStateToProps, { })(WaitingToHaveDeliveryAcceptedHelper);