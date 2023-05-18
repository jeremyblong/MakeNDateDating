import React, { useState, Fragment, useCallback, useRef, useEffect } from 'react';
import { View, Image, useColorScheme, TouchableOpacity, Dimensions, ScrollView, TextInput, Keyboard } from 'react-native';
import { useTheme} from '@config';
import {Header, Text, Tag, Icon} from '@components';
import styles from './indexStyles.js';
import moment from 'moment';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from "axios";
import { BASE_URL, BASE_ASSET_URL } from "@env";
import { SliderBox } from "react-native-image-slider-box";
import { connect } from "react-redux";
import _ from "lodash";
import Toast from 'react-native-toast-message';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import SendPrivateMessagePaneFeedPost from "./Panes/messagingPane.js";
import RBSheet from "react-native-raw-bottom-sheet";

const { width, height } = Dimensions.get("window");

const RenderIndividualViewPagePostFeed = (props) => {

    const { item } = props.route.params;
    const authData = props.authData;

    const leaveNewCommentRBRef = useRef(null);
    const navigation = useNavigation();
    const {colors, theme} = useTheme();
    const cardColor = colors.card;
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        post: null,
        ready: false,
        comments: []
    })

    const fetchCommentsToAddProfilePic = (passedComments) => {

        const promises = [];
    
        if (typeof passedComments !== "undefined" && passedComments.length > 0) {
            for (let idxxxxx = 0; idxxxxx < passedComments.length; idxxxxx++) {
                const previousCommentOBJ = passedComments[idxxxxx];
                
                const { postedByID } = previousCommentOBJ;
    
                if (typeof previousCommentOBJ.subcomments !== "undefined" && previousCommentOBJ.subcomments.length > 0) {
    
                    for (let idxxxxx = 0; idxxxxx < previousCommentOBJ.subcomments.length; idxxxxx++) {
                        const nestedSubcomment = previousCommentOBJ.subcomments[idxxxxx];
    
                        console.log("nestedSubcomment", nestedSubcomment);
    
                        promises.push(new Promise((resolve, reject) => {
                            // update comments state
                            const config = {
                                params: {
                                    postedByID: nestedSubcomment.postedByID
                                }
                            };
                            axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
                                if (res.data.message === "Submitted gathered user's picture/file!") {
        
                                    const { user } = res.data; 
            
                                    nestedSubcomment["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
            
                                    resolve(previousCommentOBJ);
                                } else {
            
                                    nestedSubcomment["lastProfilePic"] = null;
            
                                    resolve(previousCommentOBJ);
                                }
                            }).catch((err) => {
                                nestedSubcomment["lastProfilePic"] = null;
            
                                resolve(previousCommentOBJ);
                            })
                        }));
                    }
    
                } else {
                    promises.push(new Promise((resolve, reject) => {
                        // update comments state
                        const config = {
                            params: {
                                postedByID: postedByID
                            }
                        };
                        axios.get(`${BASE_URL}/gather/only/profile/picture/with/id`, config).then((res) => {
                            if (res.data.message === "Submitted gathered user's picture/file!") {
    
                                const { user } = res.data; 
        
                                previousCommentOBJ["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
        
                                resolve(previousCommentOBJ);
                            } else {
        
                                previousCommentOBJ["lastProfilePic"] = null;
        
                                resolve(previousCommentOBJ);
                            }
                        }).catch((err) => {
                            previousCommentOBJ["lastProfilePic"] = null;
        
                            resolve(previousCommentOBJ);
                        })
                    }));
                }
            };
    
            Promise.all(promises).then((passedValues) => {
    
                console.log("Promise passedValues passedValues passedValues passedValues....:", passedValues);
    
                setState(prevState => {
                    return {
                        ...prevState,
                        comments: passedValues
                    }
                })
            });
        } else {
            console.log("NO comments available...!");
        }
    }
    
    useEffect(() => {
        console.log("Effect subcomments-related re-mounted...");
    
        fetchCommentsToAddProfilePic(state.comments);
    
    }, [...state.comments.map((comment) => {
        return comment.id;
    })])
    

    useFocusEffect(
        useCallback(() => {

            fetchCommentsToAddProfilePic(item.comments);

            setState(prevState => {
                return {
                ...prevState,
                    post: item,
                    ready: true,
                    comments: item.comments
                }
            });
    }, []));

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
    
                setState(prevState => {
                    return {
                    ...prevState,
                        post: feedMatch
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
    
                setState(prevState => {
                    return {
                    ...prevState,
                        post: feedMatch
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
    
                setState(prevState => {
                    return {
                    ...prevState,
                        post: feedMatch
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
    
                setState(prevState => {
                    return {
                    ...prevState,
                        post: feedMatch
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
    
                setState(prevState => {
                    return {
                    ...prevState,
                        post: feedMatch
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
    
                setState(prevState => {
                    return {
                    ...prevState,
                        post: feedMatch
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
    const handleSendShare = (postId) => {
        console.log("handleCommentAddition clicked/ran...", postId);
    }
    const viewCommentsAdd = (postId) => {
        console.log("viewCommentsAdd clicked/ran...", postId);
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

    const reordered = item.files.map(data => data.location);
    const { hashtags, captionText, likes, dislikes, posterUsername, postedName } = item;

    if (state.ready) {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 62.25 }}>
                <RBSheet
                    ref={leaveNewCommentRBRef}
                    height={height}
                    openDuration={250}
                    draggable={false}
                    closeOnDragDown={true}
                    customStyles={{
                        container: {
                            paddingHorizontal: 20,
                        },
                        draggableIcon: {
                            width: width * 0.725
                        }
                    }}
                >
                    {Object.values(authData).length >= 5 ? <SendPrivateMessagePaneFeedPost setMainState={setState} itemData={item} authData={authData} sendCommentRef={leaveNewCommentRBRef} /> : null}
                </RBSheet>
                <Header
                    title={"Individual Post"}
                    subTitle="Viewing Individual Feed Post"
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
                <View
                    style={[ styles.containCustom, { shadowColor: colors.border, paddingVertical: 10 }]}
                    onPress={() => navigation.navigate("ViewIndividualFeedItem", { item })}
                    activeOpacity={0.9}
                >
                <View
                    style={[
                    styles.nameContent,
                        {
                            borderBottomColor: colors.card,
                            backgroundColor: "#000"
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
                    style={[styles.mainContent, { backgroundColor: "#000" }]}>
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
                    <Text style={{ color: "green" }}>{likes}</Text> / <Text style={{ color: "red" }}>{dislikes}</Text>
                    </Text>
                    </View>
                </View>
                <View style={[styles.validContent, {backgroundColor: colors.card, minHeight: 50 }]}>
                    <Text semibold style={{ marginTop: 7.25 }}>
                    {(captionText).slice(0, 225)}{typeof captionText !== "undefined" && captionText.length >= 225 ? "..." : ""} 
                    </Text>
                </View>
                </View>
                <View style={[styles.centered, { maxHeight: 550 }]}>
                <SliderBox
                    sliderBoxHeight={500}
                    onCurrentImagePressed={index =>
                        console.warn(`image ${index} pressed`)
                    }
                    parentWidth={width} 
                    images={reordered} 
                    style={styles.bottomImage}
                />
                </View>
                <View style={[styles.bottomRow, { marginBottom: 10 }]}>
                <View style={styles.leftCol}>
                    <View style={styles.rowCentered}>
                    <TouchableOpacity onPress={() => positiveLikeReaction(item.id)}>
                        <Image resizeMode='contain' source={require("../../../assets/icons/like.png")} style={colorSchemeDark ? [styles.iconCustom, { marginLeft: 7.25 }] : [styles.iconCustom, { marginLeft: 7.25 }]} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => dislikeReaction(item.id)}>
                        <Image resizeMode='contain' source={require("../../../assets/icons/disliked.png")} style={colorSchemeDark ? [styles.iconCustom, { marginLeft: 7.25 }] : [styles.iconCustom, { marginLeft: 7.25 }]} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => viewCommentsAdd(item.id)}>
                        <Image resizeMode='contain' source={require("../../../assets/icons/comments.png")} style={colorSchemeDark ? [styles.iconCustom, { tintColor: "#fff" }] : [styles.iconCustom, { tintColor: "#000" }]} />
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity onPress={() => handleSendShare(item.id)}>
                        <Image resizeMode='contain' source={require("../../../assets/icons/send-64.png")} style={colorSchemeDark ? [styles.iconCustomSmaller, { tintColor: "#fff" }] : [styles.iconCustom, { tintColor: "#000" }]} />
                    </TouchableOpacity> */}
                    </View>
                </View>
                <TouchableOpacity style={{ position: "absolute", right: 10 }} onPress={() => handleSendShare()}>
                    <Image resizeMode='contain' source={require("../../../assets/icons/bookmark.png")} style={colorSchemeDark ? [styles.iconCustom, { tintColor: "#fff" }] : [styles.iconCustom, { tintColor: "#000" }]} />
                </TouchableOpacity>
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
                            marginRight: 5
                        }}>
                        {hashtag}
                    </Tag>
                    );
                }) : <Text style={colorSchemeDark ? { color: "#fff", fontWeight: "bold", margin: 7.25 } : { color: "#000", fontWeight: "bold", margin: 7.25 }}>No HashTag's Provided...</Text>}
                </View>
                <Text style={styles.labeled}>Drop a comment (click the box below)...</Text>
                {Object.values(authData).length >= 5 ? <TextInput
                    onFocus={() => {
                        Keyboard.dismiss();
                        leaveNewCommentRBRef.current.open()
                    }}
                    style={colorSchemeDark ? { color: "#fff", margin: 15, left: -(width * 0.0325 ) } : { margin: 15, left: -(width * 0.0325 ), color: "#000" }}
                    placeholderTextColor={colorSchemeDark ? "#fff" : "#000"}
                    secureTextEntry={false}
                    placeholder={"Tap to open comment submission settings..."}
                /> : null}
                <View style={{ margin: 12.25 }}>
                {typeof state.comments !== "undefined" && state.comments.length > 0 ? state.comments.map((comment, index) => {
                    const { postedDate, subject, postedBy, postedByID, postedByUsername, id } = comment;
                    return (
                        <Fragment key={index}>
                            <View style={[styles.containMapped, {backgroundColor: cardColor}]}>
                                <View style={{flexDirection: 'row', marginBottom: 10}}>
                                    <View style={styles.contentLeft}>
                                    <Image source={{ uri: typeof comment.lastProfilePic !== "undefined" && comment.lastProfilePic !== null ? `${BASE_ASSET_URL}/${comment.lastProfilePic.link}` : `https://i.pravatar.cc/300?img=${index}` }} style={styles.thumb} />
                                    <View>
                                        <Text headline semibold numberOfLines={1}>
                                        {postedBy}
                                        </Text>
                                    </View>
                                    </View>
                                    <View style={styles.contentRight}>
                                    <Text caption2 grayColor numberOfLines={1}>
                                        {moment(postedDate).format("YYYY-MM-DD")}
                                    </Text>
                                    </View>
                                </View>
                                <View>
                                    <Text subhead semibold>
                                    {subject}
                                    </Text>
                                    <Text
                                    body2
                                    grayColor
                                    style={{
                                        marginTop: 10,
                                    }}>
                                        {comment.message}
                                    </Text>
                                </View>
                                </View>
                            </Fragment>
                        );
                    }) : <Fragment>
                        <Text style={[styles.labeled, { textAlign: "center" }]}>No Comment's Yet...</Text>  
                        <Image resizeMode='contain' source={require("../../../assets/images/custom/no-comments.png")} style={styles.maxedCommentIcon} />
                    </Fragment>}
                </View>
            </ScrollView>
        );
    } else {
        return (
            <Fragment>
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
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
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder> 
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {  })(RenderIndividualViewPagePostFeed);