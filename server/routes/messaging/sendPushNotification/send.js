const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require("config");
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, response) => {

    const { 
        receiverID,
        authedUniqueId,
        accountType,
        message
    } = req.body;

    const authenticatedUserCollection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");
    const collectionUsers  = Connection.db.db("test").collection("users");
    const collectionMentors = Connection.db.db("test").collection("mentors");

    const requestingUserAccount = await authenticatedUserCollection.findOne({ uniqueId: authedUniqueId });

    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `@${requestingUserAccount.username}/${requestingUserAccount.firstName} sent you a new private message!`,
            body: message
        },
        from: authedUniqueId,
        link: "new-private-message"
    };

    const matchingMentor = await collectionMentors.findOne({ uniqueId: receiverID });
    const matchingUser = await collectionUsers.findOne({ uniqueId: receiverID });

    if (matchingUser !== null) {

        const messageee = { 
            to: matchingUser.fcmToken, 
            collapse_key: uuidv4(),
            notification: {
                title: `@${requestingUserAccount.username}/${requestingUserAccount.firstName} sent you a new private message!`,
                body: message,
                data: {
                    icon: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/logo.png",
                    url: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/logo.png",
                    image: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/logo.png"
                }
            }
        };
    
        collectionUsers.findOneAndUpdate({ uniqueId: receiverID }, { $push: { notifications: newNotification }}, { returnDocument: 'after' }, (err, doc) => {
            if (err) {
                response.json({
                    message: "Failed to update other user's notification results - undo changes...",
                    err
                });
            } else {
                const { value } = doc;
    
                console.log("Successfully updated/pushed new notification...:", value);
    
                fcm.send(messageee, (err, responseeeeee) => {
                    if (err) {
                        console.log("Something has gone wrong!", err);
                
                        response.json({
                            message: "Submitted sent push notification!"
                        })
                    } else {
                        console.log("Successfully sent with response: ", responseeeeee);
                
                        response.json({
                            message: "Submitted sent push notification!"
                        })
                    }
                });
            }
        })
    } else {
        const messageee = { 
            to: matchingMentor.fcmToken, 
            collapse_key: uuidv4(),
            notification: {
                title: `@${requestingUserAccount.username}/${requestingUserAccount.firstName} sent you a new private message!`,
                body: message,
                data: {
                    icon: "https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/logo.png"
                }
            }
        };

        collectionMentors.findOneAndUpdate({ uniqueId: receiverID }, { $push: { notifications: newNotification }}, { returnDocument: 'after' }, (err, doc) => {
            if (err) {
                response.json({
                    message: "Failed to update other user's notification results - undo changes...",
                    err
                });
            } else {
                const { value } = doc;

                console.log("Successfully updated/pushed new notification...:", value);

                fcm.send(messageee, (err, responseeeeee) => {
                    if (err) {
                        console.log("Something has gone wrong!", err);
                
                        response.json({
                            message: "Submitted sent push notification!"
                        })
                    } else {
                        console.log("Successfully sent with response: ", responseeeeee);
                
                        response.json({
                            message: "Submitted sent push notification!"
                        })
                    }
                });
            }
        })
    } 
});

module.exports = router;