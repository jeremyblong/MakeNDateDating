const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");
const axios = require("axios");

router.post("/", async (req, resppppp) => {

    const { uniqueId, requestCopy, socialSecurityNumber, zipcode } = req.body;

    const collection = Connection.db.db("test").collection("users");

    const matchingUser = await collection.findOne({ uniqueId });

    axios.get(`https://api.tomtom.com/search/2/structuredGeocode.json?key=${config.get("tomtomAPIKey")}&countryCode=us&limit=1&postalCode=${zipcode}`).then((res) => {
        if (res.data) {
            console.log("TomTomAPI data....:", res.data);

            const { results } = res.data;

            const cityMatch = results[0].address.countrySubdivisionName;

            const formattedCity = cityMatch.replace(/ /g, "+");
            const abbrevCity = results[0].address.countrySubdivision;
            const cityName = results[0].address.municipality

            console.log("abbrevCity", abbrevCity, results[0].address);

            fetch("https://api.checkr.com/v1/candidates", {
                body: `first_name=${matchingUser.firstName}&no_middle_name&last_name=${matchingUser.lastName}&email=${matchingUser.email}&phone=${matchingUser.phoneNumber}&zipcode=${zipcode}&dob=${matchingUser.birthdate}&ssn=${socialSecurityNumber}&copy_requested=${requestCopy}`,
                headers: {
                    Authorization: `Basic ${Buffer.from(config.get("checkrAPITestSecret")).toString('base64')}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            }).then((response) => {
                return response.json();
            }).then((finalData) => {
                console.log("finalData", finalData);
        
                fetch("https://api.checkr.com/v1/invitations", {
                    body: `candidate_id=${finalData.id}&package=tasker_pro&work_locations[][state]=${abbrevCity.toLowerCase()}&work_locations[][city]=${cityName.toLowerCase()}&work_locations[][country]=US`,
                    headers: {
                        Authorization: `Basic ${Buffer.from(config.get("checkrAPITestSecret")).toString('base64')}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST"
                }).then((resppppppponse) => {
                    return resppppppponse.json();
                }).then((secondDataChunk) => {
                    console.log("secondDataChunk", secondDataChunk);

                    if (!secondDataChunk.error) {
                        resppppp.json({
                            message: "Successfully executed!"
                        });
                    } else {
                        resppppp.json({
                            message: "An error has occurred...",
                            err: secondDataChunk.error
                        });
                    }

                }).catch((errrrrrr) => {
                    console.log("errrrrrr", errrrrrr);
                })
            }).catch((error) => {
                console.log("error", error);
            })
        } else {
            console.log("Err", res.data);
        }
    }).catch((err) => {
        console.log(err.message);
    })
});

module.exports = router;