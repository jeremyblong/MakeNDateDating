const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");
const _ = require("lodash");

router.get("/", async (req, resppppp) => {

    const { accountType, uniqueId } = req.query;

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    collection.findOne({ uniqueId }).then(async (user) => {
        if (!user) {

            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found.",
                err: null,
                alreadySubbed: false
            });

        } else {
            console.log("runnnnnnninggg...");

            resppppp.json({
                message: "Successfully gathered!",
                alreadySubbed: _.has(user, "hideProfileViews") ? user.hideProfileViews : false
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