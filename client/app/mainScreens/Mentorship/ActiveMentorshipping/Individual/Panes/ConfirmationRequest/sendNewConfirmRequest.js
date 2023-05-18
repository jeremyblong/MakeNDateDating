import React, { useState, Fragment, useRef, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@config';
import styles from "./sendNewConfirmRequestStyles.js";
import _ from "lodash";
import axios from "axios";
import moment from 'moment';
import { BASE_ASSET_URL, BASE_URL } from "@env";
import { connect } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import {
    Header,
    Icon,
    Text,
    Button
} from '@components';
import Toast from "react-native-toast-message";
              

const SendConfirmationRequestHelper = ({ otherUser, authData, listingID, authenticatedData, sendConfirmationRequestRef }) => {

    const { colors, theme } = useTheme();
    const colorSchemeDark = theme.dark;
    const navigation = useNavigation();
    const [activeSection, setActiveSection] = useState(0);
    const sections = [
        {
            title: `What exactly does a 'confirmation' mean?`,
            content: 'Once the mentorship program has come to a conclusion, it is important for both parties involved in the contract to confirm that all meetings have been successfully concluded. This confirmation serves as proof that the agreed amount of counseling sessions were completed and that the peer who hired the mentor received the support they needed. Upon receiving confirmation, the mentor can be assured that their job is finished and done to the best of their ability.'
        },
        {
            title: `What happen's after I send my 'confirmation' request?`,
            content: 'Once the mentorship meetings have concluded, it is essential to reach a clear conclusion regarding the services provided. The other user must confirm or deny that the contract was fulfilled as per the agreed terms. It is imperative to ensure that all aspects of the contract were completed, and there are no loose ends left untied. Once everything is done, it is essential to have a mutual understanding of the finished services. Confirming the outcome of the meetings will then release the funds into your account which can then be withdrawn!'
        },
        {
            title: `Is the user required to respond in a specific time period?`,
            content: `It's important to remember that when using digital services, there is often a time delay associated with communication. As a user, you will have approximately 3 days to confirm or deny if the services were rendered before the funds are released automatically due to no response from the other user. While it can be frustrating to wait for a response, there are no ways around this process. It's important to be patient and allow the timeout period to run its course. Any attempt to circumvent this process will only cause further delay in resolving the issue at hand. So, wait for a response or wait for a timeout – either way, trust the system and allow it to work as intended.`
        }
    ];

    const handleSubmission = () => {
        console.log("handleSubmission clicked/ran...");

        const config = {
            otherUser,
            authData,
            listingID
        }

        axios.post(`${BASE_URL}/send/confirmation/request/mentorship/complete`, config).then((res) => {
            if (res.data.message === "Successfully sent completion request!") {
                console.log("Successfully sent completion request!", res.data);

                sendConfirmationRequestRef.current.close();

                Toast.show({
                    type: 'success',
                    text1: `Successfully sent your confirmation & notified user!`,
                    text2: `We've successfully sent the desired request & notified the specific user requesting action - please wait for a response...`,
                    visibilityTime: 3250,
                    position: "bottom"
                });
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }

    return (
        <Fragment>
            <Header
                title="Send Confirmation Request"
                subTitle="Complete Transaction Request..."
                renderLeft={() => {
                    return (
                        <Icon
                            name="arrow-left"
                            size={25}
                            color={"darkred"}
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    sendConfirmationRequestRef.current.close();
                }}
            />
            <View style={colorSchemeDark ? [styles.container, { backgroundColor: "#000" }] : [styles.container, { backgroundColor: "#fff" }]}>
                <Text style={styles.headerText}>You're about to send a 'confirmation' request to the other user to confirm that both parties have indeed concluded the agreed terms & conditions (therapy/mentorship sessions WERE provided).</Text>
                <View style={styles.accordionContainer}>
                    {sections.map((section, index) => (
                        <View style={{ margin: 7.75 }} key={index}>
                            <TouchableOpacity 
                                style={styles.titleContainer}
                                onPress={() => setActiveSection(index)}
                            >
                                <Text style={styles.title}>{section.title}</Text>
                            </TouchableOpacity>
                            {activeSection === index && (
                                <View style={styles.contentContainer}>
                                    <Text style={styles.content}>{section.content}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
                <View style={styles.hr} />
                <Button full style={{ marginTop: 10, backgroundColor: colors.accent }} onPress={() => handleSubmission()}>
                    Send Confirmation Request!
                </Button>
            </View>
        </Fragment>
    );
};

const mapStateToProps = (state) => {
	return {
		authenticatedData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
	}
}
export default connect(mapStateToProps, { })(SendConfirmationRequestHelper);