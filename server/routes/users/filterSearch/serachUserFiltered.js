const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const { v4: uuidv4 } = require('uuid');
const _ = require("lodash");

router.get("/", async (req, resppppp) => {

    const { height, gender, hairColor, children } = req.query;
    
    const { partial, full } = children;

    const collection = Connection.db.db("test").collection("users");
    const maxHeight = 2.54 * height.high;
    const minHeight = 2.54 * height.low;
    const promiseArr = [];

    if (gender === "Anyone") {
        promiseArr.push(new Promise(async (resolve, reject) => {
            await collection.aggregate([{ $sample: { size: 30 } }, { $project: {
                coverPhoto: 1, 
                followers: 1, 
                subscribedUsersRestricted: 1, 
                subscriptionAmountRestrictedContent: 1, 
                firstName: 1, 
                generatedFake: 1,
                spotifyProfileTokenCode: 1,
                spotifyRecentPlaylist: 1,
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
            }}]).toArray((err, results) => {
                if (err) {
                    console.log("err", err);
                } else {
                    console.log("results", results);
        
                    resolve(results);
                }
            });
        }));
    } else {
        promiseArr.push(new Promise(async (resolve, reject) => {
            await collection.find({ $and: [ { "coreProfileData.heightProfileData.CMHeight": { $gte: minHeight } }, { "coreProfileData.heightProfileData.CMHeight": { $lte: maxHeight } } ]}).project({
                securityAuthenticationLogs: 0,
                password: 0,
                interestedIn: 0,
                authStrategy: 0,
                refreshToken: 0,
                paymentMethods: 0,
                authyId: 0,
                stripeAccountDetails: 0,
                salt: 0,
                hash: 0,
                vonageTokenSession: 0,
                inAppTokenCurrency: 0
            }).limit(30).toArray((err, results) => {
                if (err) {
                    console.log("err", err);
                } else {
                    console.log("results", results);
        
                    resolve(results);
                }
            });
        }));
    
        promiseArr.push(new Promise(async (resolve, reject) => {
            await collection.find({ "gender.value": gender }).project({
                securityAuthenticationLogs: 0,
                password: 0,
                interestedIn: 0,
                authStrategy: 0,
                refreshToken: 0,
                paymentMethods: 0,
                authyId: 0,
                stripeAccountDetails: 0,
                salt: 0,
                hash: 0,
                vonageTokenSession: 0,
                inAppTokenCurrency: 0
            }).limit(30).toArray((err, results) => {
                if (err) {
                    console.log("err", err);
                } else {
                    console.log("results", results);
        
                    resolve(results);
                }
            });
        }));
    
        promiseArr.push(new Promise(async (resolve, reject) => {
            await collection.find({ "coreProfileData.hairColor": hairColor }).project({
                securityAuthenticationLogs: 0,
                password: 0,
                interestedIn: 0,
                authStrategy: 0,
                refreshToken: 0,
                paymentMethods: 0,
                authyId: 0,
                stripeAccountDetails: 0,
                salt: 0,
                hash: 0,
                vonageTokenSession: 0,
                inAppTokenCurrency: 0
            }).limit(30).toArray((err, results) => {
                if (err) {
                    console.log("err", err);
                } else {
                    console.log("results", results);
        
                    resolve(results);
                }
            });
        }))
    
        
        promiseArr.push(new Promise(async (resolve, reject) => {
            await collection.find({ $and: [ { "coreProfileData.custodyChildren.numberOfFullTimeChildren": { $lte: full } }, { "coreProfileData.custodyChildren.numberOfPartialCustody": { $lte: partial } } ]}).project({
                securityAuthenticationLogs: 0,
                password: 0,
                interestedIn: 0,
                authStrategy: 0,
                refreshToken: 0,
                paymentMethods: 0,
                authyId: 0,
                stripeAccountDetails: 0,
                salt: 0,
                hash: 0,
                vonageTokenSession: 0,
                inAppTokenCurrency: 0
            }).limit(30).toArray((err, results) => {
                if (err) {
                    console.log("err", err);
                } else {
                    console.log("results", results);
        
                    resolve(results);
                }
            });
        }));
    }

    Promise.all(promiseArr).then((passedValues) => {
        if (gender === "Anyone") {
            resppppp.json({
                message: "Successfully filtered!",
                users: passedValues[0]
            })
        } else {
            const newArr = [].concat(passedValues[0], passedValues[1], passedValues[2], passedValues[3]);

            const parsed = Array.from(new Set(newArr.map(JSON.stringify))).map(JSON.parse);
        
            resppppp.json({
                message: "Successfully filtered!",
                users: parsed
            })
        }
    })
});

module.exports = router;