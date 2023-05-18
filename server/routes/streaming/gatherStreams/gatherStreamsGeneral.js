const express = require("express");
const router = express.Router();
const OpenTok = require("opentok");
const config = require("config");
const opentok = new OpenTok(config.get("vontageAPIKey"), config.get("vontageSecretKey"));
const _ = require("lodash");

router.get("/", (req, resppppp) => {

    opentok.listBroadcasts({ count: 25 }, (
        error,
        broadcasts,
        totalCount
    ) => {
        if (error) {
            console.log("error:", error)
        } else {

            console.log(totalCount + " broadcasts", broadcasts);

            let shuffled_array = _.shuffle(broadcasts);

            resppppp.json({
                message: "Gathered streams!",
                broadcasts: shuffled_array
            });
        }
    });
});

module.exports = router;