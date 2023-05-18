import React, { Fragment, useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Image, Dimensions, Animated, Keyboard } from "react-native";
import styles from "./paneStyles.js";
import moment from "moment";
import {useTranslation} from 'react-i18next';
import { BaseColor, Images, useTheme } from '@config';
import CollapsingToolbar from "../../../../../component/appBarScreen.js";
import GoogleMapRenderHelper from "./mapHelper/renderMap.js";
import Collapsible from 'react-native-collapsible';
import AwesomeButtonBlue from "react-native-really-awesome-button/src/themes/blue";
import { BASE_ASSET_URL, BASE_URL } from "@env";
import ViewMoreText from 'react-native-view-more-text';
import axios from "axios";
import _ from "lodash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const { width, height } = Dimensions.get("window");

const PaneSheetDetailsHelper = (props) => {

    console.log("propsssss....:", props);

    const {colors} = useTheme();
    const {t} = useTranslation(); 
    
    const { detailsSheetRef, currentlySelected, updateParentState } = props;

    const [ state, setState ] = useState({
        showSnackBar: false,
        isInWishList: false,
        isCollapsed: false,
        modalVisibility: false,
        selectedImage: null,
        commentText: "",
        posterProfilePic: null,
        commentDialog: false,
        multiline: false,
        currentlySelected: null,
        liveListing: null,
        listingLoaded: false
    });

    const { mainData, postedByID, date, dateString, id, newlyConstructedCoordsRandomizedNearby, alreadyCompletedDeliveries, likes, dislikes, postedByName, postedByUsername
    } = currentlySelected || {};
    
    const { mainCategory, subCategory, environmentalConditions, environmentBuildingType, spaceMeasurementsDimensionsFeet, contactRequiredOrNot, description, uploadedRelatedImages } = mainData || {};

    const { 
        listingLoaded 
    } = state;

    useEffect(() => {
        // set listing data for global availability...!
        setState(prevState => {
            return {
                ...prevState,
                liveListing: currentlySelected,
                listingLoaded: true
            }
        });
        // fetch pictures relevant to comment(s)
        const config = {
            params: {
                postedByID: currentlySelected.postedByID
            }
        };
        axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
            if (res.data.message === "Submitted gathered user's picture/file!") {

                console.log("Succcccccccesssss: ", res.data);

                const { user } = res.data; 

                setState(prevState => {
                    return {
                        ...prevState,
                        posterProfilePic: (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null
                    }
                })
            } else {
                console.log("Else ran upon axios request...:", res.data);
            }
        }).catch((err) => {
            console.log("Errrrrrrrrrrrrrr", err);
        });
    }, []) 

    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const renderPhysicalSpaceSizeRender = () => {
        const { length, width, height } = spaceMeasurementsDimensionsFeet;
        return (
            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 10 - 8.0
                    }}>
                    <Text style={styles.titled}>
                        Space/Location Size-Constraint(s)
                    </Text>
                    <TouchableOpacity onPress={() => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                isCollapsed: !prevState.isCollapsed
                            }
                        })
                    }}>
                        <Image
                            source={require('../../../../../assets/images/icon/change-96.png')}
                            style={{ width: 32.5, height: 32.5, borderRadius: 11.5, left: -15 }}
                        />
                    </TouchableOpacity>
                </View>
                <Collapsible collapsed={state.isCollapsed}>
                    <View style={{ marginVertical: 10 + 1.75, marginHorizontal: 10 * 1.75 }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10 - 7.0
                        }}>
                            <Text style={{ fontWeight: "bold", fontSize: 16.25 }}>
                                <Text style={styles.buildingTypeText}>{length}" x {width}" x {height}"</Text> (Length ~ Width ~ Height)
                            </Text>
                        </View>
                    </View>
                </Collapsible>
            </View>
        )
    }
    const enviormentalConditionsMet = () => {
        return (
            <View style={{ marginTop: 10 - 8.0, paddingBottom: 10 }}>
                {environmentalConditions.map((item) => (
                    <View key={item.id}>
                        <View style={styles.aminitiesContentStyle}>
                            <Image
                                source={require('../../../../../assets/images/icon/checked-circle.png')}
                                style={{ width: 27.25, height: 27.25, borderRadius: 9.25, tintColor: colors.primary }}
                            />
                            <Text style={{ marginLeft: 8.25, marginTop: 1.5 }}>
                                <Text style={styles.mainChunkText}>{item.name}</Text> ~ {item.subtitle}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        )
    }
    const mapInfo = () => {

        const latitude = newlyConstructedCoordsRandomizedNearby.coordinates[1];
        const longitude = newlyConstructedCoordsRandomizedNearby.coordinates[0];

        return (
            <View style={styles.mapStyle}>
                <GoogleMapRenderHelper
                    latitude={latitude}
                    longitude={longitude}
                    height={150}
                    pinColor={colors.primary}
                />
            </View>
        )
    }
    const photos = () => {
        const renderItem = ({ item, index }) => {
            return (
                <Fragment key={index}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{ overflow: 'hidden' }}
                        onPress={() => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    selectedImage: item,
                                    modalVisibility: true
                                }
                            })
                        }} // navigation.navigate('ImageFullView', { image: item.photo, id: item.id })
                    >
                        <Image
                            source={{ uri: `${BASE_ASSET_URL}/${item.link}` }}
                            style={styles.propertyPhotosStyle}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </Fragment>
            );
        }
        return (
            <FlatList
                horizontal
                data={uploadedRelatedImages}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingLeft: 10 * 2.0,
                    paddingTop: 10 - 5.0
                }}
            />
        )
    };
    const renderViewMore = (onPress) => {
        return (
            <Text style={styles.showMoreOrLess} onPress={onPress}>View more</Text>
        )
    }
    const renderViewLess = (onPress) => {
        return (
            <Text style={styles.showMoreOrLess} onPress={onPress}>View less</Text>
        )
    }
    const renderBuildingType = () => {
        return (
            <View style={{ marginLeft: 17.25, marginRight: 17.25, marginBottom: 25 }}>
                <Text style={styles.buildingTypeText}>{environmentBuildingType.name}</Text>
                <View style={styles.thinnerHr} />
                <Text style={styles.buildingTypeTextSub}>{environmentBuildingType.subtitle}</Text>
            </View>
        );
    }
    const renderContactRequirements = () => {
        return (
            <View style={{ marginLeft: 17.25, marginRight: 17.25, marginBottom: 25 }}>
                <Text style={styles.buildingTypeText}>{contactRequiredOrNot.name}</Text>
                <View style={styles.thinnerHr} />
                <Text style={styles.buildingTypeTextSub}>{contactRequiredOrNot.subtitle}</Text>
            </View>
        );
    }
    const descriptionTextRender = () => {
        return (
            <ViewMoreText
                numberOfLines={3}
                renderViewMore={renderViewMore}
                renderViewLess={renderViewLess}
                textStyle={{ marginHorizontal: 10 * 1.75, marginRight: 25, textAlign: 'justify', color: "#000", fontWeight: "bold" }}
            >
                <Text>
                    {description}
                </Text>
            </ViewMoreText>
        );
    }
    const title = ({ title }) => {
        return (
            <Text style={styles.titled}>
                {title}
            </Text>
        )
    }
    const renderSpacerPadding = () => {
        return <View style={{ paddingTop: 12.5, paddingBottom: 12.5 }} />;
    }
    
    const propertyInfo = () => {
        return (
            <View style={{ marginHorizontal: 10 * 2.0 }}>
                <View style={[styles.propertyAmountContentStyle, { marginTop: 32.5 }]}>
                    <Text style={{}}>
                        {mainCategory.subtitle}
                    </Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 10
                }}>
                    <View>
                        <Text style={{}}>
                            Posted <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>{moment(date).fromNow(true)}</Text> on {dateString}
                        </Text>
                        <Text style={styles.subCategoryStyleText}>
                            {subCategory.name}
                        </Text>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10 + 8.75,
                    marginBottom: 10 + 2.75
                }}>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.numericalWrapper}>
                            <Text style={styles.numericalText}><Text style={styles.innerNumText}>{likes}</Text> likes</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.numericalWrapper}>
                            <Text style={styles.numericalText}><Text style={styles.innerNumText}>{dislikes}</Text> dislikes</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.numericalWrapper}>
                            <Text style={styles.numericalText}><Text style={styles.innerNumText}>{alreadyCompletedDeliveries}</Text> drop's</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const conditionallyRenderMainDataChunk = () => {
        if (listingLoaded === true) {
            return (
                <Fragment>
                    <View style={styles.contentContainer}>
                        <CollapsingToolbar
                            centerItem={<TouchableOpacity onPress={() => {
                                updateParentState(prevState => {
                                    return {
                                        ...prevState,
                                        dialogVisibility: true
                                    }
                                })
                            }} style={styles.absoluteMiddle}><Text style={styles.buttonInnerText}>Select This Dropoff!</Text></TouchableOpacity>}
                            borderBottomRadius={20}
                            toolbarColor={colors.primary}
                            toolBarMinHeight={40}
                            toolbarMaxHeight={358}
                            src={require('../../../../../assets/images/e-waste-1.jpg')}>
                            <View style={{ paddingBottom: 10 * 8.0 }}>
                                {propertyInfo()}
                                {title({ title: 'Description' })}
                                {descriptionTextRender()}
                                {title({ title: 'Property Type' })}
                                {renderBuildingType()}
                                {title({ title: 'Contact Required Or Not' })}
                                {renderContactRequirements()}
                                {title({ title: 'Photos' })}
                                {photos()}
                                {renderSpacerPadding()}
                                {title({ title: 'Location' })}
                                {mapInfo()}
                                {renderSpacerPadding()}
                                {title({ title: 'Enviormental Conditions Selected' })}
                                {enviormentalConditionsMet()}
                                {renderPhysicalSpaceSizeRender()}
                            </View>
                        </CollapsingToolbar>
                    </View>
                    <View style={styles.footer}>
                        <AwesomeButtonBlue backgroundDarker={"#000"} backgroundColor={"#e60000"} style={styles.absoluteButtonBottom} type={"secondary"} onPress={() => detailsSheetRef.current.close()} textColor={"#fff"} backgroundShadow={"black"} stretch={true}>Cancel/Close Pane</AwesomeButtonBlue>
                    </View>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <SkeletonPlaceholder>
                        <View style={{ width: "100%", minHeight: 125, height: 125, borderRadius: 35 }} />
                    </SkeletonPlaceholder>
                    <View style={{ marginTop: 7.5 }} />
                    <SkeletonPlaceholder>
                        <View style={{ width: "100%", minHeight: 125, height: 125, borderRadius: 35 }} />
                    </SkeletonPlaceholder>
                    <View style={{ marginTop: 7.5 }} />
                    <SkeletonPlaceholder>
                        <View style={{ width: "100%", minHeight: 125, height: 125, borderRadius: 35 }} />
                    </SkeletonPlaceholder>
                    <View style={{ marginTop: 7.5 }} />
                    <SkeletonPlaceholder>
                        <View style={{ width: "100%", minHeight: 125, height: 125, borderRadius: 35 }} />
                    </SkeletonPlaceholder>
                    <View style={{ marginTop: 7.5 }} />
                    <SkeletonPlaceholder>
                        <View style={{ width: "100%", minHeight: 125, height: 125, borderRadius: 35 }} />
                    </SkeletonPlaceholder>
                    <View style={{ marginTop: 7.5 }} />
                    <SkeletonPlaceholder>
                        <View style={{ width: "100%", minHeight: 125, height: 125, borderRadius: 35 }} />
                    </SkeletonPlaceholder>
                </Fragment>
            );
        }
    }
    return (
        <View style={styles.container}>
            {conditionallyRenderMainDataChunk()}
        </View>
    );
}
export default PaneSheetDetailsHelper;