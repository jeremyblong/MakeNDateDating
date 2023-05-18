const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");


router.post("/", (req, resppppp) => {

    const { 
        uniqueId,
        accountType 
    } = req.body;

    if ((accountType === "bizz") || (accountType === "date") || (accountType === "bff")) {
        // this is a regular account type...
        const collection = Connection.db.db("test").collection("users");

        collection.findOneAndUpdate({ uniqueId }, { $set: { verficationCompleted: true } }, { returnDocument: 'after' },  (err, data) => {
            if (err) {
                console.log(err.message);
    
                resppppp.json({
                    message: "An error occurred while attempting to update DB information...",
                    err
                })
            } else {
                console.log("result", data);
    
                resppppp.json({
                    message: "Successfully updated verification status!",
                    data: data.value
                })
            }
        })
    } else {
        // this is a counselor account type...
        const collection = Connection.db.db("test").collection("mentors");

        collection.findOneAndUpdate({ uniqueId }, { $set: { verficationCompleted: true } }, { returnDocument: 'after' },  (err, data) => {
            if (err) {
                console.log(err.message);
    
                resppppp.json({
                    message: "An error occurred while attempting to update DB information...",
                    err
                })
            } else {
                console.log("result", data);
    
                resppppp.json({
                    message: "Successfully updated verification status!",
                    data: data.value
                })
            }
        })
    }
});

module.exports = router;