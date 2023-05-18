const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");
const BoostNewUser = require("../../../schemas/booosts/boostRegUser.js");

router.post("/", async (req, resppppp) => {

    const { uniqueId, tier } = req.body;

    const collection = Connection.db.db("test").collection("users");

    const matchingResult = await collection.findOne({ uniqueId });
    
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
    } = matchingResult;

    switch (tier) {
        case 1:
            if (matchingResult !== null && matchingResult.inAppTokenCurrency >= 40) {
                let tokenCount = -40;

                collection.findOneAndUpdate({ uniqueId }, { $inc: {
                    inAppTokenCurrency: tokenCount
                } }, { returnDocument: 'after' },  (errrrrrrrr, data) => {
                    if (errrrrrrrr) {
                        console.log("Error secondary...:", errrrrrrrr);
            
                        resppppp.json({
                            message: "An err occurred while attempting to update DB information...",
                            err: errrrrrrrr
                        })
                    } else {
                        console.log("result second...:", data);
            
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
                            uniqueId,
                            tier
                        });

                        collection.findOneAndUpdate({ uniqueId }, { $inc: {
                            superMessageCount: 3
                        }}, { returnDocument: 'after' },  (err, data) => {
                            if (err) {
                                console.log(err.message);
        
                                resppppp.json({
                                    message: "Error occurred while updating password data/information...",
                                    err
                                })
                            } else {
                                newUserBoostedOne.save((err, result) => {
                                    if (err) {
                                        console.log("err", err);
                                    } else {
                                        console.log("result", result);
                    
                                        resppppp.json({
                                            message: "Submitted promoted/boosted account!",
                                            result
                                        })
                                    }
                                })
                            }
                        });
                    }
                });
            } else {
                resppppp.json({
                    message: "You do NOT have enough tokens/coins available in your in-app balance..."
                })
            }
            break;
        case 2:
            if (matchingResult !== null && matchingResult.inAppTokenCurrency >= 100) {
                
                let tokenCount = -100;
                
                collection.findOneAndUpdate({ uniqueId }, { $inc: {
                    inAppTokenCurrency: tokenCount
                } }, { returnDocument: 'after' },  (errrrrrrrr, data) => {
                    if (errrrrrrrr) {
                        console.log("Error secondary...:", errrrrrrrr);
            
                        resppppp.json({
                            message: "An err occurred while attempting to update DB information...",
                            err: errrrrrrrr
                        })
                    } else {
                        console.log("result second...:", data);
            
                        const newUserBoostedTwo = new BoostNewUser({
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
                            uniqueId,
                            tier
                        });
            
                        newUserBoostedTwo.save((err, result) => {
                            if (err) {
                                console.log("err", err);
                            } else {
                                console.log("result", result);
                                
                                collection.findOneAndUpdate({ uniqueId }, { $inc: { profileBoosts: 1, superMessageCount: 5, superLikeCredit: 5 } }, { returnDocument: 'after' },  (err, data) => {
                                    if (err) {
                                        console.log(err.message);
                                
                                        resppppp.json({
                                            message: "An error occurred while attempting to update DB information...",
                                            err
                                        })
                                    } else {
                                        console.log("result", data);
                                
                                        resppppp.json({
                                            message: "Submitted promoted/boosted account!",
                                            result
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
            } else {
                resppppp.json({
                    message: "You do NOT have enough tokens/coins available in your in-app balance..."
                })
            }
            break;
        case 3:
            if (matchingResult !== null && matchingResult.inAppTokenCurrency >= 140) {

                let tokenCount = -140;
                
                collection.findOneAndUpdate({ uniqueId }, { $inc: {
                    inAppTokenCurrency: tokenCount
                } }, { returnDocument: 'after' },  (errrrrrrrr, data) => {
                    if (errrrrrrrr) {
                        console.log("Error secondary...:", errrrrrrrr);
            
                        resppppp.json({
                            message: "An err occurred while attempting to update DB information...",
                            err: errrrrrrrr
                        })
                    } else {
                        console.log("result second...:", data);
            
                        const newUserBoostedThree = new BoostNewUser({
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
                            uniqueId,
                            tier
                        });
            
                        newUserBoostedThree.save((err, result) => {
                            if (err) {
                                console.log("err", err);
                            } else {
                                console.log("result", result);
            
                                collection.findOneAndUpdate({ uniqueId }, { $inc: { profileBoosts: 2, superMessageCount: 8, superLikeCredit: 10 } }, { returnDocument: 'after' },  (err, data) => {
                                    if (err) {
                                        console.log(err.message);
                                
                                        resppppp.json({
                                            message: "An error occurred while attempting to update DB information...",
                                            err
                                        })
                                    } else {
                                        console.log("result", data);
                                
                                        resppppp.json({
                                            message: "Submitted promoted/boosted account!",
                                            result
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
            } else {
                resppppp.json({
                    message: "You do NOT have enough tokens/coins available in your in-app balance..."
                })
            }
            break;
        default:
            break;
    }
});

module.exports = router;
