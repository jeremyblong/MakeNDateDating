import React, { Fragment, useState } from "react";
import {
    View,
    TouchableOpacity,
    Image,
    FlatList,
  } from 'react-native'
import styles from "./mainNavStyles.js";
import { Text, Header, Icon, Button, TextInput } from "@components";
import { useTheme, BaseColor } from '@config';
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@env";


const MainBachelorBacheloretteMenuNav = ({ }) => {

    const {colors, theme} = useTheme();
    const colorSchemeDark = theme.dark;
    const navigation = useNavigation();

    const data = [
        {
            id: 1,
            title: 'View Available Event(s)',
            color: '#FF4500',
            image: require("../../../assets/icons/competition.png"),
            route: "BacheloretteMain"
        },
        {
            id: 2,
            title: 'Create New Competition/Event',
            color: '#87CEEB',
            image: require("../../../assets/icons/createee.png"),
            route: "CreateNewBacheloretteGame"
        },
        {
            id: 3,
            title: 'Manage An Active Listing/Event',
            color: '#4682B4',
            image: require("../../../assets/icons/listing-64.png"),
            route: "ViewManageActiveSessionsBacheloretteBachelor"
        },
        {
            id: 4,
            title: 'Rules & How It Works!',
            color: BaseColor.pinkColor,
            image: require("../../../assets/icons/event-manage.png"),
            route: "BacheloretteConfirmationAboutPage"
        }
        // {
        //     id: 5,
        //     title: 'Something Future Goes Here...',
        //     color: BaseColor.greenColor,
        //     image: require("../../../assets/icons/rules64.png"),
        //     route: "BacheloretteConfirmationAboutPage"
        // },
        // {
        //     id: 6,
        //     title: 'Something Future Goes Here...',
        //     color: '#6A5ACD',
        //     image: require("../../../assets/icons/rules64.png"),
        //     route: "BacheloretteConfirmationAboutPage"
        // }
        // {
        //     id: 7,
        //     title: 'Something Future Goes Here...',
        //     color: colors.accent,
        //     image: require("../../../assets/icons/rules64.png"),
        //     route: "BacheloretteConfirmationAboutPage"
        // },
        // {
        //     id: 8,
        //     title: 'Something Future Goes Here...',
        //     color: colors.primary,
        //     image: require("../../../assets/icons/rules64.png"),
        //     route: "BacheloretteConfirmationAboutPage"
        // }
    ];

    const [ state, setState ] = useState({
        options: data
    });

    return (
        <View style={styles.container}>
            <Header
                title={"Quick Links/Redirects..."}
                subTitle={"Navigational Options"}
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
            <FlatList
                style={styles.list}
                contentContainerStyle={styles.listContainer}
                data={state.options}
                horizontal={false}
                numColumns={2}
                keyExtractor={item => {
                    return item.id
                }}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: "#000", borderWidth: 1, borderColor: colors.primary }]}
                            onPress={() => {
                                navigation.navigate(item.route);
                            }}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Image
                                    style={styles.icon}
                                    source={require("../../../assets/icons/redirect-80.png")}
                                />
                            </View>
                            <Image style={styles.cardImage} source={item.image} />
                            <View style={styles.cardFooter}>
                                <Text style={styles.subTitle}>View/Redirect...</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    );
}

const mapStateToProps = (state) => {
	return {
		authData: state.auth.tempUserData
	}
}
export default connect(mapStateToProps, {  })(MainBachelorBacheloretteMenuNav);