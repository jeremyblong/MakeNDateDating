const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
const axios = require("axios");
const config = require("config");

router.get("/", (req, resppppp) => {

    const { uniqueId } = req.query;

    const collection = Connection.db.db("test").collection("users");

    collection.findOne({ uniqueId }).then((data) => {
        if (!data) {

            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found."
            });
        } else {
            console.log("result", data);

            const promises = [];

            if (typeof data.pendingShipments !== "undefined" && data.pendingShipments.length > 0) {
                for (let index = 0; index < data.pendingShipments.length; index++) {
                    const pendingShipmentDetails = data.pendingShipments[index];
                    
                    promises.push(new Promise((resolve, reject) => {
                        // update comments state
                        const configuration = {
                            params: {
                                postedByID: pendingShipmentDetails.purchasedBy
                            }
                        };
                        axios.get(`${config.get("baseURL")}/gather/only/profile/picture/with/id`, configuration).then((res) => {
                            if (res.data.message === "Submitted gathered user's picture/file!") {
    
                                const { user } = res.data; 
        
                                pendingShipmentDetails["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
                                pendingShipmentDetails.name = `${user.firstName} ~ @${user.username}`;
                                resolve(pendingShipmentDetails);
                            } else {
        
                                pendingShipmentDetails["lastProfilePic"] = null;
                                pendingShipmentDetails.name = null;
                                resolve(pendingShipmentDetails);
                            }
                        }).catch((err) => {
                            pendingShipmentDetails["lastProfilePic"] = null;
                            pendingShipmentDetails.name = null;
                            resolve(pendingShipmentDetails);
                        })
                    }));
                }
    
                Promise.all(promises).then((passedValues) => {
                    resppppp.json({
                        message: "Successfully gathered clothing sold sales!",
                        sales: passedValues
                    })
                })
            } else {
                resppppp.json({
                    message: "Successfully gathered clothing sold sales!",
                    sales: []
                })
            }
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