const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const _ = require("lodash");

router.get("/", async (req, resppppp) => {

    const { sizeOfResults, interestedIn, uniqueId } = req.query;

    const collection = Connection.db.db("test").collection("users");
    
    const userData = await collection.findOne({ uniqueId });

    if (typeof interestedIn !== "undefined" && interestedIn === "everyone") {
        
        const blockedUsers = _.has(userData, "blockedUsers") ? userData.blockedUsers : [];
        // find related matches...
        collection.aggregate([
            { "$project" : { review_count: { $size: { "$ifNull": [ "$reviews", [] ] } }, coverPhoto: 1, spotifyProfileTokenCode: 1, generatedFake: 1, requestedMatches: 1, followers: 1, subscribedUsersRestricted: 1, subscriptionAmountRestrictedContent: 1, firstName: 1, username: 1, email: 1, profilePictures: 1, uniqueId: 1, verificationCompleted: 1, registrationDate: 1, registrationDateString: 1, reviews: 1, totalUniqueViews: 1, rank: 1, stripeAccountVerified: 1, currentApproxLocation: 1, coreProfileData: 1, gender: 1, interestedIn: 1, restrictedImagesVideos: 1, spotifyRecentPlaylist: 1, birthdateRaw: 1, accountType: 1 }}, 
            { "$sort": { size: 1 }},
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
        if (_.has(userData, "currentApproxLocation")) {
            const longitude = userData.currentApproxLocation.geo.coordinates[0];
            const latitude = userData.currentApproxLocation.geo.coordinates[1];
        
            collection.createIndex({ "currentApproxLocation.geo": "2dsphere" });
        
            const calculateInterest = () => {
                switch (interestedIn) {
                    case "men":
                        return "Man";
                        break;
                    case "women":
                        return "Woman";
                        break
                    case "everyone":
                        return "";
                        break;
                    default:
                        break;
                }
            }
        
            const blockedUsers = _.has(userData, "blockedUsers") ? userData.blockedUsers : [];
            // find related matches...
            collection.aggregate([
                {
                    "$geoNear": {
                       near: { type: "Point", coordinates: [ longitude, latitude ] },
                       distanceField: "currentApproxLocation.geo",
                       maxDistance : 20000,
                       key: "currentApproxLocation.geo",
                       includeLocs: "currentApproxLocation.geo"
                    }
                },
                { "$project" : { review_count: { $size: { "$ifNull": [ "$reviews", [] ] } }, coverPhoto: 1, spotifyProfileTokenCode: 1, generatedFake: 1, requestedMatches: 1, followers: 1, subscribedUsersRestricted: 1, subscriptionAmountRestrictedContent: 1, firstName: 1, username: 1, email: 1, profilePictures: 1, uniqueId: 1, verificationCompleted: 1, registrationDate: 1, registrationDateString: 1, reviews: 1, totalUniqueViews: 1, rank: 1, stripeAccountVerified: 1, currentApproxLocation: 1, coreProfileData: 1, gender: 1, interestedIn: 1, spotifyRecentPlaylist: 1, restrictedImagesVideos: 1, birthdateRaw: 1, accountType: 1 }}, 
                { "$match": { "gender.value": calculateInterest(interestedIn) }},
                { "$sort": { size: 1 }},
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
            const calculateInterest = () => {
                switch (interestedIn) {
                    case "men":
                        return "Man";
                        break;
                    case "women":
                        return "Woman";
                        break
                    case "everyone":
                        return "";
                        break;
                    default:
                        break;
                }
            };
        
            const blockedUsers = _.has(userData, "blockedUsers") ? userData.blockedUsers : [];
            // find related matches...
            collection.aggregate([
                { "$project" : { review_count: { $size: { "$ifNull": [ "$reviews", [] ] } }, coverPhoto: 1, spotifyProfileTokenCode: 1, generatedFake: 1, requestedMatches: 1, followers: 1, subscribedUsersRestricted: 1, subscriptionAmountRestrictedContent: 1, firstName: 1, username: 1, email: 1, profilePictures: 1, uniqueId: 1, verificationCompleted: 1, registrationDate: 1, registrationDateString: 1, reviews: 1, totalUniqueViews: 1, rank: 1, stripeAccountVerified: 1, currentApproxLocation: 1, coreProfileData: 1, gender: 1, interestedIn: 1, spotifyRecentPlaylist: 1, restrictedImagesVideos: 1, birthdateRaw: 1, accountType: 1 }}, 
                { "$match": { "gender.value": calculateInterest(interestedIn) }},
                { "$sort": { size: 1 }},
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
    }
});

module.exports = router;