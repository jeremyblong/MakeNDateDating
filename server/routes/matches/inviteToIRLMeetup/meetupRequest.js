const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const _ = require("lodash");
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, response) => {

    const collection = Connection.db.db("test").collection("users");

    const { 
        uniqueId,
        otherUserID,
        time, 
        markedDatesIn, 
        description,
        firstName,
        username,
        waggedAmount
    } = req.body;

    const authenticatedUser = await collection.findOne({ uniqueId });
    const otherUserAccount = await collection.findOne({ uniqueId: otherUserID });
    const generatedID = uuidv4();
    
    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `${authenticatedUser.firstName} has sent a request to meet-up with you soon!`,
            body: `${authenticatedUser.firstName}/@${authenticatedUser.username} requested to meetup in real life with you sometime soon! You've matched with them so why not? Click this notification to take action to this request...!`,
            meetupID: generatedID
        },
        from: uniqueId,
        link: "meetup-request"
    };

    const matching = await collection.findOne({ uniqueId: otherUserID });

    const messageee = { 
        to: matching.fcmToken, 
        collapse_key: uuidv4(),
        notification: {
            title: `${authenticatedUser.firstName} has sent a request to meet-up with you soon!`,
            body: `${authenticatedUser.firstName}/@${authenticatedUser.username} requested to meetup in real life with you sometime soon! You've matched with them so why not? Click this notification to take action to this request...!`
        }
    };

    const newMeetupRequest = {
        meetupTime: time, 
        selectedMeetupData: markedDatesIn, 
        meetupDescription: description,
        id: generatedID,
        dateOfChange: new Date(),
        accepted: false,
        sendingID: uniqueId,
        recievingUserID: otherUserID,
        reacted: false,
        firstName,
        username,
        recieverName: otherUserAccount.firstName,
        recieverUsername: otherUserAccount.username,
        waggedAmount
    }

    collection.findOneAndUpdate({ uniqueId: otherUserID }, { $push: { notifications: newNotification, meetupRequestsPending: newMeetupRequest }, $inc: { rank: Math.abs(Number(25)) }}, { returnDocument: 'after' }, (err, doc) => {
        if (err) {
            console.log("err in request...:", err);

            response.json({
                message: "Failed to update other user's notification results - undo changes...",
                err
            });
        } else {
            const { value } = doc;
            
            collection.findOneAndUpdate({ uniqueId }, { $push: { meetupRequestsPending: newMeetupRequest }, $inc: {
                inAppTokenCurrency: -Math.abs(Number(waggedAmount))
            }}, { returnDocument: 'after' }, (errrrrr, doccccc) => {
                if (errrrrr) {
                    console.log("errrrrr in request...:", errrrrr);
        
                    response.json({
                        message: "Failed to update other user's notification results - undo changes...",
                        err: errrrrr
                    });
                    
                } else {
                    const { value } = doccccc;

                    fcm.send(messageee, (err, responseeeeee) => {
                        if (err) {
                            console.log("Something has gone wrong!", err);
        
                            response.json({
                                message: "Successfully sent notification for meetup!",
                                user: value
                            })
                        } else {
                            console.log("Successfully sent with response: ", responseeeeee);
        
                            response.json({
                                message: "Successfully sent notification for meetup!",
                                user: value
                            })
                        }
                    });
                }
            })   
        }
    })  
});

module.exports = router;