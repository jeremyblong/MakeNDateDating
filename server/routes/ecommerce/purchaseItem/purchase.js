const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const moment = require("moment");
const { Connection } = require("../../../mongoUtil.js");
const _ = require('lodash');
const axios = require("axios");
const FCM = require('fcm-node');
const createAnAcceptPaymentTransaction = require("./getAPIToken.js");

const fcm = new FCM(config.get("firebaseServerKey"));

router.post("/", async (req, resppppp, next) => {

    console.log("req.body", req.body);
    
    const {
        uniqueId,
        price,
        accountType,
        otherUserUsername,
        invoiceNumber,
        itemInfo,
        customMessage
    } = req.body;

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");
    const findOtherUser = await collection.findOne({ username: otherUserUsername });
    const authenticatedUser = await collection.findOne({ uniqueId });
    const caluclatedPriceInTokens = (price / config.get("tokenApproxCostPerCoin"));

    const paymentCardData = {
        cardNumber: "370000000000002",
        month: "12",
        year: "26",
        cardCode: "4454"
    }

    if (_.has(findOtherUser, "addressRelated")) {
        if (caluclatedPriceInTokens <= authenticatedUser.inAppTokenCurrency) {

            const { addressLineOne, addressLineTwo, city, zipCode, addressState } = findOtherUser.addressRelated;

            axios.get(`https://www.floristone.com/api/rest/flowershop/getauthorizenetkey`, {
                headers: { 'Authorization': `Basic ${Buffer.from(config.get("flowerApiCreds")).toString("base64")}` }
            }).then((resssssssss) => {
                if (resssssssss.data) {
                    console.log("resssssssss.data", resssssssss.data);

                    const { AUTHORIZENET_KEY, AUTHORIZENET_URL, USERNAME } = resssssssss.data;

                    const callbackFunHelper = () => {
                        console.log("done!");
                    }

                    const responseeeeee = createAnAcceptPaymentTransaction(callbackFunHelper, price, AUTHORIZENET_KEY, AUTHORIZENET_URL, USERNAME);

                    console.log("responseeeeee", responseeeeee, AUTHORIZENET_KEY, AUTHORIZENET_URL, USERNAME);
                    
                    const configurationTwo = {
                        "customer": {
                            "FIRST_NAME": findOtherUser.firstName,
                            "LAST_NAME": findOtherUser.lastName,
                            "EMAIL": findOtherUser.email,
                            "PHONE": findOtherUser.phoneNumber,
                            "ADDRESS": addressLineOne,
                            "ADDRESS2": addressLineTwo,
                            "CITY": city,
                            "STATE": addressState,
                            "COUNTRY": "US",
                            "ZIPCODE": zipCode,
                            "IP": "1.1.1.1"
                        },
                        "product": {
                            "CODE": itemInfo.CODE,
                            "NUMBER": 1,
                            "AMOUNT": itemInfo.PRICE
                        },
                        "recipient": {
                            "FIRST_NAME": findOtherUser.firstName,
                            "LAST_NAME": findOtherUser.lastName,
                            "EMAIL": findOtherUser.email,
                            "MESSAGE": customMessage,
                            "SEND_CERTIFICATE": 1
                        },
                        // "ccinfo": "{ \"authorizenet\_token\" : \"****\" }",
                        "ordertotal": itemInfo.PRICE,
                        "sender_display_name": `${authenticatedUser.firstName} ${authenticatedUser.lastName}`,
                        "deceased_display_name": `${findOtherUser.firstName} ${findOtherUser.lastName}`
                    };
            
                    axios.post(`https://www.floristone.com/api/rest/trees/placeorder`, configurationTwo, {
                        headers: { 'Authorization': `Basic ${Buffer.from(config.get("flowerApiCreds")).toString("base64")}` }
                    }).then((res) => {
                        if (res.data) {
                            console.log("Successfully purchased item...:", res.data);
            
                            // const newNotification = {
                            //     id: uuidv4(),
                            //     system_date: Date.now(),
                            //     date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                            //     data: {
                            //         title: `${findOtherUser.firstName} purchased one of your clothing articles for sale! Congrats - time to ship it!`,
                            //         body: `${findOtherUser.firstName}/@${findOtherUser.username} has purchased a used clothing article you have for sale! Congrats on the sale - click this notification for your shipping label OR view your shipping list in the main menu.`,
                            //         data: {
                            //             shippingLabel: response.body,
                            //             purchasedItem: itemInfo
                            //         }
                            //     },
                            //     from: uniqueId,
                            //     link: "new-purchased-item"
                            // };
            
                            // const messageee = { 
                            //     to: matching.fcmToken, 
                            //     collapse_key: uuidv4(),
                            //     notification: {
                            //         title: `${findOtherUser.firstName} purchased one of your clothing articles for sale! Congrats - time to ship it!`,
                            //         body: `${findOtherUser.firstName}/@${findOtherUser.username} has purchased a used clothing article you have for sale! Congrats on the sale - click this notification for your shipping label OR view your shipping list in the main menu.`
                            //     }
                            // };
                
                            // collection.findOneAndUpdate({ uniqueId: otherUserID }, { $pull: {
                            //     itemsForSale: {
                            //         id: itemInfo.id
                            //     }
                            // }, $inc: {
                            //     inAppTokenCurrency: caluclatedPriceInTokens
                            // }, $push: {
                            //     notifications: newNotification,
                            //     pendingShipments: {
                            //         shippingLabel: JSON.parse(response.body),
                            //         purchasedItem: {
                            //             ...itemInfo,
                            //             tokensPrice: caluclatedPriceInTokens
                            //         },
                            //         id: uuidv4(),
                            //         dateCreated: new Date(),
                            //         shippedAlready: false,
                            //         purchasedBy: uniqueId
                            //     }
                            // }}, { returnDocument: 'after' },  (err, data) => {
                            //     if (err) {
                            //         console.log(err.message);
                        
                            //         resppppp.json({
                            //             message: "An error occurred while attempting to update DB information...",
                            //             err
                            //         })
                            //     } else {
                            //         console.log("result", data);
                        
                            //         fcm.send(messageee, (err, response) => {
                            //             if (err) {
                            //                 console.log("Something has gone wrong!", err);
                        
                            //                 resppppp.json({
                            //                     message: "Successfully purchased item & generated shipping label!",
                            //                     apiData: {}
                            //                 })
                            //             } else {
                            //                 console.log("Successfully sent with response: ", response);
                        
                            //                 resppppp.json({
                            //                     message: "Successfully purchased item & generated shipping label!",
                            //                     apiData: {}
                            //                 })
                            //             }
                            //         });
                            //     }
                            // })
                        } else {
                            console.log("Err", res.data);
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    console.log("res.data error", resssssssss.data);
                }
            }).catch((err) => {
                console.log("err", err);
            });
        } else {
            resppppp.json({
                message: "You do NOT have enough tokens to purchase this item!"
            })
        }
    } else {
        resppppp.json({
            message: "User has NOT completed their address information yet...",
            success: false
        })
    }
});

module.exports = router;