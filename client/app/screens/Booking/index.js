import React, { useState, Fragment, useCallback } from 'react';
import {FlatList, RefreshControl, View, Image, TouchableOpacity, Dimensions} from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Text, Tag, Icon } from '@components';
import styles from './styles';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import { BASE_URL } from "@env";
import { SliderBox } from "react-native-image-slider-box";
import { connect } from "react-redux";
import _ from "lodash";
import Toast from 'react-native-toast-message';
import RectangeCenteredBannerRender from "../../mainScreens/AdvertisementHelpers/RectanageBanner/rectangleBanner.js";          
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from "rn-placeholder";
import FILTERS from "./Helpers/filters.js";
import FastImage from 'react-native-fast-image';


const { width, height } = Dimensions.get("window");

const Booking = ({navigation, authData}) => {
  const {colors, theme} = useTheme();
  const colorSchemeDark = theme.dark;
  const [ state, setState ] = useState({
    posts: [],
    current: {
      start: 0,
      end: 10
    },
    alreadyViewedArrIds: []
  })

  const [refreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const configuration = { params: {} }; 
  
      axios.get(`${BASE_URL}/gather/randomized/feed/posts`, configuration).then((ressss) => {
          if (ressss.data.message === "Gathered list of posts!") {
              console.log("ressssdata", ressss.data);
  
              const { posts } = ressss.data;

              const newArrIds = [];

              for (let index = 0; index < posts.length; index++) {
                const element = posts[index];

                newArrIds.push(element.id);

                if ((posts.length - 1) === index) {
                  setState(prevState => {
                    return {
                      ...prevState,
                      posts,
                      alreadyViewedArrIds: newArrIds
                    }
                  });
                }
              }

          } else {
              console.log("errrorrrrrr", ressss.data);
          }
      }).catch((err) => {
          console.log(err.message);
      })
  }, []));

  const loadMoreResults = (info) => {
    console.log("loadMoreResults info :", info);

    const configuration = {
      params: {
        idsAlreadyIncluded: state.alreadyViewedArrIds
      }
    };

    axios.get(`${BASE_URL}/fetch/more/feed/post/items`, configuration).then((res) => {
        if (res.data.message === "Successfully fetched new posts/results!") {
            console.log("Successfully fetched new posts/results!", res.data);

            const { posts } = res.data;

            setState(prevState => {
              return {
                  ...prevState,
                  current: {
                      ...prevState.current,
                      end: prevState.current.end += 10
                  },
                  posts: [...prevState.posts, ...posts]
              }
          })
        } else {
            console.log("Err", res.data);

            Toast.show({
                type: 'error',
                text1: `An error occurred while attempting to fetch posts!`,
                text2: "We encountered an error while attempting to fetch more posts for the feed...",
                visibilityTime: 2375,
                position: "bottom"
            });
        }
    }).catch((err) => {
        console.log(err.message);

        // Toast.show({
        //     type: 'error',
        //     text1: `An error occurred while attempting to fetch posts!`,
        //     text2: "We encountered an error while attempting to fetch more posts for the feed...",
        //     visibilityTime: 2375,
        //     position: "bottom"
        // });
    });
  }

  const dislikeReaction = (postId) => {
    console.log("dislikeReaction clicked/ran...", postId);

    const config = {
      reactorFullName: authData.firstName,
      reactorUsername: authData.username,
      listingID: postId,
      uniqueId: authData.uniqueId,
      reaction: "negative"
    };
    axios.post(`${BASE_URL}/reaction/feed/post`, config).then((res) => {
      if (res.data.message === "Successfully 'thumbed-down' the comment!") {
          console.log("Successfully 'thumbed-down' the comment!", res.data);

          const { feedMatch } = res.data;

          const match = state.posts.findIndex(dataaa => dataaa.id === feedMatch.id);
          const copy = [...state.posts];
          copy[match] = feedMatch;

          setState(prevState => {
            return {
              ...prevState,
              posts: copy
            }
          });

          Toast.show({
            type: 'success',
            text1: "Successfully ADDED 'thumbs-down' reaction...",
            text2: "Successfully added your 'thumbs-down' reaction to this feed-post!",
            visibilityTime: 4250,
            position: "bottom"
          });
      } else if (res.data.message === "Successfully removed-previous 'thumbed-down' the comment!") {
        console.log("Successfully removed-previous 'thumbed-down' the comment!", res.data);

        const { feedMatch } = res.data;

        const match = state.posts.findIndex(dataaa => dataaa.id === feedMatch.id);
        const copy = [...state.posts];
        copy[match] = feedMatch;

        setState(prevState => {
          return {
            ...prevState,
            posts: copy
          }
        });
        
        Toast.show({
          type: 'info',
          text1: 'Successfully REMOVED your previous reaction...',
          text2: "Successfully removed your 'thumbs-down' reaction to this feed-post!",
          visibilityTime: 4250,
          position: "bottom"
        });
      } else if (res.data.message === "Can't react any further with this user's post - max reaction reached.") {

        const { feedMatch } = res.data;

        const match = state.posts.findIndex(dataaa => dataaa.id === feedMatch.id);
        const copy = [...state.posts];
        copy[match] = feedMatch;

        setState(prevState => {
          return {
            ...prevState,
            posts: copy
          }
        });

        Toast.show({
          type: 'error',
          text1: `You've already reacted too many times to this user!`,
          text2: "You've already reacted too many times with this specific user, no more actions can be taken point-wise.",
          visibilityTime: 4250,
          position: "bottom"
        });
      } else {
          console.log("errrorrrrrr", res.data);

          Toast.show({
            type: 'error',
            text1: 'Successfully removed your previous reaction...',
            text2: "An unknown error has occurred while processing your request, please try this action again or contact support if the problem persists!",
            visibilityTime: 4250,
            position: "bottom"
          });
      }
    }).catch((err) => {
        console.log(err.message);
    })
  }

  const positiveLikeReaction = (postId) => {
    console.log("positiveLikeReaction clicked/ran...", postId);

    const config = {
      reactorFullName: authData.firstName,
      reactorUsername: authData.username,
      listingID: postId,
      uniqueId: authData.uniqueId,
      reaction: "positive"
    };
    axios.post(`${BASE_URL}/reaction/feed/post`, config).then((res) => {
      if (res.data.message === "Successfully 'thumbed-up' the comment!") {
          console.log("Successfully 'thumbed-up' the comment!", res.data);

          const { feedMatch } = res.data;

          const match = state.posts.findIndex(dataaa => dataaa.id === feedMatch.id);
          const copy = [...state.posts];
          copy[match] = feedMatch;

          setState(prevState => {
            return {
              ...prevState,
              posts: copy
            }
          });

          Toast.show({
            type: 'success',
            text1: "Successfully ADDED 'thumbs-up' reaction...",
            text2: "Successfully added your 'thumbs-up' reaction to this feed-post!",
            visibilityTime: 4250,
            position: "bottom"
          });
      } else if (res.data.message === "Successfully removed-previous 'thumbed-up' the comment!") {
        console.log("Successfully removed-previous 'thumbed-down' the comment!", res.data);

        const { feedMatch } = res.data;

        const match = state.posts.findIndex(dataaa => dataaa.id === feedMatch.id);
        const copy = [...state.posts];
        copy[match] = feedMatch;

        setState(prevState => {
          return {
            ...prevState,
            posts: copy
          }
        });
        
        Toast.show({
          type: 'info',
          text1: 'Successfully REMOVED your previous reaction...',
          text2: "Successfully removed your 'thumbs-up' reaction to this feed-post!",
          visibilityTime: 4250,
          position: "bottom"
        });
      } else if (res.data.message === "Can't react any further with this user's post - max reaction reached.") {

        const { feedMatch } = res.data;

        const match = state.posts.findIndex(dataaa => dataaa.id === feedMatch.id);
        const copy = [...state.posts];
        copy[match] = feedMatch;

        setState(prevState => {
          return {
            ...prevState,
            posts: copy
          }
        });

        Toast.show({
          type: 'error',
          text1: `You've already reacted too many times to this user!`,
          text2: "You've already reacted too many times with this specific user, no more actions can be taken point-wise.",
          visibilityTime: 4250,
          position: "bottom"
        });
      } else {
          console.log("errrorrrrrr", res.data);

          Toast.show({
            type: 'error',
            text1: 'Successfully removed your previous reaction...',
            text2: "An unknown error has occurred while processing your request, please try this action again or contact support if the problem persists!",
            visibilityTime: 4250,
            position: "bottom"
          });
      }
    }).catch((err) => {
        console.log(err.message);
    })
  }

  const renderItem = (item, index) => {
    const reordered = item.files.map(data => data.location);

    console.log("reordered", item.captionText === "The dog went to the park and the walk was clever indeed!!" ? reordered : "Unknown");
    
    const { hashtags, captionText, likes, dislikes, posterUsername, postedName, filteredIndexMask } = item;

    if (index  % 3 == 0 && index !== 0) {
      return (
        <Fragment>
          <TouchableOpacity
            style={colorSchemeDark ? [styles.containCustom, { shadowColor: colors.border, paddingVertical: 10, borderBottomColor: "#fff" }] : [styles.containCustom, { shadowColor: colors.border, paddingVertical: 10, borderBottomColor: "#000" }]}
            onPress={() => {
              if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                navigation.navigate("ViewIndividualFeedItem", { item })
              } else {
                Toast.show({
                    type: 'info',
                    text1: 'You must sign-in/up first...',
                    text2: `Please login/signup before accessing these features...`,
                    visibilityTime: 4250,
                    position: "bottom"
                });
              }
            }}
            activeOpacity={0.9}>
            <View
              style={[
                styles.nameContent,
                {
                  borderBottomColor: colors.card,
                  backgroundColor: "#000",
                },
              ]}>
              <TouchableOpacity onPress={() => {
                if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                  fetchUserAndRedirect(item.postedByID);
                } else {
                  Toast.show({
                    type: 'info',
                    text1: 'You must sign-in/up first...',
                    text2: `Please login/signup before accessing these features...`,
                    visibilityTime: 4250,
                    position: "bottom"
                  });
                }
              }}>
                <Text style={{ fontWeight: "bold" }} body2 whiteColor semibold>
                  {`${postedName} ~ @${posterUsername}`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.farRightText}>
                <Text semibold style={styles.commentText}>{item.comments.length} Comment(s)</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[styles.mainContent, {backgroundColor: "#000"}]}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text caption2 whiteColor>
                  {"Posted"}
                </Text>
                <Text body1 whiteColor semibold>
                  {moment(item.creationDate).format("MM-DD ~ HH:mm A")}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text caption2 whiteColor>
                  {"Likes/Dislikes"}
                </Text>
                <Text body1 whiteColor semibold>
                <Text style={{ color: "lightgreen" }}>{likes}</Text> / <Text style={{ color: "red" }}>{dislikes}</Text>
                </Text>
              </View>
            </View>
            <View style={[styles.validContent, {backgroundColor: colors.card, minHeight: 50 }]}>
              <Text semibold style={{ marginTop: 7.25 }}>
                {(captionText).slice(0, 225)}{typeof captionText !== "undefined" && captionText.length >= 225 ? "..." : ""} 
              </Text>
            </View>
            <View style={[styles.centered, { maxHeight: 550 }]}>
              <SliderBox
                sliderBoxHeight={500}
                onCurrentImagePressed={index => {
                  if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                    navigation.navigate("ViewIndividualFeedItem", { item })
                  } else {
                    Toast.show({
                        type: 'info',
                        text1: 'You must sign-in/up first...',
                        text2: `Please login/signup before accessing these features...`,
                        visibilityTime: 4250,
                        position: "bottom"
                    });
                  }
                }}
                parentWidth={width} 
                images={reordered} 
                resizeMode={"cover"}
                style={styles.bottomImage}
              />
            </View>
            <View style={[styles.bottomRow, { marginBottom: 10 }]}>
              <View style={styles.leftCol}>
                <View style={styles.rowCentered}>
                  <TouchableOpacity onPress={() => {
                    if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                      positiveLikeReaction(item.id);
                    } else {
                      Toast.show({
                          type: 'info',
                          text1: 'You must sign-in/up first...',
                          text2: `Please login/signup before accessing these features...`,
                          visibilityTime: 4250,
                          position: "bottom"
                      });
                    }
                  }}>
                    <Image resizeMode='contain' source={require("../../assets/icons/like.png")} style={colorSchemeDark ? [styles.iconCustom, { marginLeft: 7.25 }] : [styles.iconCustom, { marginLeft: 7.25 }]} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                      dislikeReaction(item.id);
                    } else {
                      Toast.show({
                          type: 'info',
                          text1: 'You must sign-in/up first...',
                          text2: `Please login/signup before accessing these features...`,
                          visibilityTime: 4250,
                          position: "bottom"
                      });
                    }
                  }}>
                    <Image resizeMode='contain' source={require("../../assets/icons/disliked.png")} style={colorSchemeDark ? [styles.iconCustom, { marginLeft: 7.25 }] : [styles.iconCustom, { marginLeft: 7.25 }]} />
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={() => viewCommentsAdd(item.id)}>
                    <Image resizeMode='contain' source={require("../../assets/icons/comments.png")} style={colorSchemeDark ? [styles.iconCustom, { tintColor: "#fff" }] : [styles.iconCustom, { tintColor: "#000" }]} />
                  </TouchableOpacity> */}
                  {/* <TouchableOpacity onPress={() => handleSendShare(item.id)}>
                    <Image resizeMode='contain' source={require("../../assets/icons/send-64.png")} style={colorSchemeDark ? [styles.iconCustomSmaller, { tintColor: "#fff" }] : [styles.iconCustom, { tintColor: "#000" }]} />
                  </TouchableOpacity> */}
                </View>
              </View>
              {/* <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => handleSendShare()}>
                <Image resizeMode='contain' source={require("../../assets/icons/bookmark.png")} style={colorSchemeDark ? [styles.iconCustom, { tintColor: "#fff" }] : [styles.iconCustom, { tintColor: "#000" }]} />
              </TouchableOpacity> */}
            </View>
            <View style={[styles.bottomRow, { flexWrap: 'wrap' }]}>
              {typeof hashtags !== "undefined" && hashtags.length > 0 ? hashtags.map((hashtag, index) => {
                return (
                  <Tag
                    key={'service' + index}
                    icon={
                      <Icon
                        name={"hashtag"}
                        size={12}
                        color={colors.accent}
                        solid
                        style={{marginRight: 5}}
                      />
                    }
                    chip
                    style={{
                      marginTop: 5,
                      marginRight: 5,
                    }}>
                    {hashtag}
                  </Tag>
                );
              }) : <Text style={colorSchemeDark ? { color: "#fff", fontWeight: "bold", margin: 7.25 } : { color: "#000", fontWeight: "bold", margin: 7.25 }}>No HashTag's Provided...</Text>}
            </View> 
          </TouchableOpacity>
          <RectangeCenteredBannerRender />
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <TouchableOpacity
            style={colorSchemeDark ? [styles.containCustom, { shadowColor: colors.border, paddingVertical: 10, borderBottomColor: "#fff" }] : [styles.containCustom, { shadowColor: colors.border, paddingVertical: 10, borderBottomColor: "#000" }]}
            onPress={() => {
              if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                navigation.navigate("ViewIndividualFeedItem", { item })
              } else {
                Toast.show({
                    type: 'info',
                    text1: 'You must sign-in/up first...',
                    text2: `Please login/signup before accessing these features...`,
                    visibilityTime: 4250,
                    position: "bottom"
                });
              }
            }}
            activeOpacity={0.9}>
            <View
              style={[
                styles.nameContent,
                {
                  borderBottomColor: colors.card,
                  backgroundColor: "#000",
                },
              ]}>
              <TouchableOpacity onPress={() => {
                if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                  fetchUserAndRedirect(item.postedByID);
                } else {
                  Toast.show({
                    type: 'info',
                    text1: 'You must sign-in/up first...',
                    text2: `Please login/signup before accessing these features...`,
                    visibilityTime: 4250,
                    position: "bottom"
                  });
                }
              }}>
                <Text style={{ fontWeight: "bold" }} body2 whiteColor semibold>
                  {`${postedName} ~ @${posterUsername}`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.farRightText}>
                <Text semibold style={styles.commentText}>{item.comments.length} Comment(s)</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[styles.mainContent, {backgroundColor: "#000"}]}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text caption2 whiteColor>
                  {"Posted"}
                </Text>
                <Text body1 whiteColor semibold>
                  {moment(item.creationDate).format("MM-DD ~ HH:mm A")}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text caption2 whiteColor>
                  {"Likes/Dislikes"}
                </Text>
                <Text body1 whiteColor semibold>
                <Text style={{ color: "lightgreen" }}>{likes}</Text> / <Text style={{ color: "red" }}>{dislikes}</Text>
                </Text>
              </View>
            </View>
            <View style={[styles.validContent, {backgroundColor: colors.card, minHeight: 50 }]}>
              <Text semibold style={{ marginTop: 7.25 }}>
                {(captionText).slice(0, 225)}{typeof captionText !== "undefined" && captionText.length >= 225 ? "..." : ""} 
              </Text>
            </View>
            <View style={[styles.centered, { maxHeight: 550 }]}>
              <SliderBox
                sliderBoxHeight={500}
                onCurrentImagePressed={index => {
                  if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                    navigation.navigate("ViewIndividualFeedItem", { item })
                  } else {
                    Toast.show({
                        type: 'info',
                        text1: 'You must sign-in/up first...',
                        text2: `Please login/signup before accessing these features...`,
                        visibilityTime: 4250,
                        position: "bottom"
                    });
                  }
                }}
                parentWidth={width} 
                images={reordered} 
                resizeMode={"cover"}
                style={styles.bottomImage}
              />
            </View>
            <View style={[styles.bottomRow, { marginBottom: 10 }]}>
              <View style={styles.leftCol}>
                <View style={styles.rowCentered}>
                  <TouchableOpacity onPress={() => {
                    if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                      positiveLikeReaction(item.id);
                    } else {
                      Toast.show({
                          type: 'info',
                          text1: 'You must sign-in/up first...',
                          text2: `Please login/signup before accessing these features...`,
                          visibilityTime: 4250,
                          position: "bottom"
                      });
                    }
                  }}>
                    <Image resizeMode='contain' source={require("../../assets/icons/like.png")} style={colorSchemeDark ? [styles.iconCustom, { marginLeft: 7.25 }] : [styles.iconCustom, { marginLeft: 7.25 }]} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    if (authData !== null && Object.keys(authData).length > 5 && _.has(authData, "uniqueId")) {
                      dislikeReaction(item.id);
                    } else {
                      Toast.show({
                          type: 'info',
                          text1: 'You must sign-in/up first...',
                          text2: `Please login/signup before accessing these features...`,
                          visibilityTime: 4250,
                          position: "bottom"
                      });
                    }
                  }}>
                    <Image resizeMode='contain' source={require("../../assets/icons/disliked.png")} style={colorSchemeDark ? [styles.iconCustom, { marginLeft: 7.25 }] : [styles.iconCustom, { marginLeft: 7.25 }]} />
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={() => viewCommentsAdd(item.id)}>
                    <Image resizeMode='contain' source={require("../../assets/icons/comments.png")} style={colorSchemeDark ? [styles.iconCustom, { tintColor: "#fff" }] : [styles.iconCustom, { tintColor: "#000" }]} />
                  </TouchableOpacity> */}
                  {/* <TouchableOpacity onPress={() => handleSendShare(item.id)}>
                    <Image resizeMode='contain' source={require("../../assets/icons/send-64.png")} style={colorSchemeDark ? [styles.iconCustomSmaller, { tintColor: "#fff" }] : [styles.iconCustom, { tintColor: "#000" }]} />
                  </TouchableOpacity> */}
                </View>
              </View>
              {/* <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => handleSendShare()}>
                <Image resizeMode='contain' source={require("../../assets/icons/bookmark.png")} style={colorSchemeDark ? [styles.iconCustom, { tintColor: "#fff" }] : [styles.iconCustom, { tintColor: "#000" }]} />
              </TouchableOpacity> */}
            </View>
            <View style={[styles.bottomRow, { flexWrap: 'wrap' }]}>
              {typeof hashtags !== "undefined" && hashtags.length > 0 ? hashtags.map((hashtag, index) => {
                return (
                  <Tag
                    key={'service' + index}
                    icon={
                      <Icon
                        name={"hashtag"}
                        size={12}
                        color={colors.accent}
                        solid
                        style={{marginRight: 5}}
                      />
                    }
                    chip
                    style={{
                      marginTop: 5,
                      marginRight: 5,
                    }}>
                    {hashtag}
                  </Tag>
                );
              }) : <Text style={colorSchemeDark ? { color: "#fff", fontWeight: "bold", margin: 7.25 } : { color: "#000", fontWeight: "bold", margin: 7.25 }}>No HashTag's Provided...</Text>}
            </View> 
          </TouchableOpacity>
        </Fragment>
      );
    }
  };

  const renderEmptyListContent = () => {
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

  const fetchUserAndRedirect = (uniqueId) => {
    const configuration = {
        params: {
            postedByID: uniqueId
        }
    };

    axios.get(`${BASE_URL}/gather/one/user/restricted/data`, configuration).then((res) => {
        if (res.data.message === "Submitted gathered user's info!") {
            console.log("Submitted gathered user's info!", res.data);

            const { user } = res.data;

            navigation.navigate('Profile1', { user });
        } else {
            console.log("Err", res.data);

            Toast.show({
                type: 'error',
                text1: `An error occurred while attempting to fetch user details!`,
                text2: "We encountered an error while attempting to fetch this specific user's account details...",
                visibilityTime: 2375,
                position: "bottom"
            });
        }
    }).catch((err) => {
        console.log(err.message);

        // Toast.show({
        //     type: 'error',
        //     text1: `An error occurred while attempting to fetch user details!`,
        //     text2: "We encountered an error while attempting to fetch this specific user's account details...",
        //     visibilityTime: 2375,
        //     position: "bottom"
        // });
    });
  }

  return (
    <View style={{flex: 1}}>
      <Header
          title={"Social Feed/Exploration"}
          subTitle="Explore posts from other user's!"
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
        <FlatList
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {}}
            />
          }
          ListEmptyComponent={renderEmptyListContent}
          data={typeof state.posts !== "undefined" && state.posts.length > 0 ? state.posts.slice(state.current.start, state.current.end) : state.posts}
          onEndReachedThreshold={0.01}
          onEndReached={info => {
              if (typeof state.posts !== "undefined" && state.posts.length >= 7) {
                loadMoreResults(info);
              }
          }}
          keyExtractor={(item, index) => item.id}
          renderItem={({item, index}) => renderItem(item, index)}
        />
      </SafeAreaView>
    </View>
  );
}
const mapStateToProps = (state) => {
  return {
      authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
  }
}
export default connect(mapStateToProps, {  })(Booking);