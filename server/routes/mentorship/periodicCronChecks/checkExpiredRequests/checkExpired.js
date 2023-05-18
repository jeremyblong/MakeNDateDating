const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../../mongoUtil.js");

router.put("/", (req, resppppp) => {

    const {} = req.body;

    const collection = Connection.db.db("test").collection("users");

    const currentNow = new Date();

    collection.deleteMany({ "completionMentorshipRequestsPending.$.expiresAt": { $lte: currentNow }}, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err.message);

            resppppp.json({
                message: "An error occurred while attempting to update DB information...",
                err
            })
        } else {
            console.log("result", data);

            resppppp.json({
                message: "Successfully updated/removed the appropriate result(s)!",
                data: data.value
            })
        }
    });
});

module.exports = router;