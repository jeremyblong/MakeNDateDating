const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const { encryptString } = require("../../../crypto.js");
const _ = require("lodash");

router.post("/", (req, resppppp, next) => {
    // req.body
    const { uniqueId, publicKey } = req.body;
    // collection data...
    const collection = Connection.db.db("test").collection("users");
    // update blockchain key AND encrypt...
    collection.findOneAndUpdate({ uniqueId }, { $set: { blockchainPublicKey: encryptString(publicKey) }}, { returnDocument: 'after' }, (err, doc) => {
         if (err) {

             console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror disliked ==> :", err);

             resppppp.json({
                 message: "Could not find the appropriate results...",
                 err
             });
         } else {
            console.log("Successfullyyyyyyyyyyyy saved...:", doc);

            const { value } = doc;
            
            resppppp.json({
                message: "Uploaded public key!",
                publicKey
            })
         }
     });
});

module.exports = router;