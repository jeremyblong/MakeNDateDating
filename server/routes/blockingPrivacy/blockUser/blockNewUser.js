const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const _ = require("lodash");

router.post("/", async (req, resppppp) => {

    const { uniqueId, otherUserUsername } = req.body;

    const collection = Connection.db.db("test").collection("users");
    
    const alreadyBlockedOrNot = await collection.findOne({ uniqueId });

    const findIndexMatch = _.has(alreadyBlockedOrNot, "blockedUsers") && alreadyBlockedOrNot.blockedUsers.findIndex(item => item === otherUserUsername);
    
    if (findIndexMatch === false || findIndexMatch === -1) {
        collection.findOneAndUpdate({ uniqueId }, { $push: {
            blockedUsers: otherUserUsername
        }}, { returnDocument: 'after' }, (err, document) => {
            if (err) {
                console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror disliked ==> :", err);
   
                resppppp.json({
                    message: "An error occurred while processing this request.",
                    err
                })
            } else {
               console.log("Successfullyyyyyyyyyyyy saved...:", document);

               const { value } = document;

               collection.findOneAndUpdate({ username: otherUserUsername }, { $push: {
                    blockedUsers: alreadyBlockedOrNot.username
                }}, { returnDocument: 'after' }, (err, doc) => {
                    if (err) {
                        console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror disliked ==> :", err);
        
                        resppppp.json({
                            message: "An error occurred while processing this request.",
                            err
                        })
                    } else {
                    console.log("Successfullyyyyyyyyyyyy saved...:", doc);
        
                    resppppp.json({
                            message: "Successfully blocked this user and added to list!",
                            blockedUserID: value.uniqueId
                        })
                    }
                });
            }
        });
    } else {
        resppppp.json({
            message: "You've already added this user to your blocked list..."
        })
    }
});

module.exports = router;