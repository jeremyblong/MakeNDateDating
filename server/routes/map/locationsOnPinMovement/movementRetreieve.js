const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");

router.get("/", (req, resppppp) => {
    // deconstruct data...
    const { currentLoc } = req.query;

    const { longitude, latitude } = currentLoc;

    const collection = Connection.db.db("test").collection("users");

    // collection.createIndex({ "newlyConstructedCoordsRandomizedNearby": "2dsphere" });
    collection.createIndex({ "currentApproxLocation.geo": "2dsphere" });

    const filteredQueryFields = { projection: { coverPhoto: 1, generatedFake: 1, requestedMatches: 1, followers: 1, subscribedUsersRestricted: 1, subscriptionAmountRestrictedContent: 1, firstName: 1, username: 1, email: 1, profilePictures: 1, uniqueId: 1, verificationCompleted: 1, registrationDate: 1, registrationDateString: 1, reviews: 1, totalUniqueViews: 1, rank: 1, stripeAccountVerified: 1, currentApproxLocation: 1, coreProfileData: 1, gender: 1, interestedIn: 1, restrictedImagesVideos: 1, birthdateRaw: 1, accountType: 1, currentApproxLocation: 1 }};

    const milesConvertedToMeters = (1609 * 35); // 1609 === meters in mile

    collection.find({ "currentApproxLocation.geo": {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [Number(longitude), Number(latitude)]
            },
            $maxDistance: milesConvertedToMeters,
            $minDistance: 1
        }
      }}, filteredQueryFields).limit(20).toArray().then((results) => {    
        console.log("results", results);

        resppppp.json({
            message: "Gathered relevant location points!",
            results
        })
    }).catch((err) => {
        console.log("err fetching - critical...:", err);

        resppppp.json({
            message: "Could not find the appropriate results...",
            err
        });
    });
});

module.exports = router;