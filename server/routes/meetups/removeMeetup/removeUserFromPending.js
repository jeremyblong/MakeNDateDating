const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');

router.post("/", async (req, resppppp) => {

    const { uniqueId, accountType, selectedID } = req.body;

    console.log("req.bodyyyyyyyyyyyy remove the specific user...", req.body);

    const collection = Connection.db.db("test").collection("users");

    const fetchedBothUsers = await collection.findOne({ uniqueId });

    const findMatchInUsers = fetchedBothUsers.meetupRequestsPending.findIndex(item => item.id === selectedID);

    const match = fetchedBothUsers.meetupRequestsPending[findMatchInUsers];

    const sender = match.sendingID;
    const reciever = match.recievingUserID;

    const promises = [];

    promises.push(new Promise((resolve, reject) => {
        collection.findOneAndUpdate({ uniqueId: sender, "meetupRequestsPending.id": selectedID }, { $pull: {
            "meetupRequestsPending": {
                id: selectedID
            }
        }}, { returnDocument: 'after' },  (err, data) => {
            if (err) {
                console.log(err.message);
    
                resolve(null);
            } else {
                console.log("result", data);
    
                resolve(data.value);
            }
        })
    }))

    promises.push(new Promise((resolve, reject) => {
        collection.findOneAndUpdate({ uniqueId: reciever, "meetupRequestsPending.id": selectedID }, { $pull: {
            "meetupRequestsPending": {
                id: selectedID
            }
        }}, { returnDocument: 'after' },  (err, data) => {
            if (err) {
                console.log(err.message);
    
                resolve(null);
            } else {
                console.log("result", data);
    
                resolve(data.value);
            }
        })
    }))

    Promise.all(promises).then((passedValues) => {

        console.log("passedValues", passedValues);

        if (passedValues.includes(null)) {
            resppppp.json({
                message: "An error occurred while processing your request..."
            })
        } else {
            resppppp.json({
                message: "Successfully deleted/removed match!"
            })
        }
    })
});

module.exports = router;