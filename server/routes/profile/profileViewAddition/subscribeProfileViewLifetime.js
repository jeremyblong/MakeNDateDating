const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const _ = require("lodash");

router.post("/", async (req, resppppp) => {

    const { accountType, uniqueId } = req.body;

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");
    
    const matchingUserCheckAuthedUser = await collection.findOne({ uniqueId });

    if (matchingUserCheckAuthedUser.inAppTokenCurrency >= config.get("viewProfileViewsCost")) {
        collection.findOneAndUpdate({ uniqueId }, { $set: {
            profileViewSubscription: true
        }, $inc: {
            inAppTokenCurrency: -config.get("viewProfileViewsCost")
        }}, { returnDocument: 'after' }, (errrrrrrr, doc) => {
                if (errrrrrrr) {
                console.log("Errrrrrrr occurred while adding/setting subscription field..", err);
    
                resppppp.json({
                    message: "An error occurred while attempting to update DB information...",
                    err: errrrrrrr
                });
            } else {
                console.log("Successfully added new update...", doc);
                
                resppppp.json({
                    message: "Submitted subscribed to visibility lifetime!"
                })
            }
        });
    } else {
        resppppp.json({
            message: "You do NOT have enough tokens to purchase this ablitiy/advantage..."
        });
    }
});

module.exports = router;