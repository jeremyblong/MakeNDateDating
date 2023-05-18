import React, {useState} from 'react';
import {FlatList, RefreshControl, View, TouchableOpacity, Image} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function More({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [refreshing] = useState(false);
  const [screen] = useState([
    {
      screen: 'PostNewFeedItems',
      icon: require("../../assets/icons/dating-icons/Profile.png"),
      title: 'Post New Feed Item(s)',
    },
    {
      screen: 'CreateNewGroupMeetup',
      icon: require("../../assets/icons/dating-icons/DatingApp.png"),
      title: 'Create A New Meet-Up',
    },
    // {
    //   screen: 'ProfileExample',
    //   icon: 'users',
    //   title: '8 User Profiles',
    // },
    {
      screen: 'AboutUs',
      icon: require("../../assets/icons/dating-icons/Help.png"),
      title: 'About Us',
    },
    {
      screen: 'ContactUs',
      icon: require("../../assets/icons/dating-icons/Call.png"),
      title: 'Contact Us',
    },
    {
      screen: 'OpenSupportTicket',
      icon: require("../../assets/icons/dating-icons/Report.png"),
      title: 'Open Support Ticket/Inquiry',
    },
    {
      screen: 'ChatGPTSuggestionsMain',
      icon: require("../../assets/icons/dating-icons/LoveLetter.png"),
      title: 'ChatGPT Chat Suggestion(s)',
    },
    // {
    //   screen: 'PricingTable',
    //   icon: 'dollar-sign',
    //   title: 'Pricing Table',
    // },
    // {
    //   screen: 'Review',
    //   icon: 'comments',
    //   title: 'User Reviews',
    // },
    {
      screen: 'Notification',
      icon: require("../../assets/icons/dating-icons/Notification.png"),
      title: 'Notification List',
    },
    // {
    //   screen: 'CommerceClothingMainView',
    //   icon: 'user',
    //   title: 'Buy Used Underwear & Clothing!',
    // },
    // {
    //   screen: 'NotFound',
    //   icon: 'wrench',
    //   title: 'Pange Not Found',
    // },
  ]);

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('more')}
        subTitle="More Navigational Options..."
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
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {}}
            />
          }
          data={screen}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={[styles.item, {borderBottomColor: colors.border}]}
              onPress={() => navigation.navigate(item.screen)}>
              <View style={{flexDirection: 'row'}}>
                <Image source={item.icon} style={{ width: 18, height: 18, maxHeight: 18, maxWidth: 18, marginHorizontal: 18 }}/>
                <Text body1>{item.title}</Text>
              </View>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                enableRTL={true}
              />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
