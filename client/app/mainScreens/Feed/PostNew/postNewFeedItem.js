import React, { Fragment, useState, useEffect, useRef } from "react";
import { Text, Header, Icon, Button } from "@components";
import { useTheme } from '@config';
import styles from './postNewFeedItemStyles.js';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useNavigation } from "@react-navigation/native";
import { PERMISSIONS, request } from 'react-native-permissions';
import { Platform, PermissionsAndroid, Dimensions, FlatList, View, Image, TouchableOpacity, SafeAreaView, useColorScheme, ScrollView, TextInput } from "react-native";
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import FILTERS from "./Helpers/filters.js";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import _ from "lodash";
import axios from "axios";
import { BASE_URL } from "@env";
import Spinner from 'react-native-loading-spinner-overlay';
import * as Progress from 'react-native-progress';
import uuid from "react-native-uuid";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
            
const { width, height } = Dimensions.get("window");

const PostNewIndividualFeedItem = ({ authData }) => {
    console.log("authData", authData);

    const { theme, colors } = useTheme();
    const navigation = useNavigation();
    const colorSchemeDark = theme.dark;
    const captionRef = useRef(null);
    const hashtagRef = useRef(null);
    const flatlistRef = useRef(null);

    const [ state, setState ] = useState({
        photos: [],
        reFormatted: [],
        ready: false,
        spinner: false,
        selected: null,
        progressNumber: 0,
        postData: {
            captionText: "",
            hashtags: ""
        },
        multiple: false,
        selectedArr: [],
        currentlySelectedFilterItem: null,
        page: 1,
        selectedFilterIndex: 0,
        finalArr: []
    }); 

    const calculateTags = () => {
        const tagsFrom = (text) => {
            var toReturn=[], i=0, hashtag=false
            let isNumber=(n)=>Number(n).toString()==n
            let isValidChar=(c)=>c=="_"?true:isNumber(c)||(c.toUpperCase()!=c.toLowerCase())
            for(let c of text){
              if(typeof toReturn[i]!="string"){toReturn[i]=""}
              if(c=="#"){hashtag=true;continue} 
              if(isValidChar(c)&&hashtag){toReturn[i]+=c} 
              else if(hashtag){hashtag=false;i++}
            }
            return toReturn.filter(tag=>tag.length&&!isNumber(tag))
        }
        const replaced = tagsFrom(state.postData.hashtags);
        return replaced;
    }

    useEffect(async () => {

        // PERMISSIONS.IOS.PHOTO_LIBRARY;

        const hasAndroidPermission = async () => {
            const permission = 
           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
          
            const hasPermission = await PermissionsAndroid.check(permission);
            if (hasPermission) {
              return true;
            }
          
            const status = await PermissionsAndroid.request(permission);
            return status === 'granted';
        }

        if (Platform.OS === "android") {
            console.log("await hasAndroidPermission()", await hasAndroidPermission());
            
            if (await hasAndroidPermission() === true) {
                const params = {
                    first: 100,
                    assetType: 'All',
                    groupTypes: "All"
                };
                CameraRoll.getPhotos(params).then((photos) => {
                    console.log("photos", photos);
        
                    if (_.has(photos.edges[0], "node")) {
                        setState(prevState => {
                            return {
                                ...prevState,
                                photos: photos.edges,
                                selected: photos.edges[0].node.image.uri,
                                ready: true
                            }
                        })
                    }
                }).catch((err) => {
                    // Error Loading Images
                    console.log("Error Loading Images...", err);

                    navigation.goBack();
                });
            }
        } else {
            request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(async (result) => {
                const params = {
                    first: 100,
                    assetType: 'All',
                    groupTypes: "All"
                };
                CameraRoll.getPhotos(params).then((photos) => {
                    console.log("photos", photos);
        
                    if (_.has(photos.edges[0], "node")) {
                        setState(prevState => {
                            return {
                                ...prevState,
                                photos: photos.edges,
                                selected: photos.edges[0].node.image.uri,
                                ready: true
                            }
                        })
                    }
                }).catch((err) => {
                    // Error Loading Images
                    console.log("Error Loading Images...", err);
                });
            }).catch((error) => {
                console.log("error", error);

                navigation.goBack();
            });
        }
    }, [])

    const handleConditionalAddition = (itemUri) => {
        if (state.multiple === true) {
            if (typeof state.selectedArr !== "undefined" && state.selectedArr.length < 10) {
                if (state.selectedArr.includes(itemUri)) {
                    setState(prevState => {
                        return {
                            ...prevState,
                            selectedArr: prevState.selectedArr.filter(data => data !== itemUri),
                            selected: itemUri
                        }
                    })
                } else {
                    setState(prevState => {
                        return {
                            ...prevState,
                            selectedArr: [...prevState.selectedArr, itemUri],
                            selected: itemUri
                        }
                    })
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: `Can't upload more than 10 items!`,
                    text2: `Error, you cannot upload more than 10 items, please remove some item's and add others if you wish to do so but 10 is the maxiumum upload count...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            }
        } else {
            setState(prevState => {
                return {
                    ...prevState,
                    selectedArr: [itemUri],
                    selected: itemUri
                }
            })
        }
    }

    const forwardOrBackwards = (val) => {
        console.log("forwardOrBackwards clicked/ran...", state.page);

        if (val === "backward" && state.page === 2) {
            setState(prevState => {
                return {
                    ...prevState,
                    page: val === "forward" ? prevState.page + 1 : prevState.page - 1,
                    currentlySelectedFilterItem: prevState.selectedArr[0],
                    reFormatted:  val === "backward" ? [] : prevState.reFormatted,
                    selectedArr: []
                }
            })
        } else {
            if (state.page === 2) {
                console.log("------------------- ran --------------------------");

                setState(prevState => {
                    return {
                        ...prevState,
                        page: val === "forward" ? prevState.page + 1 : prevState.page - 1,
                        currentlySelectedFilterItem: prevState.selectedArr[0],
                        reFormatted:  val === "backward" ? [] : prevState.reFormatted
                    }
                })
            } else {
                setState(prevState => {
                    return {
                        ...prevState,
                        page: val === "forward" ? prevState.page + 1 : prevState.page - 1,
                        currentlySelectedFilterItem: prevState.selectedArr[0],
                        reFormatted:  val === "backward" ? [] : prevState.reFormatted
                    }
                })   
            }
        }
    }

    console.log("state.finalArr", state.selectedFilterIndex);

    console.log("state.selectedArr", state.selectedArr);

    const submitPost = () => {
        const { captionText } = state.postData;

        console.log("submitPost clicked/ran...", state.finalArr);

        setState(prevState => {
            return {
                ...prevState,
                spinner: true
            }
        })

        const tags = calculateTags();

        console.log("tags tags tags", tags);

        const formData = new FormData();

        formData.append("captionText", captionText);
        formData.append("hashtags", tags);
        formData.append("uniqueId", authData.uniqueId);
        formData.append("postedName", authData.firstName);
        formData.append("posterUsername", authData.username);
        formData.append("filterIndexSelected", state.selectedFilterIndex);

        const awaitResponse = new Promise((resolve, reject) => {
            for (let index = 0; index < state.finalArr.length; index++) {
                const link = state.finalArr[index];
    
                formData.append("images", { uri: Platform.OS === 'ios' ? link.replace('file://', '') : link, name: uuid.v4() + ".jpg", type: "image/jpeg" });   
    
                if ((state.finalArr.length - 1) === index) {
                    resolve();
                }
            }
        });

        awaitResponse.then(() => { //
            setTimeout(() => {
                console.log("formData", formData);
                axios({
                    method: "post",
                    url: `${BASE_URL}/post/new/feed/item`,
                    data: formData,
                    headers: { 
                        "Content-Type": "multipart/form-data" 
                    }
                }).then((res) => {
                    if (res.data.message === "Successfully posted item!") {
                        console.log("res.data success!", res.data);

                        navigation.replace("BottomTabNavigator", { screen: "Home" });
        
                        setState(prevState => {
                            return {
                                ...prevState,
                                spinner: false
                            }
                        })
        
                        Toast.show({
                            type: 'success',
                            text1: `Successfully posted your post/item!`,
                            text2: `We've successfully posted your data/item & it is now live... congrats!`,
                            visibilityTime: 2750,
                            position: "bottom",
                            onHide: () => {}
                        });
                    } else {
                        console.log("Err", res.data);
        
                        setState(prevState => {
                            return {
                                ...prevState,
                                spinner: false
                            }
                        })
        
                        Toast.show({
                            type: 'error',
                            text1: `An error occurred while processing your request.`,
                            text2: `We've experienced an error attempting to submit your new feed post - please try this action again.`,
                            visibilityTime: 2750,
                            position: "bottom"
                        });
                    }
                }).catch((err) => {
                    console.log(err.message);
        
                    setState(prevState => {
                        return {
                            ...prevState,
                            spinner: false
                        }
                    })
        
                    // Toast.show({
                    //     type: 'error',
                    //     text1: `An error occurred while processing your request.`,
                    //     text2: `We've experienced an error attempting to submit your new feed post - please try this action again.`,
                    //     visibilityTime: 2750,
                    //     position: "bottom"
                    // });
                })
            }, 1750)
        })
    }

    const renderMainLogic = () => {
        const { photos, multiple, page, ready, selectedFilterIndex, currentlySelectedFilterItem } = state;

        if (page === 1) {
            if (ready) {
                const renderItem = ({item, index}) => {
                    if (item.empty === true) {
                        return <View style={[styles.item, styles.itemInvisible]} />;
                    }
                    return (
                        <Fragment>
                            <TouchableOpacity onPress={() => handleConditionalAddition(item.node.image.uri)} style={[styles.item, { height: width / 4 }]}>
                                {_.has(item, "node") ? <Image
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    source={{ uri: item.node.image.uri }}
                                /> : null}
                                {_.has(item, "node") && state.selectedArr.includes(item.node.image.uri) ? <Image
                                    style={styles.checkedIcon}
                                    source={require("../../../assets/icons/greencheck.png")}
                                /> : null}
                            </TouchableOpacity>
                        </Fragment>
                    );
                }
                
                const formatRow = (data, numColumns) => {
                    const numberOfFullRows = Math.floor(data.length / numColumns);
                    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
                    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
                        data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
                        numberOfElementsLastRow++;
                    }
                    return data;
                }
                return (
                    <Fragment>
                        <View style={styles.container}>
                            <View style={styles.contentContainer}>
                                <View style={styles.backgroundTopWrapper}>
                                    <View style={styles.oneQuarter}>
                                  
                                    </View>
                                    <View style={styles.middleChunk}>
                                        
                                    </View>
                                    <View style={styles.oneQuarter}>
                                        {typeof state.selectedArr !== "undefined" && state.selectedArr.length > 0 ? <TouchableOpacity onPress={() => forwardOrBackwards("forward")}><Image
                                            style={styles.galleryIconTwo}
                                            source={require("../../../assets/icons/forward.png")}
                                        /></TouchableOpacity> : null}
                                    </View>
                                </View>
                                <Image resizeMode="contain" source={{ uri: state.selected }} style={styles.stretchedFull} />
                                <TouchableOpacity onPress={() => {
                                    if (multiple === true) {
                                        setState(prevState => {
                                            return {
                                                ...prevState,
                                                multiple: !prevState.multiple,
                                                selectedArr: prevState.selectedArr[0]
                                            }
                                        })
                                    } else {
                                        setState(prevState => {
                                            return {
                                                ...prevState,
                                                multiple: !prevState.multiple
                                            }
                                        })
                                    }
                                }} style={styles.positionAlignRight}>
                                    <Image
                                        style={styles.galleryIcon}
                                        source={require("../../../assets/icons/gallery.png")}
                                    />
                                    <Text style={[styles.multipleText, { color: "#000" }]}>{!state.multiple ? "Select Multiple..." : "Switch To Single Selector..."}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.footer}>
                                <FlatList
                                    data={formatRow(photos, 4)}
                                    renderItem={renderItem}
                                    numColumns={4}
                                /> 
                            </View>
                        </View>
                    </Fragment>
                );
            } else {
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
        } else if (page === 2) {

            console.log("currentlySelectedFilterItem", currentlySelectedFilterItem, state.selectedArr);
            
            const onExtractImage = ({nativeEvent}) => {
                // extractedUri.current = nativeEvent.uri;
                const findIndex = state.selectedArr.findIndex(data => data === currentlySelectedFilterItem);
                const copy = [...state.selectedArr];
                copy[findIndex] = currentlySelectedFilterItem;

                setState(prevState => {
                    return {
                        ...prevState,
                        selectedArr: copy
                    }
                })
            };
            const onSelectFilter = selectedIndex => {
                setState(prevState => {
                    return {
                        ...prevState,
                        selectedFilterIndex: selectedIndex
                    }
                })
            };
            const renderFilterComponent = ({item, index}) => {
                const FilterComponent = item.filterComponent;
                const image = (
                    <Image
                        style={styles.filterSelectorFilter}
                        source={{ uri: currentlySelectedFilterItem }}
                        resizeMode={'contain'}
                    />
                );
                return (
                    <TouchableOpacity onPress={() => onSelectFilter(index)}>
                        <Text style={styles.filterTitleFilter}>{item.title}</Text>
                        <FilterComponent image={image} />
                    </TouchableOpacity>
                );
            };

            const SelectedFilterComponent = FILTERS[selectedFilterIndex].filterComponent;
            
            return (
                <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 150 }} keyboardShouldPersistTaps='always'>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 62.25 }}>
                        <SafeAreaView>
                            <View style={styles.contentContainer}>
                                <View style={styles.backgroundTopWrapper}>
                                    <View style={styles.oneQuarter}>
                                        <TouchableOpacity onPress={() => forwardOrBackwards("backward")}>
                                            <Image
                                                style={styles.galleryIconTwo}
                                                source={require("../../../assets/icons/backward.png")}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.middleChunk}>
                                        
                                    </View>
                                    <View style={styles.oneQuarter}>
                                        {typeof state.selectedArr !== "undefined" && state.selectedArr.length > 0 ? <TouchableOpacity onPress={() => forwardOrBackwards("forward")}><Image
                                            style={styles.galleryIconTwo}
                                            source={require("../../../assets/icons/forward.png")}
                                        /></TouchableOpacity> : null}
                                    </View>
                                </View>
                            </View>
                            <FlatList
                                data={state.selectedArr}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={item => item}
                                horizontal={true}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                            {selectedFilterIndex === 0 ? (
                                                <Image
                                                    style={styles.imageFilter}
                                                    source={{ uri: item }}
                                                    resizeMode={'contain'}
                                                />
                                            ) : (
                                                <SelectedFilterComponent
                                                    onExtractImage={onExtractImage}
                                                    extractImageEnabled={true}
                                                    image={
                                                        <Image
                                                            style={styles.imageFilter}
                                                            source={{ uri: item }}
                                                            resizeMode={'contain'}
                                                        />
                                                    }
                                                />
                                            )}
                                        </View>
                                    );
                                }}
                            />
                            <FlatList
                                data={FILTERS}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={item => item.title}
                                horizontal={true}
                                renderItem={renderFilterComponent}
                            />
                            <View style={[styles.centered, { margin: 6.25 }]}>
                                <Text style={colorSchemeDark ? [styles.applyToAllText, { color: "#fff" }] : [styles.applyToAllText, { color: "#000" }]}>This will apply this filter to ALL images...</Text>
                            </View>
                        </SafeAreaView>
                    </ScrollView>
                </KeyboardAwareScrollView>
            );
        } else if (page === 3) {

            const SelectedFilterComponent = FILTERS[selectedFilterIndex].filterComponent;

            const onExtractImage = ({nativeEvent}) => {
                console.log("nativeEvent", nativeEvent);
                // extractedUri.current = nativeEvent.uri;

                setState(prevState => {
                    return {
                        ...prevState,
                        finalArr: [...prevState.finalArr, nativeEvent.uri]
                    }
                })
            };

            const renderItem = ({ item, index }) => {
                console.log("item", item);
                return (
                    <Fragment key={index}>
                        <SelectedFilterComponent
                            onExtractImage={onExtractImage}
                            extractImageEnabled={true}
                            style={styles.imageFilterCustomized}
                            image={
                                <Image
                                    style={styles.imageFilterCustomized}
                                    source={{ uri: item }}
                                    resizeMode={'contain'}
                                />
                            }
                        />
                    </Fragment>
                );
            }
            return (
                <Fragment>
                    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingBottom: 62.25 }}>
                        <SafeAreaView>
                            <View style={styles.contentContainer}>
                                <View style={styles.backgroundTopWrapper}>
                                    <View style={styles.oneQuarter}>
                                        <TouchableOpacity onPress={() => forwardOrBackwards("backward")}>
                                            <Image
                                                style={styles.galleryIconTwo}
                                                source={require("../../../assets/icons/backward.png")}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.middleChunk}>
                                        
                                    </View>
                                    <View style={styles.oneQuarter}>
                                        <TouchableOpacity onPress={() => forwardOrBackwards("forward")}>
                                            <Image
                                                style={styles.galleryIconTwo}
                                                source={require("../../../assets/icons/forward.png")}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <FlatList
                                ref={flatlistRef}
                                data={state.selectedArr}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                                horizontal={true} 
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ margin: 12.25 }}
                            />
                            <View style={styles.hr} />
                            <Text style={styles.labeled}>Enter your caption/about below...</Text>
                            <TextInput
                                style={colorSchemeDark ? [styles.customTextInput, { backgroundColor: colors.card, minHeight: 225, color: "#fff", borderRadius: 12.25 }] : [styles.customTextInput, { backgroundColor: colors.card, minHeight: 225, color: "#000", borderRadius: 12.25 }]}
                                ref={captionRef}
                                value={state.postData.captionText}
                                multiline={true}
                                numberOfLines={6}
                                placeholderTextColor={"grey"}
                                inputStyle={{ paddingTop: 5, height: 225 }}
                                placeholder={"Write a caption..."}
                                blurOnSubmit={true}
                                onChangeText={(value) => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            postData: {
                                                ...prevState.postData,
                                                captionText: value
                                            }
                                        }
                                    })
                                }}
                            />
                            <View style={styles.hr} />
                            <Text style={styles.labeled}>Enter hashtags/tags if you wish... (up-to 30 tags)</Text>
                            <TextInput
                                style={colorSchemeDark ? [styles.customTextInput, { minHeight: 125, backgroundColor: colors.card, color: "#fff", borderRadius: 12.25 }] : [styles.customTextInput, { minHeight: 125, backgroundColor: colors.card, color: "#000", borderRadius: 12.25 }]}
                                ref={hashtagRef}
                                value={state.postData.hashtags}
                                multiline={true}
                                numberOfLines={3}
                                blurOnSubmit={true}
                                placeholderTextColor={"grey"}
                                inputStyle={{ paddingTop: 5, height: 115.75 }}
                                placeholder={"Enter hashtags with # then your tagname..."}
                                onChangeText={(value) => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            postData: {
                                                ...prevState.postData,
                                                hashtags: value
                                            }
                                        }
                                    })
                                }}
                            />
                            <View style={styles.hr} />
                            <View style={{ margin: 22.25 }}>
                                <Button style={{ marginTop: 12.25 }} full outline onPress={() => submitPost()}>
                                    Submit My Post!
                                </Button>
                            </View>
                        </SafeAreaView>
                    </ScrollView>
                </Fragment>
            );
        }
    }
    return (
        <Fragment>
            <Spinner
		          visible={state.spinner}
		          textContent={'Uploading File(s)...'}
		          textStyle={styles.spinnerTextStyle}
		          overlayColor={"rgba(0, 0, 0, 0.725)"}
	        />
            <Header
                title={"New Feed!"}
                subTitle="Post New Feed Item(s)"
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

                    setState(prevState => {
                        return {
                            ...prevState,
                            selectedArr: []
                        }
                    })
                    navigation.goBack();
                }}
            />
            {state.page === 3 && state.spinner ? <Progress.Bar progress={state.progressNumber} unfilledColor={"lightgrey"} borderRadius={0} height={7.5} color={"#0BDA51"} width={width} /> : null}
            {renderMainLogic()}
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
  }
  
  export default connect(mapStateToProps, {  })(PostNewIndividualFeedItem);