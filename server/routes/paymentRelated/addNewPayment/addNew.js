const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const { encryptString } = require("../../../crypto.js");
const _ = require("lodash");
const config = require("config");
const stripe = require('stripe')(config.get("stripeSecretKey"));

router.post("/", async (req, resppppp) => {

    const { 
        uniqueId,
        card,
        valid,
        digit, 
        name,
        primary,
        cardType,
        accountType
    } = req.body;

    console.log("req.body", req.body);

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    const result = await collection.findOne({ uniqueId });

    if (_.has(result, "paymentMethods") && result.paymentMethods.length > 0 && primary === true) {

        await stripe.tokens.create({
            card: {
              number: card,
              exp_month: Number(valid.substring(0, 2)),
              exp_year: Number(`20${valid.substring(3, 5)}`),
              cvc: digit,
              currency: "usd"
            }
        }, async (errrrrrrr, tokennnn) => {
            if (errrrrrrr) { 
                console.log("errrrrrrr", errrrrrrr);

                resppppp.json({
                    message: "An err occurred while attempting to update DB information...",
                    err: errrrrrrr
                })
            } else {
                console.log("tokennnn", tokennnn);


                await stripe.accounts.createExternalAccount(
                    result.stripeAccountDetails.id,
                    {
                        external_account: tokennnn.id,
                    }
                ).then((res) => {
                    console.log("res.data", res);

                    resppppp.json({
                        message: "Successfully saved card details!",
                        data: res
                    })
                }).catch((errrrrrr) => {
                    console.log("errrrrrrerrrrrrr", errrrrrr);

                    if (errrrrrr.raw.code === "instant_payouts_unsupported") {
                        resppppp.json({
                            message: "This card is not eligible for Instant Payouts. Try a debit card from a supported bank."
                        })
                    } else if (errrrrrr.raw.code === "invalid_card_type") {
                        resppppp.json({
                            message: "This does NOT appear to be a debit card - payouts can ONLY be used on debit cards..."
                        })
                    }
                })
            }
        });
    } else {
        await stripe.tokens.create({
            card: {
              number: card,
              exp_month: Number(valid.substring(0, 2)),
              exp_year: Number(`20${valid.substring(3, 5)}`),
              cvc: digit,
              currency: "usd"
            }
        }, async (errrrrrrr, tokennnn) => {
            if (errrrrrrr) { 
                console.log("errrrrrrr", errrrrrrr);

                resppppp.json({
                    message: "An err occurred while attempting to update DB information...",
                    err: errrrrrrr
                })
            } else {
                console.log("tokennnn", tokennnn);


                await stripe.accounts.createExternalAccount(
                    result.stripeAccountDetails.id,
                    {
                      external_account: tokennnn.id,
                    }
                ).then((res) => {
                    console.log("res", res);

                    resppppp.json({
                        message: "Successfully saved card details!",
                        data: res
                    })
                }).catch((errrrrrr) => {
                    console.log("errrrrrrerrrrrrr", errrrrrr);

                    if (errrrrrr.raw.code === "instant_payouts_unsupported") {
                        resppppp.json({
                            message: "This card is not eligible for Instant Payouts. Try a debit card from a supported bank."
                        })
                    } else if (errrrrrr.raw.code === "invalid_card_type") {
                        resppppp.json({
                            message: "This does NOT appear to be a debit card - payouts can ONLY be used on debit cards..."
                        })
                    }
                })
            }
        });
    }
});

module.exports = router;