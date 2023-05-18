const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
const _ = require("lodash");

router.get("/", async (req, resppppp) => {

    const { sizeOfResults, uniqueId } = req.query;

    const collectionUser = Connection.db.db("test").collection("users");
    
    const collection = Connection.db.db("test").collection("boostedusers");

    const userData = await collectionUser.findOne({ uniqueId });

    const blockedUsers = _.has(userData, "blockedUsers") ? userData.blockedUsers : [];

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    if (userData !== null) {
        if (userData.interestedIn.toLowerCase() === "everyone") {
            // find related matches...
            collection.aggregate([
                { "$project" : { 
                    coverPhoto: 1, 
                    requestedMatches: 1, 
                    spotifyProfileTokenCode: 1,
                    followers: 1, 
                    subscribedUsersRestricted: 1, 
                    subscriptionAmountRestrictedContent: 1, 
                    firstName: 1, 
                    generatedFake: 1,
                    username: 1, 
                    email: 1, 
                    profilePictures: 1, 
                    uniqueId: 1, 
                    spotifyRecentPlaylist: 1,
                    verificationCompleted: 1, 
                    registrationDate: 1, 
                    registrationDateString: 1, 
                    reviews: 1, 
                    totalUniqueViews: 1, 
                    rank: 1, 
                    stripeAccountVerified: 1, 
                    currentApproxLocation: 1, 
                    coreProfileData: 1, 
                    gender: 1, 
                    interestedIn: 1, 
                    restrictedImagesVideos: 1, 
                    birthdateRaw: 1, 
                    accountType: 1 
                }}, 
                { "$limit": Number(sizeOfResults) }
            ]).toArray().then((users) => {    
    
                console.log("users", users);
    
                const filteredResults = users.filter(user => !blockedUsers.includes(user.username));
    
                resppppp.json({
                    message: "Gathered list of users!",
                    users: filteredResults
                })
            });
        } else {
            // find related matches...
            collection.aggregate([
                { "$project" : { 
                    coverPhoto: 1, 
                    requestedMatches: 1, 
                    spotifyProfileTokenCode: 1,
                    followers: 1, 
                    subscribedUsersRestricted: 1, 
                    subscriptionAmountRestrictedContent: 1, 
                    firstName: 1, 
                    username: 1, 
                    generatedFake: 1,
                    email: 1, 
                    spotifyRecentPlaylist: 1,
                    profilePictures: 1, 
                    uniqueId: 1, 
                    verificationCompleted: 1, 
                    registrationDate: 1, 
                    registrationDateString: 1, 
                    reviews: 1, 
                    totalUniqueViews: 1, 
                    rank: 1, 
                    stripeAccountVerified: 1, 
                    currentApproxLocation: 1, 
                    coreProfileData: 1, 
                    gender: 1, 
                    interestedIn: 1, 
                    restrictedImagesVideos: 1, 
                    birthdateRaw: 1, 
                    accountType: 1 
                }}, 
                { "$match": { "gender.value": capitalizeFirstLetter(userData.interestedIn) }},
                { "$limit": Number(sizeOfResults) }
            ]).toArray().then((users) => {    
    
                console.log("users", users);
    
                const filteredResults = users.filter(user => !blockedUsers.includes(user.username));
    
                resppppp.json({
                    message: "Gathered list of users!",
                    users: filteredResults
                })
            });
        }
    } else {
        resppppp.json({
            message: "Gathered list of users!",
            users: []
        })
    }
});

module.exports = router;