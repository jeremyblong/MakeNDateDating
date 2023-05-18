const express = require("express");
const router = express.Router();
const config = require("config");
const moment = require("moment");
const { Connection } = require("../../../../mongoUtil.js");
const _ = require("lodash");  

router.post("/", async (req, resppppp, next) => {

    const { otherUserID, signedInID } = req.body;
        
    const collection = Connection.db.db("test").collection("users");

    const fields = [
        "coverPhoto", 
        "subscriptionAmountRestrictedContent", 
        "firstName", 
        "username", 
        "email", 
        "profilePictures", 
        "uniqueId", 
        "verificationCompleted", 
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

    const matchingUser = await collection.findOne({ uniqueId: otherUserID });

    console.log("matchingUser", matchingUser);
    
    const loggedInUser = await collection.findOne({ uniqueId: signedInID });

    if (_.has(matchingUser, "subscriptionAmountRestrictedContent")) {

        const subscriptionAmount = matchingUser.subscriptionAmountRestrictedContent;
        
        if (loggedInUser.inAppTokenCurrency >= subscriptionAmount) {

            collection.findOneAndUpdate({ uniqueId: signedInID }, { $inc: {
                inAppTokenCurrency: -subscriptionAmount
            } }, { returnDocument: 'after' },  (errrrrrrrr, data) => {
                if (errrrrrrrr) {
                    console.log("Error secondary...:", errrrrrrrr);
        
                    resppppp.json({
                        message: "An err occurred while attempting to update DB information...",
                        err: errrrrrrrr
                    })
                } else {
                    console.log("result second...:", data);
        
                    collection.findOneAndUpdate({ uniqueId: otherUserID }, { $push: {
                        subscribedUsersRestricted: signedInID,
                    }, $inc: { inAppTokenCurrency: Math.abs(Number(subscriptionAmount)) }}, { returnDocument: 'after' },  (err, data) => {
                        if (err) {
                            console.log(err.message);
        
                            resppppp.json({
                                message: "An error occurred while attempting to update DB information...",
                                err
                            })
                        } else {
                            console.log("result", data);
        
                            const { value } = data;
        
                            const valuesSelected = _.pick(value, fields);
        
                            resppppp.json({
                                message: "Successfully subscribed!",
                                user: valuesSelected
                            })
                        }
                    });
                }
            });
        } else {
            resppppp.json({
                message: "You do NOT have enough tokens to complete this transaction."
            })
        }
    } else {
        resppppp.json({
            message: "This user has NOT set a price for their subscription yet, no action was taken as the appropriate settings have not been set!"
        })
    }
});

module.exports = router;