const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");

router.post("/", (req, resppppp) => {

    const { userID, location } = req.body;

    console.log("req.bodyyyyyyyyyy", req.body);

    const collection = Connection.db.db("test").collection("users");

    const { latitude, longitude } = location;

    const updateQuery = { $set: {
        currentApproxLocation: {
            "geo" : {
                "type" : "Point",
                "coordinates" : [ longitude + ((Math.random() > 0.5 ? 0.01 : -0.09) + Math.random() * 0.08), latitude ]
            }
        }
    }};

    collection.findOneAndUpdate({ uniqueId: userID }, updateQuery, (err, result) => {
        if (err) {

            console.log("User does NOT exist or could not be found for location updating purposes...", err);

            resppppp.json({
                message: "User does NOT exist or could not be found for location updating purposes...",
                updated: false,
                err
            });
        } else {
            console.log("result!!!", result);

            resppppp.json({
                message: "Successfully updated user's current approx location!",
                updated: true,
                result
            })
        }
    });
});

module.exports = router;