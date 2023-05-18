const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
const config = require("config");
const stripe = require('stripe')(config.get("stripeSecretKey"));

router.get("/", (req, resppppp, next) => {
    
    const { 
        id,
        accountType
    } = req.query;

    console.log("Req.query", req.query);

    const collection = Connection.db.db("db").collection(accountType);

    collection.findOne({ uniqueId: id }).then(async (user) => {
        if (!user) {
            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found."
            })
        } else {
            console.log("user", user);

            const stripeID = user.stripeAccountDetails.id;
            // customer account
            const payouts = await stripe.payouts.list({
                status: "paid"
            }, {
                stripeAccount: stripeID
            });

            if (payouts) {
                resppppp.json({
                    message: "Gathered payouts!",
                    payouts: payouts.data
                })
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