const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const _ = require("lodash");
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp) => {

    const { relevantListingID, authedID, otherUserID, notificationID } = req.body;

    const collection = Connection.db.db("test").collection("users");
    const mentorCollection = Connection.db.db("test").collection("mentors");

    const matching = await mentorCollection.findOne({ uniqueId: otherUserID });
    const authedUserFullData = await collection.findOne({ uniqueId: authedID });

    const indexOfRelevantListing = matching.acceptedMentorshipRequests.findIndex((item) => item.id === relevantListingID);
    const matchingListing = matching.acceptedMentorshipRequests[indexOfRelevantListing];

    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `Your session completion request was APPROVED/ACCEPTED!`,
            body: `${authedUserFullData.username} has CONFIRMED that your mentorship serivces have been concluded successfully and you have now been paid & the relevant token's have been released into your account!`
        },
        from: authedID,
        link: "confirmation-completion"
    };

    const messageee = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: matching.fcmToken, 
        collapse_key: uuidv4(),
        notification: {
            title: `Your session completion request was APPROVED/ACCEPTED!`,
            body: `${authedUserFullData.username} has CONFIRMED that your mentorship serivces have been concluded successfully and you have now been paid & the relevant token's have been released into your account!`
        }
    };

    const calculateTokensToReward = (tier) => {
        switch (tier) {
            case "tier-1":
                return Math.floor(Math.floor(35 / 0.20) * 0.85);
                break;
            case "tier-2":
                return Math.floor(Math.floor(65 / 0.20) * 0.85)
                break;
            case "tier-3":
                return Math.floor(Math.floor(100 / 0.20) * 0.85)
                break;
            default:
                break;
        }
    }

    console.log("calculateTokensToReward", calculateTokensToReward("tier-1"));

    if (typeof matchingListing !== "undefined" && matchingListing !== null) {
        mentorCollection.findOneAndUpdate({ uniqueId: otherUserID }, { $push: { "notifications": newNotification }, $pull: {
            acceptedMentorshipRequests: {
                id: relevantListingID
            }
        }, $inc: {
            inAppTokenCurrency: calculateTokensToReward(matchingListing.tierSelected)
        }}, { returnDocument: 'after' },  (err, data) => {
            if (err) {
                console.log(err);
        
                resppppp.json({
                    message: "An error occurred while attempting to update DB information...",
                    err
                })
            } else {
                console.log("result", data);
    
                collection.findOneAndUpdate({ uniqueId: authedID }, { $pull: {
                    acceptedMentorshipRequests: {
                        id: relevantListingID
                    },
                    notifications: {
                        id: notificationID
                    }
                }}, { returnDocument: 'after' },  (errInner, dataInner) => {
                    if (errInner) {
                        console.log(errInner);
                
                        resppppp.json({
                            message: "An error occurred while attempting to update DB information...",
                            err: errInner
                        })
                    } else {
                        console.log("result", dataInner);
                
                        fcm.send(messageee, (err, responseeeeee) => {
                            if (err) {
                                console.log("Something has gone wrong!", err);
            
                                resppppp.json({
                                    message: "Successfully confirmed response!"
                                })
                            } else {
                                console.log("Successfully sent with response: ", responseeeeee);
            
                                resppppp.json({
                                    message: "Successfully confirmed response!"
                                })
                            }
                        });
                    }
                });
            }
        });
    } else {
        resppppp.json({
            message: "Error while trying to fetch & modify the appropriate data..."
        })
    }
});

module.exports = router;