import React, { Fragment, useState, useRef, useEffect } from "react";
import { Text, Icon, Header, SafeAreaView, Button, TextInput } from "@components";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@config';
import { useColorScheme, TouchableOpacity, View, Image, FlatList, Dimensions } from "react-native";
import styles from "./mainViewStyles.js";
import uuid from "react-native-uuid";
import RBSheet from "react-native-raw-bottom-sheet";
import { BASE_URL } from "@env";
import axios from "axios";
import Autocomplete from "react-native-autocomplete-input";
import { connect } from "react-redux";
import _ from "lodash";
import Toast from 'react-native-toast-message';
import { CometChat } from "@cometchat-pro/react-native-chat";


const { width, height } = Dimensions.get("window");

const BlockingPrivacyMainPage = ({ authData }) => {

    const [ state, setState ] = useState({
        listItems: [{
            id: uuid.v4(),
            title: "Block a user by searching for a username",
            subtitle: "Completely restrict activity between you and another user with our blocking feature by searching their username...",
            image: require("../../assets/icons/1.png")
        }, 
        // {
        //     id: uuid.v4(),
        //     title: "Hide your account temporarily",
        //     subtitle: "Hide your account temporarily by changing your settings to make your profile private temporarily - you'll need to manually change it back to 'public'",
        //     image: require("../../assets/icons/2.png")
        // }
        ],
        username: "",
        data: [],
        hideResults: true,
        selected: null
    })

    const rbSheetRef = useRef(null);
    const navigation = useNavigation();
    const { colors, theme } = useTheme();
    const colorSchemeDark = theme.dark;

    const _renderItem = ({ item, index }) => {
        return (
            <Fragment>
                <TouchableOpacity
                    style={[styles.item]}
                    onPress={() => {
                        switch (index) {
                            case 0:
                                rbSheetRef.current.open();
                                break;
                        
                            default:
                                break;
                        }
                    }}
                    activeOpacity={0.9}
                >
                    <View style={[styles.contain, {borderBottomColor: colors.border}]}>
                        <Image source={item.image} style={colorSchemeDark ? [styles.thumb, { tintColor: "#fff" }] : [styles.thumb]} />
                        <View style={styles.content}>
                            <View style={styles.left}>
                                <Text headline semibold>
                                    {item.title}
                                </Text>
                                <Text
                                    note
                                    numberOfLines={4}
                                    footnote
                                    grayColor
                                    style={{
                                        paddingTop: 5,
                                    }}
                                >
                                    {item.subtitle}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Fragment>
        );
    }

    const calculateDisabled = () => {
        if (state.selected !== null) {
            return false;
        } else {
            return true;
        }
    }

    const renderFooter = () => {
        return (
            <Fragment>
                <View style={styles.centered}>
                    <Image resizeMode="contain" source={require("../../assets/images/privacy2.png")} style={styles.privacyImageIllustration} />
                </View>
            </Fragment>
        );
    }

    const handleBlockingSubmission = () => {
        const config = {
            uniqueId: authData.uniqueId,
            otherUserUsername: state.selected
        }

        axios.post(`${BASE_URL}/block/specific/user/add/list`, config).then((res) => {
            if (res.data.message === "Successfully blocked this user and added to list!") {
                console.log("res.data Successfully blocked this user and added to list...:", res.data);

                const { blockedUserID } = res.data;

                setState(prevState => {
                    return {
                        ...prevState,
                        hideResults: true,
                        selected: null
                    }
                })

                const usersList = [blockedUserID];

                Toast.show({
                    type: 'success',
                    text1: `Successfully blocked ${state.selected}`,
                    text2: "We've successfully blocked the desired user... They may not interact with you any further at this point.",
                    visibilityTime: 4250,
                    position: "bottom"
                });

                CometChat.blockUsers(usersList).then(
                    list => {
                        console.log("users list blocked", { list });
                    }, error => {
                        console.log("Blocking user fails with error", error);
                    }
                );
            } else {
                console.log("Err", res.data);

                Toast.show({
                    type: 'error',
                    text1: 'Error occurred while attempting to block this user...',
                    text2: 'An error occurred while attempting to block the desired user - please try this action again or contact support!',
                    visibilityTime: 4250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);


            Toast.show({
                type: 'error',
                text1: 'Error occurred while attempting to block this user...',
                text2: 'An error occurred while attempting to block the desired user - please try this action again or contact support!',
                visibilityTime: 4250,
                position: "bottom"
            });
        })

        rbSheetRef.current.close();
    }

    const handleUsernameSearching = (username) => {
        const config = {
            uniqueId: authData.uniqueId,
            otherUserUsername: username
        }

        axios.post(`${BASE_URL}/search/for/usernames/only`, config).then((res) => {
            if (res.data.message === "Successfully located usernames!") {
                console.log("Successfully located usernames! res.data ---- :",  res.data);

                const { usernames } = res.data;
                
                setState(prevState => {
                    return {
                        ...prevState,
                        data: usernames,
                        hideResults: false
                    }
                })
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          console.log(state.username)
          // Send Axios request here
          if (typeof state.username !== "undefined" && state.username.length > 0) {
            handleUsernameSearching(state.username);
          }
        }, 1750)
    
        return () => clearTimeout(delayDebounceFn)
    }, [state.username])

    const handlePressedSelection = username => {
        console.log("handlePressedSelection clicked/ran...", username);

        setState(prevState => {
            return {
                ...prevState,
                hideResults: true,
                selected: username,
                data: [],
                username: ""
            }
        })
    }

    return (
        <Fragment>
            <Header
                title="Privacy Settings"
                subtitle="Manage your privacy!"
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
            <RBSheet
                ref={rbSheetRef}
                height={height * 0.925}
                openDuration={250}
                closeOnDragDown={false}
                customStyles={{
                    draggableIcon: {
                        minWidth: width * 0.625
                    },
                    container: {
                        backgroundColor: colorSchemeDark ? "#000" : "#fff"
                    }
                }}
            >
                <View style={{ margin: 12.25 }}>
                    <Button full style={{ marginTop: 10, backgroundColor: colors.accent }} onPress={() => rbSheetRef.current.close()}>
                        Close Pane
                    </Button>
                    <View style={styles.hr} />
                    <Text style={theme.dark ? [styles.label, { color: "#fff" }] : [styles.label, { color: "#000" }]}>Enter the username you wish to block</Text>
                    <View style={styles.autocompleteContain}>
                        <Autocomplete
                            data={state.data}
                            hideResults={state.hideResults}
                            value={state.username}
                            listContainerStyle={[styles.listContainerStyle, { backgroundColor: "#fff" }]}
                            flatListProps={{
                                keyExtractor: (_, idx) => idx,
                                renderItem: ({ item }) => <TouchableOpacity style={styles.minHeightListItem} onPress={() => handlePressedSelection(item.username)}><Text style={styles.listStyle}>{item.username}</Text></TouchableOpacity>
                            }}
                            listStyle={styles.listStyle}
                            containerStyle={{ minHeight: 62.25 }}
                            renderTextInput={() => (
                                <Fragment>
                                    <TextInput
                                        onChangeText={text => setState(prevState => {
                                            return {
                                                ...prevState,
                                                username: text
                                            }
                                        })}
                                        placeholder="Enter the user's username..."
                                        value={state.username}
                                    />
                                </Fragment>
                            )}
                        />
                    </View>
                    <View style={styles.hr} />
                    {state.selected !== null ? <Fragment><Text style={{ fontSize: 18.25 }}>{state.selected}</Text><View style={styles.hr} /></Fragment>: null}
                    <Button disabled={calculateDisabled()} full style={calculateDisabled() ? { marginTop: 10, backgroundColor: "lightgrey" } : { marginTop: 10, backgroundColor: colors.primary }} onPress={() => handleBlockingSubmission()}>
                        Ban/Block This User
                    </Button>
                    <View style={styles.centered}>
                        <Image resizeMode="contain" source={require("../../assets/images/privacy4.png")} style={styles.lockill} />
                    </View>
                </View>
            </RBSheet>
            <SafeAreaView style={colorSchemeDark ? { flex: 1, backgroundColor: "#000" } : { flex: 1 }} edges={['right', 'left', 'bottom'] }>
                <FlatList
                    data={state.listItems}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 32.25 }}
                    renderItem={_renderItem}
                    ListFooterComponent={renderFooter}
                    style={styles.container}
                />
            </SafeAreaView>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
	return {
		authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
	}
}
export default connect(mapStateToProps, { })(BlockingPrivacyMainPage);