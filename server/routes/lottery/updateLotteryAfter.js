const express = require("express");
const router = express.Router();
const { Connection } = require("../../mongoUtil.js");
const _ = require("lodash");

router.post("/", async (req, resppppp) => {
    const { 
        uniqueId,
        winningItem,
        accountType
    } = req.body;

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    const userDetails = await collection.findOne({ uniqueId });

    if (userDetails !== null) {
        collection.findOneAndUpdate({ uniqueId }, { $inc: {
            inAppTokenCurrency: winningItem.credits
        } }, { returnDocument: 'after' },  (errrrrrrrr, data) => {
            if (errrrrrrrr) {
                console.log("Error secondary...:", errrrrrrrr);
    
                resppppp.json({
                    message: "An err occurred while attempting to update DB information...",
                    err: errrrrrrrr
                })
            } else {
                console.log("result second...:", data);
    
                resppppp.json({
                    message: "Successfully won lottery!"
                })
            }
        });
    } else {
        resppppp.json({
            message: "An error occurred while fetching user information to update account info."
        })
    }
});

module.exports = router;