import React, {useState} from 'react';
import {
  View,
  Switch,
  KeyboardAvoidingView,
  Platform,
  TextInput as CustomTextInput,
  ScrollView,
  Image,
  useColorScheme
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, TextInput, Button} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import Toast from 'react-native-toast-message';
import axios from "axios";
import { BASE_URL } from "@env";
import DatePicker from "react-native-date-picker";
import moment from 'moment';                  
import { connect } from "react-redux";
import _ from "lodash";

const AddPayment = ({navigation, authData}) => {
  const { colors, theme } = useTheme();
  const colorSchemeDark = theme.dark;
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [card, setCard] = useState('');
  const [valid, setValid] = useState(new Date());
  const [digit, setDigit] = useState('');
  const [name, setName] = useState('');
  const [primary, setPrimary] = useState(true);
  const [ cardData, setCardData ] = useState(null);
  const [ pickerOpen, setPickerState ] = useState(false);

  console.log("cardData", cardData);

  const submitCreditDebitCard = () => {
    console.log("submitCreditDebitCard clicked/ran...");

    const configuration = {
      uniqueId: authData.uniqueId,
      accountType: authData.accountType,
      card,
      valid,
      digit, 
      name,
      primary,
      cardType: checkCreditCard(card).type
    }

    axios.post(`${BASE_URL}/save/card/details`, configuration).then((res) => {
      if (res.data.message === "Successfully saved card details!") {
        console.log("Successfully gathered...", res.data);

        Toast.show({
            type: 'success',
            text1: `Successfully saved/updated your card data!`,
            text2: `We've successfully saved and updated your payment related settings/data...`,
            visibilityTime: 2375,
            position: "bottom",
            onHide: () => {
              navigation.replace("BottomTabNavigator", { screen: "Profile" });
            }
        });
      } else if (res.data.message === "This card is not eligible for Instant Payouts. Try a debit card from a supported bank.") {
        Toast.show({
          type: 'error',
          text1: `This card is not supported for payouts!`,
          text2: "We cannot use this card for payouts - please use another card instead.",
          visibilityTime: 3500,
          position: "bottom"
        });
      } else if (res.data.message === "This does NOT appear to be a debit card - payouts can ONLY be used on debit cards...") {
        Toast.show({
          type: 'error',
          text1: "ONLY debit cards are allowed for payouts!",
          text2: res.data.message,
          visibilityTime: 3500,
          position: "bottom"
        });
      } else {
        console.log("Err", res.data);

        Toast.show({
            type: 'error',
            text1: `Error attempting to update your card data...`,
            text2: `An error occurred while attempting to update your card data, please try this action again or contact support if the problem persists...`,
            visibilityTime: 2375,
            position: "bottom"
        });
        }
    }).catch((err) => {
        console.log(err.message);

        Toast.show({
            type: 'error',
            text1: `Error attempting to update your card data...`,
            text2: `An error occurred while attempting to update your card data, please try this action again or contact support if the problem persists...`,
            visibilityTime: 2375,
            position: "bottom"
        });
    })
  }

  const disabledButton = () => {
    if ((typeof card !== "undefined" && card.length > 0) && (typeof digit !== "undefined" && digit.length >= 3) && (typeof valid !== "undefined" && valid.length >= 3) && (typeof digit !== "undefined" && digit.length > 0)) {
      return false;
    } else {  
      return true;
    }
  }
  const validateCardNumber = number => {
    //Check if the number contains only numeric value  
    //and is of between 13 to 19 digits
    const regex = new RegExp("^[0-9]{13,19}$");
    if (!regex.test(number)){
        return false;
    }
  
    return luhnCheck(number);
  }

  const luhnCheck = val => {
      let checksum = 0; // running checksum total
      let j = 1; // takes value of 1 or 2

      // Process each digit one by one starting from the last
      for (let i = val.length - 1; i >= 0; i--) {
        let calc = 0;
        // Extract the next digit and multiply by 1 or 2 on alternative digits.
        calc = Number(val.charAt(i)) * j;

        // If the result is in two digits add 1 to the checksum total
        if (calc > 9) {
          checksum = checksum + 1;
          calc = calc - 10;
        }

        // Add the units element to the checksum total
        checksum = checksum + calc;

        // Switch the value of j
        if (j == 1) {
          j = 2;
        } else {
          j = 1;
        }
      }
    
      //Check if it is divisible by 10 or not.
      return (checksum % 10) == 0;
  }
  const checkCreditCard = cardnumber => {
  
    //Error messages
    const ccErrors = [];
    ccErrors [0] = "Unknown card type";
    ccErrors [1] = "No card number provided";
    ccErrors [2] = "Credit card number is in invalid format";
    ccErrors [3] = "Credit card number is invalid";
    ccErrors [4] = "Credit card number has an inappropriate number of digits";
    ccErrors [5] = "Warning! This credit card number is associated with a scam attempt";
    
    //Response format
    const response = (success, message = null, type = null) => ({
      message,
      success,
      type
    });
       
    // Define the cards we support. You may add additional card types as follows.
    
    //  Name:         As in the selection box of the form - must be same as user's
    //  Length:       List of possible valid lengths of the card number for the card
    //  prefixes:     List of possible prefixes for the card
    //  checkdigit:   Boolean to say whether there is a check digit
    const cards = [];
    cards [0] = {name: "Visa", 
                 length: "13,16", 
                 prefixes: "4",
                 checkdigit: true};
    cards [1] = {name: "MasterCard", 
                 length: "16", 
                 prefixes: "51,52,53,54,55",
                 checkdigit: true};
    cards [2] = {name: "DinersClub", 
                 length: "14,16", 
                 prefixes: "36,38,54,55",
                 checkdigit: true};
    cards [3] = {name: "CarteBlanche", 
                 length: "14", 
                 prefixes: "300,301,302,303,304,305",
                 checkdigit: true};
    cards [4] = {name: "AmEx", 
                 length: "15", 
                 prefixes: "34,37",
                 checkdigit: true};
    cards [5] = {name: "Discover", 
                 length: "16", 
                 prefixes: "6011,622,64,65",
                 checkdigit: true};
    cards [6] = {name: "JCB", 
                 length: "16", 
                 prefixes: "35",
                 checkdigit: true};
    cards [7] = {name: "enRoute", 
                 length: "15", 
                 prefixes: "2014,2149",
                 checkdigit: true};
    cards [8] = {name: "Solo", 
                 length: "16,18,19", 
                 prefixes: "6334,6767",
                 checkdigit: true};
    cards [9] = {name: "Switch", 
                 length: "16,18,19", 
                 prefixes: "4903,4905,4911,4936,564182,633110,6333,6759",
                 checkdigit: true};
    cards [10] = {name: "Maestro", 
                 length: "12,13,14,15,16,18,19", 
                 prefixes: "5018,5020,5038,6304,6759,6761,6762,6763",
                 checkdigit: true};
    cards [11] = {name: "VisaElectron", 
                 length: "16", 
                 prefixes: "4026,417500,4508,4844,4913,4917",
                 checkdigit: true};
    cards [12] = {name: "LaserCard", 
                 length: "16,17,18,19", 
                 prefixes: "6304,6706,6771,6709",
                 checkdigit: true};
     
    // Ensure that the user has provided a credit card number
    if (cardnumber.length == 0)  {
       return response(false, ccErrors[1]);
    }
      
    // Now remove any spaces from the credit card number
    // Update this if there are any other special characters like -
    cardnumber = cardnumber.replace (/\s/g, "");
    
    // Validate the format of the credit card
    // luhn's algorithm
    if(!validateCardNumber(cardnumber)){
      return response(false, ccErrors[2]);
    }
   
    // Check it's not a spam number
    if (cardnumber == '5490997771092064') { 
      return response(false, ccErrors[5]);
    }
  
    // The following are the card-specific checks we undertake.
    let lengthValid = false;
    let prefixValid = false; 
    let cardCompany = "";
    
    // Check if card belongs to any organization
    for(let i = 0; i < cards.length; i++){
      const prefix = cards[i].prefixes.split(",");
      
      for (let j = 0; j < prefix.length; j++) {
        const exp = new RegExp ("^" + prefix[j]);
        if (exp.test (cardnumber)) {
          prefixValid = true;
        }
      }
      
      if(prefixValid){
        const lengths = cards[i].length.split(",");
        // Now see if its of valid length;
        for (let j=0; j < lengths.length; j++) {
          if (cardnumber.length == lengths[j]) {
            lengthValid = true;
          }
        }
      }
      
      if(lengthValid && prefixValid){
        cardCompany = cards[i].name;
        return response(true, null, cardCompany);
      }  
    }
    
    // If it isn't a valid prefix there's no point at looking at the length
    if (!prefixValid) {
       return response(false, ccErrors[3]);
    }
    
    // See if all is OK by seeing if the length was valid
    if (!lengthValid) {
       return response(false, ccErrors[4]);
    };   
    
    // The credit card is in the required format.
    return response(true, null, cardCompany);
  }

  const validateExpiry = (input) => {
    // ensure basic format is correct
    if (input.match(/^(0\d|1[0-2])\/\d{2}$/)) {
      const {0: month, 1: year} = input.split("/");
  
      // get midnight of first day of the next month
      const expiry = new Date("20"+year, month);
      const current = new Date();
      
      return expiry.getTime() > current.getTime();
      
    } else return false;
  }

  const calculateValidExp = (event) => {
    console.log("Event", event.key);
  }

  const renderCardIconImage = () => {
    if (cardData !== null) {
      switch (cardData.type) {
        case "Discover":
          return <Image source={require("../../assets/icons/card-icons/discover.png")} style={styles.cardIcon} />
          break;
        case "AmEx":
          return <Image source={require("../../assets/icons/card-icons/american.png")} style={styles.cardIcon} />
          break;
        case "DinersClub":
          return <Image source={require("../../assets/icons/card-icons/diners.png")} style={styles.cardIcon} />
          break;
        case "Visa":
          return <Image source={require("../../assets/icons/card-icons/visa.png")} style={styles.cardIcon} />
          break;
        case "JCB":
          return <Image source={require("../../assets/icons/card-icons/jcb.png")} style={styles.cardIcon} />
          break;
        case "MasterCard":
          return <Image source={require("../../assets/icons/card-icons/mastercard.png")} style={styles.cardIcon} />
          break;
        default:
          if (!cardData.success) {
            return <Text style={{ fontSize: 18.25, fontWeight: "400", textAlign: "center", textDecorationLine: "underline", color: colors.accent }}>You MUST enter a valid credit-card/debit number, current card number is invalid.</Text>
          }
          break;
      }
    }
  }
  return (
    <View style={{flex: 1}}>
      <Header
        title={t('add_payment_method')}
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
      <DatePicker
        modal 
        open={pickerOpen}
        date={new Date()}
        minimumDate={new Date()}
        mode="date" 
        textColor={"#000"}
        onConfirm={(date) => {
          setValid(moment(date).format("MM/YY"));
          setPickerState(false);
        }}
        onCancel={() => {
          setPickerState(false);
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <ScrollView contentContainerStyle={{padding: 20}}>
            <Text headline>{t('card_information')}</Text>
            <CustomTextInput
              style={colorSchemeDark ? {marginTop: 10, backgroundColor: colors.card, paddingLeft: 10, minHeight: 45, color: "#fff" } : {marginTop: 10, backgroundColor: colors.card, paddingLeft: 10, minHeight: 45, color: "#000" }}
              onChangeText={text => setCard(text)}
              placeholder={"Credit/Debit Card Number"}
              onEndEditing={() => setCardData(checkCreditCard(card))}
              keyboardType="numeric"
              placeholderTextColor={"darkgrey"}
              value={card}
              maxLength={18}
            />
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flex: 6.5}}>
                <CustomTextInput
                  onChangeText={text => {}}
                  placeholder={"Valid Until"}
                  onFocus={() => setPickerState(true)}
                  value={valid}
                  placeholderTextColor={"darkgrey"}
                  keyboardType={"number-pad"}
                  onKeyPress={calculateValidExp}
                  maxLength={5}
                  style={colorSchemeDark ? { backgroundColor: colors.card, paddingLeft: 10, minHeight: 45, color: "#fff" } : { backgroundColor: colors.card, paddingLeft: 10, minHeight: 45, color: "#000" }}
                />
              </View>
              <View style={{flex: 3.5, marginLeft: 10}}>
                <TextInput
                  onChangeText={text => setDigit(text)}
                  placeholder={t('digit_num')}
                  maxLength={4}
                  style={colorSchemeDark ? { color: "#fff" } : { color: "#000" }}
                  keyboardType="numeric"
                  placeholderTextColor={"darkgrey"}
                  value={digit}
                />
              </View>
            </View>
            <TextInput
              style={colorSchemeDark ? { color: "#fff", marginTop: 10 } : { color: "#000", marginTop: 10 }}
              onChangeText={text => setName(text)}
              placeholder={t('name_on_card')}
              placeholderTextColor={"darkgrey"}
              value={name}
            />
            <View
              style={[styles.checkDefault, {borderTopColor: colors.border}]}>
              <Text body2>{t('set_as_primary')}</Text>
              <Switch
                name="angle-right"
                size={18}
                onValueChange={() => setPrimary(prevState => !prevState)}
                value={primary}
              />
            </View>
            {renderCardIconImage()}
          </ScrollView>
          <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
            <Button disabled={disabledButton()} style={disabledButton() ? { backgroundColor: "lightgrey" } : { }} full onPress={() => submitCreditDebitCard()}>
              {"Add New Debit Card!"}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
const mapStateToProps = (state) => {
  return {
      authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
  }
}
export default connect(mapStateToProps, { })(AddPayment);