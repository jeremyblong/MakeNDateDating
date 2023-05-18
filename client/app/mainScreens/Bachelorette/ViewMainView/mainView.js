import React, { Fragment, useRef, useState, useEffect } from "react";
import { View, Image, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native'
import Toast from "react-native-toast-message";
import styles from "./mainViewStyles.js";
import { Text, Header, Icon, Button, Tag } from "@components";
import { useTheme, BaseColor } from '@config';
import moment from "moment";
import { useNavigation } from '@react-navigation/native';
import ShowDetailsPaneBachelorette from "./Sheets/InfoSheet.js";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import { connect } from "react-redux";
import _ from "lodash";

const { width, height } = Dimensions.get("window");

const BacheloretteMainViewHomepage = ({ authData }) => {

    const { colors, theme } = useTheme();
    const navigation = useNavigation();
    const refSheet = useRef(null);
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        selected: null,
        listings: [],
        alreadyIncluded: []
    })

    useEffect(() => {
        console.log("mounted...!");

        const configuration = {
            params: {
                idsAlreadyIncluded: state.alreadyIncluded
            }
        };

        axios.get(`${BASE_URL}/gather/competitions/bachelorette/games`, configuration).then((res) => {
            if (res.data.message === "Successfully gathered games!") {
                console.log("Successfully gathered games!", res.data);

                const { listings } = res.data;

                setState(prevState => {
                    return {
                        ...prevState,
                        listings: listings.filter((listing) => {
                            const dateA = moment(new Date(moment(listing.creationDate).add(7, "d")));
                            const dateB = moment(new Date());

                            const differenceDate = dateA.diff(dateB, 'days');

                            if (differenceDate > 0) {
                                return (Number(listing.listingData.startDate) >= Number(moment(authData.birthdate).format("YYYY"))) && (Number(listing.listingData.endDate) <= Number(moment(authData.birthdate).format("YYYY")) && listing.joinable === true)
                            }
                        })
                    }
                })

                Toast.show({
                    type: 'success',
                    text1: `Successfully gathered the data!`,
                    text2: `We've successfully gathered the appropriate data, checkout the competitions!`,
                    visibilityTime: 2750,
                    position: "bottom"
                });
            } else {
                console.log("Err", res.data);

                // Toast.show({
                //     type: 'error',
                //     text1: `Error attempting to gather proper data!`,
                //     text2: `An error occurred while attempting to gather proper data - please try again or report to support if persists...`,
                //     visibilityTime: 2750,
                //     position: "bottom"
                // });
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }, []);

    const renderHeader = () => {
        return (
            <Fragment>
                <Button style={{ backgroundColor: BaseColor.greenColor, marginVertical: 12.25 }} full onPress={() => {
                    if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                        navigation.navigate("CreateNewBacheloretteGame")
                      } else {
                        Toast.show({
                            type: 'info',
                            text1: 'You must sign-in/up first...',
                            text2: `Please login/signup before accessing these features...`,
                            visibilityTime: 4250,
                            position: "bottom"
                        });
                      }
                }}> 
                    {`Create New Bachelorette Game`}
                </Button>
            </Fragment>
        );
    };

    const renderEmptyList = () => {
        return (
            <Fragment>
                <View style={styles.centeredMargin}>
                    <Text style={styles.noneAvailableText}>No listings/data are available, please check back at a later time to see if there are listings that were posted since you last checked...</Text>
                    <Image resizeMode={"contain"} source={require("../../../assets/images/noresult.png")} style={styles.placeholderImage} />
                </View>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Header
                title={"Bachelorette Games"}
                subTitle="Join a new bachelorette group..."
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
                // renderRight={() => {
                //     return (
                //         <Text headline primaryColor numberOfLines={1}>
                //             Search
                //         </Text>
                //     );
                // }}
                // onPressRight={() => {
                //     console.log("pressed right.");
                // }}
            />
            <ShowDetailsPaneBachelorette updateOutterState={setState} selected={state.selected} refSheet={refSheet} />
            <FlatList
                data={state.listings}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyList}
                renderItem={({ item, index }) => {
                    if (item.joinable === true) {
                        const dateA = moment(new Date(moment(item.creationDate).add(7, "d")));
                        const dateB = moment(new Date());

                        const differenceDate = dateA.diff(dateB, 'days');

                        const { bachelor, listingData } = item;
                        const lengthOfUsersJoined = typeof item.joined !== "undefined" && item.joined.length > 0 ? item.joined.length : 0;
                        const amountToFill = listingData.canidateCount - lengthOfUsersJoined;
                        const joinedArr = item.joined.concat(new Array(amountToFill).fill(null));
                        return (
                            <View key={index} style={colorSchemeDark ? [styles.card, { backgroundColor: "#000", borderColor: "#fff" }] : [styles.card, { backgroundColor: "#fff", borderColor: "#000" }]} onPress={() => {}}>
                                <View style={styles.cardContent}>
                                    <Text style={styles.membersText}>These are the 'already joined' competing members...</Text>
                                    <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.imagesContent}>
                                        {joinedArr.map((joinedUser, index) => {
                                            if (joinedUser === null) {
                                                return (
                                                    <TouchableOpacity onPress={() => {}} key={`${item.id}_${index}`}>
                                                        <Image blurRadius={10} style={colorSchemeDark ? [styles.productImage, { borderColor: "#fff" }] : [styles.productImage, { borderColor: "#000" }]} source={{ uri: `https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/placeholder-loading.png` }} />
                                                    </TouchableOpacity>
                                                );
                                            } else {
                                                return (
                                                    <TouchableOpacity onPress={() => {}} key={`${item.id}_${index}`}>
                                                        <Image blurRadius={10} style={colorSchemeDark ? [styles.productImage, { borderColor: "#fff" }] : [styles.productImage, { borderColor: "#000" }]} source={{ uri: `${BASE_ASSET_URL}/${joinedUser.profilePictures[joinedUser.profilePictures.length - 1].link}` }} />
                                                    </TouchableOpacity>
                                                );   
                                            }
                                        })}
                                    </ScrollView>
                                    <Text numberOfLines={1} style={[styles.gender, { color: colors.primary }]}>{listingData.title}</Text>
                                    <Text numberOfLines={2} style={styles.gender}>{listingData.subtitle}</Text>
                                    <Text style={[styles.productName, { color: colors.accent }]}>{item.postedName}</Text>
                                    <Text style={styles.gender}>{bachelor.gender.label}</Text>
                                    <Text style={styles.productPrice}>Cohort Starts in {differenceDate} days...</Text>
                                    <View style={styles.centered}>
                                        <Image style={[styles.bacheloretteImage, { borderColor: colors.primary }]} source={{ uri: `${BASE_ASSET_URL}/${bachelor.profilePictures[bachelor.profilePictures.length - 1].link}` }} />
                                    </View>
                                </View>
                                <View style={styles.cardActions}>
                                    {/* <TouchableOpacity style={[styles.buttonMain, { backgroundColor: colors.accent }]} onPress={() => {}}>
                                        <Text style={[styles.buttonText, { color: "#fff" }]}>Join Competition</Text>
                                    </TouchableOpacity> */}
                                    <Button style={{ backgroundColor: colors.accent, marginVertical: 12.25 }} full onPress={() => {
                                        if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                                            setState(prevState => {
                                                return {
                                                    ...prevState,
                                                    selected: item
                                                }
                                            })
            
                                            setTimeout(() => {
                                                refSheet.current.open();
                                            }, 675);
                                        } else {
                                            Toast.show({
                                                type: 'info',
                                                text1: 'You must sign-in/up first...',
                                                text2: `Please login/signup before accessing these features...`,
                                                visibilityTime: 4250,
                                                position: "bottom"
                                            });
                                        }
                                    }}> 
                                        {`View Game Details`}
                                    </Button>
                                    {/* <TouchableOpacity style={styles.button} onPress={() => {}}>
                                        <Text style={styles.buttonText}>Message</Text>
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                        );
                    } else {
                        return null;
                    }
                }}
                keyExtractor={item => item.id.toString()}
            />
        </Fragment>
    );
};
const mapStateToProps = (state) => {
	return {
		authData: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, {  })(BacheloretteMainViewHomepage);