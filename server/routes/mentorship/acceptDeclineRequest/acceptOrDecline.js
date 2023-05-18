const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const config = require("config");
const { v4: uuidv4 } = require('uuid');
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp) => {

    const { authedUserID, requestingUserID, requestID, accepted } = req.body;

    const collection = Connection.db.db("test").collection("mentors");
    const usersCollection = Connection.db.db("test").collection("users");

    const requestDoc = await collection.findOne({ "pendingMentorshipInvites.id": requestID });

    const indexOfMatch = requestDoc.pendingMentorshipInvites.findIndex(item => item.id === requestID);

    const match = requestDoc.pendingMentorshipInvites[indexOfMatch];
    
    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `New mentorship request was approved!`,
            body: `Your request for ${requestDoc.firstName}/@${requestDoc.username} to mentor you was approved! They have decided to mentor you and accepted your request...`
        },
        from: authedUserID,
        link: "accepted-mentorship-request"
    };

    const matching = await usersCollection.findOne({ uniqueId: requestingUserID });

    const messageee = { 
        to: matching.fcmToken, 
        collapse_key: uuidv4(),
        notification: {
            title: `New mentorship request was approved!`,
            body: `Your request for ${requestDoc.firstName}/@${requestDoc.username} to mentor you was approved! They have decided to mentor you and accepted your request...`
        }
    };

    if (accepted === true) {
        // accepted request...!
        usersCollection.findOneAndUpdate({ uniqueId: requestingUserID }, {
            $push: {
                "acceptedMentorshipRequests": match,
                "notifications": newNotification
            },
            $pull: {
                "pendingMentorshipInvites": {
                    id: requestID
                }
            }
        }, { returnDocument: 'after' },  (err, data) => {
            if (err) {
                console.log("err", err);

                resppppp.json({
                    message: "An error occurred while attempting to update DB information...",
                    err
                })
            } else {
                console.log("result", data);

                collection.findOneAndUpdate({ uniqueId: requestDoc.uniqueId }, {
                    $push: {
                        "acceptedMentorshipRequests": match
                    },
                    $pull: {
                        "pendingMentorshipInvites": {
                            id: requestID
                        }
                    }
                }, { returnDocument: 'after' },  (errrrrrrrrrrrrrrrrrrrrr, data) => {
                    if (errrrrrrrrrrrrrrrrrrrrr) {
                        console.log("errrrrrrrrrrrrrrrrrrrrr", errrrrrrrrrrrrrrrrrrrrr);

                        usersCollection.findOneAndUpdate({ uniqueId: requestingUserID }, {
                            $pull: {
                                acceptedMentorshipRequests: { id: match.id }
                            }
                        }, { returnDocument: 'after' },  (errrrrrrr, data) => {
                            if (errrrrrrr) {
                                console.log("errrrrrrr", errrrrrrr);
                
                                resppppp.json({
                                    message: "An error occurred while attempting to update DB information backup process...",
                                    err: errrrrrrr
                                })
                            } else {
                                console.log("result", data);
                
                                resppppp.json({
                                    message: "An error occurred while attempting to update DB information - deleted old information backup process..."
                                })
                            }
                        })
                    } else {
                        console.log("result", data);

                        fcm.send(messageee, (err, responseeeeee) => {
                            if (err) {
                                console.log("Something has gone wrong!", err);
                        
                                resppppp.json({
                                    message: "Successfully submitted response!"
                                })
                            } else {
                                console.log("Successfully sent with response: ", responseeeeee);
                        
                                resppppp.json({
                                    message: "Successfully submitted response!"
                                })
                            }
                        });
                    }
                })
            }
        })
    } else {
        // denied request....

        usersCollection.findOneAndUpdate({ uniqueId: requestingUserID }, {
            $pull: {
                "pendingMentorshipInvites": {
                    id: requestID
                }
            }
        }, { returnDocument: 'after' },  (err, data) => {
            if (err) {
                console.log("err", err);

                resppppp.json({
                    message: "An error occurred while attempting to update DB information...",
                    err
                })
            } else {
                console.log("result", data);

                collection.findOneAndUpdate({ uniqueId: requestDoc.uniqueId }, {
                    $pull: {
                        "pendingMentorshipInvites": {
                            id: requestID
                        }
                    }
                }, { returnDocument: 'after' },  (errrrrrrrrrrrrrrrrrrrrr, data) => {
                    if (errrrrrrrrrrrrrrrrrrrrr) {
                        console.log("errrrrrrrrrrrrrrrrrrrrr", errrrrrrrrrrrrrrrrrrrrr);

                        resppppp.json({
                            message: "An error occurred while attempting to update DB information backup process...",
                            err: errrrrrrrrrrrrrrrrrrrrr
                        })
                    } else {
                        console.log("result", data);
        
                        resppppp.json({
                            message: "Successfully submitted response!"
                        })
                    }
                })
            }
        })
    }
});

module.exports = router;