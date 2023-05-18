import React, { useState, useRef, useEffect } from 'react';
import {View, ScrollView, ImageBackground, Dimensions } from 'react-native';
import {SafeAreaView, Text, Button, Image} from '@components';
import styles from './styles';
import Swiper from 'react-native-swiper';
import {BaseColor, BaseStyle, useTheme} from '@config';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';
import ActionSheet from 'react-native-actionsheet';
import { useNavigation } from '@react-navigation/native';
import { connect } from "react-redux";
import _ from "lodash";

const { width, height } = Dimensions.get("window");

console.log("height", height);

const Walkthrough = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [slide] = useState([
    {key: 1, image: require("../../assets/images/custom/dating-4.jpg"), textVal: "Find Your Perfect Match Today!" },
    {key: 2, image: require("../../assets/images/custom/dating-1.jpg"), textVal: "Make New Friend's & Experiences" },
    {key: 3, image: require("../../assets/images/custom/dating-3.jpg"), textVal: "EARN MONEY while dating/exploring our marketplace!" },
    {key: 4, image: require("../../assets/images/custom/dating-2.jpg"), textVal: "Community, camaraderie & connection at its finest!" },
  ]);
  const { colors, theme } = useTheme();
  const {t} = useTranslation();
  const actionSheetRef = useRef(null);
  const colorSchemeDark = theme.dark;

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'left', 'bottom']}>
      <ActionSheet
        ref={actionSheetRef}
        title={`Select which account type you'd like to create...`}
        options={['Normal Dating Account', 'Therapist/Mentorship Account', "Cancel/Close Pane"]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => {
          switch (index) {
              case 0:
                  navigation.navigate("RegisterNewAccount")
                  break;
              case 1:
                  navigation.navigate("RegisterTherapistAccountType")
                  break;
              default: 
                  break;
          }
        }}
      />
      <ImageBackground imageStyle={{ opacity: 0.375 }} source={require("../../assets/images/custom/design-2.png")} style={styles.linearGradient}>
        <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.contain}
          style={{ flex: 1 }}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={(contentWidth, contentHeight) =>
            setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
          }>
          <View style={styles.wrapper}>
            {/* Images Swiper */}
            <Swiper
              dotStyle={{
                backgroundColor: BaseColor.dividerColor,
              }}
              activeDotColor={colors.primary}
              paginationStyle={styles.contentPage}
              removeClippedSubviews={false}>
              {slide.map((item, index) => {
                return (
                  <View style={styles.slide} key={item.key}>
                    <Image source={item.image} style={styles.img} />
                    <Text body1 style={[styles.textSlide, { textAlign: "center" }]}>
                      {item.textVal}
                    </Text>
                  </View>
                );
              })}
            </Swiper>
          </View>
            <View style={{width: '100%', height: 250 }}>
              <Button
                full
                style={{ marginTop: 20, backgroundColor: colors.accent }}
                onPress={() => actionSheetRef.current.show()}>
                {"Sign Up!"}
              </Button>
              <Button
                full
                style={{marginTop: 20}}
                loading={loading}
                onPress={() => navigation.navigate('SignIn')}>
                {t('sign_in')}
              </Button>
              <View style={styles.contentActionBottom}>
                {/* <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text body1 blackColor>
                    {t('not_have_account')}
                  </Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => actionSheetRef.current.show()}>
                  <Text body1 accentColor>
                    {t('join_now')}
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>
            {height <= 825 ? null : <View style={[styles.absoluteLogo]}>
              <Image resizeMode={"cover"} source={require("../../assets/images/makendate-pretty.png")} style={[styles.logoIcon, { backgroundColor: "#000", borderWidth: 2.5, borderColor: colors.accent }]} />
            </View>}
        </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
const mapStateToProps = state => {
  return {}
}
export default connect(mapStateToProps, { })(Walkthrough);