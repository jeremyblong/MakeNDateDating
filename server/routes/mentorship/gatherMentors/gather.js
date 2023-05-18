const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');

router.get("/", (req, response) => {

    const collection = Connection.db.db("test").collection("mentors");

    const {} = req.query;

    collection.find({}).toArray((err, counselors) => {
        if (err) {
            console.log(err.message);

            response.json({
                err,
                message: "Could not find users, error occurred."
            })
        } else {
            response.json({
                message: "Gathered list of counselors!",
                counselors
            })
        }
    })
});

module.exports = router;