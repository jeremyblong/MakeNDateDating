const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");

router.post("/", (req, resppppp) => {

    const { userID, accountType } = req.body;

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    const randomGeneratedRewardNum = Math.floor(Math.random() * (7 - 1 + 1) + 1);

    collection.findOneAndUpdate({ uniqueId: userID }, { $inc: {
        inAppTokenCurrency: randomGeneratedRewardNum
    }}, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err.message);

            resppppp.json({
                message: "User does NOT exist or could not be found."
            });
        } else {
            resppppp.json({
                message: "Successfully rewarded the user!",
                amount: randomGeneratedRewardNum
            })
        }
    });
});

module.exports = router;