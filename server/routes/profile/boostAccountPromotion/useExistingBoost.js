const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const BoostNewUser = require("../../../schemas/booosts/boostRegUser.js");


router.post("/", async (req, resppppp) => {

    const collection = Connection.db.db("test").collection("users");

    const { uniqueId } = req.body;

    const matchedUser = await collection.findOne({ uniqueId });

    const {
        firstName,
        accountType,
        lastName,
        username,
        email,
        rankedArr,
        rank,
        profilePictures,
        verficationCompleted,
        registrationDate,
        registrationDateString,
        birthdateRaw,
        gender,
        interestedIn,
        enrolled,
        birthdate,
        reviews,
        totalUniqueViews,
        phoneNumber
    } = matchedUser;

    if (matchedUser.profileBoosts > 0) {
        collection.findOneAndUpdate({ uniqueId }, { $inc: { profileBoosts: -1 } }, { returnDocument: 'after' },  (err, data) => {
            if (err) {
                console.log(err.message);
    
                resppppp.json({
                    message: "An error occurred while attempting to update DB information...",
                    err
                })
            } else {
                console.log("result", data);
    
                const newUserBoostedOne = new BoostNewUser({
                    firstName,
                    accountType,
                    lastName,
                    username,
                    email,
                    rankedArr,
                    rank,
                    profilePictures,
                    verficationCompleted,
                    registrationDate,
                    registrationDateString,
                    birthdateRaw,
                    gender,
                    interestedIn,
                    enrolled,
                    birthdate,
                    reviews,
                    totalUniqueViews,
                    phoneNumber,
                    uniqueId
                });
        
                newUserBoostedOne.save((err, result) => {
                    if (err) {
                        console.log("err", err);
                    } else {
                        console.log("result", result);
        
                        resppppp.json({
                            message: "Successfully boosted!",
                            result
                        })
                    }
                })
            }
        })
    } else {
        resppppp.json({
            message: "You do NOT have enough boosts to take this action - please buy more boosts and try again."
        })
    }
});

module.exports = router;