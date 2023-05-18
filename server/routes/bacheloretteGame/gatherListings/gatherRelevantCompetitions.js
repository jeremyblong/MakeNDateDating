const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");

router.get("/", (req, resppppp) => {
    const collection = Connection.db.db("test").collection("bachelorettegames");
    // find related matches...
    collection.find({}).limit(30).toArray().then((listings) => {    
        console.log("listings", listings);

        resppppp.json({
            message: "Successfully gathered games!",
            listings
        })
    });
});

module.exports = router;