import React, {useState, useEffect, useRef, Fragment} from 'react';
import {FlatList, RefreshControl, View, Animated, Dimensions, TouchableOpacity, Image} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, HotelItem, Text, Button} from '@components';
import StreamingFilter from "../../../screens/FilterLiveStreams/index.js";
import styles from './indexStyles';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL, VONAGE_API_KEY } from "@env";
import { connect } from "react-redux";
import _ from "lodash";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";
import RBSheet from "react-native-raw-bottom-sheet";
import Video from 'react-native-video';

const { width, height } = Dimensions.get("window");

const Hotel = ({navigation, authData}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const rawBottomSheetRef = useRef(null);
  const [users, setUsers] = useState([]); // HotelData
  const [ ready, setReady ] = useState(false);
  const [ broadcasts, setBroadcasts ] = useState([]);
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

            setUsers(users);
            setReady(true);
        } else {
            console.log("errrorrrrrr", ressss.data);
        }
    }).catch((err) => {
        console.log(err.message);
    })

    const configuration = {};

    axios.get(`${BASE_URL}/gather/live/streams/opentok`, configuration).then((res) => {
        if (res.data.message === "Gathered streams!") {
            console.log("resdata", res.data);

            const { broadcasts } = res.data;
            
            setBroadcasts(broadcasts);
        } else {
            console.log("errrorrrrrr", ressss.data);
        } 
    }).catch((err) => {
        console.log(err.message);
    })
  }, [])
  
  const handleLoadRefresh = () => {
    console.log("resfreshing");

    const configuration = {};

    axios.get(`${BASE_URL}/gather/live/streams/opentok`, configuration).then((res) => {
        if (res.data.message === "Gathered streams!") {
            console.log("resdata", res.data);

            const { broadcasts } = res.data;
            
            setBroadcasts(broadcasts);
        } else {
            console.log("errrorrrrrr", ressss.data);
        } 
    }).catch((err) => {
        console.log(err.message);
    })
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
            paddingTop: 50,
          }}
          ListEmptyComponent={renderEmptyContent}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => handleLoadRefresh()}
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
          data={broadcasts}
          key={'list'}
          keyExtractor={(item, index) => item.uniqueId}
          renderItem={({item, index}) => {
            console.log("item!", item);
            const broadcastURL = item.broadcastUrls.hls;
            return (
               <View style={styles.post}>
                {/* <Text style={styles.description}>{item.title}</Text> */}
                <TouchableOpacity onPress={() => {
                  navigation.navigate("LiveStreamFeedIndividual", { 
                    streamData: {
                        streamData: {
                            stream_key: null
                        },
                        streamTitle: null,
                        sessionID: item.sessionId,
                        streamID: item.id,
                        broadcastURL
                    } 
                  });
                }}>
                  <Video 
                    source={{ uri: broadcastURL }}
                    paused={true}
                    onLoadStart={() => console.log("on load started!")}
                    resizeMode={"contain"}
                    onReadyForDisplay={() => console.log("ready to display")}
                    onBuffer={() => console.log("buffering...")}
                    onError={(err) => console.log("load err...:", err)}
                    style={styles.mappedVideo} 
                  />
                </TouchableOpacity>
                {/* <View style={styles.actions}>
                  <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
                    <Text style={styles.actionText}>Like</Text>
                    <Text style={styles.actionCount}>{"0"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
                    <Text style={styles.actionText}>Dislike</Text>
                    <Text style={styles.actionCount}>{"0"}</Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            );
          }}
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
        <View style={{ margin: 17.25, marginTop: 50 }}> 
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

  const renderEmptyContent = () => {
    return (
      <View style={{ margin: 17.25, marginTop: 20 }}> 
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
          <View style={styles.centeredOnly}>
            <Text style={styles.notextAvailable}>There are no results available, please check back later to see if any live-streams are available later...</Text>
            <Image resizeMode='contain' source={require("../../../assets/images/noresult.png")} style={styles.middlePlaceholder} />
          </View>
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
  
  return (
    <View style={{flex: 1}}>
        <RBSheet
            ref={rawBottomSheetRef}
            closeOnDragDown={true}
            closeOnPressMask={true}
            dragFromTopOnly={true}
            height={height}
            closeDuration={275}
            openDuration={275}
            customStyles={{
                container: {
                    paddingHorizontal: 10 * 2.0,
                },
                draggableIcon: {
                    width: width * 0.725
                }
            }}
        >
            <StreamingFilter rawBottomSheetRef={rawBottomSheetRef} />
        </RBSheet>
        <Header
            title={t(`Live Streaming!`)}
            subTitle="View Current Live-Streams..."
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
            edges={['right', 'left', 'bottom']}>
            {/* <TouchableOpacity hitSlop={20} onPress={() => rawBottomSheetRef.current.open()} style={styles.topRightTouchable}>
                <Text style={styles.touchableText}>Filtering Option(s)</Text>
            </TouchableOpacity> */}
            <View style={{ marginHorizontal: 17.25 }}>
                <Button style={{ marginTop: 50, marginBottom: -20 }} full outline onPress={() => navigation.navigate("CreateNewLiveStream")}>
                    Start New Live-Stream!
                </Button>
            </View>
            {!ready ? renderLoading() : renderContent()}
        </SafeAreaView>
    </View>
  );
}
const mapStateToProps = (state) => {
  return {
      authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
  }
}

export default connect(mapStateToProps, {  })(Hotel);