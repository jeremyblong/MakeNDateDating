import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform, Image} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, TextInput, Button, Text} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from "axios";
import { BASE_URL } from "@env";
import Toast from "react-native-toast-message";

const ResetPassword = ({ navigation }) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [email, seteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({ email: true });
  
  const onReset = () => {
    if (email == '') {
      setSuccess({
        ...success,
        email: false,
      });
    } else {
      setLoading(true);

      const config = {
        email
      }

      axios.post(`${BASE_URL}/send/recovery/email/password/attempt`, config).then((res) => {
        if (res.data.message === "Successfully sent message!") {
            console.log("Successfully sent message! res.data ---- :",  res.data);

            Toast.show({
              type: 'success',
              text1: `Successfully sent the password request email!`,
              text2: "We've successfully processed your request and sent your email a reset request form.",
              visibilityTime: 3250,
              position: "bottom"
            });

            setTimeout(() => {
              setLoading(false);
              
              navigation.navigate('PasswordResetConfirmation', { email });
            }, 500);
        } else {
            console.log("Err", res.data);

            Toast.show({
              type: 'error',
              text1: `An error occurred processing your reset request!`,
              text2: "An error occurred while processing your desired request - please try again or contact support if the problem persists...",
              visibilityTime: 3250,
              position: "bottom"
            });
        }
      }).catch((err) => {
          console.log(err.message);

          // Toast.show({
          //   type: 'error',
          //   text1: `An error occurred processing your reset request!`,
          //   text2: "An error occurred while processing your desired request - please try again or contact support if the problem persists...",
          //   visibilityTime: 3250,
          //   position: "bottom"
          // });
      })
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={"Password Reset Flow"}
        subTitle={"Request email password reset..."}
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
          <View
            style={{
              flex: 1,
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Image resizeMode={"cover"} source={require("../../assets/images/forgot-password.png")} style={styles.forgottenPassword} />
              <Text style={styles.label}>Enter your account email address</Text>
              <TextInput
                onChangeText={text => seteEmail(text)}
                onFocus={() => {
                  setSuccess({
                    ...success,
                    email: true,
                  });
                }}
                placeholder={t('email_address')}
                success={success.email}
                value={email}
                selectionColor={colors.primary}
              />
              <Button
                style={{marginTop: 20}}
                full
                onPress={() => {
                  onReset();
                }}
                loading={loading}>
                {t('reset_password')}
              </Button>
            </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
export default ResetPassword;
