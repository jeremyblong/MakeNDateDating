import React, { Component, Fragment } from "react";
import { Text, View, SafeAreaView, Dimensions, StatusBar, ScrollView, FlatList, Image, StyleSheet, BackHandler, ImageBackground, Platform } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import axios from "axios";
import { OutlinedTextField } from 'rn-material-ui-textfield';
import { TouchableOpacity } from "react-native";
import { BottomSheet } from 'react-native-elements';
import { TransitionPresets } from 'react-navigation-stack';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { BASE_URL, BASE_ASSET_URL } from "@env";
import Toast from 'react-native-toast-message';
import _ from "lodash";
import { ListItem, Avatar, Badge } from '@rneui/themed';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import ViewMoreText from 'react-native-view-more-text';
import {
    basicsOptionsMapped
} from "./helpers/options/editProfile.js";
import { RenderPromptPane } from "./helpers/functionsHelpers/editProfile.js";
import { BaseColor } from '@config';
import { Header, Icon } from "@components";
import Spinner from 'react-native-loading-spinner-overlay';
import { request, PERMISSIONS } from 'react-native-permissions';
		

const { width, height } = Dimensions.get('screen');

const primaryColor = "#D81159";
const secondaryColor = "#0496FF";

class EditProfileScreen extends Component {

    state = {
        showBottomSheet: false,
        closable: false,
        showBottomSheetCoverPhoto: false,
        data: {
            name: "",
            email: "",
            profilePictures: undefined,
            phoneNumber: "",
            password: "",
            tags: ["Anything really, let's chat!", "Nature", "Reading", "Tattoos", "Art", "Learning", "Traveling", "Hiking/Exploring", "Sofware Development", "Software", "Coding", "Code"]
        },
        coverPhoto: null,
        backColor: null
    }
    refRBSheet = React.createRef(null);

    componentDidMount() {
        this.setState({
            backColor: this.props.colorSchemeDark === true ? "#000" : "#fff"
        })

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));

        setTimeout(() => {
            const config = {
                params: {
                    uniqueId: this.props.authData.uniqueId,
                    accountType: this.props.authData.accountType,
                    returnTokens: false
                }
            }

            axios.get(`${BASE_URL}/gather/user/profile`, config).then((res) => {
                if (res.data.message === "Successfully gathered profile!") {
                    console.log(res.data);

                    const { user } = res.data;

                    this.setState(prevState => {
                        return {
                            data: {
                                tags: prevState.data.tags,
                                ...user
                            },
                            coverPhoto: _.has(user, "coverPhoto") ? user.coverPhoto : null
                        }
                    })
                } else {
                    console.log("Err", res.data);
                }
            }).catch((err) => {
                console.log(err.message);
            })
        }, 250);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        this.props.navigation.pop();
        return true;
    };

    redirectToOther = (label) => {
        switch (label) {
            case "Height":
                this.props.navigation.navigate("HeightProfileDataEdit");
                break;
            case "Occupation":
                this.props.navigation.navigate("OccupationalSettingsProfile");
                break;
            case "Education":
                this.props.navigation.navigate("EducationalSettingsProfile");
                break;
            case "About-Me & Core Interest's":
                this.props.navigation.navigate("BiographyAndInterestsEdit");
                break;
            case "Profile Prompt's":
                this.props.navigation.navigate("ProfilePromptsEditModify");
                break;
            case "Hair Color":
                this.props.navigation.navigate("EditHairColorProfileData");
                break; 
            case "Music & Anthem(s)":
                this.props.navigation.navigate("MusicAnthemProfile");
                break;
            case "Introductory Video (About You)":
                this.props.navigation.navigate("IntroductoryVideoProfileMain");
                break;
            case "Custody Of Children":
                this.props.navigation.navigate("ChildrenCountParentingPage");
                break;
            case "Religion":
                this.props.navigation.navigate("RegigonSelectionProfile");
                break;
            case "Pay To Hide Profile View(s)":
                this.props.navigation.navigate("PayToRemoveProfileViewHistory");
                break;
            default: 
                break;
       }
    }

    renderItem = ({ item, index }) => {
        if (item.icon === false) {
            return (
                <Fragment key={index}>
                    <ListItem onPress={() => this.redirectToOther(item.label)} style={styles.listitemSettings}>
                        <ListItem.Content>
                            <ListItem.Title style={styles.breakerSection}>{item.label}</ListItem.Title>
                            <ListItem.Subtitle>{item.value}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                </Fragment>
            );
        } else {
            return (
                <Fragment key={index}>
                    <ListItem onPress={() => this.redirectToOther(item.label)} style={styles.listitemSettings} bottomDivider>
                        <Avatar style={styles.avatarIcon} source={item.icon} />
                        <ListItem.Content>
                            <ListItem.Title>{item.label}</ListItem.Title>
                            <ListItem.Subtitle>{item.value}</ListItem.Subtitle>
                        </ListItem.Content>
                        <Image source={require("../../assets/icons/right-arrow-custom.png")} style={styles.rightIconArrow} />
                    </ListItem>
                </Fragment>
            );
        }
    }
    renderViewMore = (onPress) => {
        return (
            <Text style={styles.showMoreOrLess} onPress={onPress}>View more</Text>
        )
    }
    renderViewLess = (onPress) => {
        return (
            <Text style={styles.showMoreOrLess} onPress={onPress}>View less</Text>
        )
    }
    renderFooterComponent = () => {
        return (
            <Fragment>
                <ListItem style={styles.listitemSettings} bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>About Me</ListItem.Title>
                    </ListItem.Content>
                    <Image source={require("../../assets/icons/write.png")} style={styles.pencil} />
                </ListItem>
                <ViewMoreText
                    numberOfLines={8}
                    renderViewMore={this.renderViewMore}
                    renderViewLess={this.renderViewLess}
                    textStyle={{ textAlign: 'left', backgroundColor: "#fff", padding: 17.5 }}
                >
                    <Text>
                        Lorem ipsum dolor sit amet, in quo dolorum ponderum, nam veri molestie constituto eu. Eum enim tantas sadipscing ne, ut omnes malorum nostrum cum. Errem populo qui ne, ea ipsum antiopam definitionem eos.
                    </Text>
                </ViewMoreText>
            </Fragment>
        );
    }
    calculateColor = () => {
        const num = Math.floor(Math.random() * (5 - 1 + 1) + 1);

        switch (num) {
            case 1:
                return "success";
                break;
            case 2:
                return "error";
                break;
            case 3:
                return "warning";
                break;
            case 4:
                return "primary"
                break;
            case 5:
                return "secondary";
                break;
            default:
                break;
        }
    }
    renderSecondFinalFooter = () => {
        const { data } = this.state;
        
        return (
            <Fragment>
                <ListItem style={styles.listitemSettings} bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Interest's</ListItem.Title>
                    </ListItem.Content>
                    <Image source={require("../../assets/icons/write.png")} style={styles.pencil} />
                </ListItem>
                <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1, flexDirection: "row", flexWrap: "wrap", maxWidth: width, minHeight: 212.5, maxHeight: 212.5 }} style={styles.tagContainer}>
                    {typeof data.tags !== "undefined" && data.tags.length > 0 ? data.tags.map((item, index) => {
                        console.log("item", item);
                        return <Badge
                            badgeStyle={{ margin: 2.75, minHeight: 40, padding: 5, borderWidth: 2.25, borderColor: "darkgrey" }}
                            textStyle={styles.tagBadge}
                            value={item}
                            key={index}
                            size={"large"}
                            color={"black"}
                            status={this.calculateColor()}
                            containerStyle={{ color: "white", fontWeight: "bold" }}
                        />
                    }) : null}
                </ScrollView>
                <ListItem style={styles.listitemSettings} bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>Conversation Starters</ListItem.Title>
                    </ListItem.Content>
                    <Image source={require("../../assets/icons/write.png")} style={styles.pencil} />
                </ListItem>
                <View style={styles.slightMargin}>
                    <Text style={{ textAlign: "left" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                </View>
            </Fragment>
        );
    }
    setSelectedPrompt = () => {
        this.refRBSheet.current.open();
    }
    renderHeaderCompoent = () => {
        return (
            <Fragment>
                <ListItem onPress={() => this.setSelectedPrompt()} style={styles.listitemSettingsVoice}>
                    <ListItem.Content>
                        <ListItem.Title style={styles.breakerSection}>Select a prompt</ListItem.Title>
                        <ListItem.Subtitle>And record your voice answer (allow other's to get-to-know you)</ListItem.Subtitle>
                    </ListItem.Content>
                    <Image source={require("../../assets/icons/mic.png")} style={styles.iconCustom} />
                </ListItem>
            </Fragment>
        );
    }
    renderCoverPhotoOrNot = () => {
        const { coverPhoto } = this.state;

        console.log("coverPhoto", coverPhoto);

        if (coverPhoto !== null) {
            return (
                <Fragment>
                    <ImageBackground imageStyle={{ opacity: 0.675, backgroundColor: primaryColor }} style={{ minWidth: width, minHeight: 300, maxHeight: 300 }} source={{ uri: `${BASE_ASSET_URL}/${coverPhoto.link}` }} />
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <ImageBackground imageStyle={{ opacity: 0.675, backgroundColor: primaryColor }} style={{ minWidth: width, minHeight: 300, maxHeight: 300 }} source={require("../../assets/images/placeholder-media.png")} />
                </Fragment>
            );
        }
    }
    render() { 
        const { loading, closable } = this.state;
        return (
            // <SafeAreaView style={Platform.OS === "ios" ? { flex: 1, backgroundColor: this.state.backColor, top: -35 } : { flex: 1, backgroundColor: this.state.backColor }}>
            <Fragment>
                <Header
                    title="Profile Editing"
                    style={this.props.colorSchemeDark ? { backgroundColor: "#000" } : { backgroundColor: "#fff" }}
                    renderLeft={() => {
                        return (
                            <Icon
                                name="arrow-left"
                                size={20}
                                color={this.props.colorSchemeDark ? BaseColor.whiteColor : BaseColor.blackColor}
                                enableRTL={true}
                            />
                        );
                    }}
                    onPressLeft={() => {
                        this.props.navigation.pop();
                    }}
                />
                <Spinner
                    visible={loading}
                    textContent={'Uploading File...'}
                    textStyle={styles.spinnerTextStyle}
                    overlayColor={"rgba(0, 0, 0, 0.725)"}
                />
                <StatusBar translucent={false} backgroundColor={primaryColor} />
                <RenderPromptPane props={this.props} refRBSheet={this.refRBSheet} />
                <View style={{ flex: 1 }}>
                    <ParallaxScroll
                        renderHeader={({ animatedValue }) => <View style={{}}>

                        </View>}
                        headerHeight={0}
                        height={height}
                        style={{ flex: 1 }}
                        isHeaderFixed={false}
                        parallaxHeight={150}
                        // headerBackgroundColor={""}
                        renderParallaxBackground={({ animatedValue }) => this.renderCoverPhotoOrNot()}
                        renderParallaxForeground={({ animatedValue }) => {
                            return (
                                <Fragment>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            showBottomSheetCoverPhoto: true
                                        })
                                    }} hitSlop={50} style={styles.topRightCover}>
                                        <Image source={require("../../assets/images/18.png")} style={styles.rightIconOnly} />
                                        <Text style={{ fontWeight: "bold", textAlign: "center", color: "#fff", marginTop: 6.25 }}>Cover Photo</Text>
                                    </TouchableOpacity>
                                    {this.profileImageChangeInfo()}
                                </Fragment>
                            );
                        }}
                        parallaxBackgroundScrollSpeed={3}
                        parallaxForegroundScrollSpeed={1.25}
                    >
                        <FlatList
                            contentContainerStyle={styles.centeredList}
                            data={basicsOptionsMapped}
                            style={{ flexGrow: 1, flex: 1 }}
                            keyExtractor={(item) => `${item.id}`}
                            ListHeaderComponent={this.renderHeaderCompoent}
                            renderItem={this.renderItem}
                            ListFooterComponent={null} // this.renderFooterComponent
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                        />
                        {/* <FlatList
                            contentContainerStyle={styles.centeredList}
                            data={secondListSectionOptions}
                            style={{ flexGrow: 1, flex: 1 }}
                            keyExtractor={(item) => `${item.id}`}
                            renderItem={this.renderItem}
                            horizontal={false}
                            ListFooterComponent={this.renderSecondFinalFooter}
                            showsVerticalScrollIndicator={true}
                        /> */}
                    </ParallaxScroll>
                </View>
                {this.viewBottomSheet()}
                {this.viewBottomSheetCoverPhoto()}
            {/* </SafeAreaView> */}
            </Fragment>
        )
    }

    handleCameraLaunch = async (type) => {
        if (Platform.OS === "ios") {
			request(PERMISSIONS.IOS.CAMERA).then(async (resultOutterRequest) => {
				console.log("resultOutterRequest location request...:", resultOutterRequest);
   
				if (type === "profile-picture") {
                    // profile picture logic...
                    const options = {
                        includeBase64: true,
                        saveToPhotos: true,
                        mediaType: "photo",
                        selectionLimit: 1
                    };
            
                    const result = await launchCamera(options);
            
                    if (!_.has(result, "didCancel")) {
            
                        this.setState({
                            loading: true
                        })
                        const asset = result.assets[0];
            
                        const config = {
                            base64: asset.base64,
                            contentType: asset.type,
                            filename: asset.fileName,
                            uniqueId: this.props.authData.uniqueId
                        }
            
                        axios.post(`${BASE_URL}/upload/misc/file/wo/save/profile/picture`, config).then((res) => {
                            if (res.data.message === "Uploaded successfully!") {
                                console.log(res.data);
            
                                const { file } = res.data;
            
                                this.setState({
                                    data: {
                                        ...this.state.data,
                                        profilePictures: [...this.state.data.profilePictures, file]
                                    },
                                    loading: false,
                                    showBottomSheet: false
                                })
                            } else {
                                console.log("Err", res.data);
            
                                this.setState({
                                    loading: false,
                                    showBottomSheet: false
                                }, () => {
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Error occurred while uploading your selected file.',
                                        text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                                        visibilityTime: 4250,
                                        position: "bottom"
                                    });
                                })
                            }
                        }).catch((err) => {
                            console.log(err.message);
            
                            this.setState({
                                loading: false,
                                showBottomSheet: false
                            }, () => {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Error occurred while uploading your selected file.',
                                    text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                                    visibilityTime: 4250,
                                    position: "bottom"
                                });
                            })
                        })
                    }
                } else {
                    // cover photo logic...
                    const options = {
                        includeBase64: true,
                        saveToPhotos: true,
                        mediaType: "photo",
                        selectionLimit: 1
                    };
            
                    const result = await launchCamera(options);
            
                    if (!_.has(result, "didCancel")) {
            
                        this.setState({
                            loading: true
                        })
                        const asset = result.assets[0];
            
                        const config = {
                            base64: asset.base64,
                            contentType: asset.type,
                            filename: asset.fileName,
                            uniqueId: this.props.authData.uniqueId,
                            accountType: this.props.authData.accountType
                        }
            
                        axios.post(`${BASE_URL}/upload/misc/file/wo/save/cover/photo`, config).then((res) => {
                            if (res.data.message === "Uploaded successfully!") {
                                console.log(res.data);
            
                                const { file } = res.data;
            
                                this.setState({
                                    coverPhoto: file,
                                    loading: false,
                                    showBottomSheetCoverPhoto: false
                                })
                            } else {
                                console.log("Err", res.data);
            
                                this.setState({
                                    loading: false,
                                    showBottomSheetCoverPhoto: false
                                }, () => {
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Error occurred while uploading your selected file.',
                                        text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                                        visibilityTime: 4250,
                                        position: "bottom"
                                    });
                                })
                            }
                        }).catch((err) => {
                            console.log(err.message);
            
                            this.setState({
                                loading: false,
                                showBottomSheetCoverPhoto: false
                            }, () => {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Error occurred while uploading your selected file.',
                                    text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                                    visibilityTime: 4250,
                                    position: "bottom"
                                });
                            })
                        })
                    }
                }
		   });
		} else {
			request(PERMISSIONS.ANDROID.CAMERA).then(async (resultOutterRequest) => {
				console.log("resultOutterRequest location request...:", resultOutterRequest);
   
				if (type === "profile-picture") {
                    // profile picture logic...
                    const options = {
                        includeBase64: true,
                        saveToPhotos: true,
                        mediaType: "photo",
                        selectionLimit: 1
                    };
            
                    const result = await launchCamera(options);
            
                    if (!_.has(result, "didCancel")) {
            
                        this.setState({
                            loading: true
                        })
                        const asset = result.assets[0];
            
                        const config = {
                            base64: asset.base64,
                            contentType: asset.type,
                            filename: asset.fileName,
                            uniqueId: this.props.authData.uniqueId
                        }
            
                        axios.post(`${BASE_URL}/upload/misc/file/wo/save/profile/picture`, config).then((res) => {
                            if (res.data.message === "Uploaded successfully!") {
                                console.log(res.data);
            
                                const { file } = res.data;
            
                                this.setState({
                                    data: {
                                        ...this.state.data,
                                        profilePictures: [...this.state.data.profilePictures, file]
                                    },
                                    loading: false,
                                    showBottomSheet: false
                                })
                            } else {
                                console.log("Err", res.data);
            
                                this.setState({
                                    loading: false,
                                    showBottomSheet: false
                                }, () => {
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Error occurred while uploading your selected file.',
                                        text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                                        visibilityTime: 4250,
                                        position: "bottom"
                                    });
                                })
                            }
                        }).catch((err) => {
                            console.log(err.message);
            
                            this.setState({
                                loading: false,
                                showBottomSheet: false
                            }, () => {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Error occurred while uploading your selected file.',
                                    text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                                    visibilityTime: 4250,
                                    position: "bottom"
                                });
                            })
                        })
                    }
                } else {
                    // cover photo logic...
                    const options = {
                        includeBase64: true,
                        saveToPhotos: true,
                        mediaType: "photo",
                        selectionLimit: 1
                    };
            
                    const result = await launchCamera(options);
            
                    if (!_.has(result, "didCancel")) {
            
                        this.setState({
                            loading: true
                        })
                        const asset = result.assets[0];
            
                        const config = {
                            base64: asset.base64,
                            contentType: asset.type,
                            filename: asset.fileName,
                            uniqueId: this.props.authData.uniqueId,
                            accountType: this.props.authData.accountType
                        }
            
                        axios.post(`${BASE_URL}/upload/misc/file/wo/save/cover/photo`, config).then((res) => {
                            if (res.data.message === "Uploaded successfully!") {
                                console.log(res.data);
            
                                const { file } = res.data;
            
                                this.setState({
                                    coverPhoto: file,
                                    loading: false,
                                    showBottomSheetCoverPhoto: false
                                })
                            } else {
                                console.log("Err", res.data);
            
                                this.setState({
                                    loading: false,
                                    showBottomSheetCoverPhoto: false
                                }, () => {
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Error occurred while uploading your selected file.',
                                        text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                                        visibilityTime: 4250,
                                        position: "bottom"
                                    });
                                })
                            }
                        }).catch((err) => {
                            console.log(err.message);
            
                            this.setState({
                                loading: false,
                                showBottomSheetCoverPhoto: false
                            }, () => {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Error occurred while uploading your selected file.',
                                    text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                                    visibilityTime: 4250,
                                    position: "bottom"
                                });
                            })
                        })
                    }
                }
			});
		}
    }

    handleImageGalleryLaunch = async (type) => {
        if (type === "profile-picture") {
            // profile picture logic...
            const options = {
                includeBase64: true,
                saveToPhotos: true,
                mediaType: "photo",
                selectionLimit: 1,
                quality: 1
            };
    
            const result = await launchImageLibrary(options);
    
            if (!_.has(result, "didCancel")) {
    
                this.setState({
                    loading: true
                })
                const asset = result.assets[0];
    
                const config = {
                    base64: asset.base64,
                    contentType: asset.type,
                    filename: asset.fileName,
                    uniqueId: this.props.authData.uniqueId
                }
    
                axios.post(`${BASE_URL}/upload/misc/file/wo/save/profile/picture`, config).then((res) => {
                    if (res.data.message === "Uploaded successfully!") {
                        console.log(res.data);
    
                        const { file } = res.data;
    
                        this.setState({
                            data: {
                                ...this.state.data,
                                profilePictures: [...this.state.data.profilePictures, file]
                            },
                            loading: false,
                            showBottomSheet: false
                        })
                    } else {
                        console.log("Err", res.data);
    
                        this.setState({
                            loading: false,
                            showBottomSheet: false
                        }, () => {
                            Toast.show({
                                type: 'error',
                                text1: 'Error occurred while uploading your selected file.',
                                text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                                visibilityTime: 4250,
                                position: "bottom"
                            });
                        })
                    }
                }).catch((err) => {
                    console.log(err.message);
    
                    this.setState({
                        loading: false,
                        showBottomSheet: false
                    }, () => {
                        Toast.show({
                            type: 'error',
                            text1: 'Error occurred while uploading your selected file.',
                            text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                            visibilityTime: 4250,
                            position: "bottom"
                        });
                    })
                })
            }
        } else {
            // cover photo logic...
            const options = {
                includeBase64: true,
                saveToPhotos: true,
                mediaType: "photo",
                selectionLimit: 1,
                quality: 1
            };
    
            const result = await launchImageLibrary(options);
    
            if (!_.has(result, "didCancel")) {
    
                this.setState({
                    loading: true
                })
                const asset = result.assets[0];
    
                const config = {
                    base64: asset.base64,
                    contentType: asset.type,
                    filename: asset.fileName,
                    uniqueId: this.props.authData.uniqueId,
                    accountType: this.props.authData.accountType
                }
    
                axios.post(`${BASE_URL}/upload/misc/file/wo/save/cover/photo`, config).then((res) => {
                    if (res.data.message === "Uploaded successfully!") {
                        console.log(res.data);
    
                        const { file } = res.data;
    
                        this.setState({
                            coverPhoto: file,
                            loading: false,
                            showBottomSheetCoverPhoto: false
                        })
                    } else {
                        console.log("Err", res.data);
    
                        this.setState({
                            loading: false,
                            showBottomSheetCoverPhoto: false
                        }, () => {
                            Toast.show({
                                type: 'error',
                                text1: 'Error occurred while uploading your selected file.',
                                text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                                visibilityTime: 4250,
                                position: "bottom"
                            });
                        })
                    }
                }).catch((err) => {
                    console.log(err.message);
    
                    this.setState({
                        loading: false,
                        showBottomSheetCoverPhoto: false
                    }, () => {
                        Toast.show({
                            type: 'error',
                            text1: 'Error occurred while uploading your selected file.',
                            text2: 'The attempt to upload your file failed as we encountered a random error while processing your request.',
                            visibilityTime: 4250,
                            position: "bottom"
                        });
                    })
                })
            }
        }
    }
    viewBottomSheet = () => {
        return (
            <BottomSheet
                isVisible={this.state.showBottomSheet}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.50, 0, 0.50)' }}
            >
                
                <View
                    activeOpacity={0.9}
                    onPress={() => this.setState({ showBottomSheet: false })}
                    style={styles.bottomSheetStyle}
                >
                    <Text style={{ textAlign: 'center', }}>
                        Select An Option
                    </Text>
                    <View style={{ height: 0.80, backgroundColor: 'gray', marginVertical: 10 }}>
                    </View>
                    <TouchableOpacity onPress={() => this.handleCameraLaunch("profile-picture")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require("../../assets/icons/camera-2.png")} style={styles.iconCustom} />
                        <Text style={{ marginLeft: 10 }}>
                            Camera
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.handleImageGalleryLaunch("profile-picture")} style={{ flexDirection: 'row', marginVertical: 10 * 2.0 }}>
                        <Image source={require("../../assets/icons/upload-2.png")} style={styles.iconCustom} />
                        <Text style={{ marginLeft: 10, marginTop: 7.25 }}>
                            Upload from Gallery
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ showBottomSheet: false })} style={{ flexDirection: 'row' }}>
                        <Image source={require("../../assets/icons/close-large.png")} style={styles.iconCustom} />
                        <Text style={{ marginLeft: 10, marginTop: 7.25, color: "darkred" }}>
                            Cancel/Close Pane
                        </Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        )
    }
    
    viewBottomSheetCoverPhoto = () => {
        return (
            <BottomSheet
                isVisible={this.state.showBottomSheetCoverPhoto}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.50, 0, 0.50)' }}
            >
                <View
                    activeOpacity={0.9}
                    onPress={() => this.setState({ showBottomSheetCoverPhoto: false })}
                    style={styles.bottomSheetStyle}
                >
                    <Text style={{ textAlign: 'center', }}>
                        Select An Option
                    </Text>
                    <View style={{ height: 0.80, backgroundColor: 'gray', marginVertical: 10 }}>
                    </View>
                    <TouchableOpacity onPress={() => this.handleCameraLaunch("cover-photo")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require("../../assets/icons/camera-2.png")} style={styles.iconCustom} />
                        <Text style={{ marginLeft: 10 }}>
                            Camera
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.handleImageGalleryLaunch("cover-photo")} style={{ flexDirection: 'row', marginVertical: 10 * 2.0 }}>
                        <Image source={require("../../assets/icons/upload-2.png")} style={styles.iconCustom} />
                        <Text style={{ marginLeft: 10, marginTop: 7.25 }}>
                            Upload from Gallery
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({ showBottomSheetCoverPhoto: false })} style={{ flexDirection: 'row' }}>
                        <Image source={require("../../assets/icons/close-large.png")} style={styles.iconCustom} />
                        <Text style={{ marginLeft: 10, marginTop: 7.25, color: "darkred" }}>
                            Cancel/Close Pane
                        </Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        )
    }

    saveButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.props.navigation.goBack()}
                style={styles.saveButtonContainerStyle}>
                <Text style={{ }}>Save</Text>
            </TouchableOpacity>
        )
    }

    passwordTextField() {
        return (
            <View style={styles.textFieldsCommonStyle}>
                <OutlinedTextField
                    label='Password'
                    labelTextStyle={{}}
                    style={{}}
                    value={this.state.password}
                    onChangeText={(value) => this.setState({ password: value })}
                    secureTextEntry={true}
                    keyboardType="numeric"
                />
            </View>
        )
    }

    phoneNumberTextField() {
        return (
            <View style={styles.textFieldsCommonStyle}>
                <OutlinedTextField
                    label='PhoneNumber'
                    labelTextStyle={{ }}
                    style={{  }}
                    value={this.state.phoneNumber}
                    onChangeText={(value) => this.setState({ phoneNumber: value })}
                />
            </View>
        )
    }

    emailTextField() {
        return (
            <View style={styles.textFieldsCommonStyle}>
                <OutlinedTextField
                    label='Email'
                    labelTextStyle={{ }}
                    style={{  }}
                    value={this.state.email}
                    onChangeText={(value) => this.setState({ email: value })}
                />
            </View>
        )
    }

    nameTextField() {
        return (
            <View style={{ paddingHorizontal: 10 * 2.0, marginTop: 10 * 3.0 }}>
                <OutlinedTextField
                    label='Name'
                    labelTextStyle={{ }}
                    style={{  }}
                    value={this.state.name}
                    onChangeText={(value) => this.setState({ name: value })}
                />
            </View>
        )
    }

    renderProfilePicture = () => {
        const { data } = this.state;

        const last = (typeof data.profilePictures !== "undefined" && data.profilePictures.length > 0) ? data.profilePictures[data.profilePictures.length - 1].link : null;

        console.log("LASTTTTTTTTTTTTTT", last);

        if (last !== null) {
            return <Image
                source={{ uri: `${BASE_ASSET_URL}/${last}` }}
                style={{ height: 112.25, width: 112.25, marginBottom: 13.75, borderRadius: 65.0, top: 50 }}
                resizeMode="contain"
            />;
        } else {
            return <Image
                source={require('../../assets/icons/upload.png')}
                style={{ height: 112.25, width: 112.25, marginBottom: 13.75, borderRadius: 65.0, top: 50 }}
                resizeMode="contain"
            />;
        }
    }
    profileImageChangeInfo() {
        const { data } = this.state;
        
        return (
            <View style={{ alignItems: 'center', marginTop: 10 * 2.5 }}>
                {this.renderProfilePicture()}
                <View style={{ position: 'absolute', bottom: -9.0, }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => this.setState({ showBottomSheet: true })}
                        style={styles.changeProfileContainerStyle}>
                        <Image resizeMode="contain" source={require("../../assets/icons/coverphoto.png")} style={{ ...styles.iconCustom, tintColor: "white" }} />
                        <Text style={{ marginLeft: 10 - 5.0, color: "#fff" }}>
                            Change (Main Image)
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        breakerSection: {
            fontWeight: "bold"
        },
        tagBadge: {
            fontWeight: "bold",
            color: "white",
            position: "static"
        },  
        pencil: {
            maxWidth: 22.5,
            maxHeight: 22.5
        },  
        changeProfileContainerStyle: {
            flexDirection: 'row',
            backgroundColor: "#000",
            paddingVertical: 10 - 5.0,
            width: 225,
            borderRadius: 10 * 2.0,
            borderColor: "#fff",
            borderWidth: 2.0,
            top: 50,
            alignItems: 'center',
            justifyContent: 'center'
        },
        centeredList: {
            paddingBottom: 25,
            flexGrow: 1,
            flex: 1
        },
        showMoreOrLess: {
            fontWeight: "bold", 
            color: primaryColor, 
            paddingBottom: 0, 
            paddingLeft: 17.75, 
            paddingTop: 7.5,
            backgroundColor: "#fff", 
            width, 
            paddingBottom: 32.5
        },
        tagContainer: {
            backgroundColor: "#fff",
            flex: 1,
            maxHeight: 212.5,
            flexWrap: "wrap",
            flexGrow: 1,
            padding: 7.5,
            maxWidth: width,
            height: "100%",
            minHeight: 212.5,
            flexDirection: "row",
            width
        },
        topRightCover: {
            position: "absolute",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            left: 17.25,
            top: 17.25,
            minWidth: 82.5,
            width: 82.5
        }, 
        spinnerTextStyle: {
            fontSize: 24.75,
            textAlign: "center",
            fontWeight: "bold",
            color: "#fff"
        },
        rightIconOnly: {
            maxWidth: 50,
            maxHeight: 50,
            height: 50,
            width: 50
        },
        avatarIcon: {
            minHeight: 25,
            minWidth: 25,
            maxWidth: 25,
            maxHeight: 25,
            height: 25,
            width: 25
        },
        listitemSettings: {
            maxWidth: width,
            width
        },  
        listitemSettingsVoice: {
            maxWidth: width * 0.975,
            width,
            borderWidth: 2,
            margin: 3.5,
            borderColor: primaryColor,
            borderStyle: "dashed"
        },
        slightMargin: {
            padding: 17.5,
            backgroundColor: "#fff"
        },
        activity: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "rgba(0, 0, 0, 0.535)",
            zIndex: 999999999999999999999999999999
        },
        saveButtonContainerStyle: {
            backgroundColor: primaryColor,
            paddingVertical: 10 + 5.0,
            marginHorizontal: 10 * 2.0,
            alignItems: 'center',
            borderRadius: 10 - 5.0,
            marginVertical: 10 + 5.0
        },
        textFieldsCommonStyle: {
            paddingHorizontal: 10 * 2.0,
            marginTop: 10 * 1.5
        },
        bottomSheetStyle: {
            backgroundColor: 'white',
            paddingHorizontal: 10 * 2.0,
            paddingVertical: 10
        },
        iconCustom: {
            maxWidth: 30,
            maxHeight: 30,
            minHeight: 30,
            minWidth: 30
        },
        rightIconArrow: {
            maxWidth: 27.75,
            maxHeight: 27.75,
            minHeight: 27.75,
            minWidth: 27.75
        }
    }
)

EditProfileScreen.navigationOptions = {
    title: 'Edit Profile',
    headerTitleStyle: { marginLeft: -10 * 2.0, },
    headerStyle: {
        backgroundColor: primaryColor,
    },
    headerTintColor: 'white',
    ...TransitionPresets.SlideFromRightIOS,
}
const mapStateToProps = (state) => {
    console.log("sssssssstate", state);
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null,
        isDarkMode: _.has(state.application, "force_dark") && state.application.force_dark !== "undefined" ? state.application.force_dark : true
    }
}

export default connect(mapStateToProps, {  })(withNavigation(EditProfileScreen));