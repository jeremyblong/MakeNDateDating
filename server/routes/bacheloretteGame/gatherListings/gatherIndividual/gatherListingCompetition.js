const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");

router.get("/", (req, resppppp) => {

    const { listingID } = req.query;

    const collection = Connection.db.db("test").collection("bachelorettegames");
    // find related matches...
    collection.findOne({ id: listingID }).then((listing) => {    

        console.log("listing", listing);

        resppppp.json({
            message: "Gathered listing!",
            listing
        })
    });
});

module.exports = router;