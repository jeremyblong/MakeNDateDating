const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
const config = require("config");
const stripe = require('stripe')(config.get("stripeSecretKey"));

router.post("/", (req, resppppp, next) => {
    
    const { 
        uniqueId,
        accountType,
        cardID,
        amount,
        tokenCount
    } = req.body;

    console.log("Req.body", req.body);

	const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    collection.findOne({ uniqueId }).then(async (user) => {
        if (!user) {
            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found."
            })
        } else {
            console.log("user", user);

            const stripeID = user.stripeAccountDetails.id;

            const transferFirstPart = await stripe.transfers.create({
                amount: (amount * 100).toFixed(0),
                currency: "usd",
                destination: stripeID,
            });

            if (transferFirstPart) {
                // connected account
                const payout = await stripe.payouts.create({
                    amount: (amount * 100).toFixed(0),
                    currency: 'usd',
                    description: `'Cashout/payout' to desired/selected account for the amount of $${amount} which after initiated, should deposit into the desired account immediately. Transfering available funds to personal card/account via ${config.get("applicationName")}..`,
                    destination: cardID,
                    method: "instant",
                    source_type: "card"
                }, {
                    stripeAccount: stripeID,
                });
                
                if (payout) {
                    console.log("payout", payout);

                    collection.findOneAndUpdate({ uniqueId }, { $inc: { inAppTokenCurrency: -tokenCount }}, { returnDocument: 'after' }, (err, doc) => {
                        if (err) {
                            console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror :", err);

                            resppppp.json({
                                message: "Could not find the appropriate results...",
                                err
                            });
                        } else {
                        console.log("Successfullyyyyyyyyyyyy saved...:", doc);

                        const { value } = doc;
                        
                            resppppp.json({
                                message: "Successfully cashed out to the desired card!",
                                payout
                            })
                        }
                    });
                }
            } else {
                resppppp.json({
                    message: "An error occurred while processing the initial leg of the request."
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