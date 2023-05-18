import React, { Fragment, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "./IndexStyles.js";
import { useTheme } from '@config';
import axios from "axios";
import Toast from 'react-native-toast-message';
import { BASE_URL } from "@env";
import { saveAuthenticationDetails } from "../../../../actions/auth.js";
import { connect } from "react-redux";

const PageTwoContentData = ({ phoneNumber, saveAuthenticationDetailsCounselor, therapist, saveAuthenticationDetails, mainData, handleContinuation }) => {

	const { colors } = useTheme();

	const [ state, setState ] = useState({
		inputValues: {
			first: "", // 
			second: "",
			third: "",
			fourth: ""
		}
	})

	const firstInputZone = useRef(null);
	const secondInputZone = useRef(null);
	const thirdInputZone = useRef(null);
	const fourthInputZone = useRef(null);
	const fifthInputZone = useRef(null);

	const calculateReadiness = () => {
        const { first, second, third, fourth, fifth } = state.inputValues;

        if ((typeof first !== "undefined" && first.length > 0) && (typeof second !== "undefined" && second.length > 0) && (typeof third !== "undefined" && third.length > 0) && (typeof fourth !== "undefined" && fourth.length > 0) && (typeof fifth !== "undefined" && fifth.length > 0)) {
            return false;
        } else {
            return true;
        }
    }

    const handleSubmission = () => {
    	const { first, second, third, fourth, fifth } = state.inputValues;

    	const config = {
            phoneNumber: `+1${mainData.phoneNumber.unmaskedPhoneNumber}`,
            code: `${first}${second}${third}${fourth}${fifth}`,
            sid: mainData.sid
        }
        
        axios.post(`${BASE_URL}/verify/registration/code`, config).then((res) => {
            if (res.data.message === "Successfully Verified!") {
                console.log("Successfully sent code!", res.data);

				if (therapist === false) {
					saveAuthenticationDetails({ phoneNumber: mainData.phoneNumber.unmaskedPhoneNumber });
				} else {
					saveAuthenticationDetailsCounselor({
						phoneNumber
					});
				}

                Toast.show({
				    type: 'success',
				    text1: `Code is VALID!`,
				    text2: `You've entered a valid code, you will be redirected momentarily...`,
				    visibilityTime: 2375,
				    position: "bottom",
				    onHide: () => {
				    	handleContinuation(3);
				    }
				});
            } else {
                console.log("Err", res.data);

                Toast.show({
				    type: 'error',
				    text1: `You MUST enter a VALID code!`,
				    text2: `Please enter a VALID code in order to continue forward/onward...`,
				    visibilityTime: 2375,
				    position: "bottom"
				});
			}
        }).catch((err) => {
            console.log(err.message);

            // Toast.show({
			//     type: 'error',
			//     text1: `You MUST enter a VALID code!`,
			//     text2: `Please enter a VALID code in order to continue forward/onward...`,
			//     visibilityTime: 2375,
			//     position: "bottom"
			// });
        })
    }

	return (
		<Fragment>
			<View style={styles.rowOnly}>
				<TextInput
	                textAlign={'center'}
	                maxLength={1}
	                placeholderTextColor={"#000"}
					keyboardType={"number-pad"}
	                style={styles.textFieldContainerStyle}
	                onSubmitEditing={() => secondInputZone.current.focus()}
	                blurOnSubmit={true}
	                onFocus={() => setState(prevState => {
	               	 	return {
	                        ...prevState,
	                        inputValues: {
	                        	...prevState.inputValues,
	                        	first: ""
	                        }
	                    }
		            })}
	                secureTextEntry={false} 
	                value={state.inputValues.first}
	                ref={firstInputZone}
	                onChangeText={(value) => {
	                	setState(prevState => {
	                   	 	return {
		                        ...prevState,
		                        inputValues: {
		                        	...prevState.inputValues,
		                        	first: value
		                        }
		                    }
		                })
		                secondInputZone.current.focus();
	                }}
	            />
	            <TextInput
	                textAlign={'center'}
					keyboardType={"number-pad"}
	                placeholderTextColor={"#000"}
	                maxLength={1}
	                style={styles.textFieldContainerStyle}
	                onSubmitEditing={() => thirdInputZone.current.focus()}
	                blurOnSubmit={true}
	                secureTextEntry={false} 
	                onFocus={() => setState(prevState => {
	               	 	return {
	                        ...prevState,
	                        inputValues: {
	                        	...prevState.inputValues,
	                        	second: ""
	                        }
	                    }
		            })}
	                value={state.inputValues.second}
	                ref={secondInputZone}
	                onChangeText={(value) => {
	                	setState(prevState => {
	                   	 	return {
		                        ...prevState,
		                        inputValues: {
		                        	...prevState.inputValues,
		                        	second: value
		                        }
		                    }
		                })
		                thirdInputZone.current.focus();
	                }}
	            />
	            <TextInput
	                textAlign={'center'}
					keyboardType={"number-pad"}
	                placeholderTextColor={"#000"}
	                maxLength={1}
	                style={styles.textFieldContainerStyle}
	                onSubmitEditing={() => fourthInputZone.current.focus()}
	                blurOnSubmit={true}
	                secureTextEntry={false} 
	                value={state.inputValues.third}
	                onFocus={() => setState(prevState => {
	               	 	return {
	                        ...prevState,
	                        inputValues: {
	                        	...prevState.inputValues,
	                        	third: ""
	                        }
	                    }
		            })}
	                ref={thirdInputZone}
	              	onChangeText={(value) => {
	                	setState(prevState => {
	                   	 	return {
		                        ...prevState,
		                        inputValues: {
		                        	...prevState.inputValues,
		                        	third: value
		                        }
		                    }
		                })
		                fourthInputZone.current.focus();
	                }}
	            />
	            <TextInput
	                textAlign={'center'}
	                placeholderTextColor={"#000"}
	                maxLength={1}
	                style={styles.textFieldContainerStyle}
	                blurOnSubmit={true}
	                secureTextEntry={false} 
					keyboardType={"number-pad"}
	                value={state.inputValues.fourth}
	                ref={fourthInputZone}
	                onFocus={() => setState(prevState => {
	               	 	return {
	                        ...prevState,
	                        inputValues: {
	                        	...prevState.inputValues,
	                        	fourth: ""
	                        }
	                    }
		            })}
	               onChangeText={(value) => {
	                	setState(prevState => {
	                   	 	return {
		                        ...prevState,
		                        inputValues: {
		                        	...prevState.inputValues,
		                        	fourth: value
		                        }
		                    }
		                })
		                fifthInputZone.current.focus();
	                }}
	            />
	            <TextInput
	                textAlign={'center'}
	                placeholderTextColor={"#000"}
	                maxLength={1}
					keyboardType={"number-pad"}
	                style={styles.textFieldContainerStyle}
	                onSubmitEditing={() => {}}
	                blurOnSubmit={true}
	                secureTextEntry={false} 
	                value={state.inputValues.fifth}
	                onFocus={() => setState(prevState => {
	               	 	return {
	                        ...prevState,
	                        inputValues: {
	                        	...prevState.inputValues,
	                        	fifth: ""
	                        }
	                    }
		            })}
	                ref={fifthInputZone}
	              	onChangeText={(value) => {
	                	setState(prevState => {
	                   	 	return {
		                        ...prevState,
		                        inputValues: {
		                        	...prevState.inputValues,
		                        	fifth: value
		                        }
		                    }
		                })
	                }}
	            />
            </View>
            <View style={styles.whiteThinHR} />
         	<TouchableOpacity
                disabled={calculateReadiness()}
                activeOpacity={0.9}
                onPress={() => handleSubmission()}
                style={!calculateReadiness() ? [styles.continueButtonStyle, { backgroundColor: colors.accent, borderWidth: 1.25, borderColor: "#fff" }] : styles.disabledContinueButtonStyle}>
                <Text style={!calculateReadiness() ? { color: "#fff" } : { color: "black" }}>Continue</Text>
            </TouchableOpacity>
		</Fragment>
	);
}
const mapStateToProps = (state) => {
    return {}
}
export default connect(mapStateToProps, { saveAuthenticationDetails })(PageTwoContentData);