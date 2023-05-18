const express = require("express");
const router = express.Router();
const config = require("config");
const accountSid = config.get("twilioSID");
const authToken = config.get("twilioAuthToken");
const client = require('twilio')(accountSid, authToken);

router.post("/", (req, resppppp, next) => {

    const { phoneNumber } = req.body;

    console.log("phoneNumber", phoneNumber);

    client.verify.v2.services.create({ friendlyName: "MakeNDate Mobile App", codeLength: 5 }).then(service => {
        console.log(service.sid);

        const { sid } = service;

        client.verify.v2.services(sid).verifications.create({ to: phoneNumber, channel: 'sms' }).then(verification => {
            resppppp.json({
                sid,
                message: "Successfully sent code!"
            })
        }).catch((errrrrrr) => {
            console.log("errrrrrr", errrrrrr);
        });
    }).catch((errrrrrr) => {
        console.log("errrrrrr", errrrrrr);
    });
});

// const sendCodeAuthy = (authyId, callback) => {
    // send code to sms
    // authy.requestSms({ authyId }, { force: true }, (err, smsRes) => {
    //     if (err) {
    //         console.log('ERROR requestSms', err);
    //         return false;
    //     }
    //     console.log("requestSMS response: ", smsRes);

    //     callback();
    // });
// } 
module.exports = router;