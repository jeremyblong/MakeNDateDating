import React, { Fragment, useState, useCallback, useRef, useEffect } from "react";
import { View, Dimensions, TouchableOpacity, useColorScheme } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from "./nearbyUsersStyles.js";
import customMapStyle from "../../components/mapJSONStyles.js";
import RBSheet from "react-native-raw-bottom-sheet";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import Geolocation from '@react-native-community/geolocation';
import { connect } from "react-redux";
import Toast from 'react-native-toast-message';
// import PaneSheetDetailsHelper from "./helpers/sheetPanes/detailsPaneSheet/pane.js";
import Dialog from "react-native-dialog";
import { useNavigation } from "@react-navigation/native";
import { io } from "socket.io-client";
import {useTranslation} from 'react-i18next';
import { useTheme } from '@config';
import _ from "lodash";
import {
    Image,
    Header,
    Icon,
    Text,
    Button
} from '@components';
import { useFocusEffect } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import moment from "moment";


const socket = io(BASE_URL, { transports: ["websocket"] });

const { width, height } = Dimensions.get("window");

const COST_PER_MILE = 2.15;

const deafultLocation = { latitude: 45.516869, longitude: -122.682838, latitudeDelta: 0.0325, longitudeDelta: 0.0325 };

const ViewNearbyUsersMapView = ({ storageData, authData }) => {

    const { colors, theme } = useTheme();
    const {t} = useTranslation();   
    const colorSchemeDark = theme.dark;
    const navigation = useNavigation();
    const _carouselRef = useRef(null);
    const sheetRef = useRef(null);
    const mapViewRef = useRef(null);
    const detailsSheetRef = useRef(null);

    const [ state, setState ] = useState({
        region: { latitude: 45.516869, longitude: -122.682838, latitudeDelta: 0.0325, longitudeDelta: 0.0325 },
        markerMovableCoords: deafultLocation,
        sleeping: false,
        currentlySelected: undefined,
        closable: false,
        paneIsOpen: false,
        selectedInterval: null, //
        locationsNearby: [],
        calloutRelated: {},
        sleepState: false,
        origin: undefined,
        lineset: false,
        destination: undefined,
        detailsClosable: false,
        distanceAndDuration: undefined,
        dialogVisibility: false
    });

    const { region, dialogVisibility, paneIsOpen, distanceAndDuration, closable, selectedInterval, locationsNearby, currentlySelected, origin, destination, markerMovableCoords, detailsClosable } = state;

    const fetchCommentsToAddProfilePic = (users) => {

        const promises = [];
    
        if (typeof users !== "undefined" && users.length > 0) {
            for (let idxxxxx = 0; idxxxxx < users.length; idxxxxx++) {
                const userAccountData = users[idxxxxx];
                
                const { uniqueId } = userAccountData;
    
                promises.push(new Promise((resolve, reject) => {
                    // update comments state
                    const config = {
                        params: {
                            postedByID: uniqueId
                        }
                    };

                    axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
                        if (res.data.message === "Submitted gathered user's picture/file!") {

                            const { user } = res.data; 
    
                            userAccountData["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
    
                            resolve(userAccountData);
                        } else {
    
                            userAccountData["lastProfilePic"] = null;
    
                            resolve(userAccountData);
                        }
                    }).catch((err) => {
                        userAccountData["lastProfilePic"] = null;
    
                        resolve(userAccountData);
                    })
                }));
            };
    
            Promise.all(promises).then((passedValues) => {
    
                console.log("Promise passedValues.............:", passedValues);
    
                setState(prevState => {
                    return {
                        ...prevState,
                        locationsNearby: passedValues
                    }
                })
            });
        } else {
            console.log("NO comments available...!");
        }
    }
    console.log("locationsNearby", locationsNearby);
    
    useEffect(() => {
        console.log("Effect subcomments-related re-mounted...");
    
        fetchCommentsToAddProfilePic(locationsNearby);
    
    }, [...locationsNearby.map((user) => {
        return user.uniqueId;
    })])

    const sleepState = (milliseconds) => {

        setState(prevState => {
            return {
                ...prevState,
                sleepingState: true
            }
        })

        return new Promise(resolve => resolve(setTimeout(true, milliseconds)));
    }

    useFocusEffect(useCallback(() => {
        Geolocation.getCurrentPosition(info => {

            const { latitude, longitude } = info.coords;

            console.log("latitude, longitude", latitude, longitude);

            setState(prevState => {
                return {
                    ...prevState,
                    origin: [latitude, longitude],
                    region: { latitude, longitude, latitudeDelta: 0.0325, longitudeDelta: 0.0325 },
                    markerMovableCoords: { latitude, longitude, latitudeDelta: 0.0325, longitudeDelta: 0.0325 },
                    lineset: true
                }
            })
        
            const currentLoc = { latitude, longitude, latitudeDelta: 0.00875, longitudeDelta: 0.00875 };

            if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {

                const config = {
                    params: {
                        currentLoc,
                        interestedIn: authData.interestedIn,
                        accountType: authData.accountType,
                        uniqueId: authData.uniqueId
                    }
                };
    
                axios.get(`${BASE_URL}/gather/nearby/users`, config).then((res) => {
                    if (res.data.message === "Gathered nearby location users!") {
                        console.log(res.data);
    
                        const { results } = res.data;
    
                        fetchCommentsToAddProfilePic(results);
    
                        Toast.show({
                            type: 'success',
                            text1: `Successfully gathered the user's near you!`,
                            text2: `We've successfully gathered the related drop-off locations which should now be displayed on the appropriate places on the map...`,
                            visibilityTime: 3250,
                            position: "bottom",
                            onHide: () => {}
                        });
                    } else {
                        console.log("Err", res.data);
    
                        Toast.show({
                            type: 'error',
                            text1: `An error occurred while fetching user's near you!`,
                            text2: `We've encountered an error while attempting to fetch the user's near you, please try to load the page again or contact support if the problem persists...`,
                            visibilityTime: 3250,
                            position: "bottom"
                        });
                    }
                }).catch((err) => {
                    console.log(err.message);
    
                    // Toast.show({
                    //     type: 'error',
                    //     text1: `An error occurred while fetching user's near you!`,
                    //     text2: `We've encountered an error while attempting to fetch the user's near you, please try to load the page again or contact support if the problem persists...`,
                    //     visibilityTime: 3250,
                    //     position: "bottom"
                    // });
                })
            } else {
                Toast.show({
                    type: 'info',
                    text1: 'You must sign-in/up first...',
                    text2: `Please login/signup before accessing these features...`,
                    visibilityTime: 4250,
                    position: "bottom"
                });
            }
        }, (err) => {
            console.log("errrrrr geoloc :", err);
        });
    }, []));

    const onRegionChangeEnded = (region) => {
        setState(prevState => {
            return {
                ...prevState,
                region
            }
        })
    }   

    const onMarkerMainDragged = (region) => {

        const { latitude, longitude } = region.nativeEvent.coordinate;

        const currentLoc = { latitude, longitude, latitudeDelta: 0.00875, longitudeDelta: 0.00875 };

        console.log("currentlySelected", currentlySelected);

        if (typeof currentlySelected !== "undefined") {

            const longitudeDestination = currentlySelected.newlyConstructedCoordsRandomizedNearby.coordinates[0];
            const latitudeDestination = currentlySelected.newlyConstructedCoordsRandomizedNearby.coordinates[1];

            setState(prevState => {
                return {
                    ...prevState,
                    markerMovableCoords: currentLoc,
                    origin: [latitude, longitude],
                    destination: [latitudeDestination, longitudeDestination],
                    lineset: true
                }
            });
    
            sleepState(2250).then((identifierID) => {
                // clear previously set interval
                clearTimeout(identifierID);
        
                const config = {
                    params: {
                        currentLoc
                    }
                };
                // handle request...
                axios.get(`${BASE_URL}/gather/dropoff/locations/points`, config).then((res) => {
                    if (res.data.message === "Gathered relevant location points!") {
        
                        const { results } = res.data;
                        
                        console.log("resultsssssss", results);

                        const promises = [];

                        for (let idxxxxx = 0; idxxxxx < results.length; idxxxxx++) {
                            const userAccountData = results[idxxxxx];
                            
                            const { uniqueId } = userAccountData;
            
                            console.log("userAccountData", userAccountData);
                
                            promises.push(new Promise((resolve, reject) => {
                                // update comments state
                                const config = {
                                    params: {
                                        postedByID: uniqueId
                                    }
                                };
            
                                axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
                                    if (res.data.message === "Submitted gathered user's picture/file!") {
            
                                        const { user } = res.data; 
                
                                        userAccountData["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
                
                                        resolve(userAccountData);
                                    } else {
                
                                        userAccountData["lastProfilePic"] = null;
                
                                        resolve(userAccountData);
                                    }
                                }).catch((err) => {
                                    userAccountData["lastProfilePic"] = null;
                
                                    resolve(userAccountData);
                                })
                            }));
                        };
                
                        Promise.all(promises).then((passedValues) => {
                
                            console.log("Promise passedValues.............:", passedValues);
                
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    locationsNearby: passedValues,
                                    sleepingState: false
                                }
                            })
                        });  
                              
                    } else {
                        console.log("Err", res.data);
    
                        setState(prevState => {
                            return {
                                ...prevState,
                                sleepingState: false
                            }
                        })
                    }
                }).catch((err) => {
                    console.log(err.message);
    
                    setState(prevState => {
                        return {
                            ...prevState,
                            sleepingState: false
                        }
                    })
                });
            });
        } else {
            setState(prevState => {
                return {
                    ...prevState,
                    markerMovableCoords: currentLoc,
                    origin: [latitude, longitude],
                    lineset: true
                }
            });
    
            sleepState(2250).then((identifierID) => {
                // clear previously set interval
                clearTimeout(identifierID);
        
                const config = {
                    params: {
                        currentLoc
                    }
                };
                // handle request...
                axios.get(`${BASE_URL}/gather/dropoff/locations/points`, config).then((res) => {
                    if (res.data.message === "Gathered relevant location points!") {
        
                        const { results } = res.data;

                        console.log("resultsssssss", results);

                        const promises = [];

                        for (let idxxxxx = 0; idxxxxx < results.length; idxxxxx++) {
                            const userAccountData = results[idxxxxx];
                            
                            const { uniqueId } = userAccountData;
            
                            console.log("userAccountData", userAccountData);
                
                            promises.push(new Promise((resolve, reject) => {
                                // update comments state
                                const config = {
                                    params: {
                                        postedByID: uniqueId
                                    }
                                };
            
                                axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
                                    if (res.data.message === "Submitted gathered user's picture/file!") {
            
                                        const { user } = res.data; 
                
                                        userAccountData["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
                
                                        resolve(userAccountData);
                                    } else {
                
                                        userAccountData["lastProfilePic"] = null;
                
                                        resolve(userAccountData);
                                    }
                                }).catch((err) => {
                                    userAccountData["lastProfilePic"] = null;
                
                                    resolve(userAccountData);
                                })
                            }));
                        };
                
                        Promise.all(promises).then((passedValues) => {
                
                            console.log("Promise passedValues.............:", passedValues);
                
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    locationsNearby: passedValues,
                                    sleepingState: false
                                }
                            })
                        });  
        
                    } else {
                        console.log("Err", res.data);
    
                        setState(prevState => {
                            return {
                                ...prevState,
                                sleepingState: false
                            }
                        })
                    }
                }).catch((err) => {
                    console.log(err.message);
    
                    setState(prevState => {
                        return {
                            ...prevState,
                            sleepingState: false
                        }
                    })
                });
            });
        }
    }  

    const selectThisItem = () => {
        console.log("selectThisItem clicked/ran...");

        const config = {
            authData,
            currentlySelected,
            selectedInterval,
            distanceAndDuration,
            calculateValuePerMile
        }

        new Promise((resolve, reject) => {
            axios.post(`${BASE_URL}/post/new/request/available/collection/item`, config).then((res) => {
                if (res.data.message === "Successfully added item to queue!") {

                    const { listing } = res.data;

                    resolve(listing);
                } else {
                    resolve(null);
                }
            }).catch((err) => {
                console.log("err with request...: ", err);

                resolve(null);
            })
        }).then((listing) => {
            if (listing !== null) {

                socket.emit("new-available-electronic-delivery", listing);
                
                setState(prevState => {
                    return {
                        ...prevState,
                        selectedInterval: null
                    }
                })

                detailsSheetRef.current.close();

                Toast.show({
                    type: 'success',
                    text1: `We've SUCCESSFULLY posted your request, you will now be re-directed!`,
                    text2: `We've successfully posted/sent your request - we will now re-direct you where we'll wait to locate a driver to pickup your electronics for delivery!`,
                    visibilityTime: 2750,
                    position: "bottom",
                    onHide: () => navigation.replace("DrivingSelectingPendingView", { selected: currentlySelected })
                });
            } else {
                
                Toast.show({
                    type: 'error',
                    text1: `We encountered an error while attempting to post your request!`,
                    text2: `We've encountered an error while trying to process your request, please try the action again or contact support if the problem persists...`,
                    visibilityTime: 2750,
                    position: "bottom"
                });
            }
        })
    }

    useEffect( () => () => {
        
        console.log("unmount");

        setState({
            region: { latitude: 45.516869, longitude: -122.682838, latitudeDelta: 0.0325, longitudeDelta: 0.0325 },
            markerMovableCoords: deafultLocation,
            sleeping: false,
            currentlySelected: undefined,
            closable: false,
            paneIsOpen: false,
            selectedInterval: null, //
            locationsNearby: [],
            calloutRelated: {},
            sleepState: false,
            origin: undefined,
            lineset: false,
            destination: undefined,
            detailsClosable: false,
            distanceAndDuration: undefined
        });

        sheetRef.current.close();
    }, []);

    console.log("distanceAndDuration", distanceAndDuration);

    const calculateValuePerMile = (miles) => {
        return (COST_PER_MILE * miles).toFixed(2);
    }

    const renderNextAction = () => {
        if (selectedInterval !== null) {

            const renderSelectedOrNot = () => {
                if (typeof currentlySelected !== "undefined" && (JSON.stringify(markerMovableCoords) !== JSON.stringify(deafultLocation))) {
                    return (
                        <Fragment>
                            <View style={styles.backgroundRoundedSimple}>
                                <Text style={styles.selectedDataText}>You've Selected <Text style={styles.emphisizedText}>{selectedInterval.label}</Text></Text>
                                <View style={styles.margined}>
                                <Button outline onPress={() => {}}>
                                    {t('Something Here...')}
                                </Button>
                                </View>
                                {typeof distanceAndDuration !== "undefined" ? <View style={styles.columnOnly}><Text style={styles.selectedDataTextBottom}>This location is approx. <Text style={styles.emphisizedTextRed}>{`${distanceAndDuration.distance.toFixed(2)} mile's`}</Text> at about <Text style={styles.emphisizedText}>{`${distanceAndDuration.duration.toFixed(2)} min's`} transit</Text> at <Text style={styles.greenCashText}>{`$${(calculateValuePerMile(distanceAndDuration.distance))} (USD) total`}</Text>...</Text></View> : null}
                            </View>
                        </Fragment>
                    );
                } else {
                    return (
                        <Fragment>
                            <View style={styles.backgroundRoundedSimpleDefaulted}>
                                <Text style={styles.selectedDataText}>You've Selected <Text style={styles.emphisizedText}>{selectedInterval.label}</Text>, please move the main-marker to see appropriate route's...</Text>
                                {typeof distanceAndDuration !== "undefined" ? <View style={styles.columnOnly}><Text style={styles.selectedDataTextBottom}>This location is approx. <Text style={styles.emphisizedTextRed}>{`${distanceAndDuration.distance.toFixed(2)} mile's`}</Text> at about <Text style={styles.emphisizedText}>{`${distanceAndDuration.duration.toFixed(2)} min's`} transit</Text>...</Text></View> : null}
                            </View>
                        </Fragment>
                    );
                }
            }
            return (
                <Fragment>
                    {renderSelectedOrNot()}
                </Fragment>
            );
        }
    }
    const renderModalConfirmationContinuation = () => {
        return (
            <Dialog.Container visible={dialogVisibility}
                contentStyle={styles.dialogContainerStyle}
            >
                <View style={{ backgroundColor: 'white', alignItems: 'center', }}>
                    <Text style={styles.modalTitleText}>
                        Are you sure you'd like to select this dropoff "dropoff depot" to have your electronics delivered to? {"\n"}{"\n"}This WILL INITIATE a request for a driver to come to your house and pickup said electronics immediately upon acceptance {"(typically <= 5min)"}
                    </Text>
                    <View style={styles.modalHrLine} />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 10 * 2.0
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => setState(prevState => {
                                return {
                                    ...prevState,
                                    dialogVisibility: false
                                }
                            })}
                            style={styles.cancelButtonStyle}
                        > 
                            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Abandon Request...</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9}
                            onPress={() => {

                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        dialogVisibility: false
                                    }
                                })

                                selectThisItem();
                            }}
                            style={styles.dialogYesButtonStyle}
                        >
                            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Start Delivery!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog.Container>
        )
    }
    const _renderItem = ({item, index}) => {
        console.log("_renderItem item", item.username);
        return (
          <View style={styles.centerMeWrapper}>
            <View style={colorSchemeDark ? [styles.mainContainerIterated, { backgroundColor: "#000", borderWidth: 2, borderColor: "#fff" }] : styles.mainContainerIterated}>
              <TouchableOpacity onPress={() => {
                if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                    navigation.navigate('Profile1', { user: item });
                } else {
                    Toast.show({
                        type: 'info',
                        text1: 'You must sign-in/up first...',
                        text2: `Please login/signup before accessing these features...`,
                        visibilityTime: 4250,
                        position: "bottom"
                    });
                }
              }} activeOpacity={0.9}>
                <Image resizeMode={"cover"} source={{ uri: typeof item.lastProfilePic !== "undefined" && item.lastProfilePic !== null ? `${BASE_ASSET_URL}/${item.lastProfilePic.link}` : `https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/placeholder-loading.png` }} style={styles.blockImage} />
              </TouchableOpacity>
              <View style={{paddingHorizontal: 10, paddingVertical: 20 }}>
                <Text title4 semibold style={{ marginTop: 5, flex: 1, flexWrap: 'wrap', flexShrink: 1 }} numberOfLines={2}>
                    {`Name: ${item.firstName}\nUsername: @${item.username}`}
                </Text>
                <View style={styles.blockContentAddress}>
                  {/* <Icon name="map-marker-alt" color={colors.primaryLight} size={10} /> */}
                  <Text
                    caption1
                    grayColor
                    style={{
                      marginLeft: 0
                    }}
                    numberOfLines={1}>
                    {`${moment(item.birthdateRaw).fromNow(true)} old`}
                  </Text>
                </View>
                <View style={styles.blockContentDetail}>
                  <View style={{flex: 1}}>
                    <Text title3 primaryColor semibold>
                      {item.verficationCompleted ? "Account Verified!" : "Account Not Verified."}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    {/* <Tag onPress={() => {}}>
                      {Math.floor(Math.random() * (5 - 1 + 1) + 1)}
                    </Tag> */}
                    <View
                      style={{}}>
                      {/* <StarRating
                        disabled={true}
                        starSize={10}
                        maxStars={5}
                        rating={3}
                        selectedStar={rating => {}}
                        fullStarColor={BaseColor.yellowColor}
                      /> */}
                      <Text style={[styles.scoreText, { color: colors.accent }]}>{item.rank}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )
    }

    const renderMapUnauthedCentered = () => {
        if (typeof authData === "undefined" || _.isEmpty(authData)) {
            return (
                <Fragment>
                    <View style={styles.containerMiddle}>
                        <View style={colorSchemeDark ? [styles.cardMiddle, { backgroundColor: "#000" }] : [styles.cardMiddle, { backgroundColor: "#fff" }]}>
                            <Text style={styles.titleMiddle}>You must first login...</Text>
                            <TouchableOpacity style={[styles.buttonMiddle, { backgroundColor: colors.accent }]} onPress={() => navigation.replace("BottomTabNavigator", { screen: "Profile" })}>
                                <Text style={styles.buttonTextMiddle}>Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Fragment>
            );
        }
    }

    return (
        <Fragment>
            {renderModalConfirmationContinuation()}
            <RBSheet
                ref={sheetRef}
                onOpen={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            paneIsOpen: true
                        }
                    });
                }}
                onClose={() => {
                    setState(prevState => {
                        return {
                            ...prevState,
                            paneIsOpen: false
                        }
                    });
                }}
                closeOnDragDown={closable}
                closeOnPressMask={closable}
                height={!closable ? ((height * 0.20) - 75) * 5 : ((height * 0.20) - 67.5) * 5}
                openDuration={250}
                customStyles={{
                    container: {
                        paddingHorizontal: 10 * 2.0,
                    },
                    draggableIcon: {
                        width: width * 0.725
                    }
                }}
            >

            </RBSheet>
            {renderNextAction()}
            <Header
                title="Nearby User's"
                subTitle={"User's in your proximity..."}
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
            {renderMapUnauthedCentered()}
            <MapView
                showsTraffic={true}
                rotateEnabled={false}
                customMapStyle={customMapStyle}
                // onRegionChangeComplete={onRegionChangeEnded}
                region={region}
                ref={mapViewRef}
                style={styles.map}
                moveOnMarkerPress={false}
                provider={PROVIDER_GOOGLE}
            >   
                <Marker 
                    key={"abc123u2i34923jrlakdjfadfjk"}
                    onDragEnd={onMarkerMainDragged}
                    draggable={true}
                    coordinate={markerMovableCoords}
                    title={"This is your current location"}
                    description={"Move the map to reveal new \nout-of-bounds reports/incidents..."}
                />
                {typeof locationsNearby !== "undefined" && locationsNearby.length > 0 ? locationsNearby.map((location) => {
                    console.log("location", location);
                    // deconstruct variables...
                    const { currentApproxLocation, username, firstName, accountType } = location;
                    const longitude = currentApproxLocation.geo.coordinates[0];
                    const latitude = currentApproxLocation.geo.coordinates[1];
                    // return JSX data...
                    return (
                        <Marker
                            key={location.id}
                            coordinate={{ latitude, longitude, latitudeDelta: 0.00875, longitudeDelta: 0.00875 }}
                            onPress={(e) => {
                                console.log("selected.........");

                                if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                                    navigation.navigate('Profile1', { user: location })
                                } else {
                                    Toast.show({
                                        type: 'info',
                                        text1: 'You must sign-in/up first...',
                                        text2: `Please login/signup before accessing these features...`,
                                        visibilityTime: 4250,
                                        position: "bottom"
                                    });
                                }
                            }}
                            description={`${firstName} ~ ${accountType} account-type`}
                            title={username}
                        >
                            <Image
                                source={require("../../assets/icons/marker-3.png")}
                                style={{ width: 37.5, height: 42.5, maxWidth: 37.5, maxHeight: 47.5, minHeight: 47.5 }}
                                resizeMode={"contain"}
                            />
                        </Marker>
                    );
                }) : null}
            </MapView>
            <View style={styles.absoluteCentered}>
                <Carousel
                    ref={_carouselRef}
                    data={locationsNearby}
                    layout={'stack'} 
                    firstItem={1}
                    layoutCardOffset={Number(24)}
                    renderItem={_renderItem}
                    sliderWidth={width}
                    itemWidth={width * 0.825}
                />
            </View>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, { })(ViewNearbyUsersMapView);