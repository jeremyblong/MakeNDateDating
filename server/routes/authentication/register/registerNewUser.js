const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const Client = require('authy-client').Client;
const authy = new Client({ key: config.get("twilioAuthyProductionKey") });
const NewUserRegistered = require("../../../schemas/auth/registerNew.js")
const { encryptString } = require("../../../crypto.js");
const stripe = require('stripe')(config.get("stripeSecretKey"));

router.post("/", (req, resppppp) => {

    const { deviceInfo, data } = req.body;

    const { accountType, addressRelated, timezone, phoneNumber, birthdate, birthdateRaw, email, enrolled, firstName, gender, interestedIn, lastName, password, profilePic, username } = data;

	const additionalChatMetaData = {
		firstName: firstName.toLowerCase().trim(),
		lastName: lastName.toLowerCase().trim(),
		username: username.toLowerCase().trim(),
		email: email.toLowerCase().trim(),
		registrationDate: new Date(),
		registrationDateString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
		accountType
	}

	const generatedID = uuidv4();
	const options = {
		method: 'POST',
		headers: {
			'apiKey': config.get("commetRESTApiKey"),
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({
			metadata: {
				'@private': additionalChatMetaData
			},
			uid: generatedID,
			name: `${firstName.toLowerCase().trim()} ${lastName.toLowerCase().trim()}`,
			avatar: `${config.get("assetLink")}/${profilePic.link}`
		})
	}; 

	const url = `https://${config.get("commetChatAppId")}.api-us.cometchat.io/v3/users`;
	  
	fetch(url, options).then((response) => response.json()).then((response) => {
		console.log("This is the response I'm looking for...:", response);

		authy.registerUser({
			countryCode: "US",
			email: email.toLowerCase().trim(),
			phone: phoneNumber // change this for PRODUCTION... -> phoneNumber
		}, async (regErr, regRes) => {
			if (regErr) {
				console.log('regError Registering User with Authy', regErr);
	
				resppppp.json({
					message: "Error occurred while attempting to save the desired data to the DB...",
					err: regErr
				})
				return;
			} else {
				await stripe.accounts.create({
                    type: 'custom',
                    country: 'US',
                    email: email.toLowerCase().trim(),
                    business_type: "individual",
					individual: {
						email: email.toLowerCase().trim(),
						first_name: firstName.toLowerCase().trim(),
						last_name: lastName.toLowerCase().trim()
					},
					capabilities: {
						card_payments: {
							requested: true
						},
						transfers: {
							requested: true
						}
					},
                }, (errrrrrror, accountData) => {
                    if (errrrrrror) {
						console.log(errrrrrror);
				
						resppppp.send({
							message: "An error occurred while attempting to register this new account...",
							err: errrrrrror
						})
                    } else {
                      	console.log("accountData", accountData);

						NewUserRegistered.register(new NewUserRegistered({
							firstName: firstName.toLowerCase().trim(),
							lastName: lastName.toLowerCase().trim(),
							password: encryptString(password),
							username: username.toLowerCase().trim(),
							email: email.toLowerCase().trim(),
							profilePictures: [profilePic],
							uniqueId: generatedID,
							enrolled,
							stripeAccountDetails: accountData,
							stripeAccountVerified: false,
							verficationCompleted: false,
							registrationDate: new Date(),
							registrationDateString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
							reviews: [],
							authStrategy: "local",
							refreshToken: [],
							addressRelated,
							timezone,
							paymentMethods: [],
							// authyId: regRes.user.id,
							totalUniqueViews: 0,
							birthdateRaw,
							birthdate,
							inAppTokenCurrency: 0,
							accountType,
							gender, 
							interestedIn,
							phoneNumber: phoneNumber,
							securityAuthenticationLogs: [deviceInfo], // [deviceInfo]
							rank: 500,
							rankedArr: []
						}), password, async (err, user) => {
							if (err) {
								console.log("error with passport : ", err);
			
								resppppp.statusCode = 500;
								resppppp.send(err);
							} else { 
								console.log("else ran", user);
			
								user.save((err, result) => {
									if (err) {
										console.log(err.message);
			
										resppppp.json({
											message: "Error occurred while attempting to save the desired data to the DB...",
											err
										})
									} else {
										console.log("result", result);
			
										resppppp.json({
											message: "Successfully registered new user!",
											user: result
										})
									}
								})
							}
						});
					}
				});
			}
		});
	}).catch(err => {
		console.log("This is the response but unfortunately encountered an ERROR...:", err);

		resppppp.json({
			message: "Error occurred while attempting to save the desired data to the DB...",
			err
		})
	});
});

module.exports = router;