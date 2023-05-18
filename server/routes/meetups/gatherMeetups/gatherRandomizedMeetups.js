const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');

router.get("/", (req, response) => {

    const collection = Connection.db.db("test").collection("meetups");

    const {} = req.query;

    collection.find({}).limit(30).toArray((err, meetups) => {
        if (err) {
            console.log(err.message);

            response.json({
                err,
                message: "Could not find users, error occurred."
            })
        } else {
            console.log("meetups", meetups);

            response.json({
                message: "Gathered list of meetings!",
                meetups
            })
        }
    })
});

module.exports = router;