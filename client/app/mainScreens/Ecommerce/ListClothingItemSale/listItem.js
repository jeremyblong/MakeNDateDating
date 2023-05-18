import React, { Fragment, useState } from "react";
import { Text, Icon, Header, TextInput, Button, Tag } from "@components";
import { useTheme } from '@config';
import { useColorScheme, View, ScrollView, TextInput as CustomTextInput, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./listItemStyles.js";
import RNPickerSelect from 'react-native-picker-select';
import axios from "axios";
import { connect } from "react-redux";
import { BASE_URL } from "@env";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from "react-native-toast-message";
import _ from "lodash";
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const clothingTypes = [{
    label: "Bra",
    value: "bra"
}, {
    label: "Panties",
    value: "panties"
}, {
    label: "T-Shirt",
    value: "t-shirt"
}, {
    label: "Dress",
    value: "Dress"
}, {
    label: "Shorts",
    value: "shorts"
}, {
    label: "Tank-Top",
    value: "tanktop"
}, {
    label: "Jeans",
    value: "jeans"
}, {
    label: "Swim-Suit",
    value: "swimsuit"
}, {
    label: "Thong",
    value: "thong"
}, {
    label: "Socks",
    value: "socks"
}, {
    label: "Leggings",
    value: "leggings"
}, {
    label: "Other",
    value: "other"
}];

const daysOfUseOptions = [{
    label: "1 Day",
    value: 1
}, {
    label: "2 Days",
    value: 2
}, {
    label: "3 Days",
    value: 3
}, {
    label: "4 Days",
    value: 4
}, {
    label: "5 Days",
    value: 5
}, {
    label: "6 Days",
    value: 6
}, {
    label: "7 Days",
    value: 7
}]

const ListNewItemSaleClothing = ({ authData }) => {

    const navigation = useNavigation();
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const [ state, setState ] = useState({
        title: "",
        page: 1,
        description: "",
        hashtags: [],
        files: [],
        clothingType: null,
        lengthOfWear: null,
        loading: false,
        educationalExperience: null,
        price: ""
    })

    const handleBlurCalculation = () => {
        const tagArr = [];

        if (typeof state.hashtagText !== "undefined" && state.hashtagText.length > 0) {
            const split = state.hashtagText.split(" ");

            for (let idxx = 0; idxx < split.length; idxx++) {
                const hashtag = split[idxx];
                if (hashtag.startsWith("#")) {
                    tagArr.push(hashtag.split("#")[1]);
                }

                if ((split.length - 1) === idxx) {
                    setState(prevState => {
                        return {
                            ...prevState,
                            hashtags: tagArr
                        }
                    })
                }
            }
        }
    }

    const handleNewUploadSubmission = () => {
        console.log("handleNewUploadSubmission clicked/ran...");

        const { title, description, hashtags, clothingType, lengthOfWear, files, price } = state;

        const config = {
            uniqueId: authData.uniqueId,
            title, 
            description, 
            hashtags, 
            clothingType, 
            lengthOfWear,
            files,
            price
        }
        axios.post(`${BASE_URL}/post/new/item/sale/marketplace`, config).then((res) => {
            if (res.data.message === "Successfully posted item!") {
                console.log("Successfully posted item!", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully uploaded/posted your item for sale!`,
                    text2: `We've successfully listed your item - it is now LIVE...`,
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
                    text1: `Error attempting to post your item for sale!`,
                    text2: `Item listing failed to post/upload, please try this action again or contact support if the problem persists...`,
                    visibilityTime: 2375,
                    position: "bottom"
                });
            }
        }).catch((err) => {

            // Toast.show({
            //     type: 'error',
            //     text1: `Error attempting to post your item for sale!`,
            //     text2: `Item listing failed to post/upload, please try this action again or contact support if the problem persists...`,
            //     visibilityTime: 2375,
            //     position: "bottom"
            // });

            console.log(err.message);
        })
    }

    const renderMainContent = () => {
        if (state.page === 1) {

            const calculateDisabled = () => {
                const { title, description, hashtags, category, lengthOfWear, clothingType, price } = state;
                if ((typeof title !== "undefined" && title.length > 0) && (typeof description !== "undefined" && description.length > 0) && (category !== null) && (typeof hashtags !== "undefined" && hashtags.length > 0) && (lengthOfWear !== null) && (clothingType !== null) && (typeof price !== "undefined" && price.length > 0)) {
                    return false;
                } else {
                    return true;
                }
            }

            return (
                <Fragment>
                    <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 132.25 }} keyboardShouldPersistTaps='always'>
                    <Text style={styles.mainTitle}>Sell personal used-clothing for profit!</Text>
                    <Text style={styles.labeled}>Earn up-to RETAIL price (What you originally paid) for used clothing... Use this form to create a new marketplace post/posting to sell your used yoga pants, shirts, panties, socks, etc... (Whatever you'd like really)</Text>
                    <View style={styles.hr} />
                    <Text style={styles.labeledTier}>Enter the title for your listing</Text>
                        <TextInput
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    title: text
                                }
                            })}
                            secureTextEntry={false}
                            placeholder="Enter your listing title..."
                            value={state.title}
                        />
                        <Text style={styles.labeledTier}>Enter a price for your clothing article</Text>
                        <TextInput
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    price: text.replace(/[^0-9]/g, '')
                                }
                            })}
                            keyboardType={"number-pad"}
                            secureTextEntry={false}
                            placeholder="Enter your price per item ($$$)..."
                            value={state.price}
                        />
                        <Text style={styles.labeledTier}>Select the type of clothing article you're selling</Text>
                        <RNPickerSelect 
                            onValueChange={(value) => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        clothingType: value
                                    }
                                })
                            }}
                            textInputProps={colorSchemeDark ? { color: "#fff" } : {}}
                            value={state.clothingType}
                            useNativeAndroidPickerStyle={false}
                            items={clothingTypes}
                        />
                        <Text style={styles.labeledTier}>Select how many days this clothing article has been worn</Text>
                        <RNPickerSelect 
                            onValueChange={(value) => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        lengthOfWear: value
                                    }
                                })
                            }}
                            useNativeAndroidPickerStyle={false}
                            textInputProps={colorSchemeDark ? { color: "#fff" } : {}}
                            value={state.lengthOfWear}
                            items={daysOfUseOptions}
                        />
                        <Text style={styles.labeledTier}>Enter a description for your item (Please be appropriate)</Text>
                        <CustomTextInput
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    description: text
                                }
                            })}
                            multiline={true}
                            numberOfLines={8}
                            placeholderTextColor={colorSchemeDark ? "grey" : "#000"}
                            style={colorSchemeDark ? { backgroundColor: colors.card, color: "#fff", textAlignVertical: 'top', padding: 7.25, minHeight: 125 } : { backgroundColor: colors.card, textAlignVertical: 'top', padding: 7.25, minHeight: 125 }}
                            secureTextEntry={false}
                            placeholder="Enter your description of this item - you can be detailed but do not particpate in excessive sexual talk..."
                            value={state.description}
                        />
                        <Text style={styles.labeledTier}>Enter hashtags for your listing</Text>
                        <CustomTextInput
                            onChangeText={text => setState(prevState => {
                                return {
                                    ...prevState,
                                    hashtagText: text
                                }
                            })}
                            secureTextEntry={false}
                            blurOnSubmit={true}
                            onBlur={handleBlurCalculation}
                            style={colorSchemeDark ? { backgroundColor: colors.card, padding: 5, color: "#fff" } : { backgroundColor: colors.card, padding: 5 }}
                            placeholder="Enter your hashtags..."
                            placeholderTextColor={colorSchemeDark ? "grey" : "#000"}
                            value={state.hashtagText}
                        />
                        <View style={styles.hr} />
                            <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                                {typeof state.hashtags !== "undefined" && state.hashtags.length > 0 ? state.hashtags.map((hashtag, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <Tag
                                                key={`hashtag-${index}`}
                                                icon={
                                                    <Icon
                                                        name={"hashtag"}
                                                        size={12}
                                                        color={colors.accent}
                                                        solid
                                                        style={{ marginRight: 5, marginTop: 5 }}
                                                    />
                                                }
                                                chip
                                                style={{
                                                    marginTop: 5,
                                                    marginRight: 5,
                                                    color: "#fff"
                                                }}
                                                textStyle={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}
                                            >
                                                {hashtag}
                                            </Tag>
                                        </Fragment>
                                    );
                                }) : null}
                            </View>
                        <View style={styles.hr} />
                        <Button style={calculateDisabled() ? { backgroundColor: "lightgrey" } : { backgroundColor: colors.primary }} disabled={calculateDisabled()} full onPress={() => setState(prevState => {
                            return {
                                ...prevState,
                                page: 2
                            }
                        })}> 
                            {`Continue To Picture's`}
                        </Button>
                    </KeyboardAwareScrollView>
                </Fragment>
            );
        } else {

            const calculateDisabled = () => {
                const { files } = state;
                if ((typeof files !== "undefined" && files.length > 0)) {
                    return false;
                } else {
                    return true;
                }
            }

            const handleTakeNewPhoto = async () => {
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
							    position: "bottom",
							    onHide: () => {}
							});

		                    setState(prevState => {
				            	return {
				            		...prevState,
				            		loading: false,
                                    files: [...prevState.files, file]
				            	}
				            })
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
		            });
                }
            }

            const handleImagePickSelection = async () => {

                const options = {
                    includeBase64: true,
                    saveToPhotos: true,
                    mediaType: "photo",
                    selectionLimit: 1
                };

                const result = await launchImageLibrary(options);
    
                if (!_.has(result, "didCancel")) {

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
							    position: "bottom",
							    onHide: () => {}
							});

		                    setState(prevState => {
				            	return {
				            		...prevState,
				            		loading: false,
                                    files: [...prevState.files, file]
				            	}
				            })
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
		            });
                }
            }

            return (
                <Fragment>
                    <View style={styles.centered}>
                        <Image source={require("../../../assets/images/custom/upload-ill.png")} style={styles.illustration} />
                    </View>
                    <Text style={styles.label}>Upload <Text style={{ color: colors.primary }}>listing</Text> photo's</Text>
                    <Text style={[styles.labeledTier, { marginTop: 22.25 }]}>Upload as many <Text style={{ color: colors.primary }}>accurate photos</Text> of your clothing article(s). This helps user's identify if it's something they want to buy and are interested in. Please upload at least 2 (two) photos - we recommend uploading pictures of yourself as well as the clothing article for sale so people know who wore the clothing!</Text>
                    <TouchableOpacity onPress={() => handleImagePickSelection()} style={styles.touchableButton}>
                        <Text style={colorSchemeDark ? [styles.innerText, { color: colors.primary }] : styles.innerText}>Select/Pick a photo from library</Text>
                    </TouchableOpacity>
                    <View style={styles.hr} />
                    <TouchableOpacity onPress={() => handleTakeNewPhoto()} style={styles.touchableButton}>
                        <Text style={colorSchemeDark ? [styles.innerText, { color: colors.primary }] : styles.innerText}>Take a new photo</Text>
                    </TouchableOpacity>
                    <View style={styles.hr} />
                    {typeof state.files !== "undefined" && state.files.length > 0 ? state.files.map((file, index) => {
                        return (
                            <Fragment key={index}>
                                <Text style={colorSchemeDark ? [styles.fileNameText, { color: colors.primary }] : styles.fileNameText}>{`${index + 1})`} {file.name}</Text>
                            </Fragment>
                        );
                    }) : null}
                    {typeof state.files !== "undefined" && state.files.length > 0 ? <View style={styles.hr} /> : null}
                    <Button style={calculateDisabled() ? { backgroundColor: "lightgrey" } : { backgroundColor: colors.primary }} disabled={calculateDisabled()} full onPress={() => handleNewUploadSubmission()}> 
                            {`Submit & Continue`}
                        </Button>
                </Fragment>
            );
        }
    }
    return (
        <Fragment>
            <Header
                title="List Item(s)"
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
            <Spinner
                visible={state.loading}
                textContent={'Loading/Uploading...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor={"rgba(0, 0, 0, 0.725)"}
            />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }} style={styles.container}>
                {renderMainContent()}
            </ScrollView>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {  })(ListNewItemSaleClothing);