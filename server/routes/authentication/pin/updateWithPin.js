const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");


router.post("/", (req, resppppp) => {

    const { uniqueId, pin } = req.body;

    const collection = Connection.db.db("test").collection("users");

    collection.findOneAndUpdate({ uniqueId }, { $set: { pin } }, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err.message);

            resppppp.json({
                message: "An error occurred while attempting to update DB information...",
                err
            })
        } else {
            console.log("result", data);

            resppppp.json({
                message: "Posted code to db!",
                data: data.value
            })
        }
    })
});

module.exports = router;