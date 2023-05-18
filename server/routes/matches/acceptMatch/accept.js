const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require("config");
const _ = require("lodash");
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, response) => {

    const collection = Connection.db.db("test").collection("users");

    const { 
        uniqueId, 
        selectedUser
    } = req.body;

    const authenticatedUser = await collection.findOne({ uniqueId });

    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `${authenticatedUser.firstName} accepted your match request!`,
            body: `${authenticatedUser.firstName} has requested your match request, you may now connect in more intimate ways such as 1v1 video calling & engage in various game-like activities to get to know eachtoher...`
        },
        from: uniqueId,
        link: "match-accepted"
    };

    const matching = await collection.findOne({ uniqueId: selectedUser.uniqueId });

    const messageee = { 
        to: matching.fcmToken, 
        collapse_key: uuidv4(),
        notification: {
            title: `${authenticatedUser.firstName} accepted your match request!`,
            body: `${authenticatedUser.firstName} has requested your match request, you may now connect in more intimate ways such as 1v1 video calling & engage in various game-like activities to get to know eachtoher...`
        }
    };

    collection.findOneAndUpdate({ uniqueId: selectedUser.uniqueId }, { $push: { notifications: newNotification, acceptedMatches: authenticatedUser.uniqueId }, $inc: { rank: Math.abs(Number(10)) }}, { returnDocument: 'after' }, (err, doc) => {
        if (err) {
            console.log("err in request...:", err);

            response.json({
                message: "Failed to update other user's notification results - undo changes...",
                err
            });
        } else {
            collection.findOneAndUpdate({ uniqueId }, { $push: { acceptedMatches: selectedUser.uniqueId }, $pull: {
                requestedMatches: selectedUser.uniqueId
            }, $inc: { rank: Math.abs(Number(10)) }}, { returnDocument: 'after' }, (errrrrr, doccccc) => {
                if (errrrrr) {
                    console.log("errrrrr in request...:", errrrrr);
        
                    response.json({
                        message: "Failed to update other user's notification results - undo changes...",
                        err: errrrrr
                    });
                } else {
                    const { value } = doccccc;

                    fcm.send(messageee, (err, responseeeeee) => {
                        if (err) {
                            console.log("Something has gone wrong!", err);
        
                            response.json({
                                message: "Successfully matched!",
                                user: value
                            })
                        } else {
                            console.log("Successfully sent with response: ", responseeeeee);
        
                            response.json({
                                message: "Successfully matched!",
                                user: value
                            })
                        }
                    });
                }
            })   
        }
    })    
});

module.exports = router;