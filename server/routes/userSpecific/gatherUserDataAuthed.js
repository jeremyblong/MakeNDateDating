const express = require("express");
const router = express.Router();
const { Connection } = require("../../mongoUtil.js");

router.get("/", (req, resppppp) => {

    const { uniqueId, accountType, returnTokens } = req.query;

    const collection = Connection.db.db("test").collection(accountType === "mentorship/companionship" ? "mentors" : "users");

    if (returnTokens) {

        collection.findOne({ uniqueId }).then(async (user) => {
            if (!user) {
    
                console.log("User does NOT exist or could not be found.");
    
                resppppp.json({
                    message: "User does NOT exist or could not be found.",
                    err: null
                });
            } else {

                resppppp.json({
                    message: "Successfully gathered profile!",
                    user,
                    tokenCount: user.inAppTokenCurrency
                })
            }
        }).catch((err) => {
            console.log(err.message);
    
            resppppp.json({
                message: "Unknown error.",
                err
            })
        })
    } else {
        collection.findOne({ uniqueId }).then((user) => {
            if (!user) {
    
                console.log("User does NOT exist or could not be found.");
    
                resppppp.json({
                    message: "User does NOT exist or could not be found.",
                    err: null
                });
            } else {
                resppppp.json({
                    message: "Successfully gathered profile!",
                    user
                })
            }
        }).catch((err) => {
            console.log(err.message);
    
            resppppp.json({
                message: "Unknown error.",
                err
            })
        })
    }
});

module.exports = router;