const express = require("express");
const router = express.Router();
const config = require("config");
const accountSid = config.get("twilioSID");
const authToken = config.get("twilioAuthToken");
const client = require('twilio')(accountSid, authToken);
const { v4: uuidv4 } = require('uuid');

router.post("/", (req, res) => {

    const { code, phoneNumber, sid } = req.body;

    console.log("req.body", req.body);

    client.verify.v2.services(sid).verificationChecks.create({ to: phoneNumber, code }).then(verification => {
        if (verification.status === "approved") {
            console.log("Success...:", verification.status);

            res.json({
                message: "Successfully Verified!"
            })
        } else {
            console.log("Else...:", verification.status);

            res.json({
                message: "Must enter a VALID code!"
            })
        }
    });
});

module.exports = router;