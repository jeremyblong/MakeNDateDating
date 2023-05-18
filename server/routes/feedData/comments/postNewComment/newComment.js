const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const config = require("config");
const axios = require("axios");
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp) => {

    const { 
        feedID,
        userID,
        message,
        subject,
        nameUsername,
        username
    } = req.body;

    const collection = Connection.db.db("test").collection("users");

    const newCommentAddition = {
        id: uuidv4(),
        postedDate: new Date(),
        postedDateString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
        message,
        subject,
        postedBy: nameUsername,
        postedByID: userID,
        postedByUsername: username
    };

    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `You've received a new comment on one of your feed 'posts'!`,
            body: `${nameUsername} said this... ${message}`
        },
        from: userID,
        link: "feed-comment-post"
    };

    const matching = await collection.findOne({ "feedPosts.id": feedID });

    const messageee = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: matching.fcmToken, 
        collapse_key: uuidv4(),
        notification: {
            title: `You've received a new comment on one of your feed 'posts'!`,
            body: `${nameUsername} said this... ${message}`
        }
    };

    collection.findOneAndUpdate({ "feedPosts.id": feedID }, { $push: {
        "feedPosts.$.comments": newCommentAddition,
        "notifications": newNotification
    }}, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err.message);

            resppppp.json({
                message: "Error occurred while updating password data/information...",
                err
            })
        } else {
            fcm.send(messageee, (err, response) => {
                if (err) {
                    console.log("Something has gone wrong!", err);

                    resppppp.json({
                        message: "Posted new comment on feeditem!",
                        newComment: newCommentAddition
                    })
                } else {
                    console.log("Successfully sent with response: ", response);

                    resppppp.json({
                        message: "Posted new comment on feeditem!",
                        newComment: newCommentAddition
                    })
                }
            });
        }
    });
});
module.exports = router;