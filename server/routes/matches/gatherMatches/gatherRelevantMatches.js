const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const axios = require("axios");
const config = require("config");


router.get("/", (req, resppppp) => {

    const { uniqueId } = req.query;

    const collection = Connection.db.db("test").collection("users");

    collection.findOne({ uniqueId }, { requestedMatches: 1 }).then((user) => {
        if (!user) {

            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found.",
                err: null
            });
        } else {

            const promises = [];

            for (let index = 0; index < user.requestedMatches.length; index++) {
                const element = user.requestedMatches[index];
                
                promises.push(new Promise(async (resolve, reject) => {
                    axios.get(`${config.get("baseURL")}/gather/one/user/restricted/data`, {
                        params: {
                            postedByID: element
                        }
                    }).then((res) => {
                        console.log(res.data);

                        const { user } = res.data;

                        resolve(user);
                    }).catch((err) => {
                        console.log("err", err);
                    });
                }));
            }

            Promise.all(promises).then((passedUsers) => {
                resppppp.json({
                    message: "Successfully gathered matches!",
                    matches: passedUsers
                })
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