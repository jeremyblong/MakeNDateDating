const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const _ = require("lodash");
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, response) => {

    const { 
        uniqueId, 
        otherUserID,
        accountType
    } = req.body;

    console.log("req.body", req.body);

    const authedCollection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");
    const otherUserCollection = Connection.db.db("test").collection("users");

    const authenticatedUser = await authedCollection.findOne({ uniqueId });

    const matching = await otherUserCollection.findOne({ uniqueId: otherUserID });

    if (matching !== null) {
        const messageee = { 
            to: matching.fcmToken, 
            collapse_key: uuidv4(),
            notification: {
                title: `${authenticatedUser.firstName} is actively calling you (video call)!`,
                body: `${authenticatedUser.firstName} is activly calling you right now - please respond, if you'd like to join the call - click the notification we sent you when they initiated the call...`
            }
        };
    
        fcm.send(messageee, (err, responseeeeee) => {
            if (err) {
                console.log("Something has gone wrong!", err);
    
                response.json({
                    message: "Successfully notified of calling!"
                })
            } else {
                console.log("Successfully sent with response: ", responseeeeee);
    
                response.json({
                    message: "Successfully notified of calling!"
                })
            }
        });  
    } else {
        console.log("could NOT find user....");

        response.json({
            message: "An error occurred while fetching the relevant/desired user..."
        })
    } 
});

module.exports = router;