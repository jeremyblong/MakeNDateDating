const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");
const fetch = require("node-fetch");
const stripe = require('stripe')(config.get("stripeSecretKey"));

router.post("/", async (req, resppppp) => {

    const { 
        firstName, 
        lastName, 
        uniqueId 
    } = req.body;

    console.log("req.bodyyyyyyyyyyyy veriff verification process...", req.body, `${config.get("veriffBaseURL")}/v1/sessions`);

    const options = { 
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-AUTH-CLIENT': config.get("publishableVeriffKey")
        },
        body: JSON.stringify({ 
            verification: { 
                callback: 'https://makendate.us/veriff',
                person: { 
                    firstName: firstName,
                    lastName: lastName,
                    idNumber: uniqueId
                },
                timestamp: new Date()
            } 
        }),
        json: true 
    };

    const response = await fetch(`${config.get("veriffBaseURL")}/v1/sessions`, options);

    const data = await response.json();

    if (data) {
        console.log("data fetched...", data);

        resppppp.json({
            message: "Successfully initiated!",
            session_link: data.verification.url
        })
    }
});

module.exports = router;