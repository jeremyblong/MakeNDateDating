import React, { useState, useCallback, Fragment} from 'react';
import { RefreshControl, FlatList, View, Image, useColorScheme, TouchableOpacity } from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import { CometChat } from "@cometchat-pro/react-native-chat";
import moment from "moment";
import _ from 'lodash';
import { connect } from "react-redux";
import Toast from 'react-native-toast-message';
import { TabView, TabBar } from 'react-native-tab-view';
import { useFocusEffect } from '@react-navigation/native';

const Messenger = ({navigation, authData}) => {

  const {colors, theme} = useTheme();
  const colorSchemeDark = theme.dark;
  const {t} = useTranslation();
  const [refreshing] = useState(false);
  const [ index, setIndex ] = useState(0);
  const [ conversations, setConversations ] = useState({
    individual: [],
    boostedMessages: []
  });
  const [routes] = useState([
    {key: 'privateMessages', title: "Private Msg's" },
    {key: 'boostedMessages', title: "Boosted Msg's"}
    // {key: 'review', title: t('reviews')},
  ]);

  useFocusEffect(
    useCallback(() => {

      setConversations({
        individual: [],
        boostedMessages: []
      })

      const conversationsRequest = new CometChat.ConversationsRequestBuilder().setLimit(50).setConversationType("user").build();

      if (authData !== null) {
        conversationsRequest.fetchNext().then(
          conversationList => {
            if (typeof conversationList !== "undefined" && conversationList.length > 0) {
              for (let idx = 0; idx < conversationList.length; idx++) {
                const convo = conversationList[idx];
                const promoted = _.has(conversationList[idx].lastMessage, "metadata") ? conversationList[idx].lastMessage.metadata.promoted : false;
                
                if (promoted === true) {
                  setConversations(prevState => {
                    return {
                      ...prevState,
                      boostedMessages: [...prevState.boostedMessages, convo]
                    }
                  })
                } else {
                  setConversations(prevState => {
                    return {
                      ...prevState,
                      individual: [...prevState.individual, convo]
                    }
                  })
                }
              }
            }
          },
          error => {
              console.log("Conversations list fetching failed with error:", error);
          }
        );
      } else {
        Toast.show({
          type: 'info',
          text1: 'You must sign-in/up first...',
          text2: `Please login/signup before accessing these features...`,
          visibilityTime: 4250,
          position: "bottom"
        });
      }
  }, []));

  const renderEmpty = () => {
    return (
      <View style={styles.centered}>
        <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : styles.labeled}>No messages could be fetched - be active & once you recieve a message, they'll appear here!</Text>
        <View style={styles.hrSpacer} />
        <Image source={require("../../assets/images/custom/referral.png")} style={styles.emptyHolderImage} />
      </View>
    );
  }
  const renderEmptyBoosted = () => {
    return (
      <View style={styles.centered}>
        <Text style={colorSchemeDark ? [styles.labeled, { color: "#fff" }] : styles.labeled}>No boosted messages could be fetched - once you read a 'boosted/promoted' message, they are archieved with all your other messages...</Text>
        <View style={styles.hrSpacer} />
        <Image source={require("../../assets/images/custom/referral.png")} style={styles.emptyHolderImage} />
      </View>
    );
  }
  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={[styles.indicator, {backgroundColor: colors.primary}]}
      style={[styles.tabbar, {backgroundColor: colors.background}]}
      tabStyle={styles.tab}
      inactiveColor={BaseColor.grayColor}
      activeColor={colors.text}
      renderLabel={({route, focused, color}) => (
        <View style={{flex: 1, width: 130, alignItems: 'center'}}>
          <Text headline semibold={focused} style={{color}}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );
  const handleIndexChange = index => setIndex(index);

  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'privateMessages':
        return renderMainContent();
        break;
      case 'boostedMessages':
        return renderBoostedMessages();
        break;
    }
  };
  console.log("conversations", conversations);

  const renderBoostedMessages = () => {
    if (authData !== null) {
      return (
        <Fragment>
          <FlatList
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {}}
              />
            }
            data={conversations.boostedMessages}
            ListEmptyComponent={renderEmptyBoosted}
            keyExtractor={(item, index) => item.id}
            renderItem={({item, index}) => {
              const { conversationWith, lastMessage } = item;
              console.log("BoostedMessageLast...:", lastMessage);
              return (
                <TouchableOpacity
                  style={[styles.itemMapped]}
                  onPress={() => navigation.navigate('Messages', { conversation: item })}
                  activeOpacity={0.9}>
                  <View style={[styles.contain, {borderBottomColor: colors.border}]}>
                    <Image source={{ uri: conversationWith.avatar }} style={[styles.thumbMapped]} />
                    <View style={styles.contentMapped}>
                      <View style={styles.leftMapped}>
                        <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }} headline semibold>
                          {conversationWith.name}
                        </Text>
                        <Text
                          note
                          numberOfLines={1}
                          footnote
                          grayColor
                          style={colorSchemeDark ? { color: "#fff", paddingTop: 5 } : { color: "#000", paddingTop: 5 }}>
                          {_.has(lastMessage, "data") && _.has(lastMessage.data, "attachments") ? "Image/Attachment..." : lastMessage.text}
                        </Text>
                      </View>
                      <View style={styles.rightMapped}>
                        <Text caption2 grayColor numberOfLines={1}>
                          {moment(new Date(lastMessage.sentAt * 1000)).fromNow()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <View style={styles.center}>
            <Text style={{ fontWeight: "400", top: 32.25, fontSize: 28.25, textDecorationLine: "underline" }}>Must authenticate before viewing this page/screen.</Text>
          </View>
          <View style={styles.bottomPositioned}>
            <Image source={require("../../assets/images/custom/removed-pass.png")} style={styles.noPass} />
          </View>
        </Fragment>
      );
    }
  }

  const renderMainContent = () => {
    if (authData !== null) {
      return (
        <Fragment>
          <FlatList
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {}}
              />
            }
            data={conversations.individual}
            ListEmptyComponent={renderEmpty}
            keyExtractor={(item, index) => item.id}
            renderItem={({item, index}) => {
              const { conversationWith, conversationType, name, lastMessage } = item;
              console.log("lastMessage", lastMessage);
              return (
                <TouchableOpacity
                  style={[styles.itemMapped]}
                  onPress={() => navigation.navigate('Messages', { conversation: item })}
                  activeOpacity={0.9}>
                  <View style={[styles.contain, {borderBottomColor: colors.border}]}>
                    <Image source={{ uri: conversationWith.avatar }} style={[styles.thumbMapped]} />
                    <View style={styles.contentMapped}>
                      <View style={styles.leftMapped}>
                        <Text style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }} headline semibold>
                          {conversationWith.name}
                        </Text>
                        <Text
                          note
                          numberOfLines={1}
                          footnote
                          grayColor
                          style={colorSchemeDark ? { color: "#fff", paddingTop: 5 } : { color: "#000", paddingTop: 5 }}>
                          {_.has(lastMessage, "data") && _.has(lastMessage.data, "attachments") ? "Image/Attachment..." : lastMessage.text}
                        </Text>
                      </View>
                      <View style={styles.rightMapped}>
                        <Text caption2 grayColor numberOfLines={1}>
                          {moment(new Date(lastMessage.sentAt * 1000)).fromNow()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }}
          />
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <View style={styles.center}>
            <Text style={{ fontWeight: "400", top: 32.25, fontSize: 28.25, textDecorationLine: "underline" }}>Must authenticate before viewing this page/screen.</Text>
          </View>
          <View style={styles.bottomPositioned}>
            <Image source={require("../../assets/images/custom/removed-pass.png")} style={styles.noPass} />
          </View>
        </Fragment>
      );
    }
  }
  return (
    <View style={{flex: 1}}>
      <Header
        title={t('Message Thread(s)')}
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
        <TabView
          lazy
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={handleIndexChange}
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
export default connect(mapStateToProps, {  })(Messenger);