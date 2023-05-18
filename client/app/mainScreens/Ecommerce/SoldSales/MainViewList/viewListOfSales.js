import React, {useState, useEffect, Fragment, useRef } from 'react';
import { FlatList, View, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { BaseStyle, useTheme, BaseColor } from '@config';
import { Header, SafeAreaView, Icon, Text, Button, Tag } from '@components';
import styles from './viewListOfSalesStyles.js';
import { useNavigation } from '@react-navigation/native';
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL, SHIP_ENGINE_API_KEY } from "@env";
import _ from "lodash";
import moment from "moment";
import ActionSheet from 'react-native-actionsheet';
import { SliderBox } from "react-native-image-slider-box";
import RBSheet from "react-native-raw-bottom-sheet";
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get("window");

const ManageSalesListViewMain = ({ authData }) => {

    const {colors} = useTheme();
    const navigation = useNavigation();
    const actionSheetRef = useRef(null);
    const shippingLabelRef = useRef(null);

    const [ state, setState ] = useState({
        sales: [],
        showDialog: false,
        selectedUser: null,
        selected: null,
        shippingLabel: null,
        selectedPrinter: null
    })

    useEffect(() => {
        const configuration = {
            params: {
                uniqueId: authData.uniqueId
            }
        };

        axios.get(`${BASE_URL}/gather/sales/pending/active`, configuration).then((res) => {
            if (res.data.message === "Successfully gathered clothing sold sales!") {
                console.log("resdata", res.data);

                const { sales } = res.data;
                
                setState(prevState => {
                    return {
                        ...prevState,
                        sales
                    }
                });
            } else {
                console.log("errrorrrrrr", ressss.data);
            } 
        }).catch((err) => {
            console.log(err.message);
        });
    }, []);

    const renderHeader = () => {
        return (
            <Fragment>
                <View>
                    <Image source={require("../../../../assets/images/custom/dating-backing.jpg")} style={{ width: '100%', height: 150, backgroundColor: "#000", opacity: 0.5 }} />
                    <View style={styles.titleAbout}>
                    <Text title1 semibold whiteColor>
                        {"Manage your sales!"}
                    </Text>
                    <Text style={{ padding: 12.25, textAlign: "center" }} subhead whiteColor>
                        These are your active sales to be shipped out or managed! Interact in more detail with these by clicking each to view the individual view with more information
                    </Text>
                    </View>
                </View>
            </Fragment>
        );
    }

    const renderItem = ({ item, index }) => {
        const reduced = item.purchasedItem.files.map((item) => `${BASE_ASSET_URL}/${item.link}`)
        return (
            <Fragment key={index}>
                <View style={styles.containerWrapper}>
                    <View style={styles.itemWrapper}>
                        <TouchableOpacity onPress={() => {}} style={styles.absoluteTopLeft}><Image source={{ uri: `${BASE_ASSET_URL}/${item.lastProfilePic.link}` }} resizeMode={"cover"} style={styles.blockImageCustom} /></TouchableOpacity>
                        <SliderBox
                            sliderBoxHeight={200}
                            onCurrentImagePressed={index =>
                                console.warn(`image ${index} pressed`)
                            }
                            parentWidth={width * 0.9} 
                            images={reduced} 
                            style={styles.blockImage}
                        />  
                        <View style={{ paddingHorizontal: 20 }}>
                        <Text title2 semibold style={{marginTop: 5}} numberOfLines={1}>
                            {item.name !== null ? item.name : "Not Available - N/A"}
                        </Text>
                        <View style={styles.blockContentAddress}>
                            <Text
                                caption1
                                accentColor
                                style={{
                                    marginLeft: 0,
                                    fontSize: 15
                                }}
                                numberOfLines={1}
                            >
                                {`Bought ${moment(item.dateCreated).fromNow(false)}`}
                            </Text>
                            <Text
                                caption1
                                accentColor
                                style={{
                                    position: "absolute",
                                    right: 0,
                                    fontSize: 15
                                }}
                                numberOfLines={1}
                            >
                                {item.shippingLabel.service_code}
                            </Text>
                        </View>
                        <View style={styles.blockContentDetail}>
                            <View style={{flex: 1}}>
                                <Text title3 semibold>
                                    Shipment Cost: <Text style={{ color: colors.primary, textDecorationLine: "underline", fontWeight: "400" }}>${item.shippingLabel.shipment_cost.amount}</Text>
                                </Text>
                                <Text
                                    caption1
                                    accentColor
                                    style={{
                                        marginTop: 3,
                                        fontWeight: "bold"
                                    }}
                                    numberOfLines={1}
                                >
                                    Shipped? <Text style={{ fontWeight: "bold" }}>{item.shippedAlready === true ? "YES, Shipped!" : "Still need to ship..."}</Text>
                                </Text>
                                </View>
                                <View
                                style={{
                                    flexDirection: 'row',
                                }}>
                                <Tag onPress={() => {}} rate>
                                    Tokens: {item.purchasedItem.tokensPrice}
                                </Tag>
                            </View>
                        </View>
                        </View>
                        <View style={styles.contentService}>
                            <Button full style={{ backgroundColor: BaseColor.greenColor }} onPress={() => {
                                setState(prevState => {
                                    return {
                                        ...prevState,
                                        selected: item
                                    }
                                })
                                actionSheetRef.current.show();
                            }}>
                                {"View/Manage Details"}
                            </Button>
                        </View>
                    </View>
                </View>
            </Fragment>
        );
    }

    const renderEmptyComponent = () => {
        return (
            <Fragment>
                <View style={{ margin: 12.25 }}>
                    <Text style={styles.label}>You do NOT have any sold clothing articles yet, try listing some used clothing articles for sale and when you get a sale, a notification and new item will appear here...</Text>
                    <View style={styles.hr} />
                    <Image source={require("../../../../assets/images/custom/no-results.png")} style={styles.illustrationImage} />
                </View>
            </Fragment>
        );
    }

    const viewShippingLabelDetails = () => {
        console.log("viewShippingLabelDetails clicked/ran...");

        shippingLabelRef.current.open();
        
        setState(prevState => {
            return {
                ...prevState,
                shippingLabel: state.selected.shippingLabel
            }
        })
    };

    const handleDelivery = () => {
        axios.get(`https://api.shipengine.com/v1/tracking`, {
            params: {
                carrier_code: state.shippingLabel.carrier_code,
                tracking_number: state.shippingLabel.tracking_number
            },
            headers: {
                'API-Key': SHIP_ENGINE_API_KEY
            }
        }).then((res) => {
            console.log("Res", res.data.status_description);
            if (res.data.status_description === "Not Yet In System") {
                console.log("Not yet in system...:", res.data);

                shippingLabelRef.current.close();

                Toast.show({
                    type: 'error',
                    text1: `Not shipped yet, Not yet in system!`,
                    text2: "Check this action again shortly after you physically mail the item - we will only reward upon shipment received.",
                    visibilityTime: 3275,
                    position: "bottom"
                });
            } else if (res.data.status_description === "Delivered") {
                const innerConfig = {
                    uniqueId: authData.uniqueId,
                    tracking: state.shippingLabel.tracking_number
                };
        
                axios.post(`${BASE_URL}/release/funding/delivered/package`, innerConfig).then((res) => {
                    if (res.data.message === "Successfully processed request!") {
                        console.log("resdata", res.data);

                        shippingLabelRef.current.close();

                        Toast.show({
                            type: 'success',
                            text1: `Successfully deposited funding into your account!`,
                            text2: "We've successfulyl deposited your funds into your account as your package was delivered! Congrats!",
                            visibilityTime: 3275,
                            position: "bottom",
                            onHide: () => {
                                navigation.replace("BottomTabNavigator", { screen: "Profile" });
                            }
                        });
                    } else {
                        console.log("errrorrrrrr", ressss.data);
                    } 
                }).catch((err) => {
                    console.log("err", err);
                });
            } else {
                console.log("errrorrrrrr", res.data);

                shippingLabelRef.current.close();
                
                Toast.show({
                    type: 'error',
                    text1: `An error occurred while processing request.`,
                    text2: "An error occurred attempting to process your request - an error was encountered processing request.",
                    visibilityTime: 3275,
                    position: "bottom"
                });
            } 
        }).catch((err) => {
            console.log(err.message);
        });
    }

    return (
        <Fragment>
            <ActionSheet
                ref={actionSheetRef}
                title={`Select which action you'd like to take with this specific user...`}
                options={["View Shipping Label/Details", "Cancel/Close Pane"]}
                cancelButtonIndex={1}
                destructiveButtonIndex={1}
                onPress={(index) => {
                switch (index) {
                    case 0:
                        viewShippingLabelDetails();
                        break;
                    default: 
                        break;
                }
                }}
            />
            <RBSheet
                ref={shippingLabelRef}
                height={height}
                openDuration={250}
                closeOnDragDown={false}
                customStyles={{
                    draggableIcon: {
                        minWidth: width * 0.625
                    }
                }}
            >
                <Header
                    title={"Shipping Label(s)"}
                    subTitle="Print your shipping label"
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
                        shippingLabelRef.current.close();
                    }}
                />
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 75 }} style={{ flex: 1 }}>
                    {state.shippingLabel !== null ? <View style={{ margin: 10 }}>
                        <Button
                            style={{ marginBottom: 20, backgroundColor: colors.accent }}
                            onPress={() => handleDelivery()}>
                            {"Check Delivery & Claim Proceed(s)"}
                        </Button>
                        <View style={styles.hrCustom} />
                        <Button
                            style={{ marginBottom: 20, backgroundColor: colors.primary }}
                            onPress={() => {}}>
                            {"Track Package Location"}
                        </Button>
                        <Text style={styles.price}>Price to ship: <Text style={{ textDecorationLine: "underline", color: colors.accent }}>{state.shippingLabel.shipment_cost.amount} (30 Oz Weight MAX)</Text></Text>
                        <Text style={styles.price}>Created/Generated: <Text style={{ textDecorationLine: "underline", color: colors.accent }}>{moment(state.shippingLabel.created_at).fromNow(false)}</Text></Text>
                        <Text style={styles.price}>Tracking Number: <Text style={{ textDecorationLine: "underline", color: colors.accent }}>{state.shippingLabel.tracking_number}</Text></Text>
                        <Text style={styles.price}>Service Code: <Text style={{ textDecorationLine: "underline", color: colors.accent }}>{state.shippingLabel.service_code}</Text></Text>
                        <Text style={styles.mediumText}>We will release your funds/funding for this item ONCE we see that the item is DELIVERED. This is typically a fast process as we use priority services but we want to make sure the user recieves the item described on time. There are NO returns so don't worry, you'll get your payment regardless once delivery is confirmed.</Text>
                        <View style={[styles.hr, { marginBottom: 35 }]} />
                        <Image resizeMode={"contain"} source={{ uri: state.shippingLabel.label_download.png }} style={styles.shippingImage} />
                    </View> : null}
                </ScrollView>
            </RBSheet>  
            <Header
                title={"Your Sales"}
                subTitle="Explore your sales & more"
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
            <SafeAreaView
                style={BaseStyle.safeAreaView}
                edges={['right', 'left', 'bottom']}
            >
                <FlatList
                    contentContainerStyle={styles.listContainerStyle}
                    data={state.sales}
                    style={{ flexGrow: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmptyComponent}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={null}
                    showsVerticalScrollIndicator={false}
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
  
export default connect(mapStateToProps, {  })(ManageSalesListViewMain);