const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");

router.get("/", (req, resppppp) => {

    const { sizeOfResults, interestedIn } = req.query;

    const collection = Connection.db.db("test").collection("users");
    // find related matches...
    collection.aggregate([
        { "$project" : { review_count: { $size: { "$ifNull": [ "$reviews", [] ] } }, coverPhoto: 1, spotifyRecentPlaylist: 1, spotifyProfileTokenCode: 1, generatedFake: 1, followers: 1, subscribedUsersRestricted: 1, subscriptionAmountRestrictedContent: 1, firstName: 1, username: 1, requestedMatches: 1, email: 1, profilePictures: 1, uniqueId: 1, verificationCompleted: 1, registrationDate: 1, registrationDateString: 1, reviews: 1, totalUniqueViews: 1, rank: 1, stripeAccountVerified: 1, currentApproxLocation: 1, coreProfileData: 1, gender: 1, interestedIn: 1, restrictedImagesVideos: 1, birthdateRaw: 1, accountType: 1 }}, 
        { "$sort": { size: 1 }},
        { "$limit": Number(sizeOfResults) }
    ]).toArray().then((users) => {    

        console.log("users", users);

        resppppp.json({
            message: "Gathered list of users!",
            users
        })
    });
});

module.exports = router;