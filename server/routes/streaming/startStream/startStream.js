const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const OpenTok = require("opentok");
const config = require("config");
const opentok = new OpenTok(config.get("vontageAPIKey"), config.get("vontageSecretKey"));
const { v4: uuidv4 } = require('uuid');

router.post("/", (req, resppppp) => {

    const { sessionID, streamTitle } = req.body;

    console.log("req.bod", req.body);

    const generatedStreamID = uuidv4();

    const options = {
      outputs: {
        hls: {
          dvr: false,
          lowLatency: false,
        },
        rtmp: [{
          id: generatedStreamID,
          serverUrl: `rtmp://${config.get("baseURL")}`,
          streamName: streamTitle
        }]
      },
      maxDuration: 3600,
      resolution: "640x480",
      layout: {
        type: "verticalPresentation",
      },
      streamMode: "auto"
    };

    opentok.listBroadcasts({}, (err, broadcasts) => {
      if (err) {
        console.log("err broadcast...", err);
      } else {
        console.log("broadcasts (multiple casts) result...:", broadcasts);

        const findMatch = broadcasts.findIndex(item => item.sessionId === sessionID);

        console.log("findMatch", findMatch);

        if (findMatch !== -1) {
          opentok.stopBroadcast(broadcasts[findMatch].id, (err, result) => {
            if (err) {
                console.log("err broadcast...", err);
            } else {
              console.log("stopped previous broadcast!");
  
              opentok.startBroadcast(sessionID, options, (err, innerResult) => {
                if (err) {
                    console.log("err broadcast...", err);
                } else {
                    console.log("broadcast innerResult", innerResult.broadcastUrls.hls);
      
                    resppppp.json({
                      message: "Successfully started!",
                      videoLink: innerResult.broadcastUrls.hls,
                      broadcast: innerResult
                  })
                }
              })
            }
        })
        } else {
          opentok.startBroadcast(sessionID, options, (err, result) => {
            if (err) {
                console.log("err broadcast...", err);
            } else {
                console.log("broadcast result", result.broadcastUrls.hls);
  
                resppppp.json({
                  message: "Successfully started!",
                  videoLink: result.broadcastUrls.hls,
                  broadcast: result
              })
            }
          })
        }
      }
    });
});

module.exports = router;