const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");
const { v4: uuidv4 } = require('uuid');

router.post("/", (req, resppppp) => {

    const { authedUserID, postedByID } = req.body;

    const collection = Connection.db.db("test").collection("users");

    collection.findOneAndUpdate({ uniqueId: postedByID }, { $pull: { followers: {
        followerID: authedUserID
    }}}, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err.message);

            resppppp.json({
                message: "An error occurred while attempting to update DB information...",
                err
            });
        } else {
            console.log("result", data);

            const { value } = data;

            collection.findOneAndUpdate({ uniqueId: authedUserID }, { $pull: { following: {
                followingID: value.uniqueId
            }}}, { returnDocument: 'after' },  (err, result) => {
                if (err) {
                    console.log(err.message);

                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    });
                } else {
                    console.log("result", result);
        
                    resppppp.json({
                        message: "Submitted un-subscribed as follower!",
                        otherUser: value
                    })
                }
            })
        }
    })
});

module.exports = router;