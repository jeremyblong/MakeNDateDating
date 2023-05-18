const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const aws = require('aws-sdk');
const moment = require("moment");
const { Connection } = require("../../../../mongoUtil.js");
const _ = require("lodash");

router.post("/", async (req, resppppp, next) => {

    const { postedByID, uniqueId, reactorName, reactorUsername } = req.body;

    const generatedID = uuidv4();

    const collection = Connection.db.db("test").collection("mentors");

    const matchingResult = await collection.findOne({ uniqueId: postedByID });

    const newReactionOBJ = {
        reactorID: uniqueId,
        reactorName,
        reactorUsername,
        reactedDate: new Date(),
        id: generatedID
    }
    if (_.has(matchingResult, "hearts")) {
        if (matchingResult.hearts.findIndex(item => item.reactorID === uniqueId) === -1) {
            collection.findOneAndUpdate({ uniqueId: postedByID }, { $push: { hearts: newReactionOBJ } }, { returnDocument: 'after' }, (err, data) => {
                if (err) {
                    resppppp.json({
                        message: "An error occurred while attempting to modify user data...",
                        err
                    })
                } else {
                    const { value } = data;
        
                    resppppp.json({
                        message: "Submitted heart/like!",
                        hearts: value.hearts
                    })
                }
            })
        } else {
            collection.findOneAndUpdate({ uniqueId: postedByID }, { $pull: { hearts: { reactorID: uniqueId }} }, { returnDocument: 'after' }, (err, data) => {
                if (err) {
                    resppppp.json({
                        message: "An error occurred while attempting to modify user data...",
                        err
                    })
                } else {
                    const { value } = data;
        
                    resppppp.json({
                        message: "Submitted heart/like!",
                        hearts: value.hearts
                    })
                }
            })
        }
    } else {
        collection.findOneAndUpdate({ uniqueId: postedByID }, { $push: { hearts: newReactionOBJ } }, { returnDocument: 'after' }, (err, data) => {
            if (err) {
                resppppp.json({
                    message: "An error occurred while attempting to modify user data...",
                    err
                })
            } else {
                const { value } = data;
    
                resppppp.json({
                    message: "Submitted heart/like!",
                    hearts: value.hearts
                })
            }
        })
    }
});

module.exports = router;