const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
const { v4: uuidv4 } = require('uuid');
const _ = require("lodash");

router.post("/", (req, resppppp) => {

    const { 
        uniqueId,
        otherUserUsername
    } = req.body;

    const collection = Connection.db.db("test").collection("users");

    collection.aggregate([{ 
        "$match": { "username" : { $regex : otherUserUsername.trim().toLowerCase() } 
    }}, { 
        "$limit": 30 
    }, { 
        "$project": {
            "username": 1
        }
    }]).toArray().then((usernames) => {
        if (!usernames) {
            resppppp.json({
                message: "Error occurred while fetching usernames...!",
                err
            })
        } else {
            console.log("usernames :", usernames);

            resppppp.json({
                message: "Successfully located usernames!",
                usernames
            })
        }
    })
});

module.exports = router;