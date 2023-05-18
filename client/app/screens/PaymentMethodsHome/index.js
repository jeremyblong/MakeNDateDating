import React, {useState, useCallback} from 'react';
import {View, TouchableOpacity, Image, FlatList } from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Button} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from "axios";
import { connect } from "react-redux";
import _ from "lodash";
import { BASE_URL } from "@env";
import { Bars } from 'react-native-loader';
import { useFocusEffect } from '@react-navigation/native';         

const MyPaymentMethodHomepage = ({navigation, authData}) => {
    const {colors} = useTheme();
    const {t} = useTranslation();
    const [cards, setCards] = useState([]);

    useFocusEffect(
        useCallback(async () => {
        axios.get(`${BASE_URL}/gather/cards/payouts/account`, {
            params: {
                uniqueId: authData.uniqueId,
                accountType: authData.accountType
            } 
        }).then((res) => {
            if (res.data.message === "Gathered cards successfully!") {
                console.log("Gathered cards successfully!", res.data);
    
                const { cards } = res.data;
    
                setCards(cards);
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }, []));

    const onSelectMethod = item => {
        navigation.navigate('PaymentMethodDetail', { cardDetails: item });
    };

    const renderCardIconImage = (brand) => {
        switch (brand) {
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
                return <Text style={{ fontSize: 13.25, fontWeight: "400", textAlign: "center", textDecorationLine: "underline", color: colors.accent }}>N/A</Text>
            break;
        }
    }

    return (
        <View style={{flex: 1}}>
        <Header
            title={t('my_cards')}
            subTitle={"View card(s) or add more!"}
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
            <View style={styles.contain}>

            <FlatList
                showsVerticalScrollIndicator={false}
                data={cards}
                keyExtractor={(item, index) => item.id}
                ListEmptyComponent={() => (
                    <View style={styles.centered}>
                        <View style={styles.centeredInside}>
                            <Text style={styles.loadingText}>Loading Card(s)...</Text>
                            <View style={styles.centered}>
                                <Bars size={35} color={colors.accent} />
                            </View>
                        </View>
                    </View>
                )}
                renderItem={({item, index}) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.paymentItem, {borderBottomColor: colors.border}]}
                        onPress={() => onSelectMethod(item)}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.iconContent}>
                            {renderCardIconImage(item.brand)}
                        </View>
                        <View>
                            <Text body1>{`**** **** **** ${item.last4}`}</Text>
                            <Text footnote grayColor style={{marginTop: 5}}>
                            {`Expires ${item.exp_month}/${item.exp_year}`}
                            </Text>
                        </View>
                        </View>
                        {item.primary ? (
                        <Text footnote primaryColor>
                            {t('primary')}
                        </Text>
                        ) : null}
                    </TouchableOpacity>
                )}
            />
            </View>
            <View style={{padding: 20}}>
                <Button
                    full
                    onPress={() => navigation.navigate('AddPayment')}>
                    {t('add_payment_method')}
                </Button>
                <View style={styles.hr} />
                <Button
                    full
                    onPress={() => navigation.navigate('StripeOnboardingFlow')}
                    style={{ backgroundColor: colors.accent }}
                >
                    {"Onboard/Verify Stripe (Payouts)"}
                </Button>
            </View>
        </SafeAreaView>
        </View>
    );
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {  })(MyPaymentMethodHomepage);