const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../../mongoUtil.js");
const moment = require("moment");

router.put("/", (req, resppppp) => {

    const {} = req.body;

    const collection = Connection.db.db("test").collection("bachelorettegames");

    const dateCreated = new Date(moment(new Date()).subtract(7, "d"))

    collection.updateMany({ creationDate: { $lte: dateCreated }}, { $set: { joinable: false }}, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err);

            resppppp.json({
                message: "An error occurred while attempting to update DB information...",
                err
            })
        } else {
            console.log("result", data);

            resppppp.json({
                message: "Successfully swapped the listings that were applicable!"
            })
        }
    });
});

module.exports = router;