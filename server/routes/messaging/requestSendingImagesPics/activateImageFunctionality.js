const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const axios = require('axios');
const config = require("config");

router.post("/", async (req, response) => {

    const { 
        authenticatedUserId,
        otherUserID,
        authedAccountType
    } = req.body;

    const collectionCheck = Connection.db.db("test").collection("mentors");

    const caughtMatch = await collectionCheck.findOne({ uniqueId: otherUserID });

    const authenticatedUser = Connection.db.db("test").collection(authedAccountType === "mentorship/companionship" ? "mentors" : "users");

    if (caughtMatch === null) {

        let collection = Connection.db.db("test").collection("users");

        const alreadyReactedOrNot = await collection.findOne({ uniqueId: authenticatedUserId });

        if (!alreadyReactedOrNot.enabledSendPicturesViaMessages.includes(otherUserID)) {
            // this should use the 'users' collection...
            // update FIRST user...
            authenticatedUser.findOneAndUpdate({ uniqueId: authenticatedUserId }, { $push: { enabledSendPicturesViaMessages: otherUserID }}, { returnDocument: 'after' }, (err, doc) => {
                if (err) {
                    resppppp.json({
                        message: "Failed to update other user's notification results - undo changes...",
                        err
                    });
                } else {
                    // now update OTHER user....
                    collection.findOneAndUpdate({ uniqueId: otherUserID }, { $push: { enabledSendPicturesViaMessages: authenticatedUserId }}, { returnDocument: 'after' }, (errrrrrrr, secondValue) => {
                        if (errrrrrrr) {
                            // if fails, then remove from the first/originating document...
                            authenticatedUser.findOneAndUpdate({ uniqueId: authenticatedUserId }, { $pull: { enabledSendPicturesViaMessages: otherUserID }}, { returnDocument: 'after' }, (errorRemoval, removalValue) => {
                                if (errorRemoval) {
                                    // if fails, then remove from the first/originating document...
                
                                    
                                    resppppp.json({
                                        message: "Failed to update other user's notification results - undo changes...",
                                        err: errorRemoval
                                    });
                                } else {
                                    const { value } = removalValue;
                        
                                    console.log("Successfully updated/pushed new notification...:", value);
                        
                                    response.json({
                                        message: "Successfully enabled pictures!"
                                    })
                                }
                            }) 
                        } else {
                            const { value } = secondValue;
                
                            console.log("Successfully updated/pushed new notification...:", value);
                
                            response.json({
                                message: "Successfully enabled pictures!"
                            })
                        }
                    }) 
                }
            });
        } else {
            response.json({
                message: "Already reacted to notification!"
            })
        }
    } else {
        // this shoudl user the 'mentors' collection...
        let collection = Connection.db.db("test").collection("mentors");

        const alreadyReactedOrNot = await collection.findOne({ uniqueId: authenticatedUserId });

        if (!alreadyReactedOrNot.enabledSendPicturesViaMessages.includes(otherUserID)) {
            // update FIRST user...
            authenticatedUser.findOneAndUpdate({ uniqueId: authenticatedUserId }, { $push: { enabledSendPicturesViaMessages: otherUserID }}, { returnDocument: 'after' }, (err, doc) => {
                if (err) {
                    resppppp.json({
                        message: "Failed to update other user's notification results - undo changes...",
                        err
                    });
                } else {
                    // now update OTHER user....
                    collection.findOneAndUpdate({ uniqueId: otherUserID }, { $push: { enabledSendPicturesViaMessages: authenticatedUserId }}, { returnDocument: 'after' }, (errrrrrrr, secondValue) => {
                        if (errrrrrrr) {
                            // if fails, then remove from the first/originating document...
                            authenticatedUser.findOneAndUpdate({ uniqueId: authenticatedUserId }, { $pull: { enabledSendPicturesViaMessages: otherUserID }}, { returnDocument: 'after' }, (errorRemoval, removalValue) => {
                                if (errorRemoval) {
                                    // if fails, then remove from the first/originating document...
                
                                    
                                    resppppp.json({
                                        message: "Failed to update other user's notification results - undo changes...",
                                        err: errorRemoval
                                    });
                                } else {
                                    const { value } = removalValue;
                        
                                    console.log("Successfully updated/pushed new notification...:", value);
                        
                                    response.json({
                                        message: "Successfully enabled pictures!"
                                    })
                                }
                            }) 
                        } else {
                            const { value } = secondValue;
                
                            console.log("Successfully updated/pushed new notification...:", value);
                
                            response.json({
                                message: "Successfully enabled pictures!"
                            })
                        }
                    }) 
                }
            }) 
        } else {
            response.json({
                message: "Already reacted to notification!"
            })
        }
    }
});

module.exports = router;