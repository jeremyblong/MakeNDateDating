const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
const config = require("config");
const FCM = require('fcm-node');
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp) => {

    const { uniqueId, accountType, listingID } = req.body;

    console.log("req.body", req.body);

    const collection = Connection.db.db("test").collection("bachelorettegames");
    const userCollection = Connection.db.db("test").collection("users");

    const matchingListing = await collection.findOne({ id: listingID });

    const idArray = [];

    if (matchingListing !== null) {

        collection.findOneAndUpdate({ id: listingID }, { $set: { page: "2", lastestRoundInit: new Date(moment(new Date()).add(3, "days")) }}, { returnDocument: 'after' }, async (err, doc) => {
            if (err) {
                resppppp.json({
                    message: "Failed to update other user's notification results - undo changes...",
                    err
                });
            } else {                            
                console.log("Successfully updated page number......:");

                const { value } = doc;

                for (let index = 0; index < value.joined.length; index++) {
                    const user = value.joined[index];

                    const newNotification = {
                        id: uuidv4(),
                        system_date: Date.now(),
                        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                        data: {
                            title: `Round ONE HAS COMMENCED for your bachelor/bachelorette competition or game!`,
                            body: `We've started round ONE for the compeitition, please click this notification to complete the first round of the compeititon, you will continously be updated of any change(s)...`,
                            data: {
                                listingDataMain: matchingListing
                            }
                        },
                        from: uniqueId,
                        link: "round-one-bachelorette-bachelor"
                    };
        
                    const fetchedUser = await userCollection.findOne({ uniqueId: user.uniqueId });
                
                    const messageee = { 
                        to: fetchedUser.fcmToken, 
                        collapse_key: uuidv4(),
                        notification: {
                            title: `Round ONE HAS COMMENCED for your bachelor/bachelorette competition or game!`,
                            body: `We've started round ONE for the compeitition, please click this notification to complete the first round of the compeititon, you will continously be updated of any change(s)...`
                        }
                    };    
                    
                    idArray.push(user.uniqueId);

                    if ((value.joined.length - 1) === index) {
                        userCollection.updateMany({ uniqueId: { $in: idArray } }, { $push: { notifications: newNotification }, $inc: { rank: Math.abs(Number(5)) }}, { returnDocument: 'after' }, (err, doc) => {
                            if (err) {
                                resppppp.json({
                                    message: "Successfully started round!",
                                    completed: true
                                })
                            } else {                            
                                console.log("Successfully updated/pushed new notification...:");
                    
                                fcm.send(messageee, (err, responseeeeee) => {
                                    if (err) {
                                        console.log("Something has gone wrong!", err);
                                
                                        resppppp.json({
                                            message: "Successfully started round!",
                                            completed: true
                                        })
                                    } else {
                                        console.log("Successfully sent with response: ", responseeeeee);
                                
                                        resppppp.json({
                                            message: "Successfully started round!",
                                            completed: true
                                        })
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
    } else {
        resppppp.json({
            message: "An error occurred while processing or attempt to process request...",
            completed: false
        })
    }
});

module.exports = router;