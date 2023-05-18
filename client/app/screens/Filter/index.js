import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Tag, RangeSlider} from '@components';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import styles from './styles';

export default function Filter({navigation, RBSheetRef}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [priceBegin, setPriceBegin] = useState(0);
  const [priceEnd, setPriceEnd] = useState(1000);
  const [facilities, setFacilities] = useState([
    {id: '1', name: 'Men', checked: true},
    {id: '2', name: 'Women'},
    {id: '3', name: 'Everyone'}
  ]);
  const [roomType, setRoomType] = useState([
    {id: '1', name: 'Standart', checked: true},
    {id: '2', name: 'Delux'},
    {id: '3', name: 'Premier'},
    {id: '4', name: 'Other'},
  ]);
  const [interio, setInterio] = useState([
    {id: '1', name: 'lightbrown', color: '#A08679', checked: true},
    {id: '2', name: 'lighttanish', color: '#e6c7c2'},
    {id: '3', name: 'tanish', color: '#FFCD94'},
    {id: '4', name: 'brown', color: '#964B00'},
  ]);
  const [adults, setAdults] = useState(0);
  const [childrens, setChildrens] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const onSelectFacilities = select => {
    setFacilities(
      facilities.map(item => {
        if (item.name == select.name) {
          return {
            ...item,
            checked: true,
          };
        } else {
          return {
            ...item,
            checked: false,
          };
        }
      }),
    );
  };

  const onSelectRoomType = select => {
    setRoomType(
      roomType.map(item => {
        if (item.name == select.name) {
          return {
            ...item,
            checked: true,
          };
        } else {
          return {
            ...item,
            checked: false,
          };
        }
      }),
    );
  };

  const onSelectInterio = select => {
    setInterio(
      interio.map(item => {
        if (item.name == select.name) {
          return {
            ...item,
            checked: true,
          };
        } else {
          return {
            ...item,
            checked: false,
          };
        }
      }),
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('filtering')}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('apply')}
            </Text>
          );
        }}
        onPressLeft={() => RBSheetRef.current.close()}
        onPressRight={() => {}}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ScrollView
          scrollEnabled={scrollEnabled}
          onContentSizeChange={(contentWidth, contentHeight) =>
            setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
          }>
          <View style={{padding: 20}}>
            <Text headline semibold>
              {t('Height Preference(s)').toUpperCase()}
            </Text>
            <View style={styles.contentRange}>
              <Text caption1 grayColor>
                4" 0'
              </Text>
              <Text caption1 grayColor>
                6"6'
              </Text>
            </View>
            <RangeSlider
              min={48}
              max={78}
              color={colors.border}
              selectionColor={"#00AD0D"}
              onValueChanged={(low, high) => {
                setPriceBegin(low);
                setPriceEnd(high);
              }}
            />
            <View style={styles.contentResultRange}>
              <Text caption1>{t('Height (in inches)')}</Text>
              <Text caption1>
                {priceBegin}/in - {priceEnd}/in
              </Text>
            </View>
          </View>
          <Text headline semibold style={{marginLeft: 20, marginTop: 15}}>
            {t('Seeking/Preference').toUpperCase()}
          </Text>
          <View style={styles.contentList}>
            <FlatList
              contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={facilities}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <Tag
                  primary={item.checked}
                  style={{marginLeft: 15, width: 80}}
                  outline={!item.checked}
                  onPress={() => onSelectFacilities(item)}>
                  {item.name}
                </Tag>
              )}
            />
          </View>
          <View style={{padding: 20}}>
            <Text headline semibold>
              {t(`Preference for children`).toUpperCase()}
            </Text>
            <View style={styles.contentQuest}>
              <View style={styles.lineRow}>
                <View>
                  <Text body1>{t('child (full-custody)')}</Text>
                  <Text caption1 grayColor>
                    {t('Aged up-to 18')}
                  </Text>
                </View>
                <View style={styles.iconRight}>
                  <TouchableOpacity
                    onPress={() => {
                      setAdults(adults - 1 > 0 ? adults - 1 : 0);
                    }}>
                    <Icon
                      name="minus-circle"
                      size={24}
                      color={BaseColor.grayColor}
                    />
                  </TouchableOpacity>
                  <Text title1>{adults}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setAdults(adults + 1);
                    }}>
                    <Icon name="plus-circle" size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.lineRow}>
                <View>
                  <Text body1>{t('child (partial-custody)')}</Text>
                  <Text caption1 grayColor>
                    {t('Aged up-to 18')}
                  </Text>
                </View>
                <View style={styles.iconRight}>
                  <TouchableOpacity
                    onPress={() => {
                      setChildrens(childrens - 1 > 0 ? childrens - 1 : 0);
                    }}>
                    <Icon
                      name="minus-circle"
                      size={24}
                      color={BaseColor.grayColor}
                    />
                  </TouchableOpacity>
                  <Text title1>{childrens}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setChildrens(childrens + 1);
                    }}>
                    <Icon name="plus-circle" size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <Text headline semibold style={{marginLeft: 20, marginTop: 15}}>
            {t('Hair Color').toUpperCase()}
          </Text>
          <View style={styles.contentList}>
            <FlatList
              contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={hairColorOptions}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={[styles.interioItem, {backgroundColor: item.color}]}
                  onPress={() => onSelectInterio(item)}>
                  {item.checked && (
                    <Icon name="check" size={16} color={BaseColor.whiteColor} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
          <Text headline semibold style={{marginLeft: 20, marginTop: 15}}>
            {t('Skin preference').toUpperCase()}
          </Text>
          <View style={styles.contentList}>
            <FlatList
              contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={interio}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={[styles.interioItem, {backgroundColor: item.color}]}
                  onPress={() => onSelectInterio(item)}>
                  {item.checked && (
                    <Icon name="check" size={16} color={BaseColor.whiteColor} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
