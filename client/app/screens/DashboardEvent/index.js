import React, {useEffect, useState, useRef, Fragment} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
  useColorScheme
} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  PostListItem
} from '@components';
import {EventListData} from '@data';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import moment from 'moment';
import SearchBar from 'react-native-search-bar';
import RBSheet from "react-native-raw-bottom-sheet";
import _ from "lodash";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";

const { width, height } = Dimensions.get("window");

const DashboardEvent = ({navigation}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const searchableRefPane = useRef(null);
  const rbSheetRef = useRef(null);
  const searchableRef = useRef(null);
  const colorSchemeDark = useColorScheme() === "dark" ? true : false;
  const [search, setSearch] = useState('');
  const [loading] = useState(false);
  const [recommend] = useState(EventListData);
  const [ listings, setListingsState ] = useState([]);
  const [services] = useState([
    {
      id: '1',
      color: colors.primaryLight,
      image: require("../../assets/icons/counselor.png"),
      name: 'Coaching \nCoach',
    },
    {
      id: '2',
      color: "#000",
      image: require("../../assets/icons/stick.png"),
      name: 'Singles \nCoach',
    },
    {
      id: '3',
      color: colors.primaryLight,
      image: require("../../assets/icons/couple.png"),
      name: 'Couples \nCoach',
    },
    {
      id: '4',
      color: "#000",
      image: require("../../assets/icons/female.png"),
      name: `Woman \nCoach`,
    },
    {
      id: '5',
      color: colors.primaryLight,
      image: require("../../assets/icons/male.png"),
      name: 'Male \ncoach',
    }
  ]);

  const renderEmptyList = () => {
    return (
      <View style={{ margin: 17.25 }}>
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

  useEffect(() => {
    const config = {
      params: {
        sizeOfResults: 30
      }
    }

    axios.get(`${BASE_URL}/gather/randomized/users/coaching/mentorship`, config).then((res) => {
        if (res.data.message === "Gathered list of counselors!") {
            console.log("resdata", res.data);

            const { counselors } = res.data;

            setListingsState(counselors);
        } else {
            console.log("errrorrrrrr", res.data);
        }
    }).catch((err) => {
        console.log(err.message);
    })
  }, [])

  const sellClothingItem = () => {
    console.log("sellClothingItem clicked/ran...");

    navigation.navigate("ListClothingItemForSale");
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t(`Therapist's & Mentors`)}
        subTitle={"Specialized professionals for hire!"}
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
        renderRight={() => {
          if (loading) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          }
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <RBSheet
          ref={rbSheetRef}
          height={height}
          openDuration={325}
          closeOnDragDown={true}
          customStyles={{
            container: colorSchemeDark ? {
              paddingHorizontal: 20,
              backgroundColor: "#000"
            } : {
              paddingHorizontal: 20,
            },
            draggableIcon: {
                width: width * 0.725
            }
          }}
      >
        <SearchBar
            ref={searchableRefPane}
            textFieldBackgroundColor={colorSchemeDark ? "#000" : null}
            placeholder="Search for specific therpists/mentors..."
            onChangeText={(value) => setSearch(value)}
            onSearchButtonPress={() => console.log("Searching pressed (pane)...")}
            onCancelButtonPress={() => console.log("cancelled search (pane)...")}
        />
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 0
          }}
          horizontal={false}
          data={listings.filter((item) => item.username.includes(search.toLowerCase()))}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => {
            return (
              <Fragment>
                <PostListItem
                  title={`${item.firstName} ~ @${item.username}`}
                  description={`${item.coreMentorshipAccountInfo.yearsOfExperience} Years of Experience \nGraduated in ${item.coreMentorshipAccountInfo.schoolAndResume.graduationYear} from ${item.coreMentorshipAccountInfo.schoolAndResume.schoolName} \nTimezone: ${item.coreMentorshipAccountInfo.timezone.value}`}
                  style={{ marginTop: 10, width: '100%' }}
                  image={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }}
                  onPress={() => {
                      console.log("clicked card.");

                      rbSheetRef.current.close();

                      setTimeout(() => {
                        navigation.navigate('EventDetail', { listing: item })
                      }, 725);
                  }}
                />
              </Fragment>
            );
          }}
        />
      </RBSheet>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ScrollView>
          <View style={{padding: 20}}>
            <SearchBar
                ref={searchableRef}
                textFieldBackgroundColor={colorSchemeDark ? "#fff" : null}
                placeholder="Search for specific therpists/mentors..."
                onChangeText={() => {}}
                onFocus={() => {
                  searchableRef.current.unFocus();
                  rbSheetRef.current.open();
                }}
                onSearchButtonPress={() => console.log("Searching pressed...")}
                onCancelButtonPress={() => console.log("cancelled search...")}
            />
            {/* <Button style={{ marginTop: 12.25 }} onPress={() => sellClothingItem()}>
              {"List Your Companionship Services!"}
            </Button> */}
          </View>
          {/* <FlatList
            data={services}
            horizontal={true}
            keyExtractor={(item, index) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={styles.serviceItem}
                  onPress={() => {
                    navigation.navigate('Event');
                  }}>
                  <View
                    style={[
                      styles.serviceCircleIcon,
                      {backgroundColor: item.color},
                    ]}>
                    <Image source={item.image} tintColor={"#fff"} style={{ maxWidth: 22.25, maxHeight: 22.25, height: 22.25, width: 22.25 }} />
                  </View>
                  <Text
                    footnote
                    style={{
                      marginTop: 5,
                      textAlign: "center"
                    }}>
                    {t(item.name)}
                  </Text>
                </TouchableOpacity>
              );
            }}
          /> */}
          <Text title3 semibold style={{padding: 20}}>
            {t(`Mentor's & Available Guides...`)}
          </Text>
          <View>
            {typeof listings !== "undefined" && listings.length > 0 ? <FlatList
              contentContainerStyle={{
                paddingRight: 20,
                paddingLeft: 5,
              }}
              horizontal={true}
              data={listings}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={[styles.content, {borderColor: colors.border}]}
                    onPress={() => navigation.navigate('EventDetail', { listing: item })}
                    activeOpacity={0.9}>
                    <Image resizeMode='cover' source={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }} style={styles.imageBanner} />
                    <View
                      style={{
                        padding: 10,
                        flexDirection: 'row',
                      }}>
                      <View style={{alignItems: 'flex-start', marginRight: 10}}>
                        <Text body2 primaryColor semibold>
                          {item.coreMentorshipAccountInfo.yearsOfExperience} Year's Exp.
                        </Text>
                        <Text body1 grayColor semibold>
                          Graduated {"\n"}{item.coreMentorshipAccountInfo.schoolAndResume.graduationYear}
                        </Text>
                      </View>
                      <View style={{flex: 1, alignItems: 'flex-start'}}>
                        <Text body2 semibold numberOfLines={1} style={{flex: 1}}>
                          {moment(item.birthdate).fromNow(true)} old
                        </Text>
                        <Text overline grayColor style={{marginVertical: 5}}>
                          {_.has(item, "gender") ? item.gender.value === "Man" ? "Man" : item.gender.value === "Woman" ? "Woman" : "Other" : "N/A - Unknown."}
                        </Text>
                        <Text overline grayColor>
                          {typeof item.hearts !== "undefined" && item.hearts.length > 0 ? item.hearts.length : 0} Person(s) Like This Mentor
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            /> : <Fragment>{renderEmptyList()}</Fragment>}
          </View>
          {/* <Text title3 semibold style={{ paddingLeft: 20, paddingTop: 20 }}>
            {t('recommend_for_you')}
          </Text>
          <Text semibold style={{ padding: 20 }}>
            {"These are our TOP-PICK's for the week! These are the TOP items for sale at the current moment..."}
          </Text>
          <FlatList
            contentContainerStyle={{
              paddingRight: 20,
              paddingLeft: 5,
              paddingBottom: 20,
            }}
            horizontal={true}
            data={listings.reverse()}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item.id}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={[styles.content, {borderColor: colors.border}]}
                  onPress={() => navigation.navigate('EventDetail', { listing: item })}
                  activeOpacity={0.9}>
                  <Image resizeMode='cover' source={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }} style={styles.imageBanner} />
                  <View
                    style={{
                      padding: 10,
                      flexDirection: 'row',
                    }}>
                    <View style={{alignItems: 'flex-start', marginRight: 10}}>
                      <Text body2 primaryColor semibold>
                        {item.coreMentorshipAccountInfo.yearsOfExperience} Year's Exp.
                      </Text>
                      <Text body1 grayColor semibold>
                        Graduated {"\n"}{item.coreMentorshipAccountInfo.schoolAndResume.graduationYear}
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-start'}}>
                      <Text body2 semibold numberOfLines={1} style={{flex: 1}}>
                        {moment(item.birthdate).fromNow(true)} old
                      </Text>
                      <Text overline grayColor style={{marginVertical: 5}}>
                        {_.has(item, "gender") ? item.gender.value === "Man" ? "Man" : item.gender.value === "Woman" ? "Woman" : "Other" : "N/A - Unknown."}
                      </Text>
                      <Text overline grayColor>
                        {"The cat went to the house to eat"}{"..."}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          /> */}
          <Text title3 semibold style={{ paddingLeft: 20, paddingTop: 20 }}>
            {"View More..."}
          </Text>
          <Text semibold style={{padding: 20}}>
            {"View more mentors & guides to assist you along your dating endeavors..."}
          </Text>
          <FlatList
            contentContainerStyle={{
              paddingRight: 10,
              paddingLeft: 5,
              paddingBottom: 10
            }}
            horizontal={false}
            numColumns={2}
            data={listings}
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item.id}
            renderItem={({item, index}) => {
              console.log("itemmmmm", item);
              return (
                <TouchableOpacity
                  style={[styles.contentCustomized, {borderColor: colors.border}]}
                  onPress={() => navigation.navigate('EventDetail', { listing: item })}
                  activeOpacity={0.9}>
                  <Image resizeMode='cover' source={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }} style={styles.imageBanner} />
                  <View
                    style={{
                      padding: 10,
                      flexDirection: 'row',
                    }}>
                    <View style={{alignItems: 'flex-start', marginRight: 10}}>
                      <Text body2 primaryColor semibold>
                        {item.coreMentorshipAccountInfo.yearsOfExperience} Year's Exp.
                      </Text>
                      <Text body1 grayColor semibold>
                        Graduated {"\n"}{item.coreMentorshipAccountInfo.schoolAndResume.graduationYear}
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-start'}}>
                      <Text body2 semibold numberOfLines={1} style={{flex: 1}}>
                        {moment(item.birthdate).fromNow(true)} old
                      </Text>
                      <Text overline grayColor style={{marginVertical: 5}}>
                        {_.has(item, "gender") ? item.gender.value === "Man" ? "Man" : item.gender.value === "Woman" ? "Woman" : "Other" : "N/A - Unknown."}
                      </Text>
                      <Text overline grayColor>
                        {typeof item.hearts !== "undefined" && item.hearts.length > 0 ? item.hearts.length : 0} Person(s) Like This Mentor
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
export default DashboardEvent;