import React, { Fragment, useState, useRef } from "react";
import { View, Keyboard, TouchableOpacity, Dimensions, FlatList, Image, useColorScheme, TextInput as CustomTextInput } from "react-native";
import { TextInput, Header, Icon, SafeAreaView, Tag, Button, Text } from "@components";
import styles from "./createNewMeetupStyles.js";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import {BaseStyle, useTheme} from '@config';
import RBSheet from "react-native-raw-bottom-sheet";
import SearchBar from 'react-native-search-bar';
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL, TOMTOM_API_KEY } from "@env";
import { ListItem } from 'react-native-elements';
import interests from "./selectOptions.js";
import uuid from "react-native-uuid";
import ActionSheet from 'react-native-actionsheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import _ from "lodash";
import Toast from 'react-native-toast-message';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from "react-native-date-picker";
import { Switch } from 'react-native-switch';
import Geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get("window");

const CreateANewMeetupForm = ({ authData }) => {

    const actionSheetRef = useRef(null);

    const navigation = useNavigation();

    const rbSheetRef = useRef(null);
    const activitiesInputRef = useRef(null);
    const activitiesInputRefPOI = useRef(null);
    const sheetLocOfInterestRef = useRef(null);
    const sheetActivitiesRef = useRef(null);
    const locationInputRef = useRef(null);
    const searchbarRef = useRef(null);
    const searchbarRefPOI = useRef(null);

    const { colors, theme } = useTheme();
    const {t} = useTranslation();
    const colorSchemeDark = theme.dark;

    console.log("colorSchemeDark", theme.dark);

    const [ state, setState ] = useState({
        groupTitle: "",
        memberCount: 0,
        searchResults: [],
        searchResultsPOI: [],
        selectedAddress: null,
        selectedTags: [],
        repeatingDateTime: false,
        description: "",
        loading: false,
        selectedDateTimeOrNot: false,
        selectedDateTime: new Date(),
        page: 1,
        currentLoc: null,
        currentSelectedPage: null,
        images: {
            imageOne: null,
            imageTwo: null,
            imageThree: null,
            imageFour: null,
            imageFive: null
        },
        selectedPOI: null
    });
    console.log("state", state);

    const handleCancellation = () => {
        console.log("handleCancellation clicked/ran...");

        searchbarRef.current.unFocus();

        setState(prevState => {
            return {
                ...prevState,
                searchResults: []
            }
        })

        rbSheetRef.current.close();
    }

    const handleCancellationPOI = () => {
        console.log("handleCancellation clicked/ran...");

        searchbarRef.current.unFocus();

        setState(prevState => {
            return {
                ...prevState,
                searchResults: []
            }
        })

        sheetLocOfInterestRef.current.close();
    }

    const handleSearch = (searchValue) => {
        searchbarRef.current.unFocus();

        const queryTerm = encodeURIComponent(searchValue.toLowerCase());

        axios.get(`https://api.tomtom.com/search/2/search/${queryTerm}.json?key=${TOMTOM_API_KEY}`).then((res) => {
            if (res.data) {
                console.log("Successfully gathered...", res.data);

                const { results } = res.data;

                setState(prevState => {
                    return {
                        ...prevState,
                        searchResults: results
                    }
                })
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    const handlePOISearch = (searchValue) => {
        searchbarRefPOI.current.unFocus();

        const queryTerm = encodeURIComponent(searchValue.toLowerCase());

        if (_.has(authData, "currentApproxLocation")) {
            const longitude = authData.currentApproxLocation.geo.coordinates[0];
            const latitude = authData.currentApproxLocation.geo.coordinates[1];
    
            axios.get(`https://api.tomtom.com/search/2/poiSearch/${queryTerm}.json?key=${TOMTOM_API_KEY}&lat=${latitude}&lon=${longitude}`).then((res) => {
                if (res.data) {
                    console.log("Successfully gathered...", res.data);
    
                    const { results } = res.data;
    
                    setState(prevState => {
                        return {
                            ...prevState,
                            searchResultsPOI: results
                        }
                    })
                } else {
                    console.log("Err", res.data);
                }
            }).catch((err) => {
                console.log(err.message);
            })
        } else {
            Geolocation.getCurrentPosition(info => {
      
                const { latitude, longitude } = info.coords;
            
                axios.get(`https://api.tomtom.com/search/2/poiSearch/${queryTerm}.json?key=${TOMTOM_API_KEY}&lat=${latitude}&lon=${longitude}`).then((res) => {
                    if (res.data) {
                        console.log("Successfully gathered...", res.data);
        
                        const { results } = res.data;
        
                        setState(prevState => {
                            return {
                                ...prevState,
                                searchResultsPOI: results
                            }
                        })
                    } else {
                        console.log("Err", res.data);
                    }
                }).catch((err) => {
                    console.log(err.message);
                })
            })
        }
    }
    const calculateDisabledPageTwo = () => {
        const { currentLoc, selectedPOI, selectedDateTimeOrNot } = state;

        const { imageOne, imageThree, imageTwo, imageFive, imageFour } = state.images;

        if ((imageOne !== null) && (imageTwo !== null) && (imageThree !== null) && (imageFive !== null) && (imageFour !== null)) {
            if (currentLoc !== null && selectedDateTimeOrNot) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
    const calculateDisabled = () => {
        const { groupTitle, description, memberCount, selectedAddress, selectedTags } = state;

        if ((typeof groupTitle !== "undefined" && groupTitle.length) && (selectedAddress !== null) && (memberCount !== 0) && (typeof description !== "undefined" && description.length) && (typeof selectedTags !== "undefined" && selectedTags.length > 0)) {
            return false;
        } else {
            return true;
        }
    }
    const handleAddySelection = (item) => {
        setState(prevState => {
            return {
                ...prevState,
                selectedAddress: {
                    municipality: item.address.municipality,
                    countrySubdivision: item.address.countrySubdivision
                }
            }
        })
        rbSheetRef.current.close();
    }
    
    const handleAddySelectionPOI = (item) => {
        
        const { lat, lon } = item.position;

        setState(prevState => {
            return {
                ...prevState,
                currentLoc: {
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta: 0.025,
                    longitudeDelta: 0.025
                },
                selectedPOI: {
                    name: item.poi.name,
                    freeformAddress: item.address.freeformAddress
                }
            }
        })
        sheetLocOfInterestRef.current.close();
    }
    const renderItem = ({ item, index }) => {
        return (
            <Tag
                onPress={() => setState(prevState => {
                    return {
                        ...prevState,
                        selectedTags: [...prevState.selectedTags, item.title]
                    }
                })}
                icon={
                    <Icon
                        name={"heart"}
                        size={16}
                        color={colorSchemeDark ? state.selectedTags.includes(item.title) ? colors.primary : "#fff" : state.selectedTags.includes(item.title) ? colors.primary : colors.secondary}
                        solid
                        style={{marginRight: 5}}
                    />
                }
                chip
                textStyle={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}
                style={{
                    marginTop: 5,
                    marginRight: 5
                }}>
                {item.title}
            </Tag>
        );
    };

    const postNewGroupLive = () => {
        console.log("postNewGroupLive clicked/ran...");

        const { currentLoc, selectedPOI, selectedDateTime, groupTitle, description, memberCount, selectedAddress, selectedTags, images, repeatingDateTime } = state;

        const { imageOne, imageThree, imageTwo, imageFive, imageFour } = state.images;

        const configuration = {
            selectedMeetupLocation: currentLoc, 
            locationMeetupDetails: selectedPOI, 
            meetupTime: selectedDateTime, 
            groupTitle, 
            description,    //
            memberCount, 
            selectedAddress, 
            selectedTags, 
            images,
            uniqueId: authData.uniqueId,
            repeatingDateTime,
            fullName: authData.firstName,
            username: authData.username
        }

        axios.post(`${BASE_URL}/organize/new/meetup/live/post`, configuration).then((res) => {
            if (res.data.message === "Successfully posted new meetup!") {
                console.log("Successfully gathered...", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully posted your meetup/group!`,
                    text2: `We've successfully posted/updated your meetup and it is now LIVE...`,
                    visibilityTime: 2375,
                    position: "bottom",
                    onHide: () => {
                        navigation.replace("BottomTabNavigator", { screen: "Home" });
                    }
                });
            } else {
                console.log("Err", res.data);

                Toast.show({
                    type: 'error',
                    text1: `Error attempting to post your meetup...`,
                    text2: `An error occurred while attempting to post your meetup, please try this action again or contact support if the problem persists...`,
                    visibilityTime: 2375,
                    position: "bottom"
                });

            }
        }).catch((err) => {
            console.log(err.message);

            // Toast.show({
            //     type: 'error',
            //     text1: `Error attempting to post your meetup...`,
            //     text2: `An error occurred while attempting to post your meetup, please try this action again or contact support if the problem persists...`,
            //     visibilityTime: 2375,
            //     position: "bottom"
            // });
        })
    }

    const renderImage = (num) => {
        switch (num) {
            case 1:
                return <Image source={{ uri: state.images.imageOne }} style={{ width: "100%", height: "100%" }} />
                break;
            case 2:
                return <Image source={{ uri: state.images.imageTwo }} style={{ width: "100%", height: "100%" }} />
                break;
            case 3:
                return <Image source={{ uri: state.images.imageThree }} style={{ width: "100%", height: "100%" }} />
                break;
            case 4:
                return <Image source={{ uri: state.images.imageFour }} style={{ width: "100%", height: "100%" }} />
                break;
            case 5:
                return <Image source={{ uri: state.images.imageFive }} style={{ width: "100%", height: "100%" }} />
                break;
            default:
                break;
        }
    }
    const handleImageSelection = async () => {

        const result = await launchImageLibrary({
            mediaType: "photo",
            quality: 1,
            includeBase64: true,
            selectionLimit: 1
        });

        if (!_.has(result, "didCancel")) {
			// saveAuthenticationDetails(data, oldData)
            setState(prevState => {
            	return {
            		...prevState,
            		loading: true
            	}
            })
            const asset = result.assets[0];

            const config = {
                base64: asset.base64,
                contentType: asset.type,
                filename: asset.fileName
            }

            axios.post(`${BASE_URL}/upload/misc/file/wo/saving`, config).then((res) => {
                if (res.data.message === "Uploaded successfully!") {
                    console.log(res.data);

                    const { file } = res.data;

                    Toast.show({
					    type: 'success',
					    text1: `Successfully uploaded/selected your photo!`,
					    text2: `We've successfully uploaded your profile photo - you will be redirectly momentarily...`,
					    visibilityTime: 2375,
					    position: "bottom"
					});

                    switch (state.currentSelectedPage) {
                        case 1:
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    currentSelectedPage: null,
                                    loading: false,
                                    images: {
                                        ...prevState.images,
                                        imageOne: `${BASE_ASSET_URL}/${file.link}`
                                    }
                                }
                            })
                            break;
                        case 2:
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    currentSelectedPage: null,
                                    loading: false,
                                    images: {
                                        ...prevState.images,
                                        imageTwo: `${BASE_ASSET_URL}/${file.link}`
                                    }
                                }
                            })
                            break;
                        case 3:
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    currentSelectedPage: null,
                                    loading: false,
                                    images: {
                                        ...prevState.images,
                                        imageThree: `${BASE_ASSET_URL}/${file.link}`
                                    }
                                }
                            })
                            break;
                        case 4:
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    currentSelectedPage: null,
                                    loading: false,
                                    images: {
                                        ...prevState.images,
                                        imageFour: `${BASE_ASSET_URL}/${file.link}`
                                    }
                                }
                            })
                            break;
                        case 5:
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    currentSelectedPage: null,
                                    loading: false,
                                    images: {
                                        ...prevState.images,
                                        imageFive: `${BASE_ASSET_URL}/${file.link}`
                                    }
                                }
                            })
                            break;
                        default:
                            console.log("the ELSE RAN?")
                            break;
                    }
                } else {
                    console.log("Err", res.data);

                    Toast.show({
					    type: 'error',
					    text1: `Error attempting to upload your image/photo!`,
					    text2: `Uploading your photo failed, please try this action again or contact support if the problem persists...`,
					    visibilityTime: 2375,
					    position: "bottom"
					});

                    setState(prevState => {
		            	return {
		            		...prevState,
		            		loading: false
		            	}
		            })
                }
            }).catch((err) => {
                console.log(err.message);

                // Toast.show({
				//     type: 'error',
				//     text1: `Error attempting to upload your image/photo!`,
				//     text2: `Uploading your photo failed, please try this action again or contact support if the problem persists...`,
				//     visibilityTime: 2375,
				//     position: "bottom"
				// });

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })
            })
        }
    }

    console.log("state.images", state.images);

    const handleTakeNewImage = async () => {
		const result = await launchCamera({
            mediaType: "photo",
            quality: 1,
            includeBase64: true,
            selectionLimit: 1
        });

        console.log("result", result);

        if (!_.has(result, "didCancel")) {
			// saveAuthenticationDetails(data, oldData)
            setState(prevState => {
            	return {
            		...prevState,
            		loading: true
            	}
            })
            const asset = result.assets[0];

            const config = {
                base64: asset.base64,
                contentType: asset.type,
                filename: asset.fileName
            }

            axios.post(`${BASE_URL}/upload/misc/file/wo/saving`, config).then((res) => {
                if (res.data.message === "Uploaded successfully!") {
                    console.log(res.data);

                    const { file } = res.data;

                    Toast.show({
					    type: 'success',
					    text1: `Successfully uploaded/selected your photo!`,
					    text2: `We've successfully uploaded your profile photo - you will be redirectly momentarily...`,
					    visibilityTime: 2375,
					    position: "bottom"
					});

                    switch (state.currentSelectedPage) {
                        case 1:
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    currentSelectedPage: null,
                                    loading: false,
                                    images: {
                                        ...prevState.images,
                                        imageOne: `${BASE_ASSET_URL}/${file.link}`
                                    }
                                }
                            })
                            break;
                        case 2:
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    currentSelectedPage: null,
                                    loading: false,
                                    images: {
                                        ...prevState.images,
                                        imageTwo: `${BASE_ASSET_URL}/${file.link}`
                                    }
                                }
                            })
                            break;
                        case 3:
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    currentSelectedPage: null,
                                    loading: false,
                                    images: {
                                        ...prevState.images,
                                        imageThree: `${BASE_ASSET_URL}/${file.link}`
                                    }
                                }
                            })
                            break;
                        case 4:
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    currentSelectedPage: null,
                                    loading: false,
                                    images: {
                                        ...prevState.images,
                                        imageFour: `${BASE_ASSET_URL}/${file.link}`
                                    }
                                }
                            })
                            break;
                        case 5:
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    currentSelectedPage: null,
                                    loading: false,
                                    images: {
                                        ...prevState.images,
                                        imageFive: `${BASE_ASSET_URL}/${file.link}`
                                    }
                                }
                            })
                            break;
                        default:
                            break;
                    }
                } else {
                    console.log("Err", res.data);

                    Toast.show({
					    type: 'error',
					    text1: `Error attempting to upload your image/photo!`,
					    text2: `Uploading your photo failed, please try this action again or contact support if the problem persists...`,
					    visibilityTime: 2375,
					    position: "bottom"
					});

                    setState(prevState => {
		            	return {
		            		...prevState,
		            		loading: false
		            	}
		            })
                }
            }).catch((err) => {
                console.log(err.message);

                // Toast.show({
				//     type: 'error',
				//     text1: `Error attempting to upload your image/photo!`,
				//     text2: `Uploading your photo failed, please try this action again or contact support if the problem persists...`,
				//     visibilityTime: 2375,
				//     position: "bottom"
				// });

                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })
            })
        }
    }

    const renderPlaceholderImage = () => {
        return <Image source={require("../../../assets/images/custom/placeholder-loading.png")} style={{ width: "100%", height: "100%" }} />
    }

    const renderMainContent = () => {
        if (state.page === 1) {
            return (
                <View style={theme.dark === true ? { backgroundColor: "#000", height: "100%", width, flex: 1 } : { backgroundColor: "#fff" }}>
                    <View style={styles.container}>
                        <Text style={styles.mainTitle}>Start A New Dating Group!</Text>
                        <Text style={styles.labeled}>Find your people or partner through real-life in-person meetups & groups. Use this to start your own new group wether it be hiking, board games, whatever... it can be anything!</Text>
                        <View style={styles.hr} />
                        <Text style={styles.label}>Enter the title for your new group/meetup</Text>
                        <TextInput
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    groupTitle: text
                                }
                            })}
                            secureTextEntry={false}
                            placeholder="Enter your group title..."
                            value={state.groupTitle}
                        />
                        <Text style={styles.label}>Maximum Member Count</Text>
                        <TextInput
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    memberCount: text.replace(/[^0-9]/g, '')
                                }
                            })}
                            keyboardType={"number-pad"}
                            secureTextEntry={false}
                            placeholder="Enter your group title..."
                            value={state.memberCount}
                        />
                        <Text style={styles.label}>Approx/General Location</Text>
                        <TextInput
                            onFocus={() => {
                                Keyboard.dismiss();
                                rbSheetRef.current.open();
                            }}
                            ref={locationInputRef}
                            secureTextEntry={false}
                            placeholder={state.selectedAddress !== null ? `${state.selectedAddress.municipality}` : "Tap to open location settings..."}
                        />
                        <Text style={styles.label}>Interest's</Text>
                        <TextInput
                            onFocus={() => {
                                Keyboard.dismiss();
                                sheetActivitiesRef.current.open();
                            }}
                            ref={activitiesInputRef}
                            secureTextEntry={false}
                            placeholder={"Tap to open location settings..."}
                        />
                        <Text style={styles.label}>Enter a description</Text>
                        <CustomTextInput
                            maxLength={750}
                            multiline={true}
                            numberOfLines={5}
                            style={colorSchemeDark ? { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 225, height: 225, padding: 7.25, marginTop: 12.25, color: "#fff" } : { backgroundColor: colors.card, textAlignVertical: 'top', minHeight: 225, height: 225, padding: 7.25, marginTop: 12.25, color: "#000" }}
                            secureTextEntry={false}
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    description: text
                                }
                            })}
                            placeholder="Enter your group description..."
                            value={state.description}
                            placeholderTextColor={colorSchemeDark ? "darkgrey" : "darkgrey"}
                        />
                        <View style={[styles.hr, { marginTop: 32.25 }]} />
                        <Button disabled={calculateDisabled()} style={calculateDisabled() ? { backgroundColor: "lightgrey", width: "100%", minWidth: "100%" } : { backgroundColor: "#00AD0D", width: "100%", minWidth: "100%" }} onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    page: 2
                                }
                            })
                        }}>
                            {t('Submit & Continue')}
                        </Button>
                        <View style={styles.hr} />
                    </View>
                </View>
            );
        } else {
            const { imageOne, imageThree, imageTwo, imageFive, imageFour } = state.images;

            return (
                <Fragment>
                    <View style={styles.container}>
                        <Text style={styles.mainTitle}>Time to wrap-up the last details!</Text>
                        <Text style={styles.labeled}>We will now need to collect the final details before creating your group. This includes but is not limited to privacy details, photo's of meetup spot/location, day/time(s) & more...</Text>
                        <View style={styles.hr} />
                        <Text style={styles.labeled}>Photo's of event <Text style={{ color: colors.primary }}>(must submit all 5 images, can be advertisements or event promotions)</Text></Text>
                        <View style={styles.rowOutterImages}>
                            <View style={styles.columnOne}>
                                <TouchableOpacity onPress={() => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            currentSelectedPage: 1
                                        }
                                    })

                                    setTimeout(() => {
                                        actionSheetRef.current.show();
                                    }, 350)
                                }} style={styles.firstColOne}>
                                    {imageOne === null ? renderPlaceholderImage() : renderImage(1)}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            currentSelectedPage: 2
                                        }
                                    })

                                    setTimeout(() => {
                                        actionSheetRef.current.show();
                                    }, 350)
                                }} style={styles.firstColTwo}>
                                    {imageTwo === null ? renderPlaceholderImage() : renderImage(2)}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.columnTwo}>
                                <TouchableOpacity onPress={() => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            currentSelectedPage: 3
                                        }
                                    })

                                    setTimeout(() => {
                                        actionSheetRef.current.show();
                                    }, 350)
                                }} style={styles.innerRowOne}>
                                    {imageThree === null ? renderPlaceholderImage() : renderImage(3)}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            currentSelectedPage: 4
                                        }
                                    })

                                    setTimeout(() => {
                                        actionSheetRef.current.show();
                                    }, 350)
                                }} style={styles.innerRowTwo}>
                                    {imageFour === null ? renderPlaceholderImage() : renderImage(4)}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            currentSelectedPage: 5
                                        }
                                    })

                                    setTimeout(() => {
                                        actionSheetRef.current.show();
                                    }, 350)
                                }} style={styles.innerRowThree}>
                                    {imageFive === null ? renderPlaceholderImage() : renderImage(5)}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.hr, { marginTop: 35 }]} />
                        <Text style={styles.label}>Location of meetup</Text>
                        <TextInput
                            onFocus={() => {
                                Keyboard.dismiss();
                                sheetLocOfInterestRef.current.open();
                            }}
                            ref={activitiesInputRefPOI}
                            secureTextEntry={false}
                            placeholder={"Tap to open location settings..."}
                        />
                        <View style={{ marginTop: 20 }} />
                        {state.selectedPOI !== null ? <View style={styles.mapWrapper}>
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                style={styles.map}
                                region={state.currentLoc}
                                onRegionChange={() => {}}
                            >
                                <Marker
                                    draggable={true}
                                    coordinate={state.currentLoc}
                                />
                            </MapView>
                        </View> : <Fragment>
                            <Image resizeMode="contain" source={require("../../../assets/images/custom/searchable.png")} style={styles.map} />
                        </Fragment>}
                        <View style={[styles.hr, { marginTop: 35 }]} />
                        <Text style={styles.label}>Select your meeting time/date <Text style={{ color: colors.primary }}>(must be in the future and up-to 2 months from now)</Text></Text>
                        <DatePicker
                            date={state.selectedDateTime}
                            minimumDate={new Date()}
                            mode="datetime" 
                            maximumDate={new Date(new Date().setMonth(new Date().getMonth() + 2))}
                            textColor={colorSchemeDark ? "#fff" : "#000"}
                            onDateChange={(date) =>  setState(prevState => {
                                return {
                                    ...prevState,
                                    selectedDateTime: date,
                                    selectedDateTimeOrNot: true
                                }
                            })} 
                        />
                        <View style={[styles.hr, { marginTop: 35 }]} />
                        <Text style={styles.label}>Select whether this is a <Text style={{ color: colors.primary }}>'one-time'</Text> event or a <Text style={{ color: colors.primary }}>'recurring'</Text> weekly event (until cancelled or group closed)</Text>
                        <Switch
                            value={state.repeatingDateTime}
                            onValueChange={(val) => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        repeatingDateTime: val
                                    }
                                })
                            }}
                            disabled={false}
                            activeText={'Repeat Weekly'}
                            inActiveText={'One-Time'}
                            circleSize={40}
                            barHeight={35}
                            circleBorderWidth={3}
                            backgroundActive={"#000"}
                            backgroundInactive={'gray'}
                            circleActiveColor={"green"}
                            circleInActiveColor={"lightgrey"}
                            changeValueImmediately={true}
                            innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                            outerCircleStyle={{}}
                            renderActiveText={true}
                            renderInActiveText={true}
                            switchLeftPx={2}
                            switchRightPx={2}
                            switchWidthMultiplier={3.5}
                            switchBorderRadius={30}
                        />
                        <View style={[styles.hr, { marginTop: 35 }]} />
                        <Button disabled={calculateDisabledPageTwo()} style={calculateDisabledPageTwo() ? { backgroundColor: "lightgrey", width: "100%", minWidth: "100%" } : { backgroundColor: "#00AD0D", width: "100%", minWidth: "100%" }} onPress={() => postNewGroupLive()}>
                            {t('Submit & Continue')}
                        </Button>
                        <View style={styles.hr} />
                    </View>
                </Fragment>
            );
        }
    }
    return (
        <Fragment>
            <SafeAreaView style={theme.dark === true ? { flex: 1, backgroundColor: "#000" } : { flex: 1, backgroundColor: "#fff" }} edges={['right', 'left', 'bottom']}>
                <ActionSheet
                    ref={actionSheetRef}
                    title={`Select which type of upload you'd like to make..`}
                    options={['Select an existing photo', 'Take a new photo', "Cancel/Close Pane"]}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => {
                        switch (index) {
                            case 0:
                                handleImageSelection();
                                break;
                            case 1:
                                handleTakeNewImage();
                                break;
                            default: 
                                break;
                        }
                    }}
                />
                <RBSheet
                    ref={sheetActivitiesRef}
                    height={height}
                    openDuration={325}
                    closeOnDragDown={true}
                    customStyles={{
                        draggableIcon: {
                            minWidth: width * 0.775
                        }
                    }}
                >
                    <View style={{ margin: 12.25 }}>
                        <FlatList
                            horizontal={false}
                            maxToRenderPerBatch={100}
                            ListHeaderComponent={() => (
                                <Fragment>
                                    <View style={styles.hr} />
                                    <Button style={{ backgroundColor: "#00AD0D", width: "100%", minWidth: "100%" }} onPress={() => sheetActivitiesRef.current.close()}>
                                        {t('Submit/Complete Or Close')}
                                    </Button>
                                    <View style={styles.hr} />
                                    <Text style={styles.interestsText}>Click what you're generally interested in to give group members an idea of your personality so they know a little more about you, the group creator/leader...</Text>
                                    <View style={styles.hr} />
                                </Fragment>
                            )}
                            updateCellsBatchingPeriod={750}
                            initialNumToRender={75}
                            showsHorizontalScrollIndicator={false}
                            data={interests}
                            contentContainerStyle={{ display: "flex", flexDirection: "row", flexWrap: 'wrap' }}
                            keyExtractor={() => uuid.v4()} 
                            renderItem={renderItem}
                        />
                    </View>
                </RBSheet>
                <RBSheet
                    ref={sheetLocOfInterestRef}
                    height={height}
                    openDuration={325}
                    closeOnDragDown={true}
                    customStyles={{
                        draggableIcon: {
                            minWidth: width * 0.775
                        }
                    }}
                >
                    <View style={{ margin: 12.25 }}>
                        <SearchBar
                            ref={searchbarRefPOI}
                            placeholder="Search for a POI (Point Of Interest)..."
                            onChangeText={() => {}}
                            onSearchButtonPress={handlePOISearch}
                            onCancelButtonPress={handleCancellationPOI}
                        />
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            horizontal={false}
                            data={state.searchResultsPOI}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => {
                                console.log("itemmmmm", item.position);

                                return (
                                    <ListItem button={true} onPress={() =>  handleAddySelectionPOI(item)}>
                                        <ListItem.Content>
                                            <ListItem.Title style={styles.titled}>{item.poi.name}</ListItem.Title>
                                            <Text style={styles.subtitleText}>{item.address.freeformAddress}</Text>
                                        </ListItem.Content>
                                    </ListItem>
                                );
                            }}
                        />
                    </View>
                </RBSheet>
                <RBSheet
                    ref={rbSheetRef}
                    height={height}
                    openDuration={325}
                    closeOnDragDown={true}
                    customStyles={{
                        draggableIcon: {
                            minWidth: width * 0.775
                        }
                    }}
                >
                    <View style={{ margin: 12.25 }}>
                        <SearchBar
                            ref={searchbarRef}
                            placeholder="Search for city..."
                            onChangeText={() => {}}
                            onSearchButtonPress={handleSearch}
                            onCancelButtonPress={handleCancellation}
                        />
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            horizontal={false}
                            data={state.searchResults}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => (
                                <ListItem button={true} onPress={() =>  handleAddySelection(item)}>
                                    <ListItem.Content>
                                        <ListItem.Title style={styles.titled}>{item.address.municipality}</ListItem.Title>
                                        <Text style={styles.subtitleText}>{item.address.countrySubdivision}</Text>
                                    </ListItem.Content>
                                </ListItem>
                            )}
                        />
                    </View>
                </RBSheet>
                <Spinner
                    visible={state.loading}
                    textContent={'Loading/Uploading...'}
                    textStyle={styles.spinnerTextStyle}
                    overlayColor={"rgba(0, 0, 0, 0.725)"}
                />
                <Header
                    title="Create Community"
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
                    style={theme.dark === true ?  { color: "#fff", backgroundColor: "#000" } : { color: "#000", backgroundColor: "#fff" }}
                    onPressLeft={() => {
                        navigation.goBack();
                    }}
                />
                <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 50, flexGrow: 1 }} keyboardShouldPersistTaps='always'>
                    {renderMainContent()}
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </Fragment>
    );
}

const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
  }
  
  export default connect(mapStateToProps, {  })(CreateANewMeetupForm);