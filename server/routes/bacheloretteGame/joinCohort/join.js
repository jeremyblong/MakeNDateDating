const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const { Connection } = require("../../../mongoUtil.js");
const _ = require('lodash');
const config = require("config");
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp, next) => {

    const { uniqueId, accountType, listingID } = req.body;

	const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");
    const bacheloretteCollection = Connection.db.db("test").collection("bachelorettegames");

    const gatheredUser = await collection.findOne({ uniqueId });
    const listingRelevant = await bacheloretteCollection.findOne({ id: listingID });

    const fields = [
        "coverPhoto", 
        "subscriptionAmountRestrictedContent", 
        "firstName", 
        "username", 
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

    if (gatheredUser !== null && listingRelevant !== null) {

        const newNotification = {
            id: uuidv4(),
            system_date: Date.now(),
            date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            data: {
                title: `You have a new in-game/competition request to join from ${gatheredUser.firstName} ${gatheredUser.lastName.charAt(0)}`,
                body: `You have a new 'join request' for your competition/game regarding the in-app game in-app functionality - please click this notification to accept/deny the request.`,
                data: {
                    listingID
                }
            },
            from: uniqueId,
            link: "bachelor-game-pending"
        };
    
        const otherUser = await collection.findOne({ uniqueId: listingRelevant.postedByID });
    
        const messageee = { 
            to: otherUser.fcmToken, 
            collapse_key: uuidv4(),
            notification: {
                title: `You have a new in-game/competition request to join from ${gatheredUser.firstName} ${gatheredUser.lastName.charAt(0)}`,
                body: `You have a new 'join request' for your competition/game regarding the in-app game in-app functionality - please click this notification to accept/deny the request.`
            }
        };    
        // check for existing join...
        const matchingFoundIndex = listingRelevant.joined.findIndex(item => item.uniqueId === uniqueId);
        // check for match...
        if (matchingFoundIndex === -1) {
            if ((listingRelevant.joined.length + 1) >= (listingRelevant.listingData.canidateCount - 1)) {

                console.log("bOOYAH!");

                console.log("otherUser.uniqueId", otherUser.uniqueId);

                const newAdditionUser = {
                    ..._.pick(gatheredUser, fields),
                    specificID: uuidv4(),
                    dateJoined: new Date(),
                    dateJoinedFormatted: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
                    accepted: true
                }
    
                bacheloretteCollection.findOneAndUpdate({ id: listingID }, { $push: {
                    joined: newAdditionUser
                }, $set: {
                    "joinable": false
                }}, { returnDocument: 'after' },  (err, data) => {
                    if (err) {
                        console.log(err.message);
            
                        resppppp.json({
                            message: "Error occurred while attempting to send your request...",
                            err
                        })
                    } else {

                        const { value } = data;

                        bacheloretteCollection.updateMany({ id: listingID }, { $set: {
                            "joined.$[].accepted": true
                        }}, { returnDocument: 'after' }, (err, dataaa) => {
                            if (err) {
                                console.log(err.message);
                    
                                resppppp.json({
                                    message: "Error occurred while attempting to send your request...",
                                    err
                                })
                            } else {

                                collection.findOneAndUpdate({ uniqueId: otherUser.uniqueId }, { $push: { notifications: newNotification }, $inc: { rank: Math.abs(Number(6)) }}, { returnDocument: 'after' }, (err, doc) => {
                                    if (err) {
                                        resppppp.json({
                                            message: "Failed to update other user's notification results - undo changes...",
                                            err
                                        });
                                    } else {                            
                                        console.log("Successfully updated/pushed new notification...:");
                            
                                        fcm.send(messageee, (err, responseeeeee) => {
                                            if (err) {
                                                console.log("Something has gone wrong!", err);
                                        
                                                resppppp.json({
                                                    message: "Successfully sent invitiation request!",
                                                    listing: value,
                                                    eliminate: true
                                                })
                                            } else {
                                                console.log("Successfully sent with response: ", responseeeeee);
                                        
                                                resppppp.json({
                                                    message: "Successfully sent invitiation request!",
                                                    listing: value,
                                                    eliminate: true
                                                })
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                console.log("otherUser.uniqueId", otherUser.uniqueId);
    
                const newAdditionUser = {
                    ..._.pick(gatheredUser, fields),
                    specificID: uuidv4(),
                    dateJoined: new Date(),
                    dateJoinedFormatted: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
                    accepted: false
                }
    
                bacheloretteCollection.findOneAndUpdate({ id: listingID }, { $push: {
                    joined: newAdditionUser
                }}, { returnDocument: 'after' },  (err, data) => {
                    if (err) {
                        console.log(err.message);
            
                        resppppp.json({
                            message: "Error occurred while attempting to send your request...",
                            err
                        })
                    } else {

                        const { value } = data;
    
                        collection.findOneAndUpdate({ uniqueId: otherUser.uniqueId }, { $push: { notifications: newNotification }, $inc: { rank: Math.abs(Number(6)) }}, { returnDocument: 'after' }, (err, doc) => {
                            if (err) {
                                resppppp.json({
                                    message: "Failed to update other user's notification results - undo changes...",
                                    err
                                });
                            } else {                            
                                console.log("Successfully updated/pushed new notification...:");
                    
                                fcm.send(messageee, (err, responseeeeee) => {
                                    if (err) {
                                        console.log("Something has gone wrong!", err);
                                
                                        resppppp.json({
                                            message: "Successfully sent invitiation request!",
                                            listing: value,
                                            eliminate: false
                                        })
                                    } else {
                                        console.log("Successfully sent with response: ", responseeeeee);
                                
                                        resppppp.json({
                                            message: "Successfully sent invitiation request!",
                                            listing: value,
                                            eliminate: false
                                        })
                                    }
                                });
                            }
                        });
                    }
                });
            }
        } else {
            resppppp.json({
                message: "You've ALREADY joined this game/competition!",
                err: null
            })
        }
    } else {
        resppppp.json({
            message: "Error occurred while attempting to send your request...",
            err: null
        })
    }
});

module.exports = router;