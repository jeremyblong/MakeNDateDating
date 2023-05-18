const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const { decryptString } = require("../../../crypto.js");
const _ = require("lodash");

router.get("/", (req, resppppp, next) => {
    // authenticate via passport auth flow/logic...
    const { uniqueId, accountType } = req.query;

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    collection.findOne({ uniqueId }).then(async (user) => {
        if (!user) {

            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found.",
                err: null
            });

        } else {
            console.log("runnnnnnninggg...");

            resppppp.json({
                message: "Gathered wallet information!",
                coinCount: user.inAppTokenCurrency,
                user
            })
        }
    }).catch((err) => {
        console.log(err.message);

        resppppp.json({
            message: "Unknown error.",
            err
        })
    })
});

module.exports = router;