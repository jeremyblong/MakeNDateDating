const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const aws = require('aws-sdk');
const moment = require("moment");
const { Connection } = require("../../../mongoUtil.js");
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');
const _ = require('lodash');

const s3 = new aws.S3({ params: { Bucket: config.get("awsBucketName") }});
const s3Bucket = new aws.S3({ params: { Bucket: config.get("awsBucketName") }});

const onlyS3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: onlyS3,
        bucket: config.get("awsBucketName"),
        key: (req, file, cb) => {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

router.post("/", upload.array("images"), (req, resppppp, next) => {

    console.log("req.body", req.file, req.files, req.body);

    const { captionText, hashtags, uniqueId, postedName, posterUsername, filterIndexSelected } = req.body;

    const collection = Connection.db.db("test").collection("users");
        
    const generatedIDImage = uuidv4();

    const newPost = {
        id: generatedIDImage,
        creationDate: new Date(),
        creationDateString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
        comments: [],
        likes: 0,
        files: req.files,
        dislikes: 0,
        alreadyReacted: [],
        captionText,
        hashtags: hashtags.split(","),
        postedName, 
        posterUsername,
        postedByID: uniqueId,
        filteredIndexMask: Number(filterIndexSelected),
        filteredImages: Number(filterIndexSelected) === 0 ? false : true
    }

    collection.findOneAndUpdate({ uniqueId }, { $push: {
        feedPosts: newPost
    }}, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err.message);

            resppppp.json({
                message: "Successfully authenticated w/o logging related security details...",
                err
            })
        } else {
            resppppp.json({
                message: "Successfully posted item!"
            })
        }
    });
});

module.exports = router;