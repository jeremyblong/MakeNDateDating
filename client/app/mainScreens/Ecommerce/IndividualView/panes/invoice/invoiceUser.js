import React, { useState, useEffect, Fragment, useRef } from 'react';
import { View, Text, ScrollView, useColorScheme, FlatList, Dimensions, Keyboard, TouchableOpacity, TextInput } from 'react-native';
import styles from "./invoiceUserStyles.js";
import { Button } from "@components";
import uuid from "react-native-uuid";
import moment from "moment";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '@config'; 
import Toast from "react-native-toast-message";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL, APPROX_VALUE_PER_COIN } from "@env";
import { useNavigation } from '@react-navigation/native';
import SearchBar from 'react-native-search-bar';
import Autocomplete from "react-native-autocomplete-input";
import { WebView } from 'react-native-webview';


const { width, height } = Dimensions.get("window");

const InvoiceViewPaneHelper = ({ authData, data, rbsheetPurchase }) => {

    const colorSchemeDark = useColorScheme() === "dark" ? true : false;
    const navigation = useNavigation();
    const {colors} = useTheme();
    const searchbarRef = useRef(null);
    const [ state, setState ] = useState({
        invoiceNumber: uuid.v4(),
        shippingFee: 13.50,
        searchTerm: "",
        users: [],
        hideResults: true,
        selected: null,
        customMessage: "",
        token: null,
        ready: false,
        address: {
            addressLineOne: "",
            addressLineTwo: "",
            city: "",
            state: "",
            zipcode: "",
            residential: true
        }
    })

    const searchForUserSpecific = (username) => {
        console.log("searchForUserSpecific clicked/ran...");

        const config = {
            uniqueId: authData.uniqueId,
            otherUserUsername: username.toLowerCase()
        }

        axios.post(`${BASE_URL}/search/for/usernames/only`, config).then((res) => {
            if (res.data.message === "Successfully located usernames!") {
                console.log("Successfully located usernames! res.data ---- :",  res.data);

                const { usernames } = res.data;
                
                setState(prevState => {
                    return {
                        ...prevState,
                        users: usernames,
                        hideResults: false
                    }
                })
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          console.log(state.searchTerm)
          // Send Axios request here
          if (typeof state.searchTerm !== "undefined" && state.searchTerm.length > 0) {
            searchForUserSpecific(state.searchTerm);
          }
        }, 1750)
    
        return () => clearTimeout(delayDebounceFn)
    }, [state.searchTerm])

    useEffect(() => {
        const config = {
            uniqueId: authData.uniqueId,
            otherUserUsername: " "
        }

        axios.post(`${BASE_URL}/search/for/usernames/only`, config).then((res) => {
            if (res.data.message === "Successfully located usernames!") {
                console.log("Successfully located usernames! res.data ---- :",  res.data);

                const { usernames } = res.data;
                
                setState(prevState => {
                    return {
                        ...prevState,
                        users: usernames,
                        hideResults: false
                    }
                })
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }, [])

    const handleSubmission = () => {
        console.log("handleSubmission clicked/ran..");

        const config = {
            uniqueId: authData.uniqueId,
            price: Math.floor(Number(data.PRICE) + Number(data.PRICE * taxPrice) + state.shippingFee),
            accountType: authData.accountType,
            otherUserUsername: state.selected,
            invoiceNumber: state.invoiceNumber,
            itemInfo: data,
            customMessage: state.customMessage
        };

        axios.post(`${BASE_URL}/submit/purchase/generate`, config).then((res) => {
            if (res.data.message === "Successfully purchased item & generated shipping label!") {
                console.log("Successfully purchased item & generated shipping label!", res.data);

                const { token } = res.data;

                setState(prevState => {
                    return {
                        ...prevState,
                        token
                    }
                })

            } else if (res.data.message === "You do NOT have enough tokens to purchase this item!") {

                rbsheetPurchase.current.close();

                Toast.show({
                    type: 'error',
                    text1: `Not enough coins in your account to purchase!`,
                    text2: `You need to buy more tokens to buy this item...`,
                    visibilityTime: 2375,
                    position: "bottom"
                });
            } else if (res.data.message === "User has NOT completed their address information yet...") {

                rbsheetPurchase.current.close();

                Toast.show({
                    type: 'error',
                    text1: `User has NOT completed addresss information yet!`,
                    text2: res.data.message,
                    visibilityTime: 2375,
                    position: "bottom"
                });
            } else {
                console.log("Err", res.data);

                rbsheetPurchase.current.close();

                Toast.show({
                    type: 'error',
                    text1: `Error attempting to purchase this item!`,
                    text2: `An error occurred while attempting to purchase this item - please try again or report to support if persists...`,
                    visibilityTime: 2375,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    const calculateDisabled = () => {
        console.log("calculateDisabled clicked/ran....");

        if (state.selected !== null && (typeof state.customMessage !== "undefined" && state.customMessage.length > 0)) {
            return false;
        } else {
            return true;
        }
    }

    const handlePressedSelection = username => {
        console.log("handlePressedSelection clicked/ran...", username);

        setState(prevState => {
            return {
                ...prevState,
                hideResults: true,
                selected: username,
                users: [],
                searchTerm: ""
            }
        })
    }


    const taxPrice = 0.10;
    return (
        <ScrollView style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={{ paddingBottom: 325 }} style={{ flex: 1 }} keyboardShouldPersistTaps='never'>
                <View style={styles.header}>
                    <Text style={styles.title}>Invoice</Text>
                </View>
                <View style={styles.invoiceInfoContainer}>
                    <View style={styles.invoiceInfo}>
                        <Text style={styles.label}>Invoice Number:</Text>
                        <Text style={[styles.text, { marginLeft: 0, marginTop: 7.25 }]}>{state.invoiceNumber}</Text>
                    </View>
                    <View style={styles.invoiceInfo}>
                    <Text style={styles.label}>Invoice Date:</Text>
                    <Text style={[styles.text, { marginTop: 7.25 }]}>{moment(new Date).format("YYYY/MM/DD")}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.customerInfoContainer}>
                    <Text style={styles.subtitle}>Customer Information</Text>
                    <View style={styles.customerInfo}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.text}>{authData.firstName} ~ @{authData.username}</Text>
                    </View>
                    <View style={styles.customerInfo}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.text}>{authData.email}</Text>
                    </View>
                    <View style={styles.customerInfoCustom}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={[styles.text, { marginLeft: 0, marginTop: 7.25 }]}>{`We will automatically ship it to the user you select (their address on file), we do not provide this information for security reasons, we'll make sure your delivery is completed though!`}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.itemsContainer}>
                    <Text style={styles.subtitle}>Invoice Items</Text>
                    <View style={styles.item}>
                        <Text style={styles.itemName}>Flower Kit</Text>
                        <Text style={styles.itemDetails}>
                        {1} x ${`${Number(data.PRICE).toFixed(2)}`}
                        </Text>
                        <Text style={styles.itemTotal}>${`${Number(data.PRICE).toFixed(2)}`}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemName}>Taxes/Tax (10%)</Text>

                        <Text style={styles.itemTotal}>${`${Number(data.PRICE * taxPrice).toFixed(2)}`}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemName}>Shipping/Delivery Cost</Text>

                        <Text style={styles.itemTotal}>${`${Number(state.shippingFee).toFixed(2)}`}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={[styles.totalContainer, { marginBottom: 20 }]}>
                    <Text style={styles.label}>Total (Paid in tokens):  </Text>
                    <Text style={styles.total}>${`${(Number(data.PRICE) + Number(data.PRICE * taxPrice) + state.shippingFee).toFixed(2)}`} <Text style={{ color: "darkred", textDecorationLine: "underline" }}>{`(${Math.floor((Number(data.PRICE) + Number(data.PRICE * taxPrice) + state.shippingFee) / APPROX_VALUE_PER_COIN)} tokens)`}</Text></Text>
                </View>
                <Autocomplete
                    data={state.users}
                    hideResults={state.hideResults}
                    value={state.searchTerm}
                    listContainerStyle={colorSchemeDark ? [styles.listContainerStyle, { backgroundColor: "#000" }] : [styles.listContainerStyle, { backgroundColor: "#fff" }]}
                    flatListProps={{
                        keyExtractor: (_, idx) => idx,
                        renderItem: ({ item }) => <TouchableOpacity style={styles.minHeightListItem} onPress={() => {
                            handlePressedSelection(item.username);
                            Keyboard.dismiss();
                        }}><Text style={styles.listStyle}>{item.username}</Text></TouchableOpacity>
                    }}
                    listStyle={styles.listStyle}
                    containerStyle={{ minHeight: 62.25 }}
                    renderTextInput={() => (
                        <Fragment>
                            <SearchBar
                                ref={searchbarRef}
                                placeholder="Search for a specific user's username..."
                                onChangeText={(value) => setState(prevState => {
                                    return {
                                        ...prevState,
                                        searchTerm: value
                                    }
                                })}
                                onSearchButtonPress={() => {}}
                                onCancelButtonPress={() => {}}
                            />
                        </Fragment>
                    )}
                />

                <Text style={styles.labeled}>Custom message to the recipient...</Text>
                <TextInput
                    onChangeText={text => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                customMessage: text
                            }
                        })
                    }}
                    placeholderTextColor={"#000"}
                    secureTextEntry={false}
                    numberOfLines={5}
                    multiline={true}
                    placeholder="Enter your custom message to be included with the flowers..."
                    value={state.customMessage}
                    style={styles.inputContainer}
                />
                {/* <Text style={styles.labeled}>Address Line Two (Suite, Apt, Etc...)</Text>
                <TextInput
                    onChangeText={text => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                address: {
                                    ...prevState.address,
                                    addressLineTwo: text
                                }
                            }
                        })
                    }}
                    placeholderTextColor={"#000"}
                    secureTextEntry={false}
                    placeholder="Address Line Two Address"
                    value={state.address.addressLineTwo}
                    style={styles.inputContainer}
                />
                <View style={styles.rowCustom}>
                    <View style={styles.columnOne}>
                        <Text style={styles.labeled}>City</Text>
                        <TextInput
                            onChangeText={text => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        address: {
                                            ...prevState.address,
                                            city: text
                                        }
                                    }
                                })
                            }}
                            placeholderTextColor={"#000"}
                            secureTextEntry={false}
                            placeholder="Address City"
                            value={state.address.city}
                            style={styles.inputContainer}
                        />
                    </View>
                    <View style={styles.columnOne}>
                        <Text style={styles.labeled}>State</Text>
                        <View style={[styles.inputContainerPicker, { backgroundColor: colors.card }]}>
                            <RNPickerSelect 
                                onValueChange={(value) => {
                                    setState(prevState => {
                                        return {
                                            ...prevState,
                                            address: {
                                                ...prevState.address,
                                                state: value
                                            }
                                        }
                                    })
                                }}
                                textInputProps={colorSchemeDark ? { color: "#fff" } : { color: "grey"}}
                                value={state.address.state}
                                useNativeAndroidPickerStyle={false}
                                items={statesOptions}
                            />
                        </View>
                    </View>
                </View> */}
                {/* <Text style={styles.labeled}>Address Zip-Code</Text>
                <TextInput
                    onChangeText={text => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                address: {
                                    ...prevState.address,
                                    zipcode: text.replace(/[^0-9]/g, '')
                                }
                            }
                        })
                    }}
                    placeholderTextColor={"#000"}
                    secureTextEntry={false}
                    placeholder="Enter your zipcode"
                    keyboardType={"number-pad"}
                    value={state.address.zipcode}
                    style={styles.inputContainer}
                />
                <View style={styles.hr} />
                    <Text style={styles.labeled}>Is this a commerical or residential address?</Text>
                    <View style={{ margin: 15 }}>
                        <Switch
                            value={state.address.residential}
                            onValueChange={(val) => setState(prevState => {
                                return {
                                    ...prevState,
                                    address: {
                                        ...prevState.address,
                                        residential: val
                                    }
                                }
                            })}
                            disabled={false}
                            activeText={'Residential'}
                            inActiveText={'Commerical'}
                            circleSize={35}
                            barHeight={22.25}
                            circleBorderWidth={3}
                            backgroundActive={"#000"}
                            backgroundInactive={'gray'}
                            circleActiveColor={BaseColor.greenColor}
                            circleInActiveColor={colors.primary}
                            changeValueImmediately={true}
                            innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                            outerCircleStyle={{}}
                            renderActiveText={true}
                            renderInActiveText={true}
                            switchLeftPx={2}
                            switchRightPx={2}
                            switchWidthMultiplier={3.5}
                            switchBorderRadius={30}
                        />
                    </View> */}
                <View style={styles.hr} />
                {state.selected !== null ? <Text style={styles.selectedText}>{state.selected}</Text> : null}
                <View style={styles.hr} />
                <Button
                    style={calculateDisabled() ? { backgroundColor: "lightgrey" } : { backgroundColor: colors.accent }}
                    disabled={calculateDisabled()}
                    onPress={() => handleSubmission()}
                >
                    {"Purchase Flower Bundle & Intitiate Delivery!"}
                </Button>
            </KeyboardAwareScrollView>
        </ScrollView>
    );
};
const mapStateToProps = (state) => {
	return {
		authData: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, {  })(InvoiceViewPaneHelper);