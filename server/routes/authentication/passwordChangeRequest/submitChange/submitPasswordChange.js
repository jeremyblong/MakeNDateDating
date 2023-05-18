const express = require("express");
const router = express.Router();
const config = require("config");
const { v4: uuidv4 } = require('uuid');
const { Connection } = require("../../../../mongoUtil.js");
const { decryptString, encryptString } = require("../../../../crypto.js");
const _ = require("lodash")
router.post("/", async (req, resppp) => {

    const { password, email, code } = req.body;

    const collection = Connection.db.db("test").collection("users");

    const matchingResult = await collection.findOne({ email: email.toLowerCase().trim() });

    const correctPasswordIndex = _.has(matchingResult, "passwordResetCodes") ? matchingResult.passwordResetCodes.findIndex((item) => decryptString(item.code) === code) : null;

    const encryptedPassword = encryptString(password);

    if (correctPasswordIndex !== -1) {

        collection.findOneAndUpdate({ email: email.toLowerCase().trim() }, { $set: {
            passwordResetCodes: [],
            password: encryptedPassword
        }}, { returnDocument: 'after' }, (err, doc) => {
            if (err) {
                console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror disliked ==> :", err);
    
                resppp.json({
                    message: "Could not find the appropriate results...",
                    err
                });
    
            } else {
                console.log("Successfullyyyyyyyyyyyy saved...:", doc);
    
                const { value } = doc;
                
                resppp.json({ success: true, message: "Successfully submitted password change!" });
            }
        });
    } else {
        resppp.json({ success: false, message: "Error - Enter a valid email/password-reset code to authorize the password change." });
    }
});

module.exports = router;