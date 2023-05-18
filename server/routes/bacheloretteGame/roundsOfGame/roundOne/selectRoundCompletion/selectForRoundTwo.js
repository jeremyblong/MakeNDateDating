const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../../mongoUtil.js");
const config = require("config");
const FCM = require('fcm-node');
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const _ = require("lodash");

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp) => {

    const { selectedUserID, listingID, signedInID } = req.body;

    console.log("req.body", req.body);

    const collection = Connection.db.db("test").collection("bachelorettegames");
    const userCollection = Connection.db.db("test").collection("users");

    const matchingListing = await collection.findOne({ id: listingID });
    const signedinUserData = await userCollection.findOne({ uniqueId: signedInID });

    if (matchingListing !== null) {
        const totalUsersNum = matchingListing.joined.length;
        const submittedResultsNum = _.has(matchingListing, "acceptedOrDenied") ? (matchingListing.acceptedOrDenied.length + 1) : 0;

        console.log("totalUsersNum", totalUsersNum, submittedResultsNum);

        console.log("divided...", (submittedResultsNum / totalUsersNum));

        const dividedNum = (submittedResultsNum / totalUsersNum);

        console.log("dividedNum", dividedNum);

        if (dividedNum >= 0.75) {
            console.log("continue to next round...!");

            const newAcceptDenyObj = {
                accepted: true,
                idOfUser: selectedUserID
            };
    
            collection.findOneAndUpdate({ id: listingID }, { $pull: {
                pageTwoQuestionareResults: {
                    submittingUserID: selectedUserID
                }
            }, $push: {
                acceptedOrDenied: newAcceptDenyObj
            }, $set: {
                page: "3",
                completedRoundIds: []
            }}, { returnDocument: 'after' }, async (err, doc) => {
                if (err) {
                    resppppp.json({
                        message: "Failed to update other user's notification results...",
                        err
                    });
                } else {                            
                    console.log("Successfully selected user round TWO......:");
    
                    const { value } = doc;

                    const newPromise = new Promise((resolve, reject) => {    
                        const lengthOfArray = value.acceptedOrDenied.length - 1;

                        value.acceptedOrDenied.map(async (dataaaa, indexxxxxx) => {
                            if (dataaaa.accepted === true) {

                                const userDataCustom = await userCollection.findOne({ uniqueId: dataaaa.idOfUser });
                                const newNotification = {
                                    id: uuidv4(),
                                    system_date: Date.now(),
                                    date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                                    data: {
                                        title: `You've been selected for ROUND TWO!`,
                                        body: `You've been accepted into the second round of the competition by ${signedinUserData.firstName}/@${signedinUserData.username}, Congrats!`,
                                        data: {
                                            gameID: matchingListing.id
                                        }
                                    },
                                    from: dataaaa.idOfUser,
                                    link: "round-two-continuation"
                                };
                            
                                const messageee = { 
                                    to: userDataCustom.fcmToken, 
                                    collapse_key: uuidv4(),
                                    notification: {
                                        title: `You've been selected for ROUND TWO!`,
                                        body: `You've been accepted into the second round of the competition by ${signedinUserData.firstName}/@${signedinUserData.username}, Congrats!`
                                    }
                                };

                                userCollection.findOneAndUpdate({ uniqueId: dataaaa.idOfUser }, { $push: { notifications: newNotification }, $inc: { rank: Math.abs(Number(5)) }}, { returnDocument: 'after' }, (err, doc) => {
                                    if (err) {
                                        resppppp.json({
                                            message: "An error occurred while processing your request..."
                                        })
                                    } else {                            
                                        console.log("Successfully updated/pushed new notification...:");
                            
                                        fcm.send(messageee, (err, responseeeeee) => {
                                            if (err) {
                                                console.log("Something has gone wrong!", err);

                                                if (indexxxxxx === lengthOfArray) {
                                                    resolve();
                                                }
                                            } else {
                                                console.log("Successfully sent with response: ", responseeeeee);
                                                
                                                if (indexxxxxx === lengthOfArray) {
                                                    resolve();
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                if (indexxxxxx === lengthOfArray) {
                                    resolve();
                                }
                            }
                        });
                    })
                    
                    newPromise.then((passedValues) => {
                        resppppp.json({
                            message: "Selected user for round two!",
                            completed: true,
                            listing: value
                        })
                    })
                }
            });
        } else {
            const newAcceptDenyObj = {
                accepted: true,
                idOfUser: selectedUserID
            };
    
            collection.findOneAndUpdate({ id: listingID }, { $pull: {
                pageTwoQuestionareResults: {
                    submittingUserID: selectedUserID
                }
            }, $push: {
                acceptedOrDenied: newAcceptDenyObj
            }}, { returnDocument: 'after' }, async (err, doc) => {
                if (err) {
                    resppppp.json({
                        message: "Failed to update other user's notification results...",
                        err
                    });
                } else {                            
                    console.log("Successfully selected user round TWO......:");
    
                    const { value } = doc;
                    
                    resppppp.json({
                        message: "Selected user for round two!",
                        completed: false,
                        listing: value
                    })
                }
            });
        }
    } else {
        resppppp.json({
            message: "An error occurred while processing or attempt to process request...",
            completed: false,
            listing: null
        })
    }
});

module.exports = router;