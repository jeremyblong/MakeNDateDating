const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const _ = require("lodash");
const { Connection } = require("../../../mongoUtil.js");
const FCM = require('fcm-node');
const moment = require("moment");

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp) => {

    const { relevantListingID, authedID, otherUserId } = req.body;

    const collection = Connection.db.db("test").collection("users");
    const mentorshipCollection = Connection.db.db("test").collection("mentors");

    const calculateTokensToReward = (tier) => {
        switch (tier) {
            case "tier-1":
                return Math.floor(Math.floor(Math.floor(35 / 0.20) * 0.85) * 0.50);
                break;
            case "tier-2":
                return Math.floor(Math.floor(Math.floor(65 / 0.20) * 0.85) * 0.50);
                break;
            case "tier-3":
                return Math.floor(Math.floor(Math.floor(100 / 0.20) * 0.85) * 0.50);
                break;
            default:
                break;
        }
    }

    const matching = await mentorshipCollection.findOne({ uniqueId: otherUserId });
    const fullAuthedUserAccount = await collection.findOne({ uniqueId: authedID });

    if (typeof matching !== "undefined" && matching !== null) {

        const indexOfRelevantListing = matching.acceptedMentorshipRequests.findIndex((item) => item.id === relevantListingID);
        const matchingListing = matching.acceptedMentorshipRequests[indexOfRelevantListing];

        const creditAmount = Math.abs(Number(calculateTokensToReward(matchingListing.tierSelected)));

        const newNotification = {
            id: uuidv4(),
            system_date: Date.now(),
            date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            data: {
                title: `User cancelled mentorship contract - You've been credited 1/2 payment (${creditAmount} tokens) for your time/energy!`,
                body: `@${fullAuthedUserAccount.username}/${fullAuthedUserAccount.firstName} has cancelled your mentorship contract. You've been given/credited approx. 1/2 (half) of the original agreed amount (${creditAmount} tokens - 15% fee's) as a payment for the time you did allocate towards this user!`
            },
            from: authedID,
            link: "user-cancelled-mentorship-credited"
        };
    
        const messageee = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: matching.fcmToken, 
            collapse_key: uuidv4(),
            notification: {
                title: `User cancelled mentorship contract - You've been credited 1/2 payment (${creditAmount} tokens) for your time/energy!`,
                body: `@${fullAuthedUserAccount.username}/${fullAuthedUserAccount.firstName} has cancelled your mentorship contract. You've been given/credited approx. 1/2 (half) of the original agreed amount (${creditAmount} tokens - 15% fee's) as a payment for the time you did allocate towards this user!`
            }
        };

        collection.findOneAndUpdate({ uniqueId: authedID  }, { $pull: {
            acceptedMentorshipRequests: {
                id: relevantListingID
            }
        } }, { returnDocument: 'after' },  (err, data) => {
            if (err) {
                console.log(err.message);

                resppppp.json({
                    message: "An error occurred while attempting to update DB information...",
                    err
                })
            } else {
                console.log("result", data);

                mentorshipCollection.findOneAndUpdate({ uniqueId: otherUserId  }, { $pull: {
                    acceptedMentorshipRequests: {
                        id: relevantListingID
                    }
                }, $inc: {
                    inAppTokenCurrency: creditAmount
                }, $push: {
                    notifications: newNotification
                }}, { returnDocument: 'after' },  (err, data) => {
                    if (err) {
                        console.log(err.message);
            
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
                                    message: "Successfully cancelled contract!"
                                })
                            } else {
                                console.log("Successfully sent with response: ", response);
            
                                resppppp.json({
                                    message: "Successfully cancelled contract!"
                                })
                            }
                        });
                    }
                })
            }
        })
    } else {
        resppppp.json({
            message: "Could not locate results or process the desired request..."
        })
    }
});

module.exports = router;