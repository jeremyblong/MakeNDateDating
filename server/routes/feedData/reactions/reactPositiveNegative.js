const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const { v4: uuidv4 } = require('uuid');
const _ = require("lodash");

router.post("/", async (req, resppppp) => {

    const { 
        uniqueId,
        reaction,
        reactorFullName,
        reactorUsername,
        listingID
    } = req.body;

    if (reaction === "negative") {
        const newReactionOBJ = {
            reactorID: uniqueId,
            reactorFullName,
            reactorUsername,
            reactedDate: new Date(),
            id: uuidv4(),
            reaction: "dislikes"
        }
    
        const collection = Connection.db.db("test").collection("users");
    
        const matchingResult = await collection.findOne({ "feedPosts.id": listingID });
    
        const indexedMatch = matchingResult.feedPosts.findIndex(item => item.id === listingID);

        const feedMatch = matchingResult.feedPosts[indexedMatch];
        
        const foundAMatchOrNot = _.has(feedMatch, "alreadyReacted") ? feedMatch.alreadyReacted.findIndex(item => item.reactorID === uniqueId) : -1;
    
        if (foundAMatchOrNot === -1) {
            collection.findOneAndUpdate({ "feedPosts.id": listingID }, { $inc: {
                'feedPosts.$.dislikes': 1
            }, $push: { 'feedPosts.$.alreadyReacted': newReactionOBJ }}, { returnDocument: 'after' }, async (err, doc) => {
                if (err) {
    
                    console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror disliked ==> :", err);
    
                    resppppp.json({
                        message: "Could not find the appropriate results...",
                        err
                    });
                } else {
    
                    console.log("Successfullyyyyyyyyyyyy thumbed-down...:", doc);

                    const newRankedObj = {
                        rankerID: uniqueId,
                        points: 10, 
                        positive: false
                    }
                
                    if (matchingResult.rankedArr.filter(item => item.rankerID === uniqueId).length < 3) {
                        collection.findOneAndUpdate({ "feedPosts.id": listingID }, { $inc: { rank: -Math.abs(Number(newRankedObj.points)) }, $push: { rankedArr: newRankedObj }}, { returnDocument: 'after' },  (err, data) => {
                            if (err) {
                                console.log(err.message);
                    
                                resppppp.json({
                                    message: "An error occurred while attempting to update DB information...",
                                    err
                                })
                            } else {
                                console.log("result", data);
                    
                                const { value } = doc;

                                const matchingUpdatedPost = value.feedPosts[indexedMatch];
                                
                                resppppp.json({
                                    message: "Successfully 'thumbed-down' the comment!",
                                    listing: value,
                                    feedMatch: matchingUpdatedPost
                                })
                            }
                        })
                    } else {

                        const { value } = doc;

                        const matchingUpdatedPost = value.feedPosts[indexedMatch];

                        resppppp.json({
                            message: "Can't react any further with this user's post - max reaction reached.",
                            feedMatch: matchingUpdatedPost
                        });
                    }
                }
            });
            
        } else {
    
            const selectedPreviousReaction = feedMatch.alreadyReacted[foundAMatchOrNot].reaction;
    
            collection.findOneAndUpdate({ "feedPosts.id": listingID }, { $inc: {
               [`feedPosts.$.${selectedPreviousReaction}`]: -1
            }, $pull: { 'feedPosts.$.alreadyReacted': {
                reactorID: uniqueId
            }}}, { returnDocument: 'after' }, (err, doc) => {
                if (err) {
    
                    console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror disliked ==> :", err);
    
                    resppppp.json({
                        message: "Could not find the appropriate results...",
                        err
                    });
                } else {
    
                    console.log("Successfullyyyyyyyyyyyy thumbed-down...:", doc);
    
                    const { value } = doc;

                    const matchingUpdatedPost = value.feedPosts[indexedMatch];
                    
                    resppppp.json({
                        message: "Successfully removed-previous 'thumbed-down' the comment!",
                        listing: value,
                        feedMatch: matchingUpdatedPost
                    })
                }
            });
        }
    } else {
        const newReactionOBJ = {
            reactorID: uniqueId,
            reactorFullName,
            reactorUsername,
            reactedDate: new Date(),
            id: uuidv4(),
            reaction: "likes"
        }
    
        const collection = Connection.db.db("test").collection("users");
    
        const matchingResult = await collection.findOne({ "feedPosts.id": listingID });

        const indexedMatch = matchingResult.feedPosts.findIndex(item => item.id === listingID);

        const feedMatch = matchingResult.feedPosts[indexedMatch];
        
        const foundAMatchOrNot = _.has(feedMatch, "alreadyReacted") ? feedMatch.alreadyReacted.findIndex(item => item.reactorID === uniqueId) : -1;

        console.log("foundAMatchOrNot", foundAMatchOrNot);
    
        if (foundAMatchOrNot === -1) {
            collection.findOneAndUpdate({ "feedPosts.id": listingID }, { $inc: {
                'feedPosts.$.likes': 1
            }, $push: { 'feedPosts.$.alreadyReacted': newReactionOBJ }}, { returnDocument: 'after' }, (err, doc) => {
                if (err) {
    
                    console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror liked ==> :", err);
    
                    resppppp.json({
                        message: "Could not find the appropriate results...",
                        err
                    });
                } else {
    
                    console.log("Successfullyyyyyyyyyyyy thumbed-up...:", doc);

                    const newRankedObj = {
                        rankerID: uniqueId,
                        points: 10, 
                        positive: false
                    }
                
                    if (matchingResult.rankedArr.filter(item => item.rankerID === uniqueId).length < 3) {
                        collection.findOneAndUpdate({ "feedPosts.id": listingID }, { $inc: { rank: newRankedObj.points }, $push: { rankedArr: newRankedObj }}, { returnDocument: 'after' },  (err, data) => {
                            if (err) {
                                console.log(err.message);
                    
                                resppppp.json({
                                    message: "An error occurred while attempting to update DB information...",
                                    err
                                })
                            } else {
                                console.log("result", data);

                                const { value } = doc;

                                const matchingUpdatedPost = value.feedPosts[indexedMatch];
                                
                                resppppp.json({
                                    message: "Successfully 'thumbed-up' the comment!",
                                    listing: value,
                                    feedMatch: matchingUpdatedPost
                                })
                            }
                        })
                    } else {
                        const { value } = doc;

                        const matchingUpdatedPost = value.feedPosts[indexedMatch];

                        resppppp.json({
                            message: "Can't react any further with this user's post - max reaction reached.",
                            feedMatch: matchingUpdatedPost
                        });
                    }
                }
            });
        } else {
            const selectedPreviousReaction = feedMatch.alreadyReacted[foundAMatchOrNot].reaction;

            console.log("selectedPreviousReaction", selectedPreviousReaction);

            collection.findOneAndUpdate({ "feedPosts.id": listingID }, { $inc: {
                [`feedPosts.$.${selectedPreviousReaction}`]: -1
            }, $pull: { 'feedPosts.$.alreadyReacted': {
                reactorID: uniqueId
            }}}, { returnDocument: 'after' }, (err, doc) => {
                if (err) {
    
                    console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror liked ==> :", err);
    
                    resppppp.json({
                        message: "Could not find the appropriate results...",
                        err
                    });
                } else {
    
                    console.log("Successfullyyyyyyyyyyyy thumbed-up...:", doc);
    
                    const { value } = doc;

                    const matchingUpdatedPost = value.feedPosts[indexedMatch];
                    
                    resppppp.json({
                        message: "Successfully removed-previous 'thumbed-up' the comment!",
                        listing: value,
                        feedMatch: matchingUpdatedPost
                    })
                }
            });
        }
    }
});

module.exports = router;