const express = require("express");
const router = express.Router();
const { Connection } = require("../../mongoUtil.js");
const { v4: uuidv4 } = require('uuid');
const _ = require("lodash");
const NewScratch = require("../../schemas/lottery/initiateNewLotterySaveSchema.js");

router.post("/", async (req, resppppp) => {

    const { 
        uniqueId,
        winningItem,
        firstName,
        username,
    } = req.body;

    const lotteryCollection = Connection.db.db("test").collection("lotteryscratchers");

    const matchingAlreadyOrNot = await lotteryCollection.findOne({ userID: uniqueId });

    if (matchingAlreadyOrNot === null) {
        const NewSave = new NewScratch({
            id: uuidv4(),
            firstName,
            username,
            userID: uniqueId,
            date: new Date()
        })
    
        NewSave.save((err, result) => {
            if (err) {
                console.log("err", err);
    
                resppppp.json({
                    message: "An error occurred while updating DB...."
                })
            } else {
                console.log("result", result);
    
                resppppp.json({
                    message: "Successfully initialized lottery!"
                })
            }
        })
    } else {
        resppppp.json({
            message: "Already used your scratch-off for the day! Come back in 24 hours from you last use..."
        })
    }
});

module.exports = router;