const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const { decryptString } = require("../../../crypto.js");
const _ = require("lodash");
const config = require("config");

router.post("/", async (req, resppppp) => {

    const { accountType, uniqueId, value } = req.body;

    let tokenCount = Math.round(value / config.get("tokenApproxCostPerCoin"));

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    const matchingResult = await collection.findOne({ uniqueId });

    console.log("tokenCount", tokenCount, matchingResult);

    collection.findOneAndUpdate({ uniqueId }, { $inc: {
        inAppTokenCurrency: tokenCount
    } }, { returnDocument: 'after' },  (errrrrrrrr, data) => {
        if (errrrrrrrr) {
            console.log("Error secondary...:", errrrrrrrr);

            resppppp.json({
                message: "An err occurred while attempting to update DB information...",
                err: errrrrrrrr
            })
        } else {
            console.log("result second...:", data);

            resppppp.json({
                message: "Successfully processed!"
            })
        }
    });
});

module.exports = router;