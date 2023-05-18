import React, { useState } from "react";
import CountryPicker from 'react-native-country-picker-modal';
import { statesSelection } from "../../options/editProfile.js";
import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text, View, Button, TextInput, ScrollView } from "react-native";
import _ from "lodash";
import Toast from "react-native-toast-message";
import { connect } from "react-redux"; 
import axios from "axios";
import { BASE_URL } from "@env";

const primaryColor = "#D81159";
const secondaryColor = "#0496FF";
const blackColor = "#000";

const LocationHelperComponent = (props) => {

    const navigation = props.navigation;
    const styles = props.styles;
    const profileData = props.profileData;

    const [countryCode, setCountryCode] = useState('FR');
    const [showModal, setShowModal] = useState(false);
    const [locationData, setLocationData] = useState({
        country: null,
        state: "",
        city: "",
        zipcode: ""
    })


    const handleSubmissionFinalLocation = () => {
        console.log("handleSubmissionFinalLocation clicked/ran...");

        const config = {
            uniqueId: props.userData.uniqueId,
            locationData
        }

        axios.post(`${BASE_URL}/adjust/location/profile/data`, config).then((res) => {
            if (res.data.message === "Updated successfully!") {
                console.log("resdata", res.data);

                Toast.show({
                    type: 'success',
                    text1: `Successfully adjusted your 'location settings'.`,
                    text2: `We've successfully uploaded your 'location settings' properly - you new data is now live!`,
                    visibilityTime: 4250,
                    position: "bottom"
                });

                setTimeout(() => {
                    navigation.goBack();
                }, 2500);
            } else {
                console.log("errrorrrrrr", res.data);

                Toast.show({
                    type: 'error',
                    text1: `An error occurred while processing your request.`,
                    text2: `We've experienced an error while adjusting your 'location settings' - please try this action again.`,
                    visibilityTime: 4250,
                    position: "bottom",
                    bottomOffset: -50
                });
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    const calculateDisabledLocation = () => {
        const { country, zipcode, state, city } = locationData;
        if ((country !== null) && (typeof state !== "undefined" && state.length > 0) && (typeof zipcode !== "undefined" && zipcode.length >= 5) && (typeof city !== "undefined" && city.length >= 7)) {
            return false;
        } else {
            return true;
        }
    }

    console.log("locationData", locationData);

    return (
        <ScrollView contentContainerStyle={styles.contentContainerScroll} style={{ flexGrow: 1, flex: 1 }}>
            <KeyboardAwareScrollView>
                <View style={styles.container}>
                    <Text style={[styles.title, { textDecorationLine: "underline", color: "#000" }]}>Current Location</Text>
                    <CountryPicker
                        {...{
                            countryCode,
                            withFilter: true,
                            withFlag: true,
                            withCountryNameButton: false,
                            withAlphaFilter: false,
                            withCallingCode: false,
                            withEmoji: true,
                            preferredCountries: ["US"]
                        }}
                        onSelect={(value) => {
                            setLocationData(prevState => {
                                return {
                                    ...prevState,
                                    country: value
                                }
                            })
                        }}
                        onValueChange={(value) => {
                            setLocationData(prevState => {
                                return {
                                    ...prevState,
                                    country: value
                                }
                            })
                        }}
                        value={_.has(profileData, "locationProfileData") ? profileData.locationProfileData.country : locationData.country}
                        containerButtonStyle={styles.pickerContainer}
                        visible={showModal}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12.5, marginBottom: 12.5 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                        <View>
                            <Text style={{ width: 175, textAlign: 'center', color: primaryColor }}>Your selected country is below</Text>
                        </View>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                    </View>
                    {_.has(profileData, "locationProfileData") ? <Text style={styles.countryText}>{profileData.locationProfileData.country.name} - {profileData.locationProfileData.country.subregion}</Text> : locationData.country !== null && (
                        <Text style={styles.countryText}>{locationData.country.name} - {locationData.country.subregion}</Text>
                    )}

                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>Select your relevant state/region</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={_.has(profileData, "locationProfileData") ? profileData.locationProfileData.state : locationData.state}
                                onValueChange={(itemValue, itemIndex) => {
                                    setLocationData(prevState => {
                                        return {
                                            ...prevState,
                                            state: itemValue
                                        }
                                    })
                                }}>
                                {statesSelection.map((item, index) => {
                                    return <Picker.Item key={index} label={item.label} value={item.label} />;
                                })}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>Select your current "city"</Text>
                        <TextInput
                            placeholder="Enter your desired/current city..."
                            placeholderTextColor={blackColor}
                            style={styles.textInputCustom}
                            secureTextEntry={false}
                            value={_.has(profileData, "locationProfileData") ? profileData.locationProfileData.city : locationData.city}
                            onChangeText={(value) => {
                                setLocationData(prevState => {
                                    return {
                                        ...prevState,
                                        city: value
                                    }
                                })
                            }}
                        />
                    </View>
                    <View style={styles.spacerContainer}>
                        <Text style={styles.labelText}>Select your current "zip-code"</Text>
                        <TextInput
                            placeholder="Enter your desired/current zip-code..."
                            placeholderTextColor={blackColor}
                            style={styles.textInputCustom}
                            secureTextEntry={false}
                            value={_.has(profileData, "locationProfileData") ? profileData.locationProfileData.zipcode : locationData.zipcode}
                            onChangeText={(value) => {
                                setLocationData(prevState => {
                                    return {
                                        ...prevState,
                                        zipcode: value
                                    }
                                })
                            }}
                        />
                    </View>
                    <View style={styles.spacerContainer}>
                        <Button disabled={calculateDisabledLocation()} color={primaryColor} onPress={() => {
                            handleSubmissionFinalLocation();
                        }} titleStyle={{ color: 'white' }} title={"Submit your changes (ALL fields)"} />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </ScrollView>
    );
}
const mapStateToProps = (state) => {
    return {
        userData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {})(LocationHelperComponent);