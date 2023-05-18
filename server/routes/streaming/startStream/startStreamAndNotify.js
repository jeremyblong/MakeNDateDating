const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const OpenTok = require("opentok");
const config = require("config");
const FCM = require('fcm-node');
const opentok = new OpenTok(config.get("vontageAPIKey"), config.get("vontageSecretKey"));
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const _ = require("lodash");

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp) => {

    const { sessionID, uniqueId, otherUserID, sessionId, streamId, token } = req.body;

    console.log("req.body create + notify...:", req.body);

    const collection = Connection.db.db("test").collection("users");

    const mentorCollection = Connection.db.db("test").collection("mentors");

    const matchedResultAuthed = await mentorCollection.findOne({ uniqueId });

    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `${matchedResultAuthed.firstName} is calling you for your mentorship appointment call!`,
            body: `${matchedResultAuthed.firstName}/@${matchedResultAuthed.username} has called you for your mentorship appointment - please join this call if you're just now receiving this notification!`,
            data: {
                sessionID: sessionId,
                generatedStreamID: streamId,
                token
            }
        },
        from: uniqueId,
        link: "live-streaming-mentorship-call"
    };

    const matching = await collection.findOne({ uniqueId: otherUserID });

    const messageee = { 
        to: matching.fcmToken, 
        collapse_key: uuidv4(),
        notification: {
            title: `${matchedResultAuthed.firstName} is calling you for your mentorship appointment call!`,
            body: `${matchedResultAuthed.firstName}/@${matchedResultAuthed.username} has called you for your mentorship appointment - please join this call if you're just now receiving this notification!`
        }
    };

    if (_.has(matching, "notifications") ? matching.notifications.some((item) => _.has(item.data.data, "generatedStreamID") && item.data.data.generatedStreamID === streamId) : false) {
        fcm.send(messageee, (err, responseeeeee) => {
            if (err) {
                console.log("Something has gone wrong!", err);
        
                resppppp.json({
                    message: "Successfully started!"
                })
            } else {
                console.log("Successfully sent with response: ", responseeeeee);
        
                resppppp.json({
                    message: "Successfully started!"
                })
            }
        });
    } else {
        collection.findOneAndUpdate({ uniqueId: otherUserID }, { $push: { notifications: newNotification }, $inc: { rank: Math.abs(Number(15)) }}, { returnDocument: 'after' }, (err, doc) => {
            if (err) {
                console.log("err in request...:", err);
    
                resppppp.json({
                    message: "Failed to update other user's notification results - undo changes...",
                    err
                });
            } else {
    
                fcm.send(messageee, (err, responseeeeee) => {
                    if (err) {
                        console.log("Something has gone wrong!", err);
                
                        resppppp.json({
                            message: "Successfully started!"
                        })
                    } else {
                        console.log("Successfully sent with response: ", responseeeeee);
                
                        resppppp.json({
                            message: "Successfully started!"
                        })
                    }
                });
            }
        });
    }
});

module.exports = router;