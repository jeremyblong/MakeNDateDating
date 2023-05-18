const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Connection } = require("../../../mongoUtil.js");
const passport = require("passport");
const { v4: uuidv4 } = require('uuid');
const config = require("config");
const _ = require("lodash");
const OpenTok = require("opentok");
const opentok = new OpenTok(config.get("vontageAPIKey"), config.get("vontageSecretKey"));

router.post("/", (req, resppppp, next) => {
    // authenticate via passport auth flow/logic...
    passport.authenticate('mentors', async (err, user, passedReq) => {
        if (err) {
            resppppp.json({
                message: "User could NOT be authenticated - make sure you're using a valid 'email' and 'password' combination."
            })
        } else {
            if (!user) {
                resppppp.json({
                    message: "User could NOT be authenticated - make sure you're using a valid 'email' and 'password' combination."
                })
            } else {

                console.log("userrrrrrr", user);

                opentok.createSession({ mediaMode:"routed" }, async (sessionError, session) => {
                    if (sessionError) return console.log(sessionError);
                    
                    // save the sessionId
                    console.log("session", session.sessionId);
                    // Set some options in a Token
                    const token = session.generateToken({
                        role: "publisher",
                        expireTime: new Date().getTime() / 1000 + 7 * 24 * 60 * 60, // in one week
                        data: `name=${user.username}`,
                        initialLayoutClassList: ["focus"],
                    });

                    const { deviceInfo } = passedReq.body;

                    const { sessionId } = session;

                    const newDeviceInfoOBJ = {
                        dateOfOccurance: new Date(),
                        dateOfOccuranceString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
                        idOfLog: uuidv4(),
                        ...deviceInfo
                    };

                    const collection = Connection.db.db("test").collection("mentors");

                    const { uniqueId } = user;

                    collection.findOneAndUpdate({ uniqueId }, { $push: {
                        securityAuthenticationLogs: newDeviceInfoOBJ
                    }, $set: {
                        vonageTokenSession: {
                            token,
                            sessionId
                        },
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
                                message: "Successfully authenticated!",
                                user: {
                                    ...user,
                                    vonageTokenSession: {
                                        token,
                                        sessionId
                                    }
                                }
                            })
                        }
                    });
                });
            }
        }
    })(req, resppppp, next);
});

module.exports = router;

// const additionalChatMetaData = {
//     firstName: user.firstName.toLowerCase().trim(),
//     lastName: user.lastName.toLowerCase().trim(),
//     username: user.username.toLowerCase().trim(),
//     email: user.email.toLowerCase().trim(),
//     registrationDate: new Date(),
//     registrationDateString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
//     accountType: user.accountType
// }

// const options = {
//     method: 'POST',
//     headers: {
//         'apiKey': config.get("commetRESTApiKey"),
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     },
//     body: JSON.stringify({
//         metadata: {
//             '@private': additionalChatMetaData
//         },
//         uid: user.uniqueId,
//         name: `${user.firstName.toLowerCase().trim()} ${user.lastName.toLowerCase().trim()}`,
//         avatar: `${config.get("assetLink")}/${user.profilePictures[user.profilePictures.length - 1].link}`
//     })
// };

// const url = `https://${config.get("commetChatAppId")}.api-us.cometchat.io/v3/users`;
    
// fetch(url, options).then((response) => response.json()).then((response) => {
//     console.log("responseeeeeeee", response);
// });