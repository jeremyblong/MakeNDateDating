import React, {useState} from 'react';
import {View, ScrollView, ImageBackground, FlatList} from 'react-native';
import {useTranslation} from 'react-i18next';
import {BaseStyle, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Card,
  ProfileDescription,
} from '@components';
import styles from './styles';

export default function AboutUs({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [ourTeam] = useState([
    {
      id: '1',
      screen: 'Profile1',
      image: require("../../assets/images/custom/me.jpeg"),
      subName: 'CEO/Founder',
      name: "Jeremy Blong",
      description: "Founder & CEO of MakeNDate"
    }
  ]);

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('about_us')}
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
        <ScrollView style={{flex: 1}}>
          <ImageBackground source={require("../../assets/images/background_04.jpg")} style={styles.banner}>
            <Text style={{ color: "#000" }} title1 semibold blackColor>
              {t('about_us')}
            </Text>
            <Text style={{ color: "#000" }} subhead whiteColor>
              {t('sologan_about_us')}
            </Text>
          </ImageBackground>
          <View style={styles.content}>
            <Text headline semibold>
              {"What is the problem?"}
            </Text>
            <Text body2 style={{marginTop: 5, marginBottom: 12.25}}>
              Dating apps have become popular, but often fail to help people find meaningful relationships. There is a lack of face-to-face interaction, and limited time for people to get to know each other, making it difficult to create strong connections. People also often feel judged or undervalued due to the abundance of people vying for attention.
            </Text>
            <Text headline semibold>
              {"What is the solution?"}
            </Text>
            <Text body2 style={{marginTop: 5}}>
              This app uses a reward/penalty incentive model with public ranking scores & moderation systems managed by peers. It offers intimate connections with 1v1 chats, group chats, live-streaming, posting to your reel, following/followers, & IRL meetups to connect with your next forever partner. We've cultivated the first social media content-creator dating app on the market
            </Text>
            <Text headline semibold style={{marginTop: 20}}>
              {t('what_we_do').toUpperCase()}
            </Text>
            <Text body2 style={{marginTop: 5}}>
              - Social-Style Dating
            </Text>
            <Text body2 style={{marginTop: 5}}>
              - Earn Tokens For Simply Using Our App
            </Text>
            <Text body2 style={{marginTop: 5}}>
              - Inclusive Platform
            </Text>
            <Text body2 style={{marginTop: 5}}>
              - Mentorship & Guidance
            </Text>
            <Text body2 style={{marginTop: 5}}>
              - Social score/rank to guage previous interactions w/other user's
            </Text>
            <Text body2 style={{marginTop: 5}}>
              - Manipulate behavior of users in-app by rewards & penalties
            </Text>
            <Text body2 style={{marginTop: 5}}>
              - 'Stake' in-app currency for dates (if initiating) to ensure both parties show up
            </Text>
            <Text body2 style={{marginTop: 5}}>
              - Detailed & dynamic profiles w/restrictive PPV content
            </Text>
            <Text body2 style={{marginTop: 5}}>
              - Live-streaming and real-time communication services (1v1 + group)
            </Text>
            <Text body2 style={{marginTop: 5}}>
              - And many other cool features/functionality - check out the app to see our various services
            </Text>
          </View>
          <Text headline semibold style={styles.title}>
            {t('meet_our_team').toUpperCase()}
          </Text>
          <FlatList
            contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
            numColumns={2}
            data={ourTeam}
            keyExtractor={(item, index) => 'ourTeam' + index}
            renderItem={({item, index}) => (
              <Card
                image={item.image}
                onPress={() => {}}
                style={{
                  flex: 1,
                  marginLeft: 15,
                  height: 200,
                  marginBottom: 20,
                }}>
                <Text footnote whiteColor>
                  {item.subName}
                </Text>
                <Text headline whiteColor semibold numberOfLines={1}>
                  {item.name}
                </Text>
              </Card>
            )}
          />
          <Text headline semibold style={styles.title}>
            {("More Details").toUpperCase()}
          </Text>
          <View style={{paddingHorizontal: 20}}>
            {ourTeam.map((item, index) => {
              return (
                <ProfileDescription
                  key={'service' + index}
                  image={item.image}
                  name={item.name}
                  subName={item.subName}
                  description={item.description}
                  style={{marginBottom: 10}}
                  onPress={() => {}}
                />
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
