const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");

router.get("/", async (req, resppppp) => {

    const { postedByID } = req.query;

    const collection = Connection.db.db("test").collection("users");
    const collectionMentors = Connection.db.db("test").collection("mentors");

    const matching = await collection.findOne({ uniqueId: postedByID });

    if (matching !== null) {
        const filteredQueryFields = { projection: { firstName: 1, spotifyRecentPlaylist: 1, spotifyProfileTokenCode: 1,  generatedFake: 1, followers: 1, birthdateRaw: 1, coverPhoto: 1, subscriptionAmountRestrictedContent: 1, lastName: 1, rank: 1, username: 1, email: 1, profilePictures: 1, uniqueId: 1, verificationCompleted: 1, registrationDate: 1, requestedMatches: 1, registrationDateString: 1, gender: 1, reviews: 1, accountType: 1, totalUniqueViews: 1, stripeAccountVerified: 1, currentApproxLocation: 1, birthdate: 1, interestedIn: 1 }};

        collection.findOne({ uniqueId: postedByID }, filteredQueryFields).then((user) => {
            if (!user) {
    
                console.log("User does NOT exist or could not be found.");
    
                resppppp.json({
                    message: "User does NOT exist or could not be found."
                });
            } else {
                resppppp.json({
                    message: "Submitted gathered user's info!",
                    user
                })
            }
        }).catch((err) => {
            console.log(err.message);
    
            resppppp.json({
                message: "Unknown error.",
                err
            })
        })
    } else {

        const filteredQueryFields = { projection: { firstName: 1, spotifyRecentPlaylist: 1, spotifyProfileTokenCode: 1,  generatedFake: 1, followers: 1, coverPhoto: 1, birthdateRaw: 1, subscriptionAmountRestrictedContent: 1, lastName: 1, rank: 1, username: 1, email: 1, profilePictures: 1, uniqueId: 1, verificationCompleted: 1, registrationDate: 1, requestedMatches: 1, registrationDateString: 1, gender: 1, reviews: 1, accountType: 1, totalUniqueViews: 1, stripeAccountVerified: 1, currentApproxLocation: 1 }};

        collectionMentors.findOne({ uniqueId: postedByID }, filteredQueryFields).then((user) => {
            if (!user) {
    
                console.log("User does NOT exist or could not be found.");
    
                resppppp.json({
                    message: "User does NOT exist or could not be found."
                });
            } else {
                resppppp.json({
                    message: "Submitted gathered user's info!",
                    user
                })
            }
        }).catch((err) => {
            console.log(err.message);
    
            resppppp.json({
                message: "Unknown error.",
                err
            })
        })
    }
});

module.exports = router;