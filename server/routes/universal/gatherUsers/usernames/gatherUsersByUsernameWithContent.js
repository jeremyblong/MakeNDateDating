const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
const { v4: uuidv4 } = require('uuid');
const _ = require("lodash");

router.post("/", (req, resppppp) => {

    const { 
        uniqueId,
        otherUserUsername
    } = req.body;

    const collection = Connection.db.db("test").collection("users");

    collection.aggregate([{ 
        "$match": { "username" : { $regex : otherUserUsername.trim().toLowerCase() } 
    }}, { 
        "$limit": 30 
    }, { 
        "$project" : { 
            coverPhoto: 1, 
            followers: 1, 
            subscribedUsersRestricted: 1, 
            subscriptionAmountRestrictedContent: 1, 
            spotifyRecentPlaylist: 1,
            firstName: 1, 
            generatedFake: 1,
            spotifyProfileTokenCode: 1,
            username: 1, 
            email: 1, 
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
    }}]).toArray().then((users) => {
        if (!users) {
            resppppp.json({
                message: "Error occurred while fetching usernames...!",
                err
            })
        } else {
            console.log("users :", users);

            resppppp.json({
                message: "Successfully located usernames!",
                users
            })
        }
    })
});

module.exports = router;