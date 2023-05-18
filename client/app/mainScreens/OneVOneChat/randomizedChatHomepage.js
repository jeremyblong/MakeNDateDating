import React, { Fragment, useState } from "react";
import { Text, Header, Icon, ProfileDetail, Tag, SafeAreaView } from "@components";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '@config';
import { useColorScheme, View, FlatList, Image, ScrollView } from "react-native";
import styles from "./randomizedChatHomepageStyles.js";
import { connect } from "react-redux";
import _ from "lodash";
import axios from "axios";
import { BASE_URL } from "@env";
import Toast from 'react-native-toast-message';


const OneVOneChatRandomized = ({ authData }) => {
    const { colors } = useTheme();
    const colorSchemeDark = useColorScheme() === "dark" ? true : false;
    const navigation = useNavigation();
    const [ state, setState ] = useState({
        age: {
            low: 18,
            high: 50
        },
        genders: [
            { id: '1', name: 'Woman' },
            { id: '2', name: 'Man'},
            { id: '3', name: 'Everyone/Anyone'}
          ]
    });
    
    const handleInitialization = () => {
        console.log("init....", state.checkedGender);

        if (typeof state.checkedGender !== "undefined" && state.checkedGender !== null) {
            const configuration = {
                uniqueId: authData.uniqueId,
                firstName: authData.firstName,
                username: authData.username,
                // ages: {
                //     ageBegin,
                //     ageEnd
                // },
                checkedGender: state.checkedGender.name,
                birthdate: authData.birthdateRaw,
                gender: authData.gender.label
            };
    
            axios.post(`${BASE_URL}/init/random/onevone/chat`, configuration).then((res) => {
                if (res.data.message === "Successfully added to queue!") {
                    console.log("Successfully added to queue!", res.data);
        
                    navigation.navigate("OneVOneChatRandomizedIndividual", { data: configuration });
    
                } else {
                    console.log("Err", res.data);
    
                    Toast.show({
                        type: 'error',
                        text1: `An error occurred while attempting post your data!`,
                        text2: "We encountered an error while attempting to update your information and add you to the 'chat queue'",
                        visibilityTime: 2375,
                        position: "bottom"
                    });
                }
            }).catch((err) => {
                console.log(err.message);
    
                Toast.show({
                    type: 'error',
                    text1: `An error occurred while attempting post your data!`,
                    text2: "We encountered an error while attempting to update your information and add you to the 'chat queue'",
                    visibilityTime: 2375,
                    position: "bottom"
                });
            });
        } else {
            Toast.show({
                type: 'info',
                text1: `You MUST select a gender before proceeding...`,
                text2: "You should/must select a gender to chat with before proceeding!",
                visibilityTime: 2375,
                position: "bottom"
            });
        }
    }

    return (
        <Fragment>
            <Header
                title="Randomized Chat(s)"
                subtitle="Chat with random people!"
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
            <SafeAreaView style={colorSchemeDark ? {flex: 1, backgroundColor: "#000" } : { flex: 1 }} edges={['right', 'left', 'bottom']}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 32.25 }} style={styles.container}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.headTitle}>Chat with random user's from our platform in an skip n' go fashion...</Text>
                        <View style={styles.hr} />
                        <Text style={styles.subtitle}>You will be matched with a random user within the set criteria. This user will not know you nor will you know them - feel free to spark up conversation about anything! If it goes downhill, simply skip to the next user...!</Text>

                        {/* <View style={{ padding: 20 }}>
                            <Text headline semibold>
                            {('Age Preference(s)').toUpperCase()}
                            </Text>
                            <View style={styles.contentRange}>
                                <Text caption1 grayColor>
                                    18 Year's Old
                                </Text>
                                <Text caption1 grayColor>
                                    50 Year's Old
                                </Text>
                            </View>
                            <RangeSlider
                                min={18}
                                max={50}
                                color={colors.border}
                                selectionColor={colors.primary}
                                onValueChanged={(low, high) => {
                                    setAgeBegin(low);
                                    setAgeEnd(high);
                                }}
                            />
                            <View style={styles.contentResultRange}>
                            <Text caption1>{('Age (in years)')}</Text>
                            <Text caption1>
                                {ageBegin} - {ageEnd}
                            </Text>
                            </View>
                        </View> */}
                        <Text headline semibold style={{marginLeft: 20, marginTop: 15}}>
                            {(`Preferred Gender Type`).toUpperCase()}
                        </Text>
                        <View style={styles.contentList}>
                            <FlatList
                                contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={state.genders}
                                keyExtractor={(item, index) => item.id}
                                renderItem={({item, index}) => (
                                <Tag
                                    style={{ marginLeft: 15, marginTop: 20, width: 125 }}
                                    outline={JSON.stringify(state.checkedGender) !== JSON.stringify(item)}
                                    primary={JSON.stringify(state.checkedGender) === JSON.stringify(item)}
                                    onPress={() => {
                                        setState(prevState => {
                                            return {
                                                ...prevState,
                                                checkedGender: item
                                            }
                                        })
                                    }}
                                >
                                    {item.name}
                                </Tag>
                                )}
                            />
                        </View>
                        <View style={[styles.hr, { marginTop: 22.75, marginBottom: 22.75 }]} />
                        <Image source={require("../../assets/images/chatilly.png")} style={styles.fullWidthIll} />
                        <View style={[styles.hr, { marginTop: 22.75, marginBottom: 22.75 }]} />
                    </View>
                    <View style={styles.footer}>
                        <ProfileDetail
                            image={require("../../assets/icons/chat.png")}
                            textFirst={"Start/Initialize Chat!"}
                            textSecond={"Chat with a random used in the gender your account prefers"}
                            textThird={"Don't like the convo? Simply skip to the next!"}
                            style={{ paddingHorizontal: 20 }}
                            onPress={() => handleInitialization()}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Fragment>
    );
}
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, {  })(OneVOneChatRandomized);