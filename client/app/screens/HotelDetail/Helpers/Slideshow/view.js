import React, {useEffect, useState} from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {BaseStyle, BaseColor, Images, useTheme} from '@config';
import Swiper from 'react-native-swiper';
import {Image, Header, SafeAreaView, Icon, Text} from '@components';
import styles from './viewStyles.js';
import {useTranslation} from 'react-i18next';

const PreviewImageGroupMeetup = ({navigation, setModalVisible, passedImages, selectedIndex}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();

  let flatListRef = null;
  let swiperRef = null;

  const [images, setImages] = useState([]);
  const [indexSelected, setIndexSelected] = useState(0);

  useEffect(() => {
    const imageArr = [];
    for (let idx = 0; idx < passedImages.length; idx++) {
        const img = passedImages[idx];

        if (idx === selectedIndex) {
            imageArr.push({ id: idx, image: img, selected: true });

            if ((passedImages.length - 1) === idx) {
                setImages(imageArr);
            }
        } else {
            imageArr.push({ id: idx, image: img });

            if ((passedImages.length - 1) === idx) {
                setImages(imageArr);
            }
        }
    }
  }, [])

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
            setModalVisible(false);
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
            <Text body2 whiteColor>
              Standard Double Room
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
export default PreviewImageGroupMeetup;
