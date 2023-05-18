const express = require("express");
const router = express.Router();
const config = require("config");
const moment = require("moment");
const { Connection } = require("../../../../mongoUtil.js");

router.post("/", (req, resppppp, next) => {

    const { welcomeMessage, subscriptionAmount, uniqueId } = req.body;
        
    const collection = Connection.db.db("test").collection("users");

    collection.findOneAndUpdate({ uniqueId }, { $set: {
        subscriptionAmountRestrictedContent: Number(subscriptionAmount),
        subscriptionWelcomeMessageRestricted: welcomeMessage
    }}, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err.message);

            resppppp.json({
                message: "An error occurred while attempting to update DB information...",
                err
            })
        } else {
            console.log("result", data);

            resppppp.json({
                message: "Submitted subscription data!"
            })
        }
    })
});

module.exports = router;