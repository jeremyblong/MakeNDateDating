const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
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
        const submittedResultsNum = _.has(matchingListing, "acceptedOrDeniedRoundThree") ? (matchingListing.acceptedOrDeniedRoundThree.length + 1) : 0;

        console.log("totalUsersNum", totalUsersNum, submittedResultsNum);

        console.log("divided...", (submittedResultsNum / totalUsersNum));

        const dividedNum = (submittedResultsNum / totalUsersNum);

        console.log("dividedNum", dividedNum);

        if (dividedNum >= 0.6) {
            console.log("continue to next round END...!");

            const arrayOfIDSRemove = matchingListing.acceptedOrDeniedRoundThree.filter((itemmmm) => itemmmm.accepted === true);
            const mappedIDS = arrayOfIDSRemove.map((item) => item.idOfUser);
            const arrayOfUsersEliminate = [...mappedIDS, selectedUserID];
            const removeFromJoined = matchingListing.joined.filter(item => !arrayOfUsersEliminate.includes(item.uniqueId));
            const removeTheseIDS = removeFromJoined.map(item => item.uniqueId);

            const newAcceptDenyObj = {
                accepted: true,
                idOfUser: selectedUserID
            };
    
            collection.findOneAndUpdate({ id: listingID }, { "$pull": { "joined": { "uniqueId": { $in: removeTheseIDS }}}, $push: {
                acceptedOrDeniedRoundThree: newAcceptDenyObj
            }, $set: {
                page: "4"
            }}, { returnDocument: 'after' }, async (err, doc) => {
                if (err) {
                    resppppp.json({
                        message: "Failed to update other user's notification results...",
                        err
                    });
                } else {                            
                    console.log("Successfully selected user round FOUR......:");
    
                    const { value } = doc;

                    const newPromise = new Promise((resolve, reject) => {    
                        const lengthOfArray = value.acceptedOrDeniedRoundThree.length - 1;

                        value.acceptedOrDeniedRoundThree.map(async (dataaaa, indexxxxxx) => {
                            if (dataaaa.accepted === true) {

                                const userDataCustom = await userCollection.findOne({ uniqueId: dataaaa.idOfUser });
                                const newNotification = {
                                    id: uuidv4(),
                                    system_date: Date.now(),
                                    date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                                    data: {
                                        title: `You've been selected for ROUND THREE!`,
                                        body: `You've been accepted into the THIRD round of the competition by ${signedinUserData.firstName}/@${signedinUserData.username}, Congrats!`,
                                        data: {
                                            gameID: matchingListing.id
                                        }
                                    },
                                    from: dataaaa.idOfUser,
                                    link: "round-three-continuation"
                                };
                            
                                const messageee = { 
                                    to: userDataCustom.fcmToken, 
                                    collapse_key: uuidv4(),
                                    notification: {
                                        title: `You've been selected for ROUND THREE!`,
                                        body: `You've been accepted into the THIRD round of the competition by ${signedinUserData.firstName}/@${signedinUserData.username}, Congrats!`
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
                            message: "Submitted user to round 4!",
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
    
            collection.findOneAndUpdate({ id: listingID }, { $push: {
                acceptedOrDeniedRoundThree: newAcceptDenyObj
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
                        message: "Submitted user to round 4!",
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