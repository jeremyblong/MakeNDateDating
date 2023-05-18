import React, { Component, Fragment } from "react";
import { Text, View, SafeAreaView, StatusBar, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity, ActivityIndicator, BackHandler, ImageBackground } from "react-native";
import { withNavigation } from "react-navigation";
import { Sizes } from "../../constants/styles";
import { authentication } from "../../redux/actions/authentication/auth.js";
import SvgComponentAuth from "./helpers/signinScreen/logoSvg.js";
import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from "react-redux";
import axios from "axios";
import Toast from 'react-native-toast-message';
import { BASE_URL } from "@env";
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import { ListItem } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get('screen');
 
const CONTENT = [
    {
        title: 'Why do I need a PIN?',
        content:
            'We require users to register a PIN for any verification related tasks. You will need to use this for customer support calls, account recovery and much more. Please enter a unique & private code as this information is very confidential.',
    },
    {
        title: 'Can I change my PIN at a later date?',
        content:
            'Yes, You will absolutely be able to change your PIN after successfully signing-up! Simply go to your "account settings" and change the pin from the appropriate section.',
    },
    {
        title: 'Should I ever share this PIN with support?',
        content:
            `Although most pin's are typically confidential - we use these pins for identification purposes after gathering your core account information. We WILL ask for this pin using it essentially as your "digital password or authenticator".`,
    },
    {
        title: 'What makes a "strong" PIN?',
        content:
            `Strong PIN's are made of up of unique combinations of numerical charectors - typically as randomized as possible. Please do NOT use passwords such as 123456 or 444444, or anything else that is easily guessable. Strong PIN's will protect you & your account so take this seriously.`,
    }
];

class SecurePinScreen extends Component {

    state = {
        pinCount: 0,
        pin: "******",
        sections: [],
        activityLoadingActive: false
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }

    handleBackButton = () => {
        return true;
    };

    handleSubmission = () => {
        const config = {
            uniqueId: this.props.authData.uniqueId,
            pin: this.state.pin
        }

        axios.post(`${BASE_URL}/post/newly/generated/pin`, config).then((res) => {
            if (res.data.message === "Posted code to db!") {
                console.log(res.data);

                this.setState({
                    activityLoadingActive: false
                }, () => {
                    this.props.authentication({
                        ...this.props.authData,
                        authenticated: true
                    })
    
                    this.props.navigation.replace('BottomTabScreen', { index: 1 });
                })
            } else {
                console.log("Err", res.data);

                this.setState({
                    activityLoadingActive: false
                }, () => {
                    setTimeout(() => {
                        Toast.show({
                            type: 'error',
                            text1: `PIN could NOT be properly registered...`,
                            text2: `You're desired PIN could not be properly saved & your DB information was NOT updated.`,
                            visibilityTime: 4250,
                            position: "bottom"
                        });
                    },  375);
                })
            }
        }).catch((err) => {
            console.log(err.message);

            this.setState({
                activityLoadingActive: false
            }, () => {
                setTimeout(() => {
                    Toast.show({
                        type: 'error',
                        text1: `An unknown error occurred - please try again!`,
                        text2: `An unknown possible error occurred while attempting to set/update your pin - please try again or contact support if the problem persists...`,
                        visibilityTime: 4250,
                        position: "bottom"
                    });
                },  375);
            })
        })
    }


    renderHeader = (section, i, isActive) => {
        //Accordion Header view
        return (
            <Animatable.View
                duration={400}
                style={[styles.header, isActive ? styles.active : styles.inactive]}
                transition="backgroundColor">
                <ListItem key={i}>
                    <ListItem.Content>
                        <ListItem.Title style={styles.headerText}>{section.title}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </Animatable.View>
        );
    };

    renderContent = (section, _, isActive) => {
        //Accordion Content view
        return (
            <Animatable.View
                duration={400}
                style={[styles.content, isActive ? styles.active : styles.inactive]}
                transition="backgroundColor">
                <ListItem.Content style={styles.accordionContainer}>
                    <ListItem.Title style={{ textAlign: 'center' }}>{section.content}</ListItem.Title>
                </ListItem.Content>
            </Animatable.View>
        );
    };
    setSections = (sections) => {
        //setting up a active section state
        this.setState({
            sections
        })
    };
    renderHelpPane = () => {
        return (
            <Fragment>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={height * 0.425}
                    openDuration={250}
                    closeOnDragDown={true}
                    customStyles={{
                        draggableIcon: {
                            minWidth: width * 0.625
                        }
                    }}
                >
                    <ScrollView>
                        <Accordion
                            activeSections={this.state.sections}
                            sections={CONTENT}
                            renderHeader={this.renderHeader}
                            renderContent={this.renderContent}
                            onChange={this.setSections}
                        />
                    </ScrollView>
                </RBSheet>
            </Fragment>
        );
    }
    calculateToShow = () => {
        if (this.state.activityLoadingActive === true) {
            return (
                <Fragment>
                    <ActivityIndicator color={"#0496FF"} style={{ marginTop: 10 * 3.0 }} />
                </Fragment>
            );
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F4F6" }}>
                <StatusBar translucent={false} backgroundColor={"#D81159"} />
                <ImageBackground source={require("../../assets/images/tinted-ewaste.jpeg")} style={styles.linearGradient}>
                    {this.needHelpScreen()}
                    {logo()}
                    {enterPinInfo()}
                    {this.pinBoxes()}
                    {this.renderHelpPane()}
                    {this.state.pinCount < 6 ?
                        forgotPINText() : this.calculateToShow()
                    }
                    {this.keyBoardDesign()}
                </ImageBackground>
            </SafeAreaView>
        )
    }

    pinBoxes = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 * 7.0 }}>
                <View style={{
                    backgroundColor:
                        this.state.pinCount == 1 ||
                        this.state.pinCount == 2 ||
                        this.state.pinCount == 3 ||
                        this.state.pinCount == 4 || 
                        this.state.pinCount == 5 || 
                        this.state.pinCount == 6 
                        && this.state.pinCount != 0 ? "#0496FF" : "#fff",
                    borderColor:
                    this.state.pinCount == 1 ||
                        this.state.pinCount == 2 ||
                        this.state.pinCount == 3 ||
                        this.state.pinCount == 4 || 
                        this.state.pinCount == 5 || 
                        this.state.pinCount == 6 ? "#0496FF" : 'gray',
                    ...styles.pinBoxContainerStyle
                }}>
                </View>
                <View style={{
                    backgroundColor:
                        this.state.pinCount == 2 ||
                        this.state.pinCount == 3 ||
                        this.state.pinCount == 4 || 
                        this.state.pinCount == 5 || 
                        this.state.pinCount == 6 
                            && this.state.pinCount != 0 ? "#0496FF" : "#fff",
                    borderColor:
                        this.state.pinCount == 2 ||
                        this.state.pinCount == 3 ||
                        this.state.pinCount == 4 || 
                        this.state.pinCount == 5 || 
                        this.state.pinCount == 6 ? "#0496FF" : 'gray',
                    ...styles.pinBoxContainerStyle
                }}>
                </View>
                <View style={{
                    backgroundColor:
                        this.state.pinCount == 3 ||
                        this.state.pinCount == 4 || 
                        this.state.pinCount == 5 || 
                        this.state.pinCount == 6 
                            && this.state.pinCount != 0 ? "#0496FF" : "#fff",
                    borderColor:
                        this.state.pinCount == 3 ||
                        this.state.pinCount == 4 || 
                        this.state.pinCount == 5 || 
                        this.state.pinCount == 6  ? "#0496FF" : 'gray',
                    ...styles.pinBoxContainerStyle
                }}>
                </View>
                <View style={{
                    backgroundColor:
                        this.state.pinCount == 4 || 
                        this.state.pinCount == 5 || 
                        this.state.pinCount == 6 
                            && this.state.pinCount != 0 ? "#0496FF" : "#fff",
                    borderColor: 
                        this.state.pinCount == 4 || 
                        this.state.pinCount == 5 || 
                        this.state.pinCount == 6 ? "#0496FF" : 'gray',
                    ...styles.pinBoxContainerStyle,
                }}>
                </View>
                <View style={{
                    backgroundColor:
                        this.state.pinCount == 5 || 
                        this.state.pinCount == 6 
                            && this.state.pinCount != 0 ? "#0496FF" : "#fff",
                    borderColor: 
                        this.state.pinCount == 5 || 
                        this.state.pinCount == 6 ? "#0496FF" : 'gray',
                    ...styles.pinBoxContainerStyle,
                }}>
                </View>
                <View style={{
                    backgroundColor:
                        this.state.pinCount == 6 
                            && this.state.pinCount != 0 ? "#0496FF" : "#fff",
                    borderColor: 
                        this.state.pinCount == 6 ? "#0496FF" : 'gray',
                    ...styles.pinBoxContainerStyle,
                }}>
                </View>
            </View>
        )
    }

    setCharAt = (str, index, chr) => {
        if (index > str.length - 1) return str;
        return str.substring(0, index) + chr + str.substring(index + 1);
    }

    calculateAction = (item, index) => {
        if (typeof item.data === "number") {
            if (item.id == 12) {
                this.setState({ pinCount: this.state.pinCount - 1, pin: this.state.pin.slice(0, this.state.pin.length - 1) })
            } else {
                this.setState({ pinCount: this.state.pinCount + 1, pin: this.setCharAt(this.state.pin, this.state.pinCount, item.data.toString()) })
            }
        } else {
            if (item.id == 12) {
                this.setState({ pinCount: this.state.pinCount - 1 })
            } else {
                this.setState({ pinCount: this.state.pinCount + 1 })
            }
        }
    }

    needHelpScreen = () => {
        return (
            <TouchableOpacity onPress={() => this.RBSheet.open()}>
                <Text style={{
                    alignSelf: 'flex-end',
                    marginHorizontal: 10 * 2.0,
                    marginTop: 10 * 2.0,
                    color: "#fff"
                }}>NEED HELP?</Text>
            </TouchableOpacity>
        )
    }

    keyBoardDesign() {

        console.log("this.state.pin", this.state.pin);

        const renderItem = ({ item, index }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    if (Number(item.id) === 10) {

                        this.setState({
                            activityLoadingActive: true
                        }, () => {
                            this.handleSubmission();
                        })
                    } else {
                        this.calculateAction(item, index);
                    }
                }}
                style={styles.keyboardItemContainerStyle}>
                {Number(item.id) === 12 ?
                    item.data : Number(item.id) === 10 ? item.data : <Text style={{ color: "#fff" }}>{item.data}</Text>
                }
            </TouchableOpacity>
        )
        return (

            <View style={{ position: 'absolute', bottom: 0.0 }}>
                <FlatList
                    data={keyboardItemsList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                />
            </View>
        )
    }
}

const keyboardItemsList = [
    {
        id: '1',
        data: 1,
    },
    {
        id: '2',
        data: 2,
    },
    {
        id: '3',
        data: 3,
    },
    {
        id: '4',
        data: 4,
    },
    {
        id: '5',
        data: 5,
    },
    {
        id: '6',
        data: 6,
    },
    {
        id: '7',
        data: 7,
    },
    {
        id: '8',
        data: 8,
    },
    {
        id: '9',
        data: 9,
    },
    {
        id: '10',
        data: <Image source={require("../../assets/images/icon/enter-key.png")} style={{
            maxHeight: 37.5,
            maxWidth: 42.5,
            width: 42.5,
            height: 37.5
        }} />,
    },
    {
        id: '11',
        data: 0,
    },
    {
        id: '12',
        data: <Image source={require("../../assets/images/icon/backspace.png")} style={{
            maxHeight: 37.5,
            maxWidth: 42.5,
            width: 42.5,
            height: 37.5,
            tintColor: "#fff"
        }} />
    },
];

const forgotPINText = () => {
    // return (
    //     <Text style={{ marginTop: 10 * 2.0, alignSelf: 'center' }}>
    //         Forgot PIN?
    //     </Text>
    // )
}

const enterPinInfo = () => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Text>Enter a <Text style={{ color: "blue", textDecorationLine: "underline", fontWeight: "bold" }}>unique</Text> PIN for your account</Text>
            <Text style={{ marginTop: 10 - 3.0, textAlign: "center", margin: 12.5, color: "#fff" }}>
                This pin will be used with support tickets, password resets, payments, transactions and security tasks amoung other critical tasks...
            </Text>
        </View>
    )
}

const logo = () => {
    return (
        <SvgComponentAuth />
    )
}

SecurePinScreen.navigationOptions = () => {
    return {
        header: () => null
    }
}

const styles = StyleSheet.create({
    keyboardItemContainerStyle: {
        width: width / 3.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1.0,
        borderTopColor: '#E1E3E5',
        borderRightColor: '#E1E3E5',
        borderRightWidth: 1.0,
        paddingVertical: 13,
    },
    headerText: {
        fontWeight: "bold",
        color: "darkblue"
    },
    pinBoxContainerStyle: {
        width: 20.0,
        height: 20.0,
        borderRadius: 10.0,
        borderWidth: 1.0,
        marginHorizontal: 5,
    },  
    linearGradient: {
        width,
        height,
        flex: 1
    },  
    logoImageStyle: {
        alignSelf: 'center',
        width: 100.0,
        height: 100.0,
        marginVertical: 20
    },
    accordionContainer: {
        justifyContent: "center", 
        alignContent: "center", 
        alignItems: "center", 
        margin: 17.5
    }
})
const mapStateToProps = (state) => {
    return {
        authData: state.auth.data
    }
}

export default connect(mapStateToProps, { authentication })(withNavigation(SecurePinScreen));