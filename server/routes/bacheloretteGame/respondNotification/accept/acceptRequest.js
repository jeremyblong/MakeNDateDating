const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
const config = require("config");
const FCM = require('fcm-node');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");


const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp) => {

    const { uniqueId, accountType, notificationID, from, listingID } = req.body;

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");
    const bachelorCollection = Connection.db.db("test").collection("bachelorettegames");

    const otherUser = await collection.findOne({ uniqueId: from });
    const authedUser = await collection.findOne({ uniqueId });

    if (otherUser !== null && authedUser !== null) {
        const newNotification = {
            id: uuidv4(),
            system_date: Date.now(),
            date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            data: {
                title: `Congrats, you have been ACCEPTED/CHOSEN for the in-app game/competition event (${authedUser.firstName} ~ @${authedUser.username})!`,
                body: `You're entry to the in-app game/competition or event you recently applied to has been APPROVED/ACCEPTED! CONGRATS, Check the competition page/screen for more details...`
            },
            from: authedUser.uniqueId,
            link: "bachelor-verdict-accepted"
        };

        const messageee = { 
            to: otherUser.fcmToken, 
            collapse_key: uuidv4(),
            notification: {
                title: `Congrats, you have been ACCEPTED/CHOSEN for the in-app game/competition event (${authedUser.firstName} ~ @${authedUser.username})!`,
                body: `You're entry to the in-app game/competition or event you recently applied to has been APPROVED/ACCEPTED! CONGRATS, Check the competition page/screen for more details...`
            }
        }; 
    
        bachelorCollection.findOneAndUpdate({ "joined.uniqueId": from }, { $set: {
            "joined.$.accepted": true
        }}, { returnDocument: 'after' }, (err, doc) => {
            if (err) {
    
                console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror disliked ==> :", err);
    
                resppppp.json({
                    message: "Could not find the appropriate results...",
                    err
                });
            } else {

                console.log("succcccccessss", doc.value);
                // console.log("Successfully responded to the notification ONE!", doc);
                
                collection.findOneAndUpdate({ uniqueId }, { $pull: {
                    notifications: {
                        id: notificationID
                    }
                }}, { returnDocument: 'after' }, (err, document) => {
                    if (err) {
            
                        console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror disliked ==> :", err);
            
                        resppppp.json({
                            message: "Could not find the appropriate results...",
                            err
                        });
                    } else {
                        console.log("Successfully responded to the notification TWO!", doc);
            
                        collection.findOneAndUpdate({ uniqueId: from }, { $push: { notifications: newNotification }, $inc: { rank: Math.abs(Number(6)) }}, { returnDocument: 'after' }, (err, doc) => {
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
                                            message: "Sent notification and message!"
                                        })
                                    } else {
                                        console.log("Successfully sent with response: ", responseeeeee);
                                
                                        const { value } = document;
                                        
                                        resppppp.json({ 
                                            success: true, 
                                            message: "Successfully responded to the notification!", 
                                            notifications: value.notifications
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } else {

    }
});

module.exports = router;