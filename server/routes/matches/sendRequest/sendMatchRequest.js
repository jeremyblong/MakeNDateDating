const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require("config");
const _ = require("lodash");
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, response) => {

    const collection = Connection.db.db("test").collection("users");

    const { 
        signedinID, 
        otherUserID
    } = req.body;

    const authenticatedUser = await collection.findOne({ uniqueId: signedinID });
    const otherUser = await collection.findOne({ uniqueId: otherUserID });

    const matching = await collection.findOne({ uniqueId: otherUser.uniqueId });

    const messageee = { 
        to: matching.fcmToken, 
        collapse_key: uuidv4(),
        notification: {
            title: `You have a new match request!`,
            body: `${authenticatedUser.firstName} ~ @${authenticatedUser.username} wants to match with you! Click this notification to checkout their profile and possibly match...`
        }
    };

    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `You have a new match request!`,
            body: `${authenticatedUser.firstName} ~ @${authenticatedUser.username} wants to match with you! Click this notification to checkout their profile and possibly match...`
        },
        from: authenticatedUser.uniqueId,
        link: "match-request"
    };

    collection.findOneAndUpdate({ uniqueId: otherUser.uniqueId }, { $push: { notifications: newNotification, requestedMatches: authenticatedUser.uniqueId }, $inc: { rank: Math.abs(Number(15)) }}, { returnDocument: 'after' }, (err, doc) => {
        if (err) {

            console.log("err in request...:", err);

            resppppp.json({
                message: "Failed to update other user's notification results - undo changes...",
                err
            });
            
        } else {
            const { value } = doc;

            const keysToKeep = [
                "coverPhoto", 
                "subscriptionAmountRestrictedContent", 
                "firstName", 
                "username", 
                "generatedFake",
                "email", 
                "profilePictures", 
                "uniqueId", 
                "verificationCompleted", 
                "registrationDate", 
                "registrationDateString", 
                "reviews", 
                "totalUniqueViews", 
                "rank", 
                "stripeAccountVerified", 
                "currentApproxLocation", 
                "coreProfileData", 
                "gender", 
                "interestedIn", 
                "restrictedImagesVideos", 
                "birthdateRaw", 
                "accountType",
                "subscribedUsersRestricted",
                "requestedMatches"
            ];

            const filtered = _.pick(value, keysToKeep);

            console.log("Successfully updated/pushed new notification...:", value);

            fcm.send(messageee, (err, responseeeeee) => {
                if (err) {
                    console.log("Something has gone wrong!", err);
            
                    response.json({
                        message: "Successfully sent match request!",
                        user: filtered
                    })
                } else {
                    console.log("Successfully sent with response: ", responseeeeee);
            
                    response.json({
                        message: "Successfully sent match request!",
                        user: filtered
                    })
                }
            });
        }
    })    
});

module.exports = router;