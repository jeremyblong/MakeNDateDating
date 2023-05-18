const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, response) => {

    const collection = Connection.db.db("test").collection("users");

    const { 
        other_user,
        user,
        fullName,
        message,
        subject,
        coins,
        uniqueId,
        useCredit
    } = req.body;

    const matchingResult = await collection.findOne({ uniqueId: other_user });
    const loggedInUser = await collection.findOne({ uniqueId });
    // decrypt other user blockchain public address

    const calculatedFeeCoins = Math.floor(Math.floor(coins) * 0.85);

    if (useCredit === true) {
        if (matchingResult !== null && loggedInUser !== null) {

            const newNotification = {
                id: uuidv4(),
                system_date: Date.now(),
                date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                data: {
                    title: `You have a new BOOSTED (12 token's) private message from ${fullName}`,
                    body: subject.toString()
                },
                from: user,
                link: "notifications"
            };
    
            const matching = await collection.findOne({ uniqueId: other_user });
    
            const messageee = { 
                to: matching.fcmToken, 
                collapse_key: uuidv4(),
                notification: {
                    title: `You have a new BOOSTED (12 token's) private message from ${fullName}`,
                    body: subject.toString()
                }
            };
        
            collection.findOneAndUpdate({ uniqueId }, { $inc: { rank: Math.abs(Number(5)), superMessageCount: -1 }}, { returnDocument: 'after' }, (err, doc) => {
                if (err) {
                    response.json({
                        message: "Failed to update other user's notification results - undo changes...",
                        err
                    });
                } else {
        
                    collection.findOneAndUpdate({ uniqueId: other_user }, { $push: { notifications: newNotification }, $inc: { rank: Math.abs(Number(35)), inAppTokenCurrency: 12 }}, { returnDocument: 'after' }, (err, doc) => {
                        if (err) {
                            response.json({
                                message: "Failed to update other user's notification results - undo changes...",
                                err
                            });
                        } else {
                
                            const { value } = doc;
    
                            fcm.send(messageee, (err, responseeeeee) => {
                                if (err) {
                                    console.log("Something has gone wrong!", err);
                            
                                    response.json({
                                        message: "Sent notification and message!"
                                    })
                                } else {
                                    console.log("Successfully sent with response: ", responseeeeee);
                            
                                    console.log("Successfully updated/pushed new notification...:", value);
        
                                    response.json({
                                        message: "Sent notification and message!"
                                    })
                                }
                            });
                        }
                    })
                }
            }) 
        } else {
            response.json({
                message: "You do NOT have enough in-app tokens/coins to send to this user, please try this action again after buying tokens..."
            })
        }
    } else {
        if (matchingResult !== null && loggedInUser !== null && loggedInUser.inAppTokenCurrency >= calculatedFeeCoins) {

            const newNotification = {
                id: uuidv4(),
                system_date: Date.now(),
                date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                data: {
                    title: `You have a new BOOSTED (${calculatedFeeCoins} token's) private message from ${fullName}`,
                    body: subject.toString()
                },
                from: user,
                link: "notifications"
            };
    
            const matching = await collection.findOne({ uniqueId: other_user });
    
            const messageee = { 
                to: matching.fcmToken, 
                collapse_key: uuidv4(),
                notification: {
                    title: `You have a new BOOSTED (${calculatedFeeCoins} token's) private message from ${fullName}`,
                    body: subject.toString()
                }
            };
        
            collection.findOneAndUpdate({ uniqueId }, { $inc: { rank: Math.abs(Number(5)), inAppTokenCurrency: -calculatedFeeCoins }}, { returnDocument: 'after' }, (err, doc) => {
                if (err) {
                    response.json({
                        message: "Failed to update other user's notification results - undo changes...",
                        err
                    });
                } else {
        
                    collection.findOneAndUpdate({ uniqueId: other_user }, { $push: { notifications: newNotification }, $inc: { rank: Math.abs(Number(35)), inAppTokenCurrency: calculatedFeeCoins }}, { returnDocument: 'after' }, (err, doc) => {
                        if (err) {
                            response.json({
                                message: "Failed to update other user's notification results - undo changes...",
                                err
                            });
                        } else {
                
                            const { value } = doc;
    
                            fcm.send(messageee, (err, responseeeeee) => {
                                if (err) {
                                    console.log("Something has gone wrong!", err);
                            
                                    response.json({
                                        message: "Sent notification and message!"
                                    })
                                } else {
                                    console.log("Successfully sent with response: ", responseeeeee);
                            
                                    console.log("Successfully updated/pushed new notification...:", value);
        
                                    response.json({
                                        message: "Sent notification and message!"
                                    })
                                }
                            });
                        }
                    })
                }
            }) 
        } else {
            response.json({
                message: "You do NOT have enough in-app tokens/coins to send to this user, please try this action again after buying tokens..."
            })
        }
    }
});

module.exports = router;