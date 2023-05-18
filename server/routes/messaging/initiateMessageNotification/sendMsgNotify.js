const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require("config");
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, response) => {

    const collection = Connection.db.db("test").collection("users");

    const { 
        other_user,
        user,
        fullName,
        message,
        subject 
    } = req.body;

    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `You have a new private message from ${fullName}`,
            body: `Subject: ${subject} \n \nMessage: ${message}`
        },
        from: user,
        link: "notifications"
    };

    const matching = await collection.findOne({ uniqueId: other_user });

    const messageee = { 
        to: matching.fcmToken, 
        collapse_key: uuidv4(),
        notification: {
            title: `You have a new private message from ${fullName}`,
            body: `Subject: ${subject} \n \nMessage: ${message}`
        }
    };

    collection.findOneAndUpdate({ uniqueId: other_user }, { $push: { notifications: newNotification }, $inc: { rank: Math.abs(Number(15)) }}, { returnDocument: 'after' }, (err, doc) => {
        if (err) {
            response.json({
                message: "Failed to update other user's notification results - undo changes...",
                err
            });
        } else {

            const { value } = doc;

            console.log("Successfully updated/pushed new notification...:", value);

            fcm.send(messageee, (err, responseeeeee) => {
                if (err) {
                    console.log("Something has gone wrong!", err);
            
                    response.json({
                        message: "Sent notification and message!"
                    })
                } else {
                    console.log("Successfully sent with response: ", responseeeeee);
            
                    response.json({
                        message: "Sent notification and message!"
                    })
                }
            });
        }
    })    
});

module.exports = router;