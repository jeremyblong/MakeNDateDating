const express = require("express");
const router = express.Router();
const NewMentorshipRequest = require("../../../schemas/mentorship/initiateNewRequest.js");
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const config = require("config");
const FCM = require('fcm-node');

const fcm = new FCM(config.get("firebaseServerKey"));

const calulatedTokensCost = (tierSelected) => {
    if (tierSelected === "tier-1") {
        return (35 / config.get("tokenApproxCostPerCoin"))
    } else if (tierSelected === "tier-2") {
        return (65 / config.get("tokenApproxCostPerCoin"))
    } else if (tierSelected === "tier-3") {
        return (100 / config.get("tokenApproxCostPerCoin"))
    }
};

router.post("/", async (req, resppppp) => {

    const {
        id,
        markdownText, 
        selectedDate, 
        description, 
        problemsText, 
        time, 
        selectedImprovement,
        requesterName, 
        requesterUsername,
        tierSelected, 
        otherUser, 
        requestedTherapistUsername,
        requestedTherapistName, 
        otherUserID,
        accountType,
        uniqueId
    } = req.body;

    console.log("req.bodyyyyyyyyyyyyyy", req.body);

    const collection = Connection.db.db("test").collection("mentors");
    const usersCollection = Connection.db.db("test").collection("users");

    const bothCollectionsConditionally = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    const findUser = await bothCollectionsConditionally.findOne({ uniqueId });
    const matchOtherUser = await collection.findOne({ uniqueId: otherUserID });

    const newNotification = {
        id: uuidv4(),
        system_date: Date.now(),
        date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
        data: {
            title: `You have a new mentorship/therapy request!`,
            body: `${findUser.username}/${findUser.firstName} has requested you as a therapist/mentor. This user would like to discuss potential troubles/issues they're struggling with or working on - Click this notification to view the request!`
        },
        from: uniqueId,
        link: "new-mentorship-request"
    };

    const messageee = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: matchOtherUser.fcmToken, 
        collapse_key: uuidv4(),
        notification: {
            title: `You have a new mentorship/therapy request!`,
            body: `${findUser.username}/${findUser.firstName} has requested you as a therapist/mentor. This user would like to discuss potential troubles/issues they're struggling with or working on - Click this notification to view the request!`
        }
    };

    const tConvert = (time) => {
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
    }

    const tConvertWo = (time) => {
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
        //   time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
    }

    const hoursFormatted = tConvertWo(time).split(":")[0];
    const minutesFormatted = tConvertWo(time).split(":")[1];
    const dateOne = new Date(selectedDate.dateOne);
    const dateTwo = new Date(selectedDate.dateTwo);
    const dateThree = new Date(selectedDate.dateThree);

    if ((findUser.inAppTokenCurrency >= calulatedTokensCost(tierSelected))) {
        console.log("success with contract and had enough currency!");

        if (selectedDate.dateThree !== null) {
            dateOne.setHours(0);
            dateOne.setMinutes(0);
            dateOne.setHours(hoursFormatted);
            dateOne.setMinutes(minutesFormatted);
            dateTwo.setHours(0);
            dateTwo.setMinutes(0);
            dateTwo.setHours(hoursFormatted);
            dateTwo.setMinutes(minutesFormatted);
            dateThree.setHours(0);
            dateThree.setMinutes(0);
            dateThree.setHours(hoursFormatted);
            dateThree.setMinutes(minutesFormatted);

            const newlyFormattedDateObj = {
                dateOne,
                dateTwo,
                dateThree
            }

            const timeDateConverted = tConvert(time);

            const newAdditionOBJ = {
                requestedBy: id,
                designatedTargetUserID: otherUserID,
                requesterName, 
                tierSelected,
                meetingsPerMonth: tierSelected === "tier-1" ? 1 : tierSelected === "tier-2" ? 2 : 3,
                monthlyEarnings: tierSelected === "tier-1" ? 34.99 : tierSelected === "tier-2" ? 64.99 : 99.99,
                requesterUsername,
                initialMarkdownMessage: markdownText, 
                selectedTimes: time, 
                whatYouExpectFromTherapist: description,  
                problemsText,
                formattedDates: newlyFormattedDateObj,
                approaches: selectedImprovement,
                hourSet: timeDateConverted,
                views: 0,
                postedOn: new Date(),
                id: uuidv4(),
                accepted: false,
                requestedTherapistUsername,
                requestedTherapistName
            };

            collection.findOneAndUpdate({ uniqueId: otherUser.uniqueId }, { $push: {
                pendingMentorshipInvites: newAdditionOBJ,
                notifications: newNotification
            }}, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);

                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    });

                } else {
                    console.log("result", data);

                    usersCollection.findOneAndUpdate({ uniqueId: id }, { $push: {
                        pendingMentorshipInvites: newAdditionOBJ
                    }, $inc: {
                        inAppTokenCurrency: -Math.abs(Number(calulatedTokensCost(tierSelected)))
                    }}, { returnDocument: 'after' },  (err, data) => {
                        if (err) {
                            console.log(err.message);
                
                            resppppp.json({
                                message: "An error occurred while attempting to update DB information...",
                                err
                            })
                        } else {
                            console.log("result", data);

                            fcm.send(messageee, (err, response) => {
                                if (err) {
                                    console.log("Something has gone wrong!", err);
                
                                    resppppp.json({
                                        message: "Submitted request!"
                                    })
                                } else {
                                    console.log("Successfully sent with response: ", response);
                
                                    resppppp.json({
                                        message: "Submitted request!"
                                    })
                                }
                            });
                        }
                    })
                }
            })
        } else if (selectedDate.dateTwo !== null) {

            dateOne.setHours(0);
            dateOne.setMinutes(0);
            dateOne.setHours(hoursFormatted);
            dateOne.setMinutes(minutesFormatted);
            dateTwo.setHours(0);
            dateTwo.setMinutes(0);
            dateTwo.setHours(hoursFormatted);
            dateTwo.setMinutes(minutesFormatted);

            console.log("dates registered...:", dateOne, dateTwo)

            const newlyFormattedDateObj = {
                dateOne,
                dateTwo,
                dateThree: null
            }

            const timeDateConverted = tConvert(time);

            const newAdditionOBJ = {
                requestedBy: id,
                requesterName, 
                designatedTargetUserID: otherUserID,
                tierSelected,
                meetingsPerMonth: tierSelected === "tier-1" ? 1 : tierSelected === "tier-2" ? 2 : 3,
                monthlyEarnings: tierSelected === "tier-1" ? 34.99 : tierSelected === "tier-2" ? 64.99 : 99.99,
                requesterUsername,
                initialMarkdownMessage: markdownText, 
                selectedTimes: time, 
                whatYouExpectFromTherapist: description,  
                problemsText,
                formattedDates: newlyFormattedDateObj,
                approaches: selectedImprovement,
                hourSet: timeDateConverted,
                views: 0,
                postedOn: new Date(),
                id: uuidv4(),
                accepted: false,
                requestedTherapistUsername,
                requestedTherapistName
            };

            collection.findOneAndUpdate({ uniqueId: otherUser.uniqueId }, { $push: {
                pendingMentorshipInvites: newAdditionOBJ,
                notifications: newNotification
            }}, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);

                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    });

                } else {
                    console.log("result", data);

                    usersCollection.findOneAndUpdate({ uniqueId: id }, { $push: {
                        pendingMentorshipInvites: newAdditionOBJ
                    }, $inc: {
                        inAppTokenCurrency: -Math.abs(Number(calulatedTokensCost(tierSelected)))
                    }}, { returnDocument: 'after' },  (err, data) => {
                        if (err) {
                            console.log(err.message);
                
                            resppppp.json({
                                message: "An error occurred while attempting to update DB information...",
                                err
                            })
                        } else {
                            console.log("result", data);
                
                            fcm.send(messageee, (err, response) => {
                                if (err) {
                                    console.log("Something has gone wrong!", err);
                
                                    resppppp.json({
                                        message: "Submitted request!"
                                    })
                                } else {
                                    console.log("Successfully sent with response: ", response);
                
                                    resppppp.json({
                                        message: "Submitted request!"
                                    })
                                }
                            });
                        }
                    })
                }
            })
        } else {
            dateOne.setHours(0);
            dateOne.setMinutes(0);
            dateOne.setHours(hoursFormatted);
            dateOne.setMinutes(minutesFormatted);

            const newlyFormattedDateObj = {
                dateOne,
                dateTwo: null,
                dateThree: null
            }

            const timeDateConverted = tConvert(time);

            const newAdditionOBJ = {
                requestedBy: id,
                requesterName, 
                designatedTargetUserID: otherUserID,
                tierSelected,
                meetingsPerMonth: tierSelected === "tier-1" ? 1 : tierSelected === "tier-2" ? 2 : 3,
                monthlyEarnings: tierSelected === "tier-1" ? 34.99 : tierSelected === "tier-2" ? 64.99 : 99.99,
                requesterUsername,
                initialMarkdownMessage: markdownText, 
                selectedTimes: time, 
                whatYouExpectFromTherapist: description,  
                problemsText,
                formattedDates: newlyFormattedDateObj,
                approaches: selectedImprovement,
                hourSet: timeDateConverted,
                views: 0,
                postedOn: new Date(),
                id: uuidv4(),
                accepted: false,
                requestedTherapistUsername,
                requestedTherapistName
            };

            collection.findOneAndUpdate({ uniqueId: otherUser.uniqueId }, { $push: {
                pendingMentorshipInvites: newAdditionOBJ,
                notifications: newNotification
            }}, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);

                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    });

                } else {
                    console.log("result", data);

                    usersCollection.findOneAndUpdate({ uniqueId: id }, { $push: {
                        pendingMentorshipInvites: newAdditionOBJ
                    }, $inc: {
                        inAppTokenCurrency: -Math.abs(Number(calulatedTokensCost(tierSelected)))
                    }}, { returnDocument: 'after' },  (err, data) => {
                        if (err) {
                            console.log(err.message);
                
                            resppppp.json({
                                message: "An error occurred while attempting to update DB information...",
                                err
                            })
                        } else {
                            console.log("result", data);
                
                            fcm.send(messageee, (err, response) => {
                                if (err) {
                                    console.log("Something has gone wrong!", err);
                
                                    resppppp.json({
                                        message: "Submitted request!"
                                    })
                                } else {
                                    console.log("Successfully sent with response: ", response);
                
                                    resppppp.json({
                                        message: "Submitted request!"
                                    })
                                }
                            });
                        }
                    })
                }
            })
        }
    } else {
        resppppp.json({
            message: "You do NOT have enough tokens to deposit for this purchase - please buy more tokens and try again..."
        })
    }
});

module.exports = router;