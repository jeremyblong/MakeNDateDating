import React, { Fragment, useState, useEffect } from 'react';
import {View, FlatList, TouchableOpacity, useColorScheme} from 'react-native';
import {BaseStyle, BaseColor, Images, useTheme} from '@config';
import Swiper from 'react-native-swiper';
import {Image, Header, SafeAreaView, Icon, Text} from '@components';
import styles from './slideshowPaneStyles.js';
import uuid from "react-native-uuid";


const ViewImagesPaneSheet = ({rbSheetRef, files, title, desc }) => {
  const {colors} = useTheme();

  let flatListRef = null;
  let swiperRef = null;

  const [images, setImages] = useState([]);
  const [indexSelected, setIndexSelected] = useState(0);
  const colorSchemeDark = useColorScheme() === "dark" ? true : false;

  useEffect(() => {
    const newArr = [];

    for (let idx = 0; idx < files.length; idx++) {
        const image = files[idx];
        console.log("image", image);
        newArr.push({ id: uuid.v4(), image });

        if ((files.length - 1) === idx) {
            setImages(newArr);
        }
    }
  }, [])

  const onSelect = indexSelected => {
    setIndexSelected(indexSelected);
    // setImages(
    //   images.map((item, index) => {
    //     if (index == indexSelected) {
    //       return {
    //         ...item,
    //         selected: true,
    //       };
    //     } else {
    //       return {
    //         ...item,
    //         selected: false,
    //       };
    //     }
    //   }),
    // );
    flatListRef.scrollToIndex({
      animated: true,
      index: indexSelected,
    });
  };

  const onTouchImage = touched => {
    if (touched == indexSelected) return;
    swiperRef.scrollBy(touched - indexSelected, false);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <Header
        title=""
        renderLeft={() => {
          return (
            <Icon name="arrow-left" size={20} color={BaseColor.whiteColor} />
          );
        }}
        onPressLeft={() => {
            rbSheetRef.current.close();
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
            return (
              <Image
                key={key}
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
                source={{ uri: item.image }}
              />
            );
          })}
        </Swiper>
        <View
          style={{
            paddingVertical: 10,
          }}>
          <View style={styles.lineText}>
            <Text body2 style={colorSchemeDark ? { color: colors.primary } : {}}>
              {title}
            </Text>
          </View>
          <View style={styles.lineText}>
            <Text body2 whiteColor>
              {desc.slice(0, 150)}{typeof desc !== "undefined" && desc.length >= 150 ? "..." : ""}
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
            renderItem={({item, index}) => (
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
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
export default ViewImagesPaneSheet;