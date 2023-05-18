const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
const SpotifyWebApi = require('spotify-web-api-node');
const config = require("config");
const { decryptString } = require("../../../../crypto.js");
const axios = require("axios");

router.post("/", async (req, resppppp) => {

    const { accountType, uniqueId, code } = req.body;

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");
    // credentials are optional
    const spotifyApi = new SpotifyWebApi({
        clientId: config.get("spotifyClientID"),
        clientSecret: config.get("spotifyClientSecret"),
        redirectUri: `${config.get("baseURL")}/spotify/callback`
    });

    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          'client_id': config.get("spotifyClientID"),
          'client_secret': config.get("spotifyClientSecret"),
          'grant_type': 'authorization_code',
          'code': code,
          'redirect_uri': `${config.get("baseURL")}/spotify/callback`
        })
    );

    if (response.data) {
        console.log("response.data", response.data);

        const { access_token, refresh_token } = response.data;

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        spotifyApi.getMyRecentlyPlayedTracks({
            limit: 20
        }).then((data) => {
            // Output items
            console.log("Your 20 most recently played tracks are:", data.body);
            
            const recentTracks = data.body.items;

            collection.findOneAndUpdate({ uniqueId }, { $set: {
                spotifyRecentPlaylist: recentTracks
            }}, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);

                    resppppp.json({
                        message: "Successfully authenticated w/o logging related security details...",
                        err
                    })
                } else {
                    console.log("authed!");

                    resppppp.json({
                        message: "Successfully fetched the lastest tracks from this spotify profile!",
                        tracks: recentTracks
                    })
                }
            });
        }, (err) => {
            console.log('Something went wrong!', err.message);

            resppppp.json({
                message: "An error occurred while processing the desired request...",
                err
            })
        });
    } else {
        console.log("errrrrrr responsedata", response);
    }
});

module.exports = router;