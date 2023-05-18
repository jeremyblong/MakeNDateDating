const express = require("express");
const router = express.Router();
const config = require("config");
const aws = require('aws-sdk');
const moment = require("moment");
const { Connection } = require("../../../../mongoUtil.js");

const s3Bucket = new aws.S3({ params: { Bucket: config.get("awsBucketName") }});

router.post("/", (req, resppppp, next) => {

    const { uploaded, uniqueId } = req.body;
        
    const collection = Connection.db.db("test").collection("users");

    collection.findOneAndUpdate({ uniqueId }, { $set: {
        restrictedImagesVideos: uploaded
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
                message: "Saved successfully!",
                files: uploaded
            })
        }
    })
});

module.exports = router;