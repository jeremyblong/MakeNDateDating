const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const config = require("config");
const stripe = require('stripe')(config.get("stripeSecretKey"));

router.post("/", (req, resppppp, next) => {
    
    const { uniqueId, accountType, cardID } = req.body;

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    collection.findOne({ uniqueId }).then(async (user) => {
        if (!user) {
            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found."
            })
        } else {
            const { id } = user.stripeAccountDetails;

            const cardFetched = await stripe.accounts.retrieveExternalAccount(
                id, 
                cardID
            );
            
            if (cardFetched.default_for_currency === false) {

                const deletedCard = await stripe.accounts.deleteExternalAccount(
                    id,
                    cardID
                );

                if (deletedCard) {
                    resppppp.json({ 
                        message: "Successfully deleted the desired card!",
                        deleted: deletedCard
                    })
                } 

            } else {
                resppppp.json({
                    message: "You cannot delete your primary payment method - please switch payment/payout method then try again."
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