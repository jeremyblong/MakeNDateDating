const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../../mongoUtil.js");
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");

router.post("/", (req, resppppp) => {

    const { 
        meetingID,
        userID,
        message,
        subject,
        nameUsername,
        username
    } = req.body;

    const collection = Connection.db.db("test").collection("meetups");

    const newCommentAddition = {
        id: uuidv4(),
        postedDate: new Date(),
		postedDateString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
        message,
        subject,
        postedBy: nameUsername,
        postedByID: userID,
        postedByUsername: username
    };

    collection.findOneAndUpdate({ id: meetingID }, { $push: {
        comments: newCommentAddition
    }}, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err.message);

            resppppp.json({
                message: "Error occurred while updating password data/information...",
                err
            })
        } else {
            resppppp.json({
                message: "Posted new comment on meetup!",
                newComment: newCommentAddition
            })
        }
    });
});
module.exports = router;