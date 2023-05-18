import React, {useState, useCallback} from 'react';
import {View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
} from '@components';
import styles from './styles';
import {UserData} from '@data';
import {useTranslation} from 'react-i18next';
import { connect } from "react-redux";
import axios from "axios";
import { BASE_ASSET_URL, BASE_URL } from "@env";
import { useFocusEffect } from '@react-navigation/native';
import _ from "lodash";

const ProfileEdit = ({navigation, authenticatedData}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [id, setId] = useState(UserData[0].id);
  const [name, setName] = useState(UserData[0].name);
  const [email, setEmail] = useState(UserData[0].email);
  const [address, setAddress] = useState(UserData[0].address);
  const [image] = useState(UserData[0].image);
  const [loading, setLoading] = useState(false);
  const [ user, setUser ] = useState(null);
  const [ bio, setBio ] = useState("");

  useFocusEffect(
    useCallback(() => {
      const config = {
        params: {
          uniqueId: authenticatedData.uniqueId,
          accountType: authenticatedData.accountType
        }
      }
      axios.get(`${BASE_URL}/gather/user/profile`, config).then((res) => {
          if (res.data.message === "Successfully gathered profile!") {
              console.log("Successfully gathered profile!", res.data);
  
              const { user } = res.data;
  
              setUser(user);
          } else {
              console.log("Err", res.data);
          }
      }).catch((err) => {
          console.log(err.message);
      })
  }, []));

  console.log("user", user);

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('edit_profile')}
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
        onPressRight={() => {}}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.contain}>
            <TouchableOpacity onPress={() => {}}>
              <Image source={user === null ? image : { uri: `${BASE_ASSET_URL}/${user.profilePictures[user.profilePictures.length - 1].link}` }} style={styles.thumb} />
            </TouchableOpacity>
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('account')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setId(text)}
              placeholder={t('input_id')}
              value={id}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('name')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setName(text)}
              placeholder={t('input_name')}
              value={name}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('email')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setEmail(text)}
              placeholder={t('input_email')}
              value={email}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('Bio/About-Me')}
              </Text>
            </View>
            <View style={[BaseStyle.textInputfloater, {backgroundColor: "#EEE"}]}>
              <TextInput
                placeholder={"Enter your bio/desc here..."}
                placeholderTextColor={"grey"}
                value={bio}
                maxLength={375}
                style={styles.containerStyle}
                onBlur={() => {}}
                containerStyle={{ }}
                multiline={true}
                numberOfLines={3}
                onChangeText={value => {
                  setBio(value);
                }}
            />
            </View>
          </ScrollView>
          <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
            <Button
              loading={loading}
              full
              onPress={() => {
                setLoading(true);
                setTimeout(() => {
                  navigation.goBack();
                }, 500);
              }}>
              {t('confirm all changes')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
const mapStateToProps = (state) => {
	return {
    authenticatedData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
	}
}
export default connect(mapStateToProps, { })(ProfileEdit);