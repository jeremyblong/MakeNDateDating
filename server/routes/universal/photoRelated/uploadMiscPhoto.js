const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const aws = require('aws-sdk');
const moment = require("moment");

const s3Bucket = new aws.S3({ params: { Bucket: config.get("awsBucketName") }});

router.post("/", (req, resppppp, next) => {
    
    const { base64, contentType, filename } = req.body;
        
    const generatedIDImage = uuidv4();

    console.log("base64", base64);

    const buffffer = Buffer.from(base64, 'base64');

    const data = {
        Key: generatedIDImage, 
        Body: buffffer,
        ContentEncoding: 'base64',
        ContentType: contentType
    };
    s3Bucket.putObject(data, (err, data) => {
        if (err) { 
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
                name: filename
            }
    
            resppppp.json({
                message: "Uploaded successfully!",
                generatedID: generatedIDImage,
                file: compoundedFile
            })
        }
    });
});

module.exports = router;