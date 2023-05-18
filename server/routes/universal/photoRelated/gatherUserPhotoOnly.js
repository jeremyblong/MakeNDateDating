const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");

router.get("/", (req, resppppp) => {

    const { postedByID } = req.query;

    const collection = Connection.db.db("test").collection("users");

    const filteredQueryFields = { projection: { profilePictures: 1, firstName: 1, username: 1 }};

    collection.findOne({ uniqueId: postedByID }, filteredQueryFields).then((user) => {
        if (!user) {

            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found."
            });
        } else {
            console.log("user user user user user user", user);

            resppppp.json({
                message: "Submitted gathered user's picture/file!",
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