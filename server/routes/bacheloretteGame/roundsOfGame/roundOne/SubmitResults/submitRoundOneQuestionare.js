const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../../mongoUtil.js");
const config = require("config");
const FCM = require('fcm-node');
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");


const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp) => {

    const { uniqueId, notificationID, responses, listingID, otherUserID } = req.body;

    const collection = Connection.db.db("test").collection("bachelorettegames");
    const userCollection = Connection.db.db("test").collection("users");

    const fetchedOtherUser = await userCollection.findOne({ uniqueId: otherUserID });
    const fetchedAuthedUser = await userCollection.findOne({ uniqueId });

    if (fetchedAuthedUser !== null && fetchedOtherUser !== null) {
        collection.findOneAndUpdate({ id: listingID }, { $push: { pageTwoQuestionareResults: {
            submittingUserID: uniqueId,
            generatedID: uuidv4(),
            submittedDate: new Date(),
            username: fetchedAuthedUser.username,
            fullName: `${fetchedAuthedUser.firstName} ${fetchedAuthedUser.lastName.charAt(0)}`,
            accountType: fetchedAuthedUser.accountType,
            responses: {
                ...responses
            }
        }, completedRoundIds: uniqueId }}, { returnDocument: 'after' }, async (err, doc) => {
            if (err) {
                resppppp.json({
                    message: "Failed to update other user's notification results - undo changes...",
                    err
                });
            } else {                            
                console.log("Successfully executed logic/data......:");
    
                const newNotification = {
                    id: uuidv4(),
                    system_date: Date.now(),
                    date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                    data: {
                        title: `A contestant has submitted ROUND ONE RESPONSES!`,
                        body: `A user has SUBMITTED their responses for the questionare round of the in-app game/competition - ${fetchedAuthedUser.firstName}/@${fetchedAuthedUser.username} was the one who submitted these results. Click to view...`,
                        data: {}
                    },
                    from: uniqueId,
                    link: "round-one-results-submission"
                };
            
                const messageee = { 
                    to: fetchedOtherUser.fcmToken, 
                    collapse_key: uuidv4(),
                    notification: {
                        title: `A contestant has submitted ROUND ONE RESPONSES!`,
                        body: `A user has SUBMITTED their responses for the questionare round of the in-app game/competition - ${fetchedAuthedUser.firstName}/@${fetchedAuthedUser.username} was the one who submitted these results. Click to view...`
                    }
                };    
                
                userCollection.findOneAndUpdate({ uniqueId: otherUserID }, { $push: { notifications: newNotification }, $inc: { rank: Math.abs(Number(5)) }}, { returnDocument: 'after' }, (err, doc) => {
                    if (err) {
                        resppppp.json({
                            message: "An error occurred while processing your request..."
                        })
                    } else {                            
                        console.log("Successfully updated/pushed new notification...:");
            
                        userCollection.findOneAndUpdate({ uniqueId }, { $pull: { notifications: {
                            id: notificationID
                        }}}, { returnDocument: 'after' }, (err, doc) => {
                            if (err) {
                                resppppp.json({
                                    message: "An error occurred while processing your request..."
                                })
                            } else {                            
                                console.log("Successfully updated/pushed new notification...:");
                    
                                fcm.send(messageee, (err, responseeeeee) => {
                                    if (err) {
                                        console.log("Something has gone wrong!", err);
                                
                                        resppppp.json({
                                            message: "An error occurred while processing your request..."
                                        })
                                    } else {
                                        console.log("Successfully sent with response: ", responseeeeee);
                                
                                        resppppp.json({
                                            message: "Successfully submitted results/data!",
                                            completed: true
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
        resppppp.json({
            message: "An error occurred while processing your request..."
        })
    }
});

module.exports = router;