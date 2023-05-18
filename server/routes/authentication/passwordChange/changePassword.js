const express = require("express");
const router = express.Router();
const config = require("config");
const accountSid = config.get("twilioSID");
const authToken = config.get("twilioAuthToken");
const client = require('twilio')(accountSid, authToken);
const { Connection } = require("../../../mongoUtil.js");
const { encryptString } = require("../../../crypto.js");

router.post("/", (req, resppppp) => {

    const { uniqueId, code, sid, password, accountType } = req.body;

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
            
            client.verify.v2.services(sid).verificationChecks.create({ to: `+1${user.phoneNumber}`, code }).then(verification => {
                if (verification.status === "approved") {
                    console.log("Success...:", verification.status);

                    collection.findOneAndUpdate({ uniqueId }, { $set: {
                        password: encryptString(password)
                    }}, { returnDocument: 'after' },  (err, data) => {
                        if (err) {
                            console.log(err.message);
    
                            resppppp.json({
                                message: "Error occurred while updating password data/information...",
                                err
                            })
                        } else {
                            resppppp.json({
                                message: "Successfully Verified!"
                            })
                        }
                    });
                } else {
                    console.log("Else...:", verification.status);
        
                    res.json({
                        message: "Must enter a VALID code!"
                    })
                }
            }).catch((err) => {
                console.log("errrrrr", err);
            })
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