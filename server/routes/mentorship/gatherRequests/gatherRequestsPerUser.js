const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");

router.get("/", (req, resppppp) => {

    const { uniqueId } = req.query;

    const collection = Connection.db.db("test").collection("mentors");

    collection.findOne({ uniqueId }, { pendingMentorshipInvites: 1 }).then((user) => {
        if (!user) {

            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found.",
                err: null
            });
        } else {
            resppppp.json({
                message: "Gathered list!",
                pendingMentorshipInvites: user.pendingMentorshipInvites
            })
        }
    }).catch((err) => {
        console.log(err.message);

        resppppp.json({
            message: "Unknown error.",
            err
        })
    })
});

module.exports = router;