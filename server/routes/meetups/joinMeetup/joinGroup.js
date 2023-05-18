const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');

router.post("/", async (req, resppppp) => {

    const { groupID, uniqueId, username, firstName } = req.body;

    console.log("req.bodyyyyyyyyyyyy join group...!");

    const collection = Connection.db.db("test").collection("meetups");

    const alreadyJoined = await collection.findOne({ id: groupID });

    const indexMatched = alreadyJoined.members.findIndex(item => item.memberID === uniqueId);

    const newMember = {
        memberID: uniqueId,
        memberName: firstName,
        memberUsername: username,
        identifier: uuidv4(),
        joinedOnDate: new Date(),
        joinedOnDateString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a")
    }

    if (indexMatched === -1) {
        collection.findOneAndUpdate({ id: groupID }, { $push: {
            members: newMember
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
                    message: "Gathered nearby location users!",
                    group: data.value
                })
            }
        })
    } else {
        resppppp.json({
            message: "You're already a member of this group!"
        })
    }
});

module.exports = router;