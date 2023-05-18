const config = require("config");
const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const axios = require("axios");
const stripe = require('stripe')(config.get("stripeSecretKey"));

router.post("/", async (req, resppppp) => {

    const { uniqueId, accountType } = req.body;

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    const matching = await collection.findOne({ uniqueId });

    if (matching !== null) {

        const accountLink = await stripe.accountLinks.create({
            account: matching.stripeAccountDetails.id,
            refresh_url: config.get("baseURL"),
            return_url: `${config.get("baseURL")}/finished/authentication/stripe/onboarding/${matching.uniqueId}/${matching.accountType}`,
            type: 'account_onboarding',
        });
    
        if (accountLink) {
            console.log("accountLink(s)", accountLink);

            resppppp.json({
                message: "Successfully executed related logic!",
                url: accountLink.url
            })
        }
    }
});

module.exports = router;