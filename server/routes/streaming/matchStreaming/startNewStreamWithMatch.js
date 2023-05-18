const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const OpenTok = require("opentok");
const config = require("config");
const FCM = require('fcm-node');
const opentok = new OpenTok(config.get("vontageAPIKey"), config.get("vontageSecretKey"));
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp) => {

    const { sessionID, uniqueId, otherUserID, sessionId, streamId, token } = req.body;

    console.log("req.body create + notify...:", req.body);

    const collection = Connection.db.db("test").collection("users");

    const matchedResultAuthed = await collection.findOne({ uniqueId });

    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `${matchedResultAuthed.firstName} is calling you to chat! (Your recent match)`,
            body: `${matchedResultAuthed.firstName}/@${matchedResultAuthed.username} has called you, please click this notification while they're still calling and you will be redirected & join the call!`,
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
            title: `${matchedResultAuthed.firstName} is calling you to chat! (Your recent match)`,
            body: `${matchedResultAuthed.firstName}/@${matchedResultAuthed.username} has called you, please click this notification while they're still calling and you will be redirected & join the call!`
        }
    };

    collection.findOneAndUpdate({ uniqueId: otherUserID }, { $push: { notifications: newNotification }, $inc: { rank: Math.abs(Number(20)) }}, { returnDocument: 'after' }, (err, doc) => {
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
});

module.exports = router;