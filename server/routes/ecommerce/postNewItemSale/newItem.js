const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const aws = require('aws-sdk');
const moment = require("moment");
const { Connection } = require("../../../mongoUtil.js");
const _ = require('lodash');

router.post("/", (req, resppppp, next) => {
    console.log("req.body", req.body);

    const {
        uniqueId,
        title, 
        description, 
        hashtags, 
        clothingType, 
        lengthOfWear,
        files,
        price
    } = req.body;

    const collection = Connection.db.db("test").collection("users");
        
    const generatedIDImage = uuidv4();

    const newItem = {
        id: generatedIDImage,
        date: new Date(),
        dateString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
        posterID: uniqueId,
        title, 
        description, 
        hashtags, 
        lengthOfWear, 
        files,
        clothingType,
        price
    };

    collection.findOneAndUpdate({ uniqueId }, { $push: {
        itemsForSale: newItem
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