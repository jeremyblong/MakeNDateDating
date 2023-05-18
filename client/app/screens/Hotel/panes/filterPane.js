import React, {Fragment, useState} from 'react';
import {View, FlatList, TouchableOpacity, ScrollView, useColorScheme, Platform} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Tag, RangeSlider} from '@components';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import styles from './filterPaneStyles.js';
import LinearGradient from 'react-native-linear-gradient';

const primaryColor = "#D81159";
const secondaryColor = "#0496FF";
const blackColor = "#000";
const backColor = "#eee";
const greenColor = "green";

const hairColorOptions = [
  {
      id: "Black",
      name: "black",
      color: "#000000",
      checked: true
  },
  {
      id: "Blonde",
      name: "blonde",
      color: "#faf0be",
      checked: false
  },
  {
      id: "Brown",
      name: "brown",
      color: "#964B00",
      checked: false
  },
  {
      id: "Red",
      name: "red",
      color: "#ff0000",
      checked: false
  },
  {
      id: "Blue",
      name: "Blue",
      color: "#0000FF",
      checked: false
  },
  {
      id: "Pink",
      name: "Pink",
      color: "#FFC0CB",
      checked: false
  },
  {
      id: "White",
      name: "White",
      color: "#fff",
      checked: false
  },
  {
      id: "Gray",
      name: "gray",
      color: "#808080",
      checked: false
  },
  {
      id: "Bald",
      name: "bald",
      color: "#fff",
      checked: false
  },
  {
      id: "Mixed Color(s)",
      name: "mixed",
      color: "gradient",
      checked: false
  },
]

const FilterResultsSearching = ({navigation, RBSheetRef, handleFilterSearch}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const colorSchemeDark = useColorScheme() === "dark" ? true : false;
  const [heightBegin, setHeightBegin] = useState(0);
  const [heightEnd, setHeightEnd] = useState(1000);
  const [genders, setGender] = useState([
    {id: '1', name: 'Men', value: "Man", checked: true},
    {id: '2', name: 'Women', value: "Woman" },
    {id: '3', name: 'Everyone', value: "Anyone" }
  ]);
  const [ hairColors, setHairColors ] = useState(hairColorOptions);
  const [fullCustody, setFullCustody] = useState(0);
  const [partialCustody, setPartialCustody] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const handleSearching = () => {
    
    const findIndexGender = genders.findIndex(item => item.checked === true);
    const findIndexHairColor = hairColors.findIndex(item => item.checked === true);

    const config = {
        params: {
            height: {
                low: heightBegin,
                high: heightEnd
            },
            gender: genders[findIndexGender].value,
            hairColor: hairColors[findIndexHairColor].name.toLowerCase(),
            children: {
              partial: partialCustody,
              full: fullCustody
            }
        }
    }
    handleFilterSearch(config);
  }

  const onSelectFacilities = select => {
    setGender(
        genders.map(item => {
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

  const onChangeHairColor = select => {
    setHairColors(
      hairColors.map(item => {
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
    <View style={colorSchemeDark ? { flex: 1, backgroundColor: "#000" } : {flex: 1}}>
      {Platform.OS === "ios" ? <View style={{ paddingTop: 22.25 }} /> : null}
      <Header
        title={t('filtering')}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {"Search"}
            </Text>
          );
        }}
        onPressLeft={() => RBSheetRef.current.close()}
        onPressRight={() => handleSearching()}
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
                setHeightBegin(low);
                setHeightEnd(high);
              }}
            />
            <View style={styles.contentResultRange}>
              <Text caption1>{t('Height (in inches)')}</Text>
              <Text caption1>
                {heightBegin}/in - {heightEnd}/in
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
              data={genders}
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
                      setFullCustody(fullCustody - 1 > 0 ? fullCustody - 1 : 0);
                    }}>
                    <Icon
                      name="minus-circle"
                      size={24}
                      color={BaseColor.grayColor}
                    />
                  </TouchableOpacity>
                  <Text title1>{fullCustody}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setFullCustody(fullCustody + 1);
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
                      setPartialCustody(partialCustody - 1 > 0 ? partialCustody - 1 : 0);
                    }}>
                    <Icon
                      name="minus-circle"
                      size={24}
                      color={BaseColor.grayColor}
                    />
                  </TouchableOpacity>
                  <Text title1>{partialCustody}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setPartialCustody(partialCustody + 1);
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
              data={hairColors}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => {
                if (item.name === "mixed") {
                  return (
                    <Fragment>
                      <TouchableOpacity
                        style={colorSchemeDark ? [styles.interioItem, {backgroundColor: item.color, borderWidth: 1.5, borderColor: "#fff"}] : [styles.interioItem, {backgroundColor: item.color, borderWidth: 1.5, borderColor: "#000"}]}
                        onPress={() => onChangeHairColor(item)}>
                          <LinearGradient style={{ minWidth: 32.5, minHeight: 32.5, borderRadius: 35 }} colors={[primaryColor, secondaryColor, greenColor]}>
                            {item.checked && (
                              <Icon name="check" size={16} color={BaseColor.whiteColor} />
                            )}
                          </LinearGradient>
                      </TouchableOpacity>
                    </Fragment>
                  );
                } else {
                  return (
                    <Fragment>
                      <TouchableOpacity
                        style={colorSchemeDark ? [styles.interioItem, {backgroundColor: item.color, borderWidth: 1.5, borderColor: "#fff"}] : [styles.interioItem, {backgroundColor: item.color, borderWidth: 1.5, borderColor: "#000"}]}
                        onPress={() => onChangeHairColor(item)}>
                        {item.checked && (
                          <Icon name="check" size={16} color={BaseColor.whiteColor} />
                        )}
                      </TouchableOpacity>
                    </Fragment>
                  );
                }
              }}
            />
          </View>
          {/* <Text headline semibold style={{marginLeft: 20, marginTop: 15}}>
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
          </View> */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
export default FilterResultsSearching;