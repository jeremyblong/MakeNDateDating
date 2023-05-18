import React, { Fragment } from "react";
import axios from "axios";
import { BASE_URL } from "@env";
import Toast from "react-native-toast-message";


const enablePicturesViaMessageSpecificUser = (notification, authData) => {
    console.log("enablePicturesViaMessageSpecificUser clicked/ran....");

    const config = {
        authenticatedUserId: authData.uniqueId,
        otherUserID: notification.from,
        authedAccountType: authData.accountType
    };

    axios.post(`${BASE_URL}/enable/pictures/via/messaging/specific`, config).then((res) => {
        if (res.data.message === "Successfully enabled pictures!") {
            console.log("res.data success...:", res.data);
        } else if (res.data.message === "Already reacted to notification!") {
            console.log("res.data already reacted to notification...", res.data);

            Toast.show({
                type: 'info',
                text1: `You've already reacted to this notification previously!`,
                text2: `Cannot double react to a notification that you've already reacted to...`,
                visibilityTime: 3250,
                position: "bottom"
            });
        } else {
            console.log("res.data errored...:", res.data);
        }
    }).catch((err) => {
        console.log("err", err);
    })
}

const changePendingMeetupToActiveMeetup = (notification, authData) => {
    console.log("changePendingMeetupToActiveMeetup clicked/ran....");

    const config = {
        authenticatedUserId: authData.uniqueId,
        otherUserID: notification.from,
        authedAccountType: authData.accountType
    };
    // /enable/pictures/via/messaging/specific
    axios.post(`${BASE_URL}/confirm/meetup/invitiation/notification`, config).then((res) => {
        if (res.data.message === "Successfully enabled pictures!") {
            console.log("res.data success...:", res.data);
        } else if (res.data.message === "Already reacted to notification!") {
            console.log("res.data already reacted to notification...", res.data);

            Toast.show({
                type: 'info',
                text1: `You've already reacted to this notification previously!`,
                text2: `Cannot double react to a notification that you've already reacted to...`,
                visibilityTime: 3250,
                position: "bottom"
            });
        } else {
            console.log("res.data errored...:", res.data);
        }
    }).catch((err) => {
        console.log("err", err);
    })
}

export default {
    enablePicturesViaMessageSpecificUser,
    changePendingMeetupToActiveMeetup
}