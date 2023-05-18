const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../../mongoUtil.js");

router.post("/", async (req, resppppp) => {

    const { uniqueId, tracking } = req.body;

    const collection = Connection.db.db("test").collection("users");

    const matchingResult = await collection.findOne({ "pendingShipments.shippingLabel.tracking_number": tracking });

    const matchingShipment = matchingResult.pendingShipments.findIndex((item) => item.shippingLabel.tracking_number === tracking);

    const match = matchingResult.pendingShipments[matchingShipment];

    console.log("match", match);

    collection.findOneAndUpdate({ "pendingShipments.shippingLabel.tracking_number": tracking }, { $inc: {
        inAppTokenCurrency: match.purchasedItem.tokensPrice
    }, $pull: {
        pendingShipments: {
            id: match.id
        }
    }}, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err.message);

            resppppp.json({
                message: "An error occurred while attempting to update DB information...",
                err
            })
        } else {
            console.log("result", data);

            resppppp.json({
                message: "Successfully processed request!",
                tokens: data.inAppTokenCurrency
            })
        }
    })
});

module.exports = router;