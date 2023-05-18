const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const aws = require('aws-sdk');
const moment = require("moment");
const { Connection } = require("../../../mongoUtil.js");

const s3Bucket = new aws.S3({ params: { Bucket: config.get("awsBucketName") } });

router.post("/", (req, resppppp, next) => {

    const { base64, contentType, filename, uniqueId, accountType } = req.body;

    const generatedIDImage = uuidv4();

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    const buffffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    const data = {
        Key: generatedIDImage,
        Body: buffffer,
        ContentEncoding: 'base64',
        ContentType: contentType
    };

    s3Bucket.putObject(data, (err, data) => {
        if (err) {
            console.log(err.message);

            console.log('Error uploading data: ', data);

            resppppp.json({
                message: "ERROR uploading image to cloud services...",
                err
            })
        } else {
            console.log('successfully uploaded the image!');

            const compoundedFile = {
                id: uuidv4(),
                systemDate: new Date(),
                date: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
                link: generatedIDImage,
                type: contentType,
                name: filename,
                dataType: "image"
            }

            collection.findOneAndUpdate({ uniqueId }, { $set: { coverPhoto: compoundedFile } }, (err, user) => {
                if (err) {
                    resppppp.json({
                        message: "An error occurred while attempting to modify user data..."
                    })
                } else {
                    console.log("user", user);

                    resppppp.json({
                        message: "Uploaded successfully!",
                        generatedID: generatedIDImage,
                        file: compoundedFile,
                        user
                    })
                }
            })
        }
    });
});

module.exports = router;