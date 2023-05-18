import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView, Image} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {useTranslation} from 'react-i18next';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import styles from './styles';
import DialogInput from 'react-native-dialog-input';
import Toast from 'react-native-toast-message';
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@env";
import _ from "lodash";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
                    
const ChangePassword = ({navigation, authData}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const {colors} = useTheme();
  const [ sidState, setSidState ] = useState("");
  const [ dialog, setDialog ] = useState(false);
  const [ initialPassword, setInitialPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");

  const handlePasswordChange = (code) => {
    console.log("handlePasswordChange clicked/ran...");
    
    const config = {
      uniqueId: authData.uniqueId,
      code,
      sid: sidState,
      password: confirmPassword,
      accountType: authData.accountType
    }

    axios.post(`${BASE_URL}/code/submisson/password/change`, config).then((res) => {
        if (res.data.message === "Successfully Verified!") {
            console.log("resdata", res.data);

            setDialog(false);

            Toast.show({
              type: 'success',
              text1: `Password was re-set!`,
              text2: `Your desired password was reset, we've successfully updated/changed your desired new password.`,
              visibilityTime: 4250,
              position: "bottom",
              onHide: () => {
                navigation.goBack();
              }
          });
        } else {
            console.log("errrorrrrrr", res.data);

            setDialog(false);

            Toast.show({
                type: 'error',
                text1: `Password was NOT reset...`,
                text2: `We've experienced an error while processing your desired password change - please try this action again.`,
                visibilityTime: 4250,
                position: "bottom",
            });
        }
    }).catch((err) => {
        console.log(err.message);

        setDialog(false);

        // Toast.show({
        //   type: 'error',
        //   text1: `Password was NOT reset...`,
        //   text2: `We've experienced an error while processing your desired password change - please try this action again.`,
        //   visibilityTime: 4250,
        //   position: "bottom"
        // });
    })
  }

  const sendCodeSubmission = () => {
    console.log("sendCodeSubmission clicked/ran...");

    const config = {
      uniqueId: authData.uniqueId,
      accountType: authData.accountType
    }

    axios.post(`${BASE_URL}/send/code/change/password/confirmation/text`, config).then((res) => {
        if (res.data.message === "Successfully executed desired logic!") {
            console.log("resdata", res.data);

            const { sid } = res.data;

            setSidState(sid);

            setDialog(true);
        } else {
            console.log("errrorrrrrr", res.data);

            Toast.show({
                type: 'error',
                text1: `An error occurred while processing your request.`,
                text2: `We've experienced an error while processing your desired password change - please try this action again.`,
                visibilityTime: 4250,
                position: "bottom",
            });
        }
    }).catch((err) => {
        console.log(err.message);

      //   Toast.show({
      //     type: 'error',
      //     text1: `An error occurred while processing your request.`,
      //     text2: `We've experienced an error while processing your desired password change - please try this action again.`,
      //     visibilityTime: 4250,
      //     position: "bottom"
      // });
    })
  }

  return (
    <View style={{flex: 1}}>
      <DialogInput isDialogVisible={dialog}
        title={"Enter your 'confirmation' code..."}
        message={"We've just texted/messaged your phone with a code, please enter it below to change your password."}
        hintInput ={"*****"}
        submitInput={ (inputText) => handlePasswordChange(inputText)}
        closeDialog={ () => {
          setDialog(false);
        }}>
      </DialogInput>
      <Header
        title={t('change_password')}
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
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, flex: 1 }} keyboardShouldPersistTaps='always'>
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                padding: 20,
              }}>
              <Image resizeMode={"cover"} source={require("../../assets/images/securepass.png")} style={styles.illustrationImage} />
              <View style={styles.contentTitle}>
                <Text headline semibold>
                  {t('password')}
                </Text>
              </View>
              <TextInput
                onChangeText={text => setInitialPassword(text)}
                secureTextEntry={true}
                maxLength={20}
                placeholder="Password (8+ Charecter Min.)"
                value={initialPassword}
              />
              <View style={styles.contentTitle}>
                <Text headline semibold>
                  {t('Re-Enter Password')}
                </Text>
              </View>
              <TextInput
                onChangeText={text => setConfirmPassword(text)}
                secureTextEntry={true}
                maxLength={20}
                placeholder={t('Re-entry password confirmation (must match)')}
                value={confirmPassword}
              />
              <View style={{paddingVertical: 15}}>
                <Button
                  loading={loading}
                  full
                  onPress={() => {
                    if ((typeof initialPassword !== 'undefined' && initialPassword.length >= 8) && (typeof confirmPassword !== 'undefined' && confirmPassword.length > 0)) {
                      if (confirmPassword === initialPassword) {
                        sendCodeSubmission();
                      } else {
                        Toast.show({
                          type: 'error',
                          text1: `Passwords MUST match.`,
                          text2: 'Passwords do NOT match & they must match before proceeding...',
                          visibilityTime: 4250,
                          position: "bottom"
                      });
                      }
                    } else {
                      Toast.show({
                          type: 'error',
                          text1: 'Complete each field before attempting to proceed...',
                          text2: 'Please set your password before trying to reset your password, both fields must be valid/completed.',
                          visibilityTime: 4250,
                          position: "bottom"
                      });
                    }
                  }}>
                  {"Initiate Password Change"}
                </Button>
              </View>
            </ScrollView>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    </View>
  );
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}

export default connect(mapStateToProps, {  })(ChangePassword);