import React, { Fragment, useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Dimensions, ScrollView, FlatList, useColorScheme } from "react-native";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from "axios";
import Dialog from "react-native-dialog";
import styles from "./listStyles.js";
import {
    Text,
    Button,
    ListThumbSquare
} from '@components';
import { useTheme} from '@config';
import { connect } from "react-redux";
import _ from "lodash";
import SearchBar from 'react-native-search-bar';
import moment from "moment";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const GroupMemebersListPane = ({ joinMeetupGroup, meetingData, groupListPaneRef }) => {

    const navigation = useNavigation();
    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const searchBarRef = useRef(null);

    const [ state, setState ] = useState({
        members: typeof meetingData.members !== "undefined" && meetingData.members.length > 0 ? meetingData.members : [],
        searchingValue: "",
        filtering: [],
        ready: false
    });

    const handleSearchFilterNames = (value) => {
        console.log("value", value);

        setState(prevState => {
            return {
                ...prevState,
                filtering: state.members.filter((item) => item.memberUsername.includes(state.searchingValue.trim().toLowerCase()))
            }
        })
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          console.log(state.searchingValue)
          // Send Axios request here
          if (typeof state.searchingValue !== "undefined" && state.searchingValue.length > 0) {
            handleSearchFilterNames(state.searchingValue);
          }
        }, 1750)
    
        return () => clearTimeout(delayDebounceFn)
    }, [state.searchingValue])

    const fetchCommentsToAddProfilePic = (members) => {

        const promises = [];
    
        if (typeof members !== "undefined" && members.length > 0) {
            for (let idxxxxx = 0; idxxxxx < members.length; idxxxxx++) {
                const member = members[idxxxxx];
                
                const { memberID } = member;
    
                promises.push(new Promise((resolve, reject) => {
                    // update comments state
                    const config = {
                        params: {
                            postedByID: memberID
                        }
                    };
                    axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
                        if (res.data.message === "Submitted gathered user's picture/file!") {

                            const { user } = res.data; 
    
                            member["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
    
                            resolve(member);
                        } else {
    
                            member["lastProfilePic"] = null;
    
                            resolve(member);
                        }
                    }).catch((err) => {
                        member["lastProfilePic"] = null;
    
                        resolve(member);
                    })
                }));
            };
    
            Promise.all(promises).then((passedValues) => {
    
                console.log("Promise passedValues passedValues passedValues passedValues....:", passedValues);
    
                setState(prevState => {
                    return {
                        ...prevState,
                        members: passedValues,
                        ready: true
                    }
                });
            });
        } else {
            console.log("NO members available...!");
        }
    }
    
    useEffect(() => {
        console.log("Effect members list-related re-mounted...");
    
        fetchCommentsToAddProfilePic(state.members);
    
    }, [...state.members.map((member) => {
        return member.memberID;
    })])
    
    const renderCommentConfirmationDialog = () => {
        return (
            <Dialog.Container visible={state.modalState}
                contentStyle={styles.dialogContainerStyle}
            >
                <View style={{ backgroundColor: 'white', alignItems: 'center', }}>
                    <Text style={colorSchemeDark ? { paddingBottom: 15.0, fontSize: 17.25, color: "#fff" } : { paddingBottom: 15.0, fontSize: 17.25, color: "#000" }}>
                        Are you sure you'd like to post this comment? This is a comment on the 'meeting' selected, please click continue if you're ready to post your message...
                    </Text>
                    <View style={styles.modalHrLine} />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 20
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        modalState: false
                                    }
                                })
                            }}
                            style={styles.cancelButtonStyle}
                        >
                            <Text style={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}>Cancel.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.9}
                            onPress={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        modalState: false,
                                        activityLoading: true
                                    }
                                })
                                setTimeout(() => {
                                    sendPrivateMessage();
                                },  375);
                            }}
                            style={styles.logOutButtonStyle}
                        >
                            <Text style={{ textAlign: "center", fontWeight: "bold", color: "#fff" }}>Post Message!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog.Container>
        )
    }

    const handleSearchValue = () => {
        console.log("handleSearchValue clicked/ran...");
    }

    const fetchUserAndRedirect = (uniqueId) => {
        const configuration = {
            params: {
                postedByID: uniqueId
            }
        };

        axios.get(`${BASE_URL}/gather/one/user/restricted/data`, configuration).then((res) => {
            if (res.data.message === "Submitted gathered user's info!") {
                console.log("Submitted gathered user's info!", res.data);
    
                const { user } = res.data;

                groupListPaneRef.current.close();
    
                setTimeout(() => {
                    navigation.navigate('Profile1', { user });
                }, 825);
            } else {
                console.log("Err", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while attempting to fetch user details!`,
                    text2: "We encountered an error while attempting to fetch this specific user's account details...",
                    visibilityTime: 2375,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    // return pane logic/JSX data...
    return (
        <Fragment>
            <View style={styles.mainWrapper}>
                {renderCommentConfirmationDialog()}
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' contentContainerStyle={{ paddingBottom: 125 }}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, height: height * 0.875 }}>
                    <View style={{ marginTop: 28.25 }} />
                    <SearchBar
                        ref={searchBarRef}
                        placeholder="Search for username's..."
                        placeholderTextColor={"red"}
                        textFieldBackgroundColor={colorSchemeDark ? "#000" : "#fff"}
                        onChangeText={value => {
                            setState(prevState => {
                                return {
                                    ...prevState,
                                    searchingValue: value
                                }
                            })
                        }}
                        onSearchButtonPress={handleSearchValue}
                        onCancelButtonPress={() => {}}
                        />
                        <View style={styles.hr} />
                        <FlatList
                            contentContainerStyle={{}}
                            data={typeof state.searchingValue !== "undefined" && state.searchingValue.length > 0 ? state.filtering : state.members}
                            horizontal={false}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => item.identifier}
                            renderItem={({item, index}) => {
                                console.log("item.uniqueId", item.memberID);
                                return (
                                    <Fragment key={index}>
                                        <ListThumbSquare
                                            onPress={() => fetchUserAndRedirect(item.memberID)}
                                            image={{ uri: _.has(item, "lastProfilePic") ? `${BASE_ASSET_URL}/${item.lastProfilePic.link}` : "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/placeholder-loading.png" }}
                                            txtLeftTitle={`${item.memberName} ~ @${item.memberUsername}`}
                                            txtContent={`Member since ${moment(item.joinedOnDate).fromNow(false)}`}
                                        />
                                    </Fragment>
                                );
                            }}
                        />
                        </ScrollView>
                        <Button onPress={() => joinMeetupGroup()}>
                            {"Join This Group/Meet-Up"}
                        </Button>
                </KeyboardAwareScrollView>
            </View>
        </Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, { })(GroupMemebersListPane);