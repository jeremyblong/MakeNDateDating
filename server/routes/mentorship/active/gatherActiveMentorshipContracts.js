const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");

router.get("/", (req, resppppp) => {

    const { uniqueId, accountType } = req.query;

    const accountCalculated = (accountType === "date" || accountType === "bff" || accountType === "bizz") ? "users" : "mentors";

    console.log("accountCalculated", accountCalculated)

    const collection = Connection.db.db("test").collection(accountCalculated);

    collection.findOne({ uniqueId }, { acceptedMentorshipRequests: 1 }).then((user) => {
        if (!user) {

            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found.",
                err: null
            });
        } else {
            resppppp.json({
                message: "Gathered list!",
                acceptedMentorshipRequests: user.acceptedMentorshipRequests
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