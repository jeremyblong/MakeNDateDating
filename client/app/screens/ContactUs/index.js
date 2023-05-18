import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {useTranslation} from 'react-i18next';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import styles from './styles';
import axios from "axios";
import { BASE_URL } from "@env";
import Toast from 'react-native-toast-message';

const ContactUs = ({navigation}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [ subject, setSubject ] = useState('');
  const [loading, setLoading] = useState(false);
  const [region] = useState({
    latitude: 34.052235,
    longitude: -118.243683,
    latitudeDelta: 0.095,
    longitudeDelta: 0.9,
  });

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const onSubmit = () => {
    if ((typeof name !== "undefined" && name.length > 0) && (typeof email !== "undefined" && email.length > 0) && (validateEmail(email)) && (typeof subject !== "undefined" && subject.length > 0)  && (typeof message !== "undefined" && message.length > 0) ) {
      const config = {
        name, 
        email, 
        subject, 
        message
      };
  
      axios.post(`${BASE_URL}/contact/general`, config).then((res) => {
          const { message } = res.data;
  
          if (message === "Successfully sent message!") {
              console.log("Successfully sent message! ---- : ", res.data);

              Toast.show({
                type: 'success',
                text1: `Successfully sent email!`,
                text2: `Give us 1-2 business days to circle back with you - your form was submitted successfully!`,
                visibilityTime: 3250,
                position: "bottom",
                onHide: () => {
                  navigation.goBack();
                }
              });
          } else {
              console.log("err", res.data);
          }
      }).catch((err) => {
          console.log("err", err);
      })
    } else {
      Toast.show({
        type: 'error',
        text1: `You must complete each field before proceeding!`,
        text2: `You MUST complete each/every field before proceeding - please double check each entry to make sure they're correct.`,
        visibilityTime: 3250,
        position: "bottom"
      });
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('contact_us')}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingHorizontal: 20}}>
            <View style={{height: 180, width: '100%'}}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onRegionChange={() => {}}>
                <Marker
                  coordinate={{
                    latitude: 34.052235,
                    longitude: -118.243683,
                  }}
                />
              </MapView>
            </View>
            <Text headline style={{marginVertical: 10}}>
              {t('contact_details')}
            </Text>
            <TextInput
              onChangeText={text => setName(text)}
              placeholder={t('name')}
              value={name}
            />
            <TextInput
              onChangeText={text => setSubject(text)}
              placeholder={'Subject'}
              value={subject}
              style={{ marginTop: 12.75 }}
            />
            <TextInput
              style={{ marginTop: 12.75 }}
              onChangeText={text => setEmail(text)}
              placeholder={t('email')}
              keyboardType="email-address"
              value={email}
            />
            <TextInput
              style={{marginTop: 12.75, height: 225}}
              onChangeText={text => setMessage(text)}
              textAlignVertical="top"
              multiline={true}
              placeholder={t('message')}
              value={message}
            />
          </ScrollView>
          <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
            <Button
              loading={loading}
              full
              onPress={() => {
                onSubmit();
              }}>
              {t('send')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
export default ContactUs;