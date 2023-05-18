const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../mongoUtil.js");
const _ = require("lodash");

router.get("/", async (req, resppppp) => {
    // deconstruct data...
    const { currentLoc, interestedIn, accountType, uniqueId } = req.query;

    console.log("currentLoc", currentLoc);

    const dynamicCollection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    const matchingRelevantUser = await dynamicCollection.findOne({ uniqueId });

    if (_.has(matchingRelevantUser, "currentApproxLocation")) {
        try {
            console.log("Success fetching...");
            
            const locationOBJ = JSON.parse(currentLoc);
    
            const { longitude, latitude } = locationOBJ;
    
            const collection = Connection.db.db("test").collection("users");
        
            collection.createIndex({ "currentApproxLocation.geo": "2dsphere" });
        
            const milesConvertedToMeters = (1609 * 35); // 1609 === meters in mile
        
            if (interestedIn === "everyone") {
                collection.find({ "currentApproxLocation.geo": {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: milesConvertedToMeters,
                        $minDistance: 1
                    }
                }}, { $project: {
                    gender: 0
                }}).limit(30).toArray().then((results) => {    
            
                    const formattedArr = [];
            
                    for (let idx = 0; idx < results.length; idx++) {
                        const user = results[idx];
            
                        const keysToKeep = [
                            "coverPhoto", 
                            "subscriptionAmountRestrictedContent", 
                            "firstName", 
                            "username", 
                            "email", 
                            "generatedFake",
                            "profilePictures", 
                            "inAppTokenCurrency",
                            "uniqueId", 
                            "verificationCompleted", 
                            "registrationDate", 
                            "spotifyRecentPlaylist",
                            "registrationDateString", 
                            "reviews", 
                            "totalUniqueViews", 
                            "rank", 
                            "stripeAccountVerified", 
                            "currentApproxLocation", 
                            "coreProfileData", 
                            "gender", 
                            "interestedIn", 
                            "followers",
                            "following",
                            "restrictedImagesVideos", 
                            "birthdateRaw", 
                            "accountType",
                            "subscribedUsersRestricted",
                            "requestedMatches"
                        ];
            
                        const filtered = _.pick(user, keysToKeep);
                        
                        formattedArr.push(filtered);
            
                        if ((results.length - 1) === idx) {
                            console.log("formattedArr", formattedArr);
            
                            resppppp.json({
                                message: "Gathered nearby location users!",
                                results: formattedArr
                            })
                        }
                    }
                }).catch((err) => {
                    console.log("err fetching - critical...:", err);
            
                    resppppp.json({
                        message: "Could not find the appropriate results...",
                        err
                    });
                });
            } else {
                collection.find({ "currentApproxLocation.geo": {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: milesConvertedToMeters,
                        $minDistance: 1
                    }
                }, interestedIn }, { $project: {
                    gender: 0
                }}).limit(30).toArray().then((results) => {    
            
                    const formattedArr = [];
            
                    for (let idx = 0; idx < results.length; idx++) {
                        const user = results[idx];
            
                        const keysToKeep = [
                            "coverPhoto", 
                            "subscriptionAmountRestrictedContent", 
                            "firstName", 
                            "username", 
                            "inAppTokenCurrency",
                            "email", 
                            "profilePictures", 
                            "uniqueId", 
                            "generatedFake",
                            "followers",
                            "following",
                            "verificationCompleted", 
                            "registrationDate", 
                            "registrationDateString", 
                            "spotifyRecentPlaylist",
                            "reviews", 
                            "totalUniqueViews", 
                            "rank", 
                            "stripeAccountVerified", 
                            "currentApproxLocation", 
                            "coreProfileData", 
                            "gender", 
                            "interestedIn", 
                            "restrictedImagesVideos", 
                            "birthdateRaw", 
                            "accountType",
                            "subscribedUsersRestricted",
                            "requestedMatches"
                        ];
            
                        const filtered = _.pick(user, keysToKeep);
                        
                        formattedArr.push(filtered);
            
                        if ((results.length - 1) === idx) {
                            console.log("formattedArr", formattedArr);
            
                            resppppp.json({
                                message: "Gathered nearby location users!",
                                results: formattedArr
                            })
                        }
                    }
                }).catch((err) => {
                    console.log("err fetching - critical...:", err);
            
                    resppppp.json({
                        message: "Could not find the appropriate results...",
                        err
                    });
                });
            }
        } catch (err) {
            console.log("errrrrrrr fetch...");
    
            const { longitude, latitude } = currentLoc;
    
            const collection = Connection.db.db("test").collection("users");
    
            collection.createIndex({ "currentApproxLocation.geo": "2dsphere" });
    
            const milesConvertedToMeters = (1609 * 35); // 1609 === meters in mile
    
            if (interestedIn === "everyone") {
                collection.find({ "currentApproxLocation.geo": {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [Number(longitude), Number(latitude)]
                        },
                        $maxDistance: milesConvertedToMeters,
                        $minDistance: 1
                    }
                }}, { $project: {
                    gender: 0
                }}).limit(30).toArray().then((results) => {    
        
                    const formattedArr = [];
        
                    for (let idx = 0; idx < results.length; idx++) {
                        const user = results[idx];
        
                        const keysToKeep = [
                            "coverPhoto", 
                            "subscriptionAmountRestrictedContent", 
                            "firstName", 
                            "username", 
                            "email", 
                            "profilePictures", 
                            "inAppTokenCurrency",
                            "uniqueId", 
                            "generatedFake",
                            "verificationCompleted", 
                            "registrationDate", 
                            "spotifyRecentPlaylist",
                            "registrationDateString", 
                            "reviews", 
                            "followers",
                            "following",
                            "totalUniqueViews", 
                            "rank", 
                            "stripeAccountVerified", 
                            "currentApproxLocation", 
                            "coreProfileData", 
                            "gender", 
                            "interestedIn", 
                            "restrictedImagesVideos", 
                            "birthdateRaw", 
                            "accountType",
                            "subscribedUsersRestricted",
                            "requestedMatches"
                        ];
            
                        const filtered = _.pick(user, keysToKeep);
                        
                        formattedArr.push(filtered);
        
                        if ((results.length - 1) === idx) {
                            console.log("formattedArr", formattedArr);
        
                            resppppp.json({
                                message: "Gathered nearby location users!",
                                results: formattedArr
                            })
                        }
                    }
                }).catch((err) => {
                    console.log("err fetching - critical...:", err);
        
                    resppppp.json({
                        message: "Could not find the appropriate results...",
                        err
                    });
                });
            } else {
                collection.find({ "currentApproxLocation.geo": {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [Number(longitude), Number(latitude)]
                        },
                        $maxDistance: milesConvertedToMeters,
                        $minDistance: 1
                    }
                }, interestedIn }, { $project: {
                    gender: 0
                }}).limit(30).toArray().then((results) => {    
        
                    const formattedArr = [];
        
                    for (let idx = 0; idx < results.length; idx++) {
                        const user = results[idx];
        
                        const keysToKeep = [
                            "coverPhoto", 
                            "subscriptionAmountRestrictedContent", 
                            "firstName", 
                            "username", 
                            "email", 
                            "inAppTokenCurrency",
                            "profilePictures", 
                            "uniqueId", 
                            "generatedFake",
                            "verificationCompleted", 
                            "spotifyRecentPlaylist",
                            "followers",
                            "following",
                            "registrationDate", 
                            "registrationDateString", 
                            "reviews", 
                            "totalUniqueViews", 
                            "rank", 
                            "stripeAccountVerified", 
                            "currentApproxLocation", 
                            "coreProfileData", 
                            "gender", 
                            "interestedIn", 
                            "restrictedImagesVideos", 
                            "birthdateRaw", 
                            "accountType",
                            "subscribedUsersRestricted",
                            "requestedMatches"
                        ];
            
                        const filtered = _.pick(user, keysToKeep);
                        
                        formattedArr.push(filtered);
        
                        if ((results.length - 1) === idx) {
                            console.log("formattedArr", formattedArr);
        
                            resppppp.json({
                                message: "Gathered nearby location users!",
                                results: formattedArr
                            })
                        }
                    }
                }).catch((err) => {
                    console.log("err fetching - critical...:", err);
        
                    resppppp.json({
                        message: "Could not find the appropriate results...",
                        err
                    });
                });
            }
        }
    } else {
        resppppp.json({
            message: "Location coordinates are NOT available at the current moment - taking no action."
        });
    }
});

module.exports = router;