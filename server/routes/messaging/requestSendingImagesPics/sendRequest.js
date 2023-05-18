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

    const collection = Connection.db.db("test").collection("users");

    const { 
        otherUserID,
        authedUniqueId
    } = req.body;

    const requestingUserAccount = await collection.findOne({ uniqueId: authedUniqueId });

    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `@${requestingUserAccount.username}/${requestingUserAccount.firstName} is requesting image/picture messaging!`,
            body: `The user @${requestingUserAccount.username}/${requestingUserAccount.firstName} is requesting to send/receive images & pictures via your private messaging thread/feed. Click this notification to take action whether or not to allow images/pictures via messaging...`
        },
        from: authedUniqueId,
        link: "request-picture-messaging"
    };

    const matching = await collection.findOne({ uniqueId: otherUserID });

    if (matching !== null) {
        const messageee = { 
            to: matching.fcmToken, 
            collapse_key: uuidv4(),
            notification: {
                title: `@${requestingUserAccount.username}/${requestingUserAccount.firstName} is requesting image/picture messaging!`,
                body: `The user @${requestingUserAccount.username}/${requestingUserAccount.firstName} is requesting to send/receive images & pictures via your private messaging thread/feed. Click this notification to take action whether or not to allow images/pictures via messaging...`
            }
        };
    
        collection.findOneAndUpdate({ uniqueId: otherUserID }, { $push: { notifications: newNotification }}, { returnDocument: 'after' }, (err, doc) => {
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
                            message: "Submitted request!"
                        })
                    } else {
                        console.log("Successfully sent with response: ", responseeeeee);
                
                        response.json({
                            message: "Submitted request!"
                        })
                    }
                });
            }
        })    
    } else {
        response.json({
            message: "NOT a standard user account type - this user is likely a mentor in which picture enabling is disabled."
        });
    }
});

module.exports = router;