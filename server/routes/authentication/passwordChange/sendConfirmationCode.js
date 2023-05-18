const express = require("express");
const router = express.Router();
const config = require("config");
const accountSid = config.get("twilioSID");
const authToken = config.get("twilioAuthToken");
const client = require('twilio')(accountSid, authToken);
const { Connection } = require("../../../mongoUtil.js");

router.post("/", (req, resppppp) => {

    const { uniqueId, accountType } = req.body;

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    collection.findOne({ uniqueId }).then((user) => {
        if (!user) {
            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found.",
                err: null
            });
        } else {
            console.log("runnninggggg....");
            
            client.verify.v2.services.create({ friendlyName: "MakeNDate Dating Mobile App", codeLength: 5 }).then(service => {
                console.log(service.sid);
        
                const { sid } = service;
                // user.phoneNumber
                client.verify.v2.services(sid).verifications.create({ to: `+1${user.phoneNumber}`, channel: 'sms' }).then(verification => {
                    resppppp.json({
                        sid,
                        message: "Successfully executed desired logic!"
                    })
                }).catch((errrrrrr) => {
                    console.log("errrrrrr", errrrrrr);
                });
            });
        }
    }).catch((err) => {
        console.log(err.message);

        resppppp.json({
            message: "Unknown error.",
            err
        })
    })
});
module.exports = router;