import React, { Fragment, useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native'
import { Text, Icon, Header } from "@components";
import { useTheme } from '@config';
import styles from "./viewMainMeetupsViewStyles.js";
import SearchBar from 'react-native-search-bar';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "@env";
import { SliderBox } from "react-native-image-slider-box";
import { Bars } from 'react-native-loader';
import { connect } from "react-redux";
import _ from "lodash";
import Toast from "react-native-toast-message";


const { width, height } = Dimensions.get("window");

const ViewMainMeetupListNearby = ({ userData }) => {

    const navigation = useNavigation();
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const searchbarRef = useRef(null);

    const [ state, setState ] = useState({
        meetups: [],
        searchTerm: ""
    })

    useEffect(() => {
        const configuration = {
            params: {}
        }
    
        axios.get(`${BASE_URL}/gather/meetups/randomized`, configuration).then((ressss) => {
            if (ressss.data.message === "Gathered list of meetings!") {
                console.log("ressssdata", ressss.data);
    
                const { meetups } = ressss.data;
    
                setState(prevState => {
                    return {
                        ...prevState,
                        meetups
                    }
                })
            } else {
                console.log("errrorrrrrr", ressss.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }, []);

    const renderEmptyList = () => {
        return (
            <Fragment>
                <View style={styles.centeredMargin}>
                    <Text style={styles.noneAvailableText}>No listings/data are available, please check back at a later time to see if there are listings that were posted since you last checked...</Text>
                    <Image resizeMode={"contain"} source={require("../../assets/images/empty_folder.png")} style={styles.placeholderImage} />
                </View>
            </Fragment>
        );
    }

    const handleGroupSearchName = value => {
        console.log("handleGroupSearchName clicked/ran", value);

        const configuration = {
            params: {
                searchTerm: value,
                uniqueId: userData.uniqueId
            }
        }
    
        axios.get(`${BASE_URL}/gather/meetups/searching/limited/relevant`, configuration).then((ressss) => {
            if (ressss.data.message === "Gathered list of meetings!") {
                console.log("ressssdata", ressss.data);
    
                const { meetups } = ressss.data;
    
                if (typeof meetups !== "undefined" && meetups.length === 0) {
                    Toast.show({
                        type: 'info',
                        text1: `No meetups w/search-term in your proximity...`,
                        visibilityTime: 2375,
                        position: "bottom"
                    });
                };

                setState(prevState => {
                    return {
                        ...prevState,
                        meetups
                    }
                })
            } else {
                console.log("errrorrrrrr", ressss.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }
 
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          console.log(state.searchTerm)
          // Send Axios request here
          if (typeof state.searchTerm !== "undefined" && state.searchTerm.length > 0) {
            handleGroupSearchName(state.searchTerm);
          }
        }, 1750)
    
        return () => clearTimeout(delayDebounceFn)
    }, [state.searchTerm])
    
    const handleSearch = () => {
        searchbarRef.current.unFocus();

        handleGroupSearchName(state.searchTerm);
    };
    
    const handleCancellation = () => {
        console.log("handled cancellation...", searchbarRef.current);
        
        searchbarRef.current.unFocus();
    }

    console.log("state.meetupsstate.meetupsstate.meetupsstate.meetupsstate.meetups", state.meetups);

    return (
        <Fragment>
            <Header
                title={"Viewing All Meetup's"}
                subTitle="These are local meetup's near you!"
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
            <View style={styles.container}>
                <SearchBar
                    ref={searchbarRef}
                    placeholder="Search nearby meetup's by a 'search term'..."
                    onChangeText={(value) => setState(prevState => {
                        return {
                            ...prevState,
                            searchTerm: value
                        }
                    })}
                    onSearchButtonPress={handleSearch}
                    onCancelButtonPress={handleCancellation}
                />
                <View style={{ marginTop: 12.25 }} />
                <FlatList
                    style={styles.list}
                    contentContainerStyle={styles.listContainer}
                    data={state.meetups}
                    ListEmptyComponent={renderEmptyList}
                    horizontal={false}
                    numColumns={2}
                    keyExtractor={item => {
                        return item.id
                    }}
                    ItemSeparatorComponent={() => {
                        return <View style={styles.separator} />
                    }}
                    renderItem={({ item, index }) => {
                        const reduced = [item.meetupPics.imageOne, item.meetupPics.imageTwo, item.meetupPics.imageThree, item.meetupPics.imageFour, item.meetupPics.imageFive];
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate('HotelDetail', { meetingData: item })} style={styles.card}>
                                <View style={styles.imageContainer}>
                                    <SliderBox
                                        sliderBoxHeight={150}
                                        LoaderComponent={() => <View style={styles.centered}><Bars size={17.5} color={colors.accent} /></View>}
                                        onCurrentImagePressed={index =>
                                            console.log(`image ${index} pressed`)
                                        }
                                        parentWidth={width} 
                                        images={reduced} 
                                        style={styles.cardImage}
                                    />  
                                </View>
                                <View style={styles.cardContent}>
                                    <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
                                    <Text numberOfLines={3} style={styles.count}>{item.description}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null //
    }
}
export default connect(mapStateToProps, {})(ViewMainMeetupListNearby);