const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const _ = require("lodash");

router.post("/", async (req, resppppp) => {

    const { authedUniqueId, otherUserID } = req.body;

    const collection = Connection.db.db("test").collection("users");
    const mentorCollection = Connection.db.db("test").collection("mentors");

    const newRankedObj = {
        rankerID: authedUniqueId,
        points: 20, 
        positive: true
    }

    const matchingResult = await collection.findOne({ uniqueId: otherUserID });

    if (typeof matchingResult !== "undefined" && matchingResult !== null) {
        if (_.has(matchingResult, "rankedArr")) {
            if (matchingResult.rankedArr.filter(item => item.rankerID === authedUniqueId).length < 3) {
                // add double points...
                collection.findOneAndUpdate({ uniqueId: otherUserID }, { $inc: { rank: 20 }, $push: { rankedArr: newRankedObj }}, { returnDocument: 'after' },  (err, data) => {
                    if (err) {
                        console.log(err.message);
            
                        resppppp.json({
                            message: "An error occurred while attempting to update DB information...",
                            err
                        })
                    } else {
                        console.log("result", data);
            
                        resppppp.json({
                            message: "Submitted feedback successfully!"
                        })
                    }
                })
            } else {
                resppppp.json({
                    message: "You've already reacted to this user too many times!"
                })
            }
        } else {
            // add double points...
            collection.findOneAndUpdate({ uniqueId: otherUserID }, { $inc: { rank: 20 }, $push: { rankedArr: newRankedObj }}, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);
    
                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    })
                } else {
                    console.log("result", data);
    
                    resppppp.json({
                        message: "Submitted feedback successfully!"
                    })
                }
            });
        }
    } else {
        const matchingResultMentor = await mentorCollection.findOne({ uniqueId: otherUserID });

        if (_.has(matchingResultMentor, "rankedArr")) {
            if (matchingResultMentor.rankedArr.filter(item => item.rankerID === authedUniqueId).length < 3) {
                // add double points...
                collection.findOneAndUpdate({ uniqueId: otherUserID }, { $inc: { rank: 20 }, $push: { rankedArr: newRankedObj }}, { returnDocument: 'after' },  (err, data) => {
                    if (err) {
                        console.log(err.message);
            
                        resppppp.json({
                            message: "An error occurred while attempting to update DB information...",
                            err
                        })
                    } else {
                        console.log("result", data);
            
                        resppppp.json({
                            message: "Submitted feedback successfully!"
                        })
                    }
                })
            } else {
                resppppp.json({
                    message: "You've already reacted to this user too many times!"
                })
            }
        } else {
            // add double points...
            collection.findOneAndUpdate({ uniqueId: otherUserID }, { $inc: { rank: 20 }, $push: { rankedArr: newRankedObj }}, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);
    
                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    })
                } else {
                    console.log("result", data);
    
                    resppppp.json({
                        message: "Submitted feedback successfully!"
                    })
                }
            });
        }
    }
});

module.exports = router;