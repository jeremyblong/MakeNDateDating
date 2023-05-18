const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
const SpotifyWebApi = require('spotify-web-api-node');
const config = require("config");

// credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: config.get("spotifyClientID"),
  clientSecret: config.get("spotifyClientSecret"),
  redirectUri: config.get("baseURL")
});

router.post("/", async (req, resppppp) => {
    // deconstrct id from user...
    const { uniqueId } = req.body;
    // scopes
    const scopes = ["user-read-playback-state", "user-read-currently-playing", "user-modify-playback-state", "user-read-email", "user-library-modify", "user-library-read", "user-read-private", "playlist-read-private", "playlist-read-collaborative", "user-read-playback-position", "user-top-read", "user-read-recently-played"];
    const redirectUri = `${config.get("baseURL")}/spotify/callback`;
    const clientId = config.get("spotifyClientID");
    const state = uniqueId;
    // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
    const spotifyApi = new SpotifyWebApi({
        redirectUri: redirectUri,
        clientId: clientId
    });
    // Create the authorization URL
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

    resppppp.json({
        message: "We've successfully enabled your profile's spotify history of recently played 'tracks' or songs! These will now display on your profile for now on...",
        authorizeURL
    })
});

module.exports = router;