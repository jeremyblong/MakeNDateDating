const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const config = require("config");
const stripe = require('stripe')(config.get("stripeSecretKey"));

router.get("/", (req, resppppp, next) => {
    
    const { id, accountType } = req.query;

    const collection = Connection.db.db("db").collection(accountType);

    collection.findOne({ uniqueId: id }).then(async (user) => {
        if (!user) {
            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found."
            })
        } else {
            console.log("user", user);

            const { id } = user.stripeAccountDetails;

            if (accountType === "employers") {
                await stripe.customers.listSources(id, { object: 'card' }, (err, result) => {
                    if (err) {
                        console.log("Err gathering cards...", err);

                        resppppp.json({
                            message: "Error occurred while attempting to gather related cards..",
                            err
                        })
                    } else {
                        console.log("Successfully gathered cards!", result);
                        // deconstruct results
                        const cards = result.data;
                        // create variable to hold default
                        if (typeof cards !== "undefined" && cards.length > 0) {
                            let defaultCard = null;
                            // loop and find match
                            for (let index = 0; index < cards.length; index++) {
                                const card = cards[index];
                                if (card.default_for_currency === true) {
                                    defaultCard = card;
                                }
                            }

                            resppppp.json({
                                message: "Successfully found primary card!",
                                lastFour: defaultCard !== null ? defaultCard.last4 : null
                            })
                        } else {
                            resppppp.json({
                                message: "Successfully found primary card!",
                                lastFour: null
                            })
                        }
                    }
                });
            } else {
                
                await stripe.accounts.listExternalAccounts(id, { object: 'card' }, (err, result) => {
                    if (err) {
                        console.log("Err gathering cards...", err);

                        resppppp.json({
                            message: "Error occurred while attempting to gather related cards..",
                            err
                        })
                    } else {
                        console.log("Successfully gathered cards!", result);
                        // deconstruct results
                        const cards = result.data;
                        // create variable to hold default
                        let defaultCard = null;
                        // loop and find match
                        for (let index = 0; index < cards.length; index++) {
                            const card = cards[index];
                            if (card.default_for_currency === true) {
                                defaultCard = card;
                            }
                        }

                        resppppp.json({
                            message: "Successfully found primary card!",
                            lastFour: defaultCard !== null ? defaultCard.last4 : null
                        })
                    }
                });
            }
        }
    }).catch((err) => {
        console.log(err);

        resppppp.json({
            message: "Unknown error.",
            err
        })
    })
});

module.exports = router;
