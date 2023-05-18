const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');

router.get("/", async (req, response) => {

    const collection = Connection.db.db("test").collection("meetups");
    const collectionUser = Connection.db.db("test").collection("users");

    const { searchTerm, uniqueId } = req.query;
    
    const userData = await collectionUser.findOne({ uniqueId });

    const longitude = userData.currentApproxLocation.geo.coordinates[0];
    const latitude = userData.currentApproxLocation.geo.coordinates[1];

    collection.createIndex({ "geoJsonLoc": "2dsphere" });
    
    collection.aggregate([
        {
            "$geoNear": {
               near: { type: "Point", coordinates: [ longitude, latitude ] },
               distanceField: "geoJsonLoc",
               maxDistance: 10000,
               key: "geoJsonLoc",
               includeLocs: "geoJsonLoc"
            }
        },
        { "$match": { "title": { $regex: searchTerm }  }},
        { "$limit": Number(24) }
    ]).toArray().then((meetups) => {    

        console.log("meetups", meetups);

        response.json({
            message: "Gathered list of meetings!",
            meetups
        })
    });
});

module.exports = router;