import React, { Fragment, useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import Swiper from 'react-native-swiper';
import { Image, Header, SafeAreaView, Icon, Text } from '@components';
import styles from './imagesStyles.js';
import { BASE_ASSET_URL } from "@env";
import _ from "lodash";

const PreviewImagesProfile = (props) => {
    const { colors, theme } = useTheme();
    const navigation = useNavigation();
    let flatListRef = null;
    let swiperRef = null;
    const [images, setImages] = useState([]);
    const [ ready, setReady ] = useState(false);
    const [indexSelected, setIndexSelected] = useState(0);

    useEffect(() => {
        const newImageArr = [];
        const passedImages = props.route.params.passedImages;
        const cumulatedArr = passedImages;

        if (typeof passedImages !== "undefined" && passedImages.length > 0) {
            // delay set state update..
            const newPromise = new Promise((resolve, reject) => {
                for (let idx = 0; idx < cumulatedArr.length; idx++) {
                    const specific = cumulatedArr[idx];
                    
                    if (!_.has(specific, "empty")) {
                        newImageArr.push({ id: idx, image: `${BASE_ASSET_URL}/${specific.link}`, selected: idx === 0 ? true : false });
                    }

                    if ((cumulatedArr.length - 1) === idx) {
                        resolve(newImageArr);
                    }
                }
            })
            // final resolution...
            newPromise.then((passedValues) => {
                setImages(passedValues);
                setReady(true);
            })
        }
    }, []);

    const onSelect = indexSelected => {
        setIndexSelected(indexSelected);
        setImages(
            images.map((item, index) => {
                if (index == indexSelected) {
                return {
                    ...item,
                    selected: true,
                };
                } else {
                return {
                    ...item,
                    selected: false,
                };
                }
            }),
        );
        flatListRef.scrollToIndex({
            animated: true,
            index: indexSelected,
        });
    };

    const onTouchImage = touched => {
        if (touched == indexSelected) return;
        swiperRef.scrollBy(touched - indexSelected, false);
    };

    if (ready === true) {
        return (
            <View style={{  flex: 1, backgroundColor: 'black'   }}>
                <Header
                    title=""
                    renderLeft={() => {
                        return (
                            <Icon name="arrow-left" size={20} color={BaseColor.whiteColor} />
                        );
                    }}
                    onPressLeft={() => {
                        navigation.goBack();
                    }}
                    barStyle="light-content"
                />
                <SafeAreaView
                    style={BaseStyle.safeAreaView}
                    edges={['right', 'left', 'bottom']}>
                    <Swiper
                        ref={ref => {
                            swiperRef = ref;
                        }}
                        dotStyle={{
                            backgroundColor: BaseColor.dividerColor,
                        }}
                        paginationStyle={{bottom: 0}}
                        loop={false}
                        activeDotColor={colors.primary}
                        removeClippedSubviews={false}
                        onIndexChanged={index => onSelect(index)}>
                        {images.map((item, key) => {
                            console.log("item", item);

                            if (!_.has(item, "empty")) {
                                return (
                                    <Image
                                        key={key}
                                        style={{width: '100%', height: '100%'}}
                                        resizeMode="contain"
                                        source={{ uri: item.image }}
                                    />
                                );
                            }
                        })}
                    </Swiper>
                    <View
                        style={{
                            paddingVertical: 10,
                        }}
                    >
                    <View style={styles.lineText}>
                        <Text body2 whiteColor>
                            Profile Picture {indexSelected + 1}
                        </Text>
                        <Text body2 whiteColor>
                            {indexSelected + 1}/{images.length}
                        </Text>
                    </View>
                    <FlatList
                        ref={ref => {
                            flatListRef = ref;
                        }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={images}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({item, index}) => {
                            if (!_.has(item, "empty")) {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            onTouchImage(index);
                                        }}
                                        activeOpacity={0.9}>
                                        <Image
                                            style={{
                                                width: 70,
                                                height: 70,
                                                marginLeft: 20,
                                                borderRadius: 8,
                                                borderColor:
                                                index == indexSelected
                                                    ? colors.primaryLight
                                                    : BaseColor.grayColor,
                                                borderWidth: 1,
                                            }}
                                            source={{ uri: item.image }}
                                        />
                                    </TouchableOpacity>
                                    )
                            }
                        }}
                    />
                    </View>
                </SafeAreaView>
            </View>
        );
    } else {
        return (
            <Fragment>
                <View style={{  flex: 1, backgroundColor: 'black'   }}>
                    <Header
                        title=""
                        renderLeft={() => {
                            return (
                                <Icon name="arrow-left" size={20} color={BaseColor.whiteColor} />
                            );
                        }}
                        onPressLeft={() => {
                            navigation.goBack();
                        }}
                        barStyle="light-content"
                    />
                </View>
            </Fragment>
        );
    }
}
export default PreviewImagesProfile;