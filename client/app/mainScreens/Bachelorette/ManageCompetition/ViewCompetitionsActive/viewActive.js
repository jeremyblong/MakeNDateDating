import React, { Fragment, useEffect, useState } from "react";
import { View, FlatList, Image, TouchableOpacity } from 'react-native';
import styles from "./viewActiveStyles.js";
import { Text, Header, Icon, Button, TextInput } from "@components";
import { useTheme, BaseColor } from '@config';
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import Toast from "react-native-toast-message";
import _ from "lodash";

const ViewManageActiveSessionsBacheloretteBachelorHelper = ({ authData }) => {

    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const navigation = useNavigation();

    const [ state, setState ] = useState({
        listings: []
    })

    useEffect(() => {
        const config = {
            params: {
                uniqueId: authData.uniqueId,
                accountType: authData.accountType,
            }
        };

        axios.get(`${BASE_URL}/gather/personal/active/competitions/bachelor/bachelorette`, config).then((res) => {
            if (res.data.message === "Successfully gathered games!") {
                console.log("Successfully gathered games!", res.data);

                const { listings } = res.data;

                setState(prevState => {
                    return {
                        ...prevState,
                        listings: listings.filter((item) => item.joinable === false)
                    }
                })

                Toast.show({
                    type: 'success',
                    text1: `Successfully gathered your active competitions/games!`,
                    text2: `We've successfully gathered your relevant listings/competitions...`,
                    visibilityTime: 2750,
                    position: "bottom",
                    onHide: () => {
                        
                    }
                });
            } else {
                console.log("Err", res.data);

                Toast.show({
                    type: 'error',
                    text1: `Error attempting list gathering listings/games!`,
                    text2: `An error occurred while attempting to gather relevant listings/games - please try again or report to support if persists...`,
                    visibilityTime: 2750,
                    position: "bottom"
                });
            }
        }).catch((err) => {

            // Toast.show({
            //     type: 'error',
            //     text1: `Error attempting list gathering listings/games!`,
            //     text2: `An error occurred while attempting to gather relevant listings/games - please try again or report to support if persists...`,
            //     visibilityTime: 2750,
            //     position: "bottom"
            // });

            console.log(err.message);
        })
    }, []);

    console.log("listings", state.listings);

    const renderItem = ({ item }) => {
        const individualRandomSample = _.sample(item.joined);
        return (
            <TouchableOpacity style={styles.video} onPress={() => navigation.navigate("IndividualGameCompetitionView", { listing: item })}>
                <Image style={styles.thumbnail} source={{ uri: `${BASE_ASSET_URL}/${individualRandomSample.profilePictures[individualRandomSample.profilePictures.length - 1].link}` }} />
                <View style={styles.details}>
                <Text style={styles.title}>{item.listingData.title}</Text>
                <Text style={styles.channel} numberOfLines={2}>{item.listingData.subtitle}</Text>
                <View style={styles.viewCount}>
                    <Text style={[styles.views, { color: colors.accent }]}>{typeof item.joined !== "undefined" && item.joined.length > 0 ? item.joined.length : 0} Total User's Involved</Text>
                    <Text style={[styles.duration, { color: "green" }]}>Reward: {item.listingData.rewardCountTokens} Token's</Text>
                </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmpty = () => {
        return (
          <View style={styles.centered}>
            <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : styles.labeled}>No available active games/competitions could be found or located - once you post & start a competition, the data will appear here...</Text>
            <View style={styles.hrSpacer} />
            <Image resizeMode="contain" source={require("../../../../assets/images/noresult.png")} style={styles.emptyHolderImage} />
          </View>
        );
    }

    const listHeaderComponent = () => {
        return (
            <Fragment>
                <Header
                    title={"Your Competitions"}
                    subTitle={"Your Active Games"}
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
            </Fragment>
        );
    }

    return (
        <Fragment>
            {listHeaderComponent()}
            <FlatList
                style={styles.container}
                ListEmptyComponent={renderEmpty}
                data={state.listings}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </Fragment>
    );
}

const mapStateToProps = (state) => {
	return {
		authData: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, {  })(ViewManageActiveSessionsBacheloretteBachelorHelper);