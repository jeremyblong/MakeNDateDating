const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const aws = require('aws-sdk');
const moment = require("moment");
const { Connection } = require("../../../../mongoUtil.js");
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');
const _ = require('lodash');

const s3 = new aws.S3({ params: { Bucket: config.get("awsBucketName") }});

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

router.post("/", upload.single("video"), (req, resppppp, next) => {

    console.log("req.body", req.file, req.files, req.body);
        
    const { uniqueId } = req.body;

    const generatedIDImage = uuidv4();

    const collection = Connection.db.db("test").collection("users");

    const { filename, originalname } = req.file;

    console.log("video ran!");
    
    const secondGeneratedIDThumbnail = uuidv4();
    
    // `C:\\Users\\blong\\Documents\\ethereum-dating-app\\server\\tempfiles\\${filename}`
    ffmpeg(`${config.get("assetLink")}/${originalname}`).setFfmpegPath(ffmpeg_static).screenshots({
        size: '?x512',
        count: 1,
        timemarks: ['3'],
        filename: secondGeneratedIDThumbnail,
        folder: `${process.cwd()}/thumbnails`,
    }).on('end', () => {
        console.log('Thumbnail created');

        const finshedCall = () => {
            console.log("finshedCall");
``
            const converted = `${secondGeneratedIDThumbnail}.png`;
            const contents = fs.readFileSync(`${process.cwd()}/thumbnails/${converted}`, {encoding: 'base64'});
            const buffering = Buffer.from(contents, "base64");
            const data = {
                Key: secondGeneratedIDThumbnail, 
                Body: buffering,
                ContentEncoding: 'base64',
                ContentType: "image/png"
            };
        
            s3.putObject(data, (err, data) => {
                if (err) { 
                    console.log('Error uploading data: ', data); 
        
                    resppppp.json({
                        message: "ERROR uploading image to cloud services...",
                        err
                    })
                } else {
                    console.log('successfully uploaded the image!', secondGeneratedIDThumbnail, filename);

                    const compoundedFile = {
                        id: uuidv4(),
                        systemDate: new Date(),
                        date: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
                        link: originalname,
                        type: "video/mp4",
                        name: filename
                    };

                    collection.findOneAndUpdate({ uniqueId }, { $set: { 'coreProfileData.introductoryVideo': compoundedFile }}, { returnDocument: 'after' }, (errrrrrrr, documentResp) => {
                         if (errrrrrrr) {
                            console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror removed previous follow ==> :", err);
            
                            fs.unlink(`${process.cwd()}/thumbnails/${converted}`, () => {
                                resppppp.json({
                                    message: "An error occurred while attempting to update DB information...",
                                    err: errrrrrrr
                                });
                            });
                        } else {
                            console.log("Successfully updated/saved profile video...", documentResp);
                            
                            fs.unlink(`${process.cwd()}/thumbnails/${converted}`, () => {
                                resppppp.json({
                                    message: "Uploaded successfully!",
                                    generatedID: generatedIDImage,
                                    file: compoundedFile,
                                    snapshot: secondGeneratedIDThumbnail
                                })
                            });
                        }
                    });
                }
            });
        }
        fs.unlink(`${process.cwd()}/tempfiles/${filename}`, finshedCall);
    }).on('error', (err) => {
        console.log("thumbnail err", err);
        return err;
    });
});

module.exports = router;