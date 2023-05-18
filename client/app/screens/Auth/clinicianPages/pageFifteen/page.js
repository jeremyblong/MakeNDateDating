import React, { useState, useEffect } from "react";
import { Image, View, TouchableOpacity, useColorScheme } from "react-native";
import styles from "./pageStyles.js";
import DatePicker from 'react-native-date-picker';
import Dialog from "react-native-dialog";
import moment from "moment";                    
import helpers from "./helpers/options.js";
import { TextInput, Text, Button } from "@components";
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '@config'; 
import { useNavigation } from "@react-navigation/native";
import { getUniqueId, getManufacturer, getBrand, getBuildNumber, getBundleId, getCarrier, getDeviceId, getDeviceType, getDeviceName, getIpAddress, getMacAddress, getModel, getReadableVersion,getSystemVersion, getSystemName, getUserAgent, isTablet } from 'react-native-device-info';

const {
    stateList,
    timezones
} = helpers;


const currentDate = new Date();


const PageFifteenDataRegisterClinician = ({ businessAccountTempData, saveAuthenticationDetailsCounselor, handleContinuation }) => {

    const { colors, theme } = useTheme();
    const navigation = useNavigation();
    const colorSchemeDark = theme.dark;

	const [ state, setState ] = useState({
		selectedDate: null,
		open: false,
		showDialog: false,
        timezoneOptions: [],
        stateOptions: [],
        addressRelated: {
            addressLineOne: "",
            addressLineTwo: "",
            city: "",
            zipCode: "",
            addressState: null
        },
        timezone: null
	})

    useEffect(() => {
        const newArr = [];
        for (let idx = 0; idx < stateList.length; idx++) {
            const item = stateList[idx];
            newArr.push({ label: item.name, value: item.abbreviation });
            if ((stateList.length - 1) === idx) {
                setState(prevState => {
                    return {
                        ...prevState,
                        stateOptions: newArr
                    }
                })
            }
        }
        const timezoneArrNew = [];
        for (let idx = 0; idx < timezones.length; idx++) {
            const item = timezones[idx];
            timezoneArrNew.push({ label: item.value, value: item });
            if ((timezones.length - 1) === idx) {
                setState(prevState => {
                    return {
                        ...prevState,
                        timezoneOptions: timezoneArrNew
                    }
                })
            }
        }
    }, []);

   
    const calculateDisabled = () => {
        const { timezone, selectedDate } = state;

        const { 
            addressLineOne,
            addressLineTwo,
            city,
            zipCode,
            addressState
        } = state.addressRelated;

        if ((typeof addressLineOne !== "undefined" && addressLineOne.length >= 0) && (timezone !== null) && (selectedDate !== null) && (typeof city !== "undefined" && city.length >= 0) && (typeof zipCode !== "undefined" && zipCode.length >= 5) && (addressState !== null)) {
            return false;
        } else {    
            return true;
        }
    }
    const handleDeviceInformationFetch = () => {

        const brand = getBrand(); 
        const buildNumber = getBuildNumber();
        const bundleID = getBundleId();
        const deviceID = getDeviceId();
        const deviceType = getDeviceType();
        const deviceModel = getModel();
        const readableVersion = getReadableVersion();
        const systemVersion = getSystemVersion(); 
        const systemName = getSystemName();
        const tabletOrNot = isTablet();

        const promises = [];

        promises.push(getUniqueId().then(value => {
            return {
                label: "deviceUniqueId",
                value
            }
        }));
        promises.push(getManufacturer().then(value => {
            return {
                label: "manufacturer",
                value
            }
        }));
        promises.push(getCarrier().then(value => {
            return {
                label: "carrier",
                value
            }
        }));
        promises.push(getDeviceName().then(value => {
            return {
                label: "deviceName",
                value
            }
        }));
        promises.push(getIpAddress().then(value => {
            return {
                label: "ipAddress",
                value
            }
        }));
        promises.push(getMacAddress().then(value => {
            return {
                label: "macAddress",
                value
            }
        }));
        promises.push(getUserAgent().then(value => {
            return {
                label: "userAgent",
                value
            }
        }));

        return Promise.all(promises).then((deviceValues) => {
            const newOBJFormatted = {};
            // iterate over available values...
            for (let idxxxx = 0; idxxxx < deviceValues.length; idxxxx++) {
                const element = deviceValues[idxxxx];
                
                newOBJFormatted[element.label] = element.value;
                // check for last iteration + return...
                if ((deviceValues.length - 1) === idxxxx) {
                    // contruct the returnable object!
                    const valuesToReturn = {
                        brand,
                        buildNumber,
                        bundleID,
                        deviceID, 
                        deviceType,
                        deviceModel, 
                        readableVersion, 
                        systemVersion,
                        systemName,
                        tabletOrNot,
                        ...newOBJFormatted
                    };
                    // return final value(s)...
                    return valuesToReturn;
                }
            }
        });
    }

	const handleSubmission = async () => {
		console.log("handleSubmission clicked/ran...");

        const { timezone, selectedDate, addressRelated } = state;

        const deviceInfo = await handleDeviceInformationFetch();

    	saveAuthenticationDetailsCounselor({ 
            ...businessAccountTempData, 
            birthdateRaw: selectedDate, 
            birthdate: moment(selectedDate).format("YYYY-MM-DD"),
            address: addressRelated,
            timezone,
            deviceInfo
        });

        handleContinuation(16);
	}

	console.log("selectedDate", state.selectedDate);
	return (
		<View style={{ margin: 11.25 }}>
			<Dialog.Container visible={state.showDialog}>
		      <Dialog.Title>You're {state.selectedDate !== null ? Number(currentDate.getFullYear() - state.selectedDate.getFullYear()) : "Loading..."} Year's Old</Dialog.Title>
		      <Dialog.Description>
		        Make sure you're age is correct as you cannot change it later, this is the only time you're able to set your birthdate.
		      </Dialog.Description>
		      <Dialog.Button onPress={() => setState(prevState => {
	        		return {
	        			...prevState,
	        			showDialog: false
	        		}
	        	})} label="Cancel" />
		      <Dialog.Button onPress={() => {
                setState(prevState => {
                    return {
                        ...prevState,
                        showDialog: false
                    }
                })
              }} label="Confirm" />
		    </Dialog.Container>
			<View style={styles.whiteThinHR} />
			<DatePicker
                modal
                open={state.open}
                mode={"date"}
                textColor={colors.accent}
                minimumDate={new Date("1960-01-01")}
                maximumDate={new Date("2004-01-01")}
                date={state.selectedDate !== null ? state.selectedDate : new Date()}
                onConfirm={(date) => setState(prevState => {
                    return {
                        ...prevState,
                        open: false,
                        selectedDate: date,
                        showDialog: true
                    }
                })}
	        	onCancel={() => setState(prevState => {
	        		return {
	        			...prevState,
	        			open: false
	        		}
	        	})}
            />
            <View style={colorSchemeDark ? { backgroundColor: "#000", minWidth: "100%", width: "100%", borderRadius: 8.25, marginTop: 22.75 } : { backgroundColor: "#fff", minWidth: "100%", width: "100%", borderRadius: 8.25, marginTop: 22.75 }}>
                <View style={{ margin: 12.25 }}>
                    <TouchableOpacity onPress={() => setState(prevState => {
                        return {
                            ...prevState,
                            open: true
                        }
                    })} style={colorSchemeDark ? [styles.whiteRoundedBtn, { backgroundColor: "#000", borderColor: "#fff" }] : styles.whiteRoundedBtn}>
                        <Text style={styles.btnText}>Select your birthdate</Text>
                        <Image source={require("../../../../assets/icons/birthdate.png")} style={styles.iconButton} />
                    </TouchableOpacity>
                
                    <Text style={styles.label}>What is your address? (Line one)</Text>
                    <TextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                addressRelated: {
                                    ...prevState.addressRelated,
                                    addressLineOne: text
                                }
                            }
                        })}
                        secureTextEntry={false}
                        placeholder="Enter your address/street and number..."
                        value={state.addressRelated.addressLineOne}
                    />
                    <Text style={styles.label}>What is your address? (Line Two - Apt, Suite, Etc...)</Text>
                    <TextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                addressRelated: {
                                    ...prevState.addressRelated,
                                    addressLineTwo: text
                                }
                            }
                        })}
                        secureTextEntry={false}
                        placeholder="Apt, Suite, Etc..."
                        value={state.addressRelated.addressLineTwo}
                    />
                    <Text style={styles.label}>What is the city of your address?</Text>
                    <TextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                addressRelated: {
                                    ...prevState.addressRelated,
                                    city: text
                                }
                            }
                        })}
                        secureTextEntry={false}
                        placeholder="City/Municipality..."
                        value={state.addressRelated.city}
                    />
                    <Text style={styles.label}>What is the state of your address?</Text>
                    <RNPickerSelect
                        onValueChange={(value) => setState(prevState => {
                            return {
                                ...prevState,
                                addressRelated: {
                                    ...prevState.addressRelated,
                                    addressState: value
                                }
                            }
                        })}
                        style={colorSchemeDark ? {
                            inputAndroid: {
                                color: "#fff"
                            }
                        } : {}}
                        items={state.stateOptions}
                    />
                    <Text style={styles.label}>What is the zip-code of your address?</Text>
                    <TextInput
                        onChangeText={text => setState(prevState => {
                            return {
                                ...prevState,
                                addressRelated: {
                                    ...prevState.addressRelated,
                                    zipCode: text
                                }
                            }
                        })}
                        secureTextEntry={false}
                        placeholder="Zip-code...."
                        value={state.addressRelated.zipCode}
                    />
                    <Text style={styles.label}>Select your timezone</Text>
                    <RNPickerSelect
                        onValueChange={(value) => setState(prevState => {
                            return {
                                ...prevState,
                                timezone: value
                            }
                        })}
                        style={colorSchemeDark ? {
                            inputAndroid: {
                                color: "#fff"
                            }
                        } : {}}
                        items={state.timezoneOptions}
                    />
                    <View style={styles.bufferView} />
                    <Button
                        full
                        disabled={calculateDisabled()}
                        style={calculateDisabled() ? { marginTop: 10, marginBottom: 20, backgroundColor: "lightgrey" } : { marginTop: 10, marginBottom: 20, backgroundColor: colors.accent }}
                        onPress={() => handleSubmission()}>
                        {"Submit & Continue!"}
                    </Button>
                </View>
            </View>
		</View>
	);
}
export default PageFifteenDataRegisterClinician;