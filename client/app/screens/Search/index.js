import React, {useState, useEffect, useRef, Fragment} from 'react';
import { RefreshControl, View, Animated, Dimensions, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image} from 'react-native';
import {BaseStyle, useTheme, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, HotelItem, Text, StarRating, TextInput, Button} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";
import Toast from "react-native-toast-message";
        
const { width, height } = Dimensions.get("window");

const Search = ({navigation, authData}) => {

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const {colors} = useTheme();
  const {t} = useTranslation();
  const [users, setUsers] = useState([]); // HotelData
  const [ ready, setReady ] = useState(false);
  const [ keyword, setKeyword ] = useState("");
  const [refreshing] = useState(false);
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      offsetAnim,
    ),
    0,
    40,
  );

  const handleUsernameSearching = (username) => {
    const config = {
        uniqueId: authData.uniqueId,
        otherUserUsername: username
    }

    axios.post(`${BASE_URL}/search/for/usernames/and/content/details`, config).then((res) => {
        if (res.data.message === "Successfully located usernames!") {
            console.log("Successfully located usernames! res.data ---- :",  res.data);

            const { users } = res.data;
            
            setUsers(users);
        } else {
            console.log("Err", res.data);
        }
    }).catch((err) => {
        console.log(err.message);
    })
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(keyword)
      // Send Axios request here
      if (typeof keyword !== "undefined" && keyword.length > 0) {
        handleUsernameSearching(keyword);
      }
    }, 1750)

    return () => clearTimeout(delayDebounceFn)
  }, [keyword])

  useEffect(() => {
    const config = {
      params: {
        sizeOfResults: 50,
        interestedIn: authData.interestedIn,
        uniqueId: authData.uniqueId
      }
    }

    axios.get(`${BASE_URL}/gather/users/limited`, config).then((ressss) => {
        if (ressss.data.message === "Gathered list of users!") {
            console.log("ressssdata", ressss.data);

            const { users } = ressss.data;

            const promises = [];

            setUsers(users);
            setReady(true);
        } else {
            console.log("errrorrrrrr", ressss.data);
        }
    }).catch((err) => {
        console.log(err.message);
    })
  }, []);

  const renderEmptyComponentHelper = () => {
    return (
      <Fragment>
        <View style={[styles.centeredOnly, { borderColor: "#000" }]}>
          <Image resizeMode='contain' source={require("../../assets/images/noresult.png")} style={styles.middlePlaceholder} />
        </View>
      </Fragment>
    );
  }

  const renderContent = () => {
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    });
    return (
      <View style={{flex: 1}}>
        <Animated.FlatList
          contentContainerStyle={{
            paddingTop: 10,
          }}
          columnWrapperStyle={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {}}
            />
          }
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: scrollAnim,
                  },
                },
              },
            ],
            {useNativeDriver: true},
          )}
          numColumns={2}
          data={users}
          ListEmptyComponent={renderEmptyComponentHelper}
          key={'grid'}
          keyExtractor={(item, index) => item.uniqueId}
          renderItem={({item, index}) => {
            return (
              <View style={[styles.girdContent]}>
                <TouchableOpacity onPress={() => {
                  if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                    navigation.navigate('Profile1', { user: item })
                  } else {
                    Toast.show({
                        type: 'info',
                        text1: 'You must sign-in/up first...',
                        text2: `Please login/signup before accessing these features...`,
                        visibilityTime: 4250,
                        position: "bottom"
                    });
                  }
                }} activeOpacity={0.9}>
                  <Image source={{ uri: `${BASE_ASSET_URL}/${item.profilePictures[item.profilePictures.length - 1].link}` }} style={styles.girdImage} />
                </TouchableOpacity>
                <View style={styles.girdContentLocation}>
                  <Text
                    caption2
                    grayColor
                    style={{
                      color: colors.accent
                    }}
                    numberOfLines={1}>
                    {item.accountType}
                  </Text>
                  <Text caption2 grayColor style={styles.absoluteFollowers}> 
                    {typeof item.followers !== "undefined" && item.followers.length > 0 ? item.followers.length : 0} {"Follower's"}
                  </Text>
                </View>
                <Text
                  body2
                  semibold
                  style={{
                    marginTop: 5,
                  }}>
                  {`${item.firstName} ~ @${item.username}`}
                </Text>
                <View style={styles.girdContentRate}>
                  <Text
                    title5
                    accentColor
                    semibold
                  >
                    {`${moment(item.birthdateRaw).fromNow(true)} old`}
                  </Text>
                </View>
                <Text
                  title5
                  primaryColor
                  semibold
                  style={{
                    marginTop: 5,
                  }}>
                  {`Registered: ${moment(item.registrationDate).fromNow(true)} ago`}
                </Text>
              </View>
          )}}
        />
        <Animated.View
          style={[
            styles.navbar,
            {
              transform: [{translateY: navbarTranslate}],
            },
          ]}>
        </Animated.View>
      </View>
    );
  };
  const renderLoading = () => {
    if (!ready) {
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
  }

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Header
          title={"Search By Username"}
          renderLeft={() => {
            return <Icon name="arrow-left" size={20} color={colors.primary} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <SafeAreaView
          style={BaseStyle.safeAreaView}
          edges={['right', 'left', 'bottom']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? 'height' : 'padding'}
            keyboardVerticalOffset={offsetKeyboard}
            style={{flex: 1}}>
            <ScrollView contentContainerStyle={{padding: 20}}>
              <TextInput
                onChangeText={text => setKeyword(text)}
                placeholder={t('what_are_you_looking_for')}
                value={keyword}
              />
              <View style={styles.hr} />
              {!ready ? renderLoading() : renderContent()}
            </ScrollView>
            <View style={{paddingHorizontal: 10, paddingVertical: 15}}>
              <Button
                full
                style={{ backgroundColor: colors.accent }}
                onPress={() => {
                  handleUsernameSearching(keyword);
              }}>
                {"Search For User(s)!"}
              </Button>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </View>
  );
}
const mapStateToProps = (state) => {
  return {
      authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
  }
}

export default connect(mapStateToProps, {  })(Search);