const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const axios = require("axios");
const config = require("config");

router.post("/", async (req, resppppp) => {

    const { uniqueId, accountType, selectedID, meetup, otherUserID } = req.body;

    const collection = Connection.db.db("test").collection("users");

    const initiatingUser = await collection.findOne({ uniqueId: otherUserID });

    if (initiatingUser !== null) {
        if (meetup) {
            // successfully met-up, issue coins back to user...
            collection.findOne({ uniqueId, "meetupRequestsPending.id": selectedID }).then(async (user) => {
                if (!user) {
        
                    console.log("User does NOT exist or could not be found.");
        
                    resppppp.json({
                        message: "User does NOT exist or could not be found."
                    });
                } else {

                    const matchingIndex = user.meetupRequestsPending.findIndex(dataaaa => dataaaa.id === selectedID);
                    const resultMatch = user.meetupRequestsPending[matchingIndex];
    
                    // tokens to add/transfer to authed user...
                    const tokenCountCalculatedWei = resultMatch.waggedAmount;
                    
                    const configurationCustom = {
                        uniqueId,
                        accountType,
                        selectedID
                    }
            
                    axios.post(`${config.get("baseURL")}/remove/meetup/request/match`, configurationCustom).then((res) => {
                        if (res.data.message === "Successfully deleted/removed match!") {
                            console.log(res.data);

                            resppppp.json({
                                message: "Successfully deleted/removed match!"
                            })
                        } else {
                            console.log("Err", res.data);
                        }
                    }).catch((err) => {
                        console.log(err.message);
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
            // did NOT meetup - transfer to main wallet (my wallet) for failure to show...
            const matchingIndex = user.meetupRequestsPending.findIndex(dataaaa => dataaaa.id === selectedID);
            const resultMatch = user.meetupRequestsPending[matchingIndex];
            // tokens to add/transfer to authed user...
            const tokenCountCalculatedWei = resultMatch.waggedAmount;
            
            const configurationCustom = {
                uniqueId,
                accountType,
                selectedID
            }
    
            axios.post(`${config.get("baseURL")}/remove/meetup/request/match`, configurationCustom).then((res) => {
                if (res.data.message === "Successfully deleted/removed match!") {
                    console.log(res.data);

                    resppppp.json({
                        message: "Successfully deleted/removed match!"
                    })
                } else {
                    console.log("Err", res.data);
                }
            }).catch((err) => {
                console.log(err.message);
            })
        }
    } else {
        resppppp.json({
            message: "Could not locate other user - no action was taken."
        })
    }
});

module.exports = router;