import React, { Fragment, useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { 
    View, 
    FlatList, 
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Easing,
    Animated,
    Platform,
    TextInput as CustomTextInput
  } from 'react-native';
import {BaseStyle, useTheme} from '@config';
import styles from "./manageUploadImageStyles.js";
import {
    Image,
    Header,
    SafeAreaView,
    Icon,
    Text, 
    ProfileDescription,
    StepProgress,
    Button,
    TextInput
} from '@components';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { UserData, PackageData, HelpBlockData } from '@data';
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import { connect } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';    
import Toast from 'react-native-toast-message';
import _ from "lodash";
import Spinner from 'react-native-loading-spinner-overlay';
import SortableList from 'react-native-sortable-list';
import Video from 'react-native-video';
import ProgressiveImage from "../../../lazyLoadImage.js";
import Dialog from "react-native-dialog";
import Modal from 'react-native-modal';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import uuid from "react-native-uuid";
import * as Progress from 'react-native-progress';
import RBSheet from "react-native-raw-bottom-sheet";
            
const { width, height } = Dimensions.get("window");

const ManageUploadProfilePictures = ({ authenticatedData }) => {

    const { colors, theme } = useTheme();
    const actionSheetRef = useRef(null);
    const pricingRefPane = useRef(null);
    const sortableListRef = useRef(null);
    const colorSchemeDark = theme.dark;
    const navigation = useNavigation();
    const {t} = useTranslation();

    const [ state, setState ] = useState({
        numColumns:3,
        user: null,
        userSelected:{},
        packageItem: PackageData[0],
        workProgress: [{"description": "This page is primarily to assist you in managing/uploading your 'restricted' content to ONLY paying user's. User's MUST pay to see these images", "id": "1", "step": "1) Get paid by subscribing user's for your content", "title": "Get paid while dating!"}, {"description": "You will earn 85% of each new subscription when a user subscribed/purchases the one-time associated fee to view your 'restricted' content! We do take a 15% fee but you get the rest!", "id": "2", "step": "2) Paid PER purchase", "title": "Get paid on each new subscription"}, {"description": "You can re-arrange these images by pressing & holding each image until it 'rises' to which it can then be redirected/moved to the appropriate placement/order...", "id": "3", "step": "3) Drag & drop to re-order your images/content", "title": "Drag & Drop Re-Ordering"}],
        helpBlock: HelpBlockData,
        uploaded: [],
        selected: null,
        scrollEnabled: true,
        pausedVideo: false,
        currentOrder: [],
        userData: UserData[0],
        subscriptionCost: "",
        modalVisible:false,
        pending: false,
        scrollableSortable: true,
        welcomeMessage: "",
        uploadProgress: 0,
        data: [
          {id:1,  image:"https://bootdey.com/img/Content/avatar/avatar1.png"}, 
          {id:2,  image:"https://bootdey.com/img/Content/avatar/avatar2.png"}, 
          {id:3,  image:"https://bootdey.com/img/Content/avatar/avatar3.png"}, 
          {id:4,  image:"https://bootdey.com/img/Content/avatar/avatar4.png"}, 
          {id:5,  image:"https://bootdey.com/img/Content/avatar/avatar5.png"}, 
          {id:6,  image:"https://bootdey.com/img/Content/avatar/avatar6.png"}, 
          {id:7,  image:"https://bootdey.com/img/Content/avatar/avatar7.png"}, 
          {id:8,  image:"https://bootdey.com/img/Content/avatar/avatar1.png"}, 
          {id:9,  image:"https://bootdey.com/img/Content/avatar/avatar2.png"}
        ]
    })

    useFocusEffect(
        useCallback(() => {
            const config = {
                params: {
                    uniqueId: authenticatedData.uniqueId,
                    accountType: authenticatedData.accountType
                }   
            }
            axios.get(`${BASE_URL}/gather/user/profile`, config).then((res) => {
                if (res.data.message === "Successfully gathered profile!") {
                    console.log("Successfully gathered profile!", res.data);
        
                    const { user } = res.data;
        
                    setState(prevState => {
                        return {
                            ...prevState,
                            user,
                            uploaded: typeof user.restrictedImagesVideos !== "undefined" && user.restrictedImagesVideos.length > 0 ? user.restrictedImagesVideos : []
                        }
                    })
                } else {
                    console.log("Err", res.data);
                }
            }).catch((err) => {
                console.log(err.message);
            })
    }, []));

    const handleCameraLaunch = async () => {
        const options = {
            includeBase64: true,
            saveToPhotos: true,
            mediaType: "photo",
            selectionLimit: 1
        };

        const result = await launchCamera(options);

        if (!_.has(result, "didCancel")) {

            setState(prevState => {
                return {
                    ...prevState,
                    pending: true
                }
            });
            
            const asset = result.assets[0];

            const config = {
                base64: asset.base64,
                contentType: asset.type,
                filename: asset.fileName,
                uniqueId: authenticatedData.uniqueId
            }

            axios.post(`${BASE_URL}/upload/new/pic/video/profile/specific`, config).then((res) => {
                if (res.data.message === "Uploaded successfully!") {

                    console.log(res.data);

                    const { file } = res.data; // uploaded

                    setState(prevState => {
                        return {
                            ...prevState,
                            pending: false,
                            uploaded: [...prevState.uploaded, {
                                [Number(prevState.uploaded.length)]: {
                                    link: `${BASE_ASSET_URL}/${file.link}`,
                                    type: file.type
                                }
                            }]
                        }
                    })
                } else {
                    console.log("Err", res.data);

                    setState(prevState => {
                        return {
                            ...prevState,
                            pending: false
                        }
                    })

                    Toast.show({
                        type: 'error',
                        text1: 'Error occurred while uploading your selected file.',
                        text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                        visibilityTime: 4250,
                        position: "bottom"
                    });
                }
            }).catch((err) => {
                console.log(err.message);

                setState(prevState => {
                    return {
                        ...prevState,
                        pending: false
                    }
                })

                Toast.show({
                    type: 'error',
                    text1: 'Error occurred while uploading your selected file.',
                    text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                    visibilityTime: 4250,
                    position: "bottom"
                });
            })
        }
    }

    const handleImageGalleryLaunch = async () => {
        const options = {
            includeBase64: true,
            saveToPhotos: true,
            mediaType: "photo",
            selectionLimit: 1,
            quality: 1
        };

        const result = await launchImageLibrary(options);

        if (!_.has(result, "didCancel")) {

            setState(prevState => {
                return {
                    ...prevState,
                    pending: true
                }
            });

            const asset = result.assets[0];

            const config = {
                base64: asset.base64,
                contentType: asset.type,
                filename: asset.fileName,
                uniqueId: authenticatedData.uniqueId
            }

            axios.post(`${BASE_URL}/upload/new/pic/video/profile/specific`, config).then((res) => {
                if (res.data.message === "Uploaded successfully!") {

                    console.log(res.data);

                    const { file } = res.data; // uploaded

                    setState(prevState => {
                        return {
                            ...prevState,
                            pending: false,
                            uploaded: [...prevState.uploaded, {
                                [Number(prevState.uploaded.length)]: {
                                    link: `${BASE_ASSET_URL}/${file.link}`,
                                    type: file.type
                                }
                            }]
                        }
                    })

                } else {
                    console.log("Err", res.data);

                    setState(prevState => {
                        return {
                            ...prevState,
                            pending: false
                        }
                    })
                    
                    Toast.show({
                        type: 'error',
                        text1: 'Error occurred while uploading your selected file.',
                        text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                        visibilityTime: 4250,
                        position: "bottom"
                    });
                }
            }).catch((err) => {

                console.log(err.message);

                setState(prevState => {
                    return {
                        ...prevState,
                        pending: false
                    }
                })

                Toast.show({
                    type: 'error',
                    text1: 'Error occurred while uploading your selected file.',
                    text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                    visibilityTime: 4250,
                    position: "bottom"
                });
            })
        }
    }
    const renderItem = ({item, index}) => {
        if (_.has(item, "empty") && item.empty === true) {
            let itemDimension = Dimensions.get('window').width / state.numColumns;
            return (
                <TouchableOpacity style={[styles.item, {height: itemDimension}]}>
                    <Image source={require("../../../assets/images/custom/no-image-available.jpg")} style={styles.item} />
                </TouchableOpacity>
            );
        } else {
            console.log("itemmmmmmmmmmmmmmmmmmmm", item);

            const obj = Object.values(item)[0];
            const linky = obj.link;
            const fileType = obj.type;
            
            let itemDimension = Dimensions.get('window').width / state.numColumns;
            if (fileType === "video/mp4") {
                const snapshotClip = obj.snapshot;
                const fileConverted = { uri: `${BASE_ASSET_URL}/${snapshotClip}` };
                return (
                    <TouchableOpacity style={[styles.item, {height: itemDimension}]} onPress={() => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                selected: item,
                                modalVisible: true
                            }
                        })
                    }}>
                        <Image resizeMode={"contain"} source={fileConverted} style={styles.item} />
                    </TouchableOpacity>
                );
            } else {
                return (
                    <TouchableOpacity style={[styles.item, {height: itemDimension}]} onPress={() => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                selected: item,
                                modalVisible: true
                            }
                        })
                    }}>
                        <ProgressiveImage thumbnailSource={require("../../../assets/images/custom/loading.png")} source={{uri: linky }} style={{height:itemDimension - 2, width:itemDimension - 2}} />
                    </TouchableOpacity>
                );
            }
        }
    }

    const formatRow = (data, numColumns) => {
        const numberOfFullRows = Math.floor(data.length / numColumns);
        let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
        return data;
    }

    const handleVideoClipSelection = async () => {
        console.log("handleVideoClipSelection clicked/ran...");

        const options = {
            saveToPhotos: true,
            mediaType: "video",
            selectionLimit: 1,
            quality: 1
        };

        const result = await launchImageLibrary(options);

        console.log("result", result);

        if (!_.has(result, "didCancel")) {

            setState(prevState => {
                return {
                    ...prevState,
                    pending: true
                }
            });

            const assetURI = result.assets[0].uri;
            const formData = new FormData();
            const generatedID = uuid.v4() + ".mp4";
            
            formData.append("video", { uri: assetURI, name: generatedID, type: "video/mp4" });

            axios({
                method: "post",
                url: `${BASE_URL}/upload/new/pic/video/profile/specific`,
                data: formData,
                headers: { 
                    "Content-Type": "multipart/form-data" 
                },
                onUploadProgress: progress => {
                    const { total, loaded } = progress; 
                    const totalSizeInMB = total / 1000000;
                    const loadedSizeInMB = loaded / 1000000;
                    const uploadPercentage = (loadedSizeInMB / totalSizeInMB);

                    setState(prevState => {
                        return {
                            ...prevState,
                            uploadProgress: uploadPercentage
                        }
                    })
                    console.log("total size in MB ==> ", totalSizeInMB);
                    console.log("uploaded size in MB ==> ", loadedSizeInMB);
                }
            }).then((res) => {
                if (res.data.message === "Uploaded successfully!") {

                    console.log(res.data);

                    const { file, snapshot } = res.data; // uploaded

                    setState(prevState => {
                        return {
                            ...prevState,
                            pending: false,
                            uploaded: [...prevState.uploaded, {
                                [Number(prevState.uploaded.length)]: {
                                    link: `${BASE_ASSET_URL}/${file.link}`,
                                    type: file.type,
                                    snapshot
                                }
                            }],
                            uploadProgress: false
                        }
                    })
                } else {
                    console.log("Err", res.data);

                    setState(prevState => {
                        return {
                            ...prevState,
                            pending: false,
                            uploadProgress: false
                        }
                    })

                    Toast.show({
                        type: 'error',
                        text1: 'Error occurred while uploading your selected file.',
                        text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                        visibilityTime: 4250,
                        position: "bottom"
                    });
                }
            }).catch((err) => {
                console.log(err.message);

                setState(prevState => {
                    return {
                        ...prevState,
                        pending: false
                    }
                })

                Toast.show({
                    type: 'error',
                    text1: 'Error occurred while uploading your selected file.',
                    text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                    visibilityTime: 4250,
                    position: "bottom"
                });
            })
        }
    }
    console.log("uploaded", state.uploaded);

    const onChangeOrderHelper = (nextOrder) => {

        console.log("nextOrder", nextOrder);

        setState(prevState => {
            return {
                ...prevState,
                currentOrder: nextOrder
            }
        });
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const newlyOrganizedArr = [];

            state.currentOrder.forEach((order, idx, array) => {
                // find the appropriate index
                console.log("order, idx, array", order, idx, array, state.uploaded);
                
                const matchingItem = state.uploaded.find(item => Object.keys(item)[0] === order);
    
                console.log("matchingItem", Object.values(matchingItem)[0]);
                // create new item to push
                if (matchingItem !== -1) {
                    // push into array/arr...
                    newlyOrganizedArr.push({
                        [Number(idx)]: {
                            link: Object.values(matchingItem)[0].link,
                            type: Object.values(matchingItem)[0].type
                        }
                    });

                    console.log("newlyOrganizedArr", newlyOrganizedArr);
                    // check if end
                    if (idx === (array.length - 1)) {
                        setState(prevState => {
                            return {
                                ...prevState,
                                uploaded: newlyOrganizedArr,
                                scrollEnabled: true,
                                scrollableSortable: true
                            }
                        })
                    }
                }
            });
        }, 1750)
    
        return () => clearTimeout(delayDebounceFn)
    }, [state.currentOrder])

    console.log("currentOrder", state.currentOrder);

    const onReleaseRowHelper = (key, currentOrder) => {
        console.log("onReleaseRowHelper helper... (key, currentOrder):", key, currentOrder);
    }

    const Row = (props) => {
        const { active, data } = props;

        console.log("dataaaaaaaaaaaaaaaaaaaa", Object.values(data)[0]);

        if (data !== "undefined") {
      
            const activeAnim = useRef(new Animated.Value(0));
            useEffect(() => {
            Animated.timing(activeAnim.current, {
                duration: 300,
                easing: Easing.bounce,
                toValue: Number(active),
                useNativeDriver: true,
            }).start();
            }, [active]);
        
            const obj = Object.values(data)[0];
            const linky = obj.link;
            const fileType = obj.type;
            
            if (fileType === "video/mp4") {
                const snapshotClip = obj.snapshot;
                const fileConverted = { uri: `${BASE_ASSET_URL}/${snapshotClip}` };
                return (
                    <Animated.View style={[styles.row]}>
                        <Image source={fileConverted} style={styles.image} />
                    </Animated.View>
                );
            } else {
                return (
                    <Animated.View style={[styles.row]}>
                        <Image resizeMode={"contain"} source={{ uri: linky }} style={styles.image} />
                    </Animated.View>
                );
            }
        }
    }

    const renderRow = useCallback(({data, active}) => {
        return <Row data={data} active={active} />;
    }, []);

    const handleChangesFormatted = () => {
        console.log("handleChangesFormatted clicked/ran....");

        console.log("state.currentOrder", state.currentOrder);

        const config = {
            uploaded: state.uploaded,
            uniqueId: authenticatedData.uniqueId
        }

        axios.post(`${BASE_URL}/save/restricted/content/data/files`, config).then((res) => {
            if (res.data.message === "Saved successfully!") {

                console.log(res.data);

                const { files } = res.data;

                setState(prevState => {
                    return {
                        ...prevState,
                        uploaded: files
                    }
                })

                sortableListRef.current.close()

                Toast.show({
                    type: 'success',
                    text1: `We've successfully uploaded/updated your 'restricted content'!`,
                    text2: 'Your restricted content has been saved successfully - you may now leave this page safely while keeping the appropriate edit(s)...',
                    visibilityTime: 2750,
                    position: "bottom"
                });
            } else {
                console.log("Err", res.data);

                sortableListRef.current.close()

                setState(prevState => {
                    return {
                        ...prevState,
                        pending: false
                    }
                })

                Toast.show({
                    type: 'error',
                    text1: 'An error occurred attempting to save your changes...',
                    text2: 'Please try the action again or contact support if this problem continues to persist! Please re-attempt saving your changes to formatting.',
                    visibilityTime: 2750,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);

            sortableListRef.current.close()

            setState(prevState => {
                return {
                    ...prevState,
                    pending: false
                }
            })

            Toast.show({
                type: 'error',
                text1: 'An error occurred attempting to save your changes...',
                text2: 'Please try the action again or contact support if this problem continues to persist! Please re-attempt saving your changes to formatting.',
                visibilityTime: 2750,
                position: "bottom"
            });
        })
    }
    console.log("selected", state.selected);

    const renderVideoOrImage = () => {
        if (state.selected !== null) {
            if (Object.values(state.selected)[1] === "video/mp4") {
                return (
                    <Fragment>
                        <Video 
                            source={{ uri: Object.values(state.selected)[0] }}
                            onReadyForDisplay={() => setState(prevState => {
                                return {
                                    ...prevState,
                                    pausedVideo: true
                                }
                            })}
                            style={styles.videoModal} 
                            resizeMode={"contain"}
                        />
                    </Fragment>
                );
            } else if (Object.values(state.selected)[1]  === "image/jpeg" || Object.values(state.selected)[1]  === "image/jpg" || Object.values(state.selected)[1]  === "image/png") {
                return (
                    <Fragment>
                        <Image resizeMode={"contain"} source={{ uri: Object.values(state.selected)[0] }} style={styles.videoModal} />
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
                    </Fragment>
                );
            }
        } 
    }
    const handleSubscriptionSubmission = () => {

        const { subscriptionCost, welcomeMessage } = state;

        if (typeof subscriptionCost !== "undefined" && subscriptionCost.length > 0 && typeof welcomeMessage !== "undefined" && welcomeMessage.length > 0) {

            const config = {
                welcomeMessage,
                subscriptionAmount: subscriptionCost,
                uniqueId: authenticatedData.uniqueId
            }
    
            axios.post(`${BASE_URL}/post/subscription/amount/welcome/message`, config).then((res) => {
                if (res.data.message === "Submitted subscription data!") {
    
                    console.log(res.data);
    
                    pricingRefPane.current.close();
    
                    Toast.show({
                        type: 'success',
                        text1: `We've successfully updated your subscription fee!`,
                        text2: 'Successfully submitted your subscription fee/cost...',
                        visibilityTime: 2750,
                        position: "bottom"
                    });
                } else {
                    console.log("Err", res.data);
    
                    pricingRefPane.current.close();
    
                    setState(prevState => {
                        return {
                            ...prevState,
                            pending: false
                        }
                    })
    
                    Toast.show({
                        type: 'error',
                        text1: 'An error occurred attempting to save your changes...',
                        text2: 'Please try the action again or contact support if this problem continues to persist! Please re-attempt this action.',
                        visibilityTime: 2750,
                        position: "bottom"
                    });
                }
            }).catch((err) => {
                console.log(err.message);
    
                pricingRefPane.current.close();
    
                setState(prevState => {
                    return {
                        ...prevState,
                        pending: false
                    }
                })
    
                Toast.show({
                    type: 'error',
                    text1: 'An error occurred attempting to save your changes...',
                    text2: 'Please try the action again or contact support if this problem continues to persist! Please re-attempt this action.',
                    visibilityTime: 2750,
                    position: "bottom"
                });
            })
        } else {
            pricingRefPane.current.close();

            Toast.show({
                type: 'info',
                text1: 'Enter a subscription value before proceeding...',
                visibilityTime: 2750,
                position: "bottom"
            });
        }
    }
    return (
        <View style={styles.container}>
            {state.uploadProgress !== 0 ? <Progress.Bar progress={state.uploadProgress} unfilledColor={"lightgrey"} borderRadius={0} height={10} color={"#0BDA51"} width={width} /> : null}
            <RBSheet
                ref={sortableListRef}
                closeOnDragDown={false}
                closeOnPressMask={false}
                dragFromTopOnly={false}
                height={height}
                closeDuration={35}
                openDuration={35}
                customStyles={{
                    container: {
                        paddingHorizontal: 10 * 2.0,
                    },
                    draggableIcon: {
                        width: width * 0.725
                    }
                }}
            >
                {Platform.OS === "ios" ? <View style={{ marginTop: 50 }} /> : null}
                <Button onPress={() => sortableListRef.current.close()} full style={{ backgroundColor: colors.accent, marginTop: 12.25 }}>
                    Close/Cancel
                </Button>
                <View style={styles.mediumHR} />
                <Button onPress={() => handleChangesFormatted()} full style={{ backgroundColor: colors.primary, marginTop: 12.25 }}>
                    Submit Change(s)
                </Button>
                <SortableList
                    horizontal={false}
                    keyboardShouldPersistTaps="never"
                    scrollEnabled={state.scrollableSortable}
                    style={styles.list}
                    contentContainerStyle={styles.contentContainer}
                    data={state.uploaded}
                    renderRow={renderRow}
                    showsHorizontalScrollIndicator={false}
                    onChangeOrder={onChangeOrderHelper}
                    // onReleaseRow={onReleaseRowHelper}
                />
            </RBSheet>
            <RBSheet
                ref={pricingRefPane}
                closeOnDragDown={false}
                closeOnPressMask={false}
                dragFromTopOnly={false}
                height={height}
                closeDuration={35}
                openDuration={35}
                customStyles={{
                    container: {
                        paddingHorizontal: 10 * 2.0,
                        backgroundColor: colorSchemeDark ? "#000" : "#fff"
                    },
                    draggableIcon: {
                        width: width * 0.725
                    }
                }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 82.25 }}>
                    {Platform.OS === "ios" ? <View style={{ marginTop: 45 }} /> : null}
                    <View style={styles.mediumHR} />
                    <Button onPress={() => pricingRefPane.current.close()} full style={{ backgroundColor: colors.accent, marginTop: 12.25 }}>
                        Close/Cancel
                    </Button>
                    <View style={[styles.mediumHR, { marginBottom: 32.25 }]} />
                    <Text style={styles.label}>Enter the value for user's to subscribe to your restricted content - This is a ONE TIME FEE so price accordingly</Text>
                    <TextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                subscriptionCost: text.replace(/[^0-9]/g, '')
                            }
                        })}
                        placeholder={"~ Subscription pricing fee...(USD - $$$) ~"}
                        maxLength={4}
                        keyboardType="numeric"
                        value={state.subscriptionCost}
                    />
                    <Text style={styles.label}>Enter a 'welcome message' that'll be sent to the user upon successfully subscribing to your restricted content</Text>
                    <CustomTextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                welcomeMessage: text
                            }
                        })}
                        secureTextEntry={false}
                        blurOnSubmit={true}
                        multiline={true}
                        numberOfLines={8}
                        style={{ backgroundColor: colors.card, textAlignVertical: 'top', padding: 10 }}
                        placeholder="Enter your 'welcome message' once a user subscribes/purchases access to your restricted content..."
                        placeholderTextColor={colorSchemeDark ? "grey" : "black"}
                        value={state.welcomeMessage}
                    />
                    <Image resizeMode={"contain"} source={require("../../../assets/images/custom/subscription.jpg")} style={styles.subscriptionItem} />
                    <View style={styles.mediumHR} />
                    <Button onPress={() => handleSubscriptionSubmission()} full style={{ backgroundColor: "green", marginTop: 12.25 }}>
                        Submit & Update Subscription Cost!
                    </Button>
                    <View style={styles.mediumHR} />
                </ScrollView>
            </RBSheet>
            <Spinner
		          visible={state.pending}
		          textContent={'Loading/Uploading...'}
		          textStyle={styles.spinnerTextStyle}
		          overlayColor={"rgba(0, 0, 0, 0.725)"}
	        />
            <Header
                title="Manage content!"
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
                    handleChangesFormatted();

                    setTimeout(() => {
                        navigation.goBack();
                    }, 2250)
                }}
            />
            <Dialog.Container visible={state.showDialog}>
                <Dialog.Title>Have you saved any edits you've made during this session on this page?</Dialog.Title>
                <Dialog.Description>
                    Are you SURE you've SAVED any edit's you made? You must save your edits with the 'save formatted change(s)' button to keep the changes permanant.
                </Dialog.Description>
                <Dialog.Button onPress={() => setState(prevState => {
                        return {
                            ...prevState,
                            showDialog: false
                        }
                    })} label="Cancel/Abort" />
                <Dialog.Button onPress={() => navigation.goBack()} label="Already Saved!" />
		    </Dialog.Container>
            <ActionSheet
                ref={actionSheetRef}
                title={'Select the file type (Image/Video)...'}
                options={['Select an existing photo', 'Take a new photo', "Cancel/Close Pane"]} // 'Select a video clip', 
                cancelButtonIndex={2}
                destructiveButtonIndex={2}
                onPress={(index) => {
                    switch (index) {
                        // case 0:
                        //     handleVideoClipSelection();
                        //     break;
                        case 0:
                            handleImageGalleryLaunch();
                            break;
                        case 1:
                            handleCameraLaunch();
                            break;
                        default: 
                            break;
                    }
                }}
            />
            <SafeAreaView
                style={BaseStyle.safeAreaView}
                edges={['right', 'left', 'bottom']}>
                <ScrollView scrollEnabled={state.scrollEnabled}>
                    <View style={{paddingHorizontal: 20}}>
                        <ProfileDescription
                            image={{ uri: `${BASE_ASSET_URL}/${authenticatedData.profilePictures[authenticatedData.profilePictures.length - 1].link}` }}
                            name={state.user === null ? state.userData.name : `${state.user.firstName} ${state.user.lastName}`}
                            subName={state.user === null ? state.userData.major : `@${state.user.username}`}
                            description={state.user === null ? state.userData.address : ""}
                            style={{marginTop: 25}}
                        />
                        <TouchableOpacity onPress={() => pricingRefPane.current.open()} style={styles.positionRightTop}>
                            <Image source={require("../../../assets/icons/external.png")} style={styles.minItem} />
                        </TouchableOpacity>
                    </View>
                    <Text
                        headline
                        semibold
                        style={{
                            marginLeft: 20,
                            marginTop: 20,
                            marginBottom: 10,
                        }}>
                        {t(`What's this page about?`)} <Text style={{ color: colors.accent }}>{"Video's can be up-to 30 seconds..."}</Text>
                    </Text>
                    <Text
                        style={{
                            marginLeft: 20,
                            marginTop: 5,
                            marginBottom: 32.5,
                        }}>
                        {t(`You can prioritize these images in the order you deem best starting from the top to the bottom (order of priority). These images are restricted & are ONLY available to PAYING members or if they choose to purcahase a one-off content uploaded item.`)}
                    </Text>
                    <FlatList
                        contentContainerStyle={{ paddingLeft: 5, paddingRight: 20, paddingBottom: 32.25 }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={state.workProgress}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({item}) => (
                            <StepProgress
                                style={{marginLeft: 15}}
                                step={item.step}
                                title={item.title}
                                description={item.description}
                                onPress={() => {}}
                            />
                        )}
                    />
                    <View style={styles.blackThinHR} />
                    <View style={{ margin: 10 }}>
                        <Button full round outline onPress={() => actionSheetRef.current.show()}>
                            Add New Profile Pic/Video
                        </Button>
                    </View>
                    <View style={[styles.blackThinHR, { marginBottom: 22.25 }]} />
                    <View style={{ margin: 13.25 }}>
                        <Text style={styles.emphizedText}><Text style={{ color: colors.primary, fontWeight: "400", textDecorationLine: "underline" }}>REFORMAT</Text> your images into an appropriate order from <Text style={{ color: colors.secondary, fontWeight: "400", textDecorationLine: "underline" }}>TOP (First Pic)</Text> to <Text style={{ color: colors.primary, fontWeight: "400", textDecorationLine: "underline" }}>BOTTOM (Last Pic)</Text>.... Click the button below to begin!</Text>
                    </View>
                    <View style={{ margin: 10, marginTop: 22.25 }}>
                        <Button onPress={() => sortableListRef.current.open()} full style={{ backgroundColor: colors.accent }}>
                            Re-Format Photo Arrangement
                        </Button>
                    </View>
                    <View style={{ margin: 13.25 }}>
                        <Text style={styles.emphizedText}>These are your restricted-content image/video reel set-up, your images will be viewable from <Text style={{ color: colors.secondary, fontWeight: "400", textDecorationLine: "underline" }}>top</Text> to <Text style={{ color: colors.secondary, fontWeight: "400", textDecorationLine: "underline" }}>bottom</Text> - this is the <Text style={{ color: colors.secondary, fontWeight: "400", textDecorationLine: "underline" }}>ACTUAL</Text> order/format viewable live!</Text>
                    </View>
                    <FlatList
                        data={formatRow(state.uploaded, state.numColumns)}
                        keyExtractor={(item, index) => {
                            return `index-$${Math.floor(Math.random() * (500 - 1 + 1) + 1)}`;
                        }}
                        contentContainerStyle={{  }}
                        renderItem={renderItem}
                        numColumns={state.numColumns}
                    />
                </ScrollView>
                <Modal
                    isVisible={state.modalVisible}
                    style={styles.modalPreview}
                >
                    <View style={styles.centeredMargin}>
                        <Button full outline onPress={() => setState(prevState => {
                            return {
                                ...prevState,
                                modalVisible: false
                            }
                        })}>
                            Close Pane/Modal
                        </Button>
                        <View style={[styles.blackThinHR, { marginTop: 17.25 }]} />
                        {renderVideoOrImage()}
                    </View>    
                </Modal>
            </SafeAreaView>
        </View>
    );
}
const mapStateToProps = (state) => {
	return {
		authenticatedData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
	}
}
export default connect(mapStateToProps, { })(ManageUploadProfilePictures);
 