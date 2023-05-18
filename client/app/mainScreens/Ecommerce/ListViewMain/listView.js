import React, { Fragment, useRef, useState, useEffect } from "react";
import { View, FlatList, Dimensions, Image } from "react-native";
import Toast from "react-native-toast-message";
import styles from "./listViewStyles.js";
import { Text, Header, Icon, Button, Tag } from "@components";
import { useNavigation } from "@react-navigation/native";
import { BaseColor, useTheme } from '@config';
import SearchBar from 'react-native-search-bar';
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import base64 from 'react-native-base64';


const { width, height } = Dimensions.get("window");

const ListViewCommerceMain = ({ authData }) => {

    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const navigation = useNavigation();
    const searchbarRef = useRef(null);

    const [ state, setState ] = useState({
        listings: [],
        duplicateArr: [],
        current: {
            start: 0,
            end: 10
        },
        searchingText: ""
    })

    const handleSearchQueryTerm = (value) => {
        console.log("handleSearchQueryTerm clicked/ran...:", value);
        
        setState(prevState => {
            return {
                ...prevState,
                listings: prevState.duplicateArr.filter(item => item.NAME.trim().toLowerCase().includes(value.toLowerCase()))
            }
        })
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          console.log(state.searchingText)
          // Send Axios request here
          if (typeof state.searchingText !== "undefined" && state.searchingText.length > 0) {
            handleSearchQueryTerm(state.searchingText);
          }
        }, 1750)
    
        return () => clearTimeout(delayDebounceFn)
    }, [state.searchingText])

    useEffect(() => {
        axios.get(`https://www.floristone.com/api/rest/flowershop/getproducts?category=lr&count=20`, {
            headers: { 'Authorization': `Basic ${base64.encode('864002:E0EEps')}` }
        }).then((res) => {
            console.log("res.data", res.data.PRODUCTS);

            if (res.data) {

                const { PRODUCTS } = res.data; 

                setState(prevState => {
                    return {
                        ...prevState,
                        listings: PRODUCTS,
                        duplicateArr: PRODUCTS
                    }
                })
            } else {

                console.log("res.data error", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while processing your request.`,
                    text2: `We've experienced an error while trying to fetch listing details...`,
                    visibilityTime: 4250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log("err", err);

            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while processing your request.`,
            //     text2: `We've experienced an error while trying to fetch listing details...`,
            //     visibilityTime: 4250,
            //     position: "bottom"
            // });
        })
    }, []);

    const handleSearch = (val) => {
        console.log("searching/searched...", val);

        setState(prevState => {
            return {
                ...prevState,
                searchingText: val
            }
        })

        searchbarRef.current.unFocus();
    };
    const handleCancellation = () => {
        console.log("handled cancellation...");
        
        searchbarRef.current.unFocus();
    }

    const _renderItem = ({item, index}) => {
        return (
            <Fragment key={index}>
                    <View style={colorSchemeDark ? [styles.mainContainerIterated, { backgroundColor: "#000", borderWidth: 2, borderColor: "#fff" }] : styles.mainContainerIterated}>
                    <View style={styles.imageWrapper}>
                        <Image resizeMode={"contain"} style={styles.blockImage} source={{ uri: item.LARGE }} />
                    </View>  
                    <View style={{paddingHorizontal: 20, paddingVertical: 20}}>
                        <Text title3 semibold numberOfLines={2}>
                            {item.NAME}
                        </Text>
                            <View style={styles.blockContentAddress}>
                                <Text
                                    caption1
                                    grayColor
                                    numberOfLines={3}>
                                    {item.DESCRIPTION}
                                </Text>
                            </View>
                            <View style={styles.blockContentDetail}>
                                <View style={{flex: 1}}>
                                    <Text title3 primaryColor semibold>
                                        {`$${item.PRICE}`}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row'
                                    }}>
                                    <View
                                        style={{
                                            marginLeft: 3.25
                                        }}
                                    >
                                        <Text style={[styles.scoreText, { color: colors.accent }]}>{item.CODE}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.blockContentDetail}>
                                <Button style={{ backgroundColor: BaseColor.greenColor, maxHeight: 40 }} full onPress={() => navigation.navigate("IndividualClothingItemListing", { data: item })}> 
                                    {`View Item`}
                                </Button>
                            </View>
                        </View>
                    </View>
            </Fragment>
        );
    }

    const ListHeaderRender = () => {
        return (
            <Fragment>
                <Header
                    title={"Buy & Send Gifts"}
                    subTitle="Send gifts to other users in app..."
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
                    //         <Text headline accentColor numberOfLines={1}>
                    //             List
                    //         </Text>
                    //     );
                    // }}
                    // onPressRight={() => {
                    //     console.log("pressed right.");

                    //     navigation.navigate("ListClothingItemForSale");
                    // }}
                />
                <View style={{ margin: 10 }}>
                    <SearchBar
                        ref={searchbarRef}
                        placeholder="Search specific clothing types..."
                        onSearchButtonPress={handleSearch}
                        onCancelButtonPress={handleCancellation}
                    />
                </View>
            </Fragment>
        );
    }

    const renderEmpty = () => {
        return (
            <View style={{ margin: 12.25 }}>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.225} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.225} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.225} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.225} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.225} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.225} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.225} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.225} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.225} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.225} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.225} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={props => (
                        <PlaceholderMedia
                            isRound={true}
                            style={[styles.placeholderMediaSmaller, props.style]}
                        />
                    )}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.225} />
                    <PlaceholderLine width={30} />
                </Placeholder>
            </View>
        );
    }

    const loadMoreResults = (info) => {
        console.log("loadMoreResults info :", info);

        axios.get(`https://www.floristone.com/api/rest/flowershop/getproducts?category=lr&count=20&start=${state.listings.length + 1}`, {
            headers: { 'Authorization': `Basic ${base64.encode('864002:E0EEps')}` }
        }).then((res) => {
            console.log("res.data", res.data.PRODUCTS);

            if (res.data) {

                const { PRODUCTS } = res.data; 

                setState(prevState => {
                    return {
                        ...prevState,
                        listings: prevState.listings.concat(PRODUCTS),
                        duplicateArr: prevState.listings.concat(PRODUCTS)
                    }
                })
            } else {

                console.log("res.data error", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while processing your request.`,
                    text2: `We've experienced an error while trying to fetch listing details...`,
                    visibilityTime: 4250,
                    position: "bottom"
                });
            }
        }).catch((err) => {
            console.log("err", err);

            // Toast.show({
            //     type: 'error',
            //     text1: `An error occurred while processing your request.`,
            //     text2: `We've experienced an error while trying to fetch listing details...`,
            //     visibilityTime: 4250,
            //     position: "bottom"
            // });
        })
        setState(prevState => {
            return {
                ...prevState,
                current: {
                    ...prevState.current,
                    end: prevState.current.end += 10
                }
            }
        })
    }

    return (
        <Fragment>
            <FlatList
                columnWrapperStyle={{ padding: 5 }}
                numColumns={2}
                data={typeof state.listings !== "undefined" && state.listings.length > 0 ? state.listings.slice(state.current.start, state.current.end) : state.listings}
                ListHeaderComponent={ListHeaderRender}
                onEndReachedThreshold={0.01}
                onEndReached={info => {
                    loadMoreResults(info);
                }}
                ListEmptyComponent={renderEmpty}
                keyExtractor={(item, index) => item.id}
                renderItem={_renderItem}
            />
        </Fragment>
    );  
}
export default ListViewCommerceMain;