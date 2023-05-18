const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");

router.get("/", (req, resppppp) => {

    const { uniqueId, accountType } = req.query;

    console.log("req.query", req.query);

    const collection = Connection.db.db("test").collection("bachelorettegames");
    // find related listings for personal user only...
    collection.find({ postedByID: uniqueId }).toArray().then((listings) => { // ADD THIS NEXT...:  joinable: true
        console.log("listings", listings);

        resppppp.json({
            message: "Successfully gathered games!",
            listings
        })
    });
});

module.exports = router;