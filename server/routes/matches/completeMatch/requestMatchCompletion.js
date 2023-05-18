const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const _ = require("lodash");
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp) => {

    const { otherUser, authData, listingID } = req.body;

    const { uniqueId } = authData;

    const collection = Connection.db.db("test").collection("users");
    const mentorCollection = Connection.db.db("test").collection("mentors");

    const matching = await collection.findOne({ uniqueId: otherUser });
    const authedUserFullData = await mentorCollection.findOne({ uniqueId });

    const indexOfRelevantListing = authedUserFullData.acceptedMentorshipRequests.findIndex((item) => item.id === listingID);
    const matchingListing = authedUserFullData.acceptedMentorshipRequests[indexOfRelevantListing];

    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `You have a new completion therapy request!`,
            body: `${authedUserFullData.username} has requested that you confirm whether or not the services were rendered/provided and that you have completed the agreed meetings... Please confirm whether or not all meetings have been completed!`,
            data: matchingListing
        },
        from: uniqueId,
        link: "completion-mentorship-contract-request"
    };

    const messageee = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: matching.fcmToken, 
        collapse_key: uuidv4(),
        notification: {
            title: `You have a new completion therapy request!`,
            body: `${authedUserFullData.username} has requested that you confirm whether or not the services were rendered/provided and that you have completed the agreed meetings... Please confirm whether or not all meetings have been completed!`
        }
    };

    const newPendingRequest = {
        id: uuidv4(),
        dateInitiated: Date.now(),
        dateInitiatedFormatted: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        requestingUserID: uniqueId,
        expiresAt: new Date(moment(new Date()).add(3, 'days')),
        originalDataRequest: matchingListing
    }

    collection.findOneAndUpdate({ uniqueId: otherUser }, { $push: { "notifications": newNotification, "completionMentorshipRequestsPending": newPendingRequest }}, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err);
    
            resppppp.json({
                message: "An error occurred while attempting to update DB information...",
                err
            })
        } else {
            console.log("result", data);
    
            fcm.send(messageee, (err, response) => {
                if (err) {
                    console.log("Something has gone wrong!", err);

                    resppppp.json({
                        message: "Successfully sent completion request!"
                    })
                } else {
                    console.log("Successfully sent with response: ", response);

                    resppppp.json({
                        message: "Successfully sent completion request!"
                    })
                }
            });
        }
    });
});

module.exports = router;