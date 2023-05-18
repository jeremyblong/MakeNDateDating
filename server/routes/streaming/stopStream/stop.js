const express = require("express");
const router = express.Router();
const OpenTok = require("opentok");
const config = require("config");
const opentok = new OpenTok(config.get("vontageAPIKey"), config.get("vontageSecretKey"));

router.post("/", (req, resppppp) => {

    const { broadcastID } = req.body;

    console.log("req.bodyyy stop broadcast ---- :", req.body);

    opentok.stopBroadcast(broadcastID, (err, result) => {
        if (err) {
            console.log("err broadcast...", err);
        } else {
            resppppp.json({
              message: "Successfully stopped!"
          })
        }
    })
});

module.exports = router;