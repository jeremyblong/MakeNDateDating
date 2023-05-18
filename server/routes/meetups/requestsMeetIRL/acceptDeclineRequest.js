const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));


router.post("/", async (req, resppppp) => {

    const { meetupID, uniqueId, otherUserID, accepted, username, firstName } = req.body;

    const collection = Connection.db.db("test").collection("users");

    if (accepted) {
        const newNotification = {
            id: uuidv4(),
            system_date: Date.now(),
            date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            data: {
                title: `${username} accepted your meetup request!`,
                body: `Congrats! ${firstName}/@${username} wants to meet-up in-person with you soon and has ACCEPTED your request...! Have a good time and remember to be safe!`
            },
            from: uniqueId,
            link: ""
        };

        const matching = await collection.findOne({ uniqueId: otherUserID });

        const messageee = { 
            to: matching.fcmToken, 
            collapse_key: uuidv4(),
            notification: {
                title: `${username} accepted your meetup request!`,
                body: `Congrats! ${firstName}/@${username} wants to meet-up in-person with you soon and has ACCEPTED your request...! Have a good time and remember to be safe!`
            }
        };

        collection.findOneAndUpdate({ uniqueId, "meetupRequestsPending.id": meetupID }, { $set: {
            "meetupRequestsPending.$.accepted": true,
            "meetupRequestsPending.$.reacted": true
        }}, { returnDocument: 'after' },  (err, data) => {
            if (err) {
                console.log(err);
    
                resppppp.json({
                    message: "An error occurred while attempting to update DB information...",
                    err
                })
            } else {
                console.log("result", data);
    
                collection.findOneAndUpdate({ uniqueId: otherUserID, "meetupRequestsPending.id": meetupID }, { $set: {
                    "meetupRequestsPending.$.accepted": true,
                    "meetupRequestsPending.$.reacted": true
                }, $push: {
                    notifications: newNotification
                }}, { returnDocument: 'after' },  (err, document) => {
                    if (err) {
                        console.log(err);
            
                        resppppp.json({
                            message: "An error occurred while attempting to update DB information...",
                            err
                        })
                    } else {
                        console.log("result", document);

                        fcm.send(messageee, (err, responseeeeee) => {
                            if (err) {
                                console.log("Something has gone wrong!", err);
                        
                                resppppp.json({
                                    message: "Successfully accepted the request!",
                                    group: document.value
                                })
                            } else {
                                console.log("Successfully sent with response: ", responseeeeee);
                        
                                resppppp.json({
                                    message: "Successfully accepted the request!",
                                    group: document.value
                                })
                            }
                        });
                    }
                })
            }
        })
    } else {
        const newNotification = {
            id: uuidv4(),
            system_date: Date.now(),
            date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
            data: {
                title: `${username} declined your meetup request :(`,
                body: `Unfortunately, ${firstName}/@${username} has declined your 'meetup' request - maybe this just wasn't the right time - don't get your hopes down - keep fishin'! ❤️`
            },
            from: uniqueId,
            link: ""
        };

        collection.findOneAndUpdate({ uniqueId, "meetupRequestsPending.id": meetupID }, { $set: {
            "meetupRequestsPending.$.reacted": true
        }}, { returnDocument: 'after' },  (err, data) => {
            if (err) {
                console.log(err);
    
                resppppp.json({
                    message: "An error occurred while attempting to update DB information...",
                    err
                })
            } else {
                console.log("result", data);
    
                collection.findOneAndUpdate({ uniqueId: otherUserID, "meetupRequestsPending.id": meetupID }, { $set: {
                    "meetupRequestsPending.$.reacted": true
                }, $push: {
                    notifications: newNotification
                }}, { returnDocument: 'after' },  (err, document) => {
                    if (err) {
                        console.log(err);
            
                        resppppp.json({
                            message: "An error occurred while attempting to update DB information...",
                            err
                        })
                    } else {
                        console.log("result", document);
            
                        resppppp.json({
                            message: "Successfully accepted the request!",
                            group: document.value
                        })
                    }
                })
            }
        })
    }
});

module.exports = router;