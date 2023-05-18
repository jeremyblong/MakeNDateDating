import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, ScrollView} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Tag, RangeSlider} from '@components';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import styles from './styles';

const StreamingFilter = ({navigation, rawBottomSheetRef}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [lengthTimeBegin, setLengthBegin] = useState(0);
  const [lengthTimeEnd, setLengthEnd] = useState(1000);
  const [facilities, setFacilities] = useState([
    {id: '1', name: 'Men', checked: true},
    {id: '2', name: 'Women'},
    {id: '3', name: 'Everyone'}
  ]);
  const [roomType, setRoomType] = useState([
    {id: '1', name: 'Handing-Out', checked: true},
    {id: '2', name: 'Gaming'},
    {id: '3', name: 'Educational'},
    {id: '4', name: '1v1 Chat'},
  ]);
  const [interio, setInterio] = useState([
    {id: '1', name: 'lightbrown', color: '#A08679', checked: true},
    {id: '2', name: 'lighttanish', color: '#e6c7c2'},
    {id: '3', name: 'tanish', color: '#FFCD94'},
    {id: '4', name: 'brown', color: '#964B00'},
  ]);
  const [viewerCountCurrent, setViewerDesiredCount] = useState(0);
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
        onPressLeft={() => rawBottomSheetRef.current.close()}
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
              {t('Stream Current Timespan/Length').toUpperCase()}
            </Text>
            <View style={styles.contentRange}>
              <Text caption1 grayColor>
                Just Started ({"<="} 1 Min)
              </Text>
              <Text caption1 grayColor>
                180 Minute's (Max Length)
              </Text>
            </View>
            <RangeSlider
              min={0}
              max={180}
              color={colors.border}
              selectionColor={colors.primary}
              onValueChanged={(low, high) => {
                setLengthBegin(low);
                setLengthEnd(high);
              }}
            />
            <View style={styles.contentResultRange}>
              <Text caption1>{t('Length in minutes')}</Text>
              <Text caption1>
                {lengthTimeBegin}/Min. - {lengthTimeEnd}/Min.
              </Text>
            </View>
          </View>
          <Text headline semibold style={{marginLeft: 20, marginTop: 15}}>
            {t('Streamer/Streaming Gender Type').toUpperCase()}
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
          <View style={{padding: 20, maxHeight: 112.25 }}>
            <Text headline semibold>
              {t(`Number Of Viewer's`).toUpperCase()}
            </Text>
            <View style={styles.contentQuest}>
              <View style={styles.lineRow}>
                <View>
                  <Text body1>{t('Number Of Viewers')}</Text>
                  <Text caption1 grayColor>
                    {t(`Each increment is 10 (TEN) User's`)}
                  </Text>
                </View>
                <View style={styles.iconRight}>
                  <TouchableOpacity
                    onPress={() => {
                      setViewerDesiredCount(viewerCountCurrent - 1 > 0 ? viewerCountCurrent - 10 : 0);
                    }}>
                    <Icon
                      name="minus-circle"
                      size={24}
                      color={BaseColor.grayColor}
                    />
                  </TouchableOpacity>
                  <Text title1>{viewerCountCurrent}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setViewerDesiredCount(viewerCountCurrent + 10);
                    }}>
                    <Icon name="plus-circle" size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <Text headline semibold style={{marginLeft: 20, marginTop: 15}}>
            {t('Stream Type').toUpperCase()}
          </Text>
          <View style={styles.contentList}>
            <FlatList
              contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={roomType}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <Tag
                  style={{marginLeft: 15, width: 80}}
                  outline={!item.checked}
                  primary={item.checked}
                  onPress={() => onSelectRoomType(item)}>
                  {item.name}
                </Tag>
              )}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
export default StreamingFilter;