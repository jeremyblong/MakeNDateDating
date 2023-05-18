const express = require("express");
const app = express();
const config = require("config");
const bodyParser = require('body-parser');
const cors = require("cors");
const xss = require('xss-clean');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require("express-rate-limit");
// const passport = require("passport");
const { Connection } = require("./mongoUtil.js");
const flash = require('connect-flash');
const session = require('express-session');
const path = require("path");
// setup port logic
const PORT = process.env.PORT || 5000;
const sgMail = require('@sendgrid/mail');
const aws = require('aws-sdk');
// blockchain specific start
const cron = require('node-cron');
const { encryptString } = require("./crypto.js");
const axios = require("axios");
const http = require("http");
const server = http.createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	}
});
const { initializeApp } = require("firebase-admin/app");

sgMail.setApiKey(config.get("sendgridAPIKey"));

app.use(helmet({ contentSecurityPolicy: false }));

aws.config.update({
    secretAccessKey: config.get("awsSecretKey"),
    accessKeyId: config.get("awsAccessKey"),
    region: config.get("awsRegion")
});

app.use(bodyParser.json({
	limit: "500mb"
}));
app.use(bodyParser.urlencoded({
	limit: "500mb",
	extended: false
}));

const corsOptions = {
	origin: "*",
	credentials: true,
  optionSuccessStatus: 200
};

app.use(flash());

app.use(session({ 
	cookie: { 
		maxAge: 60000 
	}, 
	secret: 'woot',
	resave: false, 
	saveUninitialized: false
}));
  
app.use(cors(corsOptions));

// app.use(passport.initialize()) 
// // init passport on every route call.
// app.use(passport.session())  

// passport stuff
require("./stategies/passport/jwtStrategy.js");
require("./stategies/passport/authentication.js");
require("./schemas/auth/registerNew.js");
require("./stategies/passport/authenticationMentorship.js");

const limiter = rateLimit({
    max: 100,// max requests
    windowMs: 60 * 60 * 1000 * 1000, // remove the last 1000 for production
    message: 'Too many requests' // message to send
}); 

app.use(xss());
app.use(helmet());
app.use(mongoSanitize());
app.use(limiter);

app.use(cors({ origin: 'http://165.227.164.118' }));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", true);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	next();
});

cron.schedule('30 2 * * * ', () => { // 30 2 * * *   |----------------------| every day at 2:30 (production code).
	console.log('running a task every minute every 10 secs...');

	const configuration = {};

	axios.put(`${config.get("baseURL")}/remove/old/expired/meetups`, configuration).then((res) => {
		if (res.data) {
			const { message } = res.data;

			if (message === "Successfully updated/removed the appropriate result(s)!") {
				console.log("Successfully removed the desired item(s)...!", res.data);
			}
		}
	}).catch((res) => {
		console.log("Errrrrrrrrrrrrr cron-job data...:", res.data);
	})

	axios.put(`${config.get("baseURL")}/check/expired/completion/mentorship/requests`, {}).then((res) => {
		if (res.data) {
			const { message } = res.data;

			if (message === "Successfully updated/removed the appropriate result(s)!") {
				console.log("Successfully removed the desired item(s)...!", res.data);
			}
		}
	}).catch((res) => {
		console.log("Errrrrrrrrrrrrr cron-job data...:", res.data);
	})
});  

cron.schedule('30 2 * * * ', () => { // 30 2 * * *   |----------------------| every day at 2:30 (production code).
	console.log('running a task every minute every 10 secs...');

	const configuration = {};

	axios.put(`${config.get("baseURL")}/remove/expired/game/listings`, configuration).then((res) => {
		if (res.data) {
			const { message } = res.data;

			if (message === "Successfully swapped the listings that were applicable!") {
				console.log("Successfully swapped the listings that were applicable!", res.data);
			}
		}
	}).catch((res) => {
		console.log("Errrrrrrrrrrrrr cron-job data...:", res.data);
	});
});  

// routes go here...
app.use("/send/registration/code", require("./routes/authentication/twilio/sendCode.js"));
app.use("/verify/registration/code", require("./routes/authentication/twilio/verifyCode.js"));
app.use("/upload/misc/file/wo/saving", require("./routes/universal/photoRelated/uploadMiscPhoto.js"))
app.use("/register/new/user", require("./routes/authentication/register/registerNewUser.js"));
app.use("/gather/user/profile", require("./routes/userSpecific/gatherUserDataAuthed.js"));
app.use("/upload/new/pic/video/profile/specific", require("./routes/profile/data/imageRelated/uploadNewVideoImg.js"));
app.use("/save/restricted/content/data/files", require("./routes/profile/restrictedContent/update/updateSaveNewFilesFormat.js"));
app.use("/login/authenticate", require("./routes/authentication/login/authenticate.js"));
app.use("/gather/profile/pictures", require("./routes/messaging/gatherProfilePicsMessaging.js"));
app.use("/update/partially/randomize/user/public/location", require("./routes/universal/location/updateLocation.js"));
app.use("/adjust/profile/data", require("./routes/profile/data/coreValues/updateAppropriateValues.js"));
app.use("/gather/nearby/users", require("./routes/mapNearby/gatherNearbyUsers.js"));
app.use("/gather/users/limited", require("./routes/universal/gatherUsers/gatherLimitedUsers.js"));
app.use("/gather/users/limited/general", require("./routes/universal/gatherUsers/gatherWhileUnauthenticated.js"));
app.use("/gather/users/limited/promoted/boosted", require("./routes/universal/gatherUsers/boosted/gatherBoostedPromotedUsers.js"));
app.use("/start/conversation/save", require("./routes/messaging/initiateMessageNotification/sendMsgNotify.js"));
app.use("/start/conversation/save/tokens/promoted", require("./routes/messaging/initiateMessageNotification/sendMsgNotifySendCoins.js"));
app.use("/gather/wallet/info", require("./routes/blockchain/wallet/gatherWalletInfo.js"));
app.use("/send/code/change/password/confirmation/text", require("./routes/authentication/passwordChange/sendConfirmationCode.js"));
app.use("/code/submisson/password/change", require("./routes/authentication/passwordChange/changePassword.js"));
app.use("/organize/new/meetup/live/post", require("./routes/meetups/postNewMeetup/postNewMeetupGroup.js"));
app.use("/gather/meetups/randomized", require("./routes/meetups/gatherMeetups/gatherRandomizedMeetups.js"));
app.use("/submit/comment/meetup/group/new", require("./routes/meetups/comments/postNewComment/postCommentNew.js"));
app.use("/gather/only/profile/picture/with/id", require("./routes/universal/photoRelated/gatherUserPhotoOnly.js"));
app.use("/react/feedback/score", require("./routes/feedbackRatings/commentFeedback/submitRegularFeedbackProCon.js"));
app.use("/react/feedback/score/double", require("./routes/feedbackRatings/commentFeedback/doublePointsFeedback.js"));
app.use("/post/new/feed/item", require("./routes/feedData/uploadNewFeedData/uploadData.js"));
app.use("/gather/randomized/feed/posts", require("./routes/feedData/gatherFeed/gatherPosts.js"));
app.use("/upload/misc/file/wo/save/cover/photo", require("./routes/profile/coverPhoto/uploadSaveCover.js"));
app.use("/upload/misc/file/wo/save/profile/picture", require("./routes/profile/profilePictures/uploadNewProfilePictures.js"));
app.use("/reaction/feed/post", require("./routes/feedData/reactions/reactPositiveNegative.js"));
app.use("/gather/one/user/restricted/data", require("./routes/universal/gatherIndividual/gatherCoreDataRestricted.js"));
app.use("/submit/comment/feeditem", require("./routes/feedData/comments/postNewComment/newComment.js"));
app.use("/veriff/complete", require("./routes/authentication/verificationFlow/veriff.js"));
app.use("/join/meetup/group", require("./routes/meetups/joinMeetup/joinGroup.js"));
app.use("/post/new/item/sale/marketplace", require("./routes/ecommerce/postNewItemSale/newItem.js"));
app.use("/gather/randomized/listings/for/sale", require("./routes/ecommerce/gatherListings/gatherListings.js"));
app.use("/register/account/companion/mentorship", require("./routes/authentication/register/registerMentorCompanionAccount.js"));
app.use("/gather/randomized/users/coaching/mentorship", require("./routes/mentorship/gatherMentors/gather.js"));
app.use("/gather/one/user/restricted/data/mentorship", require("./routes/mentorship/gatherRestrictedCoreData/gatherRestrictedData.js"));
app.use("/activate/aquire/session/veriff", require("./routes/authentication/verificationFlow/initiate.js"));
app.use("/upload/audio/file/profile/about", require("./routes/profile/audio/uploadAudioTrack.js"));
app.use("/send/request/new/mentorship/request", require("./routes/mentorship/initiateNewRequest/initiate.js"));
app.use("/login/authenticate/mentorship", require("./routes/authentication/login/authenticateMentor.js"));
app.use("/gather/mentorship/requests", require("./routes/mentorship/gatherRequests/gatherRequestsPerUser.js"));
app.use("/initiate/background/check/checkr", require("./routes/authentication/backgroundChecks/initiateBackgroundCheckAuth.js"));
app.use("/boost/account/promote/tiered", require("./routes/profile/boostAccountPromotion/promoteBoostAccount.js"));
app.use("/remove/old/expired/meetups", require("./routes/meetups/cronJobRemoval/removeMeetupsIfExpired.js"));
app.use("/meetup/leave/review", require("./routes/meetups/reviewMeetup/reviewIndividual.js"));
app.use("/save/card/details", require("./routes/paymentRelated/addNewPayment/addNew.js"));
app.use("/accept/decline/request/mentorship", require("./routes/mentorship/acceptDeclineRequest/acceptOrDecline.js"));
app.use("/gather/active/mentorship/contracts", require("./routes/mentorship/active/gatherActiveMentorshipContracts.js"));
app.use("/request/sending/images/via/messaging/with/user", require("./routes/messaging/requestSendingImagesPics/sendRequest.js"));
app.use("/enable/pictures/via/messaging/specific", require("./routes/messaging/requestSendingImagesPics/activateImageFunctionality.js"));
app.use("/post/subscription/amount/welcome/message", require("./routes/profile/restrictedContent/subscriptionRelated/updateSubscriptionDataCost.js"));
app.use("/subscribe/user/content/restricted/pay", require("./routes/profile/restrictedContent/subscriptionRelated/paySubscribeToUser.js"));
app.use("/subscribe/follower/profile", require("./routes/profile/newFollower/subscribeNewFollower.js"));
app.use("/unsubscribe/follower/profile/removal", require("./routes/profile/unsubscribeFollower/unSubscribe.js"));
app.use("/heart/like/mentorship/profile/listing", require("./routes/mentorship/listing/heartLikeListing/reactListing.js"));
app.use("/upload/public/key/blockchain", require("./routes/blockchain/wallet/uploadPublicKey.js"));
app.use("/start/live/stream/broadcast", require("./routes/streaming/startStream/startStream.js"));
app.use("/init/random/onevone/chat", require("./routes/messaging/randomOneVOne/initializeOneVOneChat.js"));
app.use("/gather/new/random/user", require("./routes/messaging/randomOneVOne/gatherIndividual/gatherNewUser.js"));
app.use("/mentor/leave/review", require("./routes/mentorship/reviews/leaveAReviewMentor.js"));
app.use("/gather/only/profile/picture/with/id/and/account/id", require("./routes/mentorship/gatherIDAndPicture.js"));
app.use("/search/appropriate/filter", require("./routes/users/filterSearch/serachUserFiltered.js"));
app.use("/purchase/coins/crypto/conversion/custom", require("./routes/paymentRelated/purchaseTokens/purchaseConversion.js"));
app.use("/gather/live/streams/opentok", require("./routes/streaming/gatherStreams/gatherStreamsGeneral.js"));
app.use("/send/match/request", require("./routes/matches/sendRequest/sendMatchRequest.js"));
app.use("/gather/match/requests/latest", require("./routes/matches/gatherMatches/gatherRelevantMatches.js"));
app.use("/confirm/match/request/partner", require("./routes/matches/acceptMatch/accept.js"));
app.use("/gather/match/active/latest", require("./routes/matches/activeMatches/fetchActiveMatches.js"));
app.use("/match-users/chat/random", require("./routes/messaging/randomOneVOne/findUserMatch.js"));
app.use("/stop/live/stream/broadcast", require("./routes/streaming/stopStream/stop.js"));
app.use("/initialize/scrather/daily", require("./routes/lottery/lotteryInit.js"));
app.use("/submit/scratcher/reward/points", require("./routes/lottery/updateLotteryAfter.js"));
app.use("/search/for/usernames/only", require("./routes/universal/gatherUsers/usernames/gatherByUsernameOnly.js"));
app.use("/block/specific/user/add/list", require("./routes/blockingPrivacy/blockUser/blockNewUser.js"));
app.use("/send/notification/meetup/match", require("./routes/matches/inviteToIRLMeetup/meetupRequest.js"));
app.use("/fetch/pending/invite/meetup/notification", require("./routes/matches/gatherMeetingData/gatherDataPendingMeeting.js"));
app.use("/accept/decline/request/meetup/irl", require("./routes/meetups/requestsMeetIRL/acceptDeclineRequest.js"));
app.use("/contact/general", require("./routes/contactUs/contactGeneral.js"));
app.use("/update/reward/user/continous/usage", require("./routes/rewardsOnly/continousUsageReward/rewardUserContinous.js"));
app.use("/remove/meetup/request/match", require("./routes/meetups/removeMeetup/removeUserFromPending.js"));
app.use("/confirm/meetup/successful/or/not", require("./routes/meetups/confirmation/confirmMetupOrNot.js"));
app.use("/boost/user/profile/existing", require("./routes/profile/boostAccountPromotion/useExistingBoost.js"));
app.use("/search/for/usernames/and/content/details", require("./routes/universal/gatherUsers/usernames/gatherUsersByUsernameWithContent.js"));
app.use("/init/random/onevone/chat/new", require("./routes/messaging/randomOneVOne/intiailizeNextOneVOne.js"));
app.use("/start/live/stream/broadcast/send/notification/alert", require("./routes/streaming/startStream/startStreamAndNotify.js"));
app.use("/submit/purchase/generate", require("./routes/ecommerce/purchaseItem/purchase.js"));
app.use("/gather/sales/pending/active", require("./routes/ecommerce/gatherListings/soldListings/gatherSoldListings.js"));
app.use("/track/package/updates", require("./routes/ecommerce/tracking/trackUpdates.js"));
app.use("/release/funding/delivered/package", require("./routes/ecommerce/tracking/deliveredReleaseFunds/depositFundsAfterDelivery.js"));
app.use("/gather/dropoff/locations/points", require("./routes/map/locationsOnPinMovement/movementRetreieve.js"));
app.use("/register/fcm/token", require("./routes/universal/fcmToken/saveFCMToken.js"));
app.use("/onboarding/flow/stripe/links", require("./routes/stripe/onboarding/initiateOnboardingLinkFlow.js"));
app.use("/gather/cards/payouts/account", require("./routes/paymentRelated/gatherCardsRelated/gatherRelevantCardsPerAccountType.js"));
app.use("/delete/card/payment/method/payout", require("./routes/paymentRelated/deletePayment/delete.js"));
app.use("/change/primary/card/stripe/account/payment", require("./routes/paymentRelated/updatePrimaryCard/updatePrimary.js"));
app.use("/cashout/funds/card/stripe", require("./routes/paymentRelated/payouts/cashout/cashoutSelectedFundsCard.js"));
app.use("/send/push/notification", require("./routes/messaging/sendPushNotification/send.js"));
app.use("/send/match/request/super/request", require("./routes/matches/sendRequest/sendSuperMatchRequest.js"));
app.use("/gather/meetups/searching/limited/relevant", require("./routes/meetups/gatherMeetups/gatherMeetupsSearchable.js"));
app.use("/send/confirmation/request/mentorship/complete", require("./routes/matches/completeMatch/requestMatchCompletion.js"));
app.use("/confirm/mentorship/sesssions/complete/request", require("./routes/matches/completeMatch/confirmOrDeny/confirmSuccessfulCompletion/successfulSessions.js"));
app.use("/check/expired/completion/mentorship/requests", require("./routes/mentorship/periodicCronChecks/checkExpiredRequests/checkExpired.js"));
app.use("/cancel/mentorship/sesssions/contract", require("./routes/mentorship/cancelServices/cancelMentorshipServices.js"));
app.use("/start/live/stream/broadcast/send/notification/alert/personal/match/stream", require("./routes/streaming/matchStreaming/startNewStreamWithMatch.js"));
app.use("/notify/only/other/user/calling", require("./routes/notifications/notifyOfUserCalling/notifyCalling.js"));
app.use("/gather/latest/spotify/played/songs", require("./routes/profile/MusicContent/Profile/gatherRecentlyPlayedTracks.js"));
app.use("/grant/access/flow/spotify", require("./routes/profile/MusicContent/Profile/grantAccessFlow.js"));
app.use("/search/chatgpt/response", require("./routes/chatGPT/searchResponseChat.js"));
app.use("/suport/unacceptable/dangerous/behavior", require("./routes/reportingBehavior/reportVariousBehaviorsViaChat.js"));
app.use("/upload/new/profile/video/introduction", require("./routes/profile/data/videoAbout/uploadAboutMeVideoProfile.js"));
app.use("/send/recovery/email/password/attempt", require("./routes/authentication/passwordChangeRequest/requestRecovery.js"));
app.use("/submit/confirmation/code/emailed/password/recovery", require("./routes/authentication/passwordChangeRequest/submitChange/submitPasswordChange.js"));
app.use("/fetch/more/feed/post/items", require("./routes/feedData/gatherFeed/gatherMoreFeedItems.js"));
app.use("/save/profile/view", require("./routes/profile/profileViewAddition/addProfileView.js"));
app.use("/subscribe/profile/visibility/lifetime", require("./routes/profile/profileViewAddition/subscribeProfileViewLifetime.js"));
app.use("/gather/only/profile/views/subscribed", require("./routes/profile/profileViewAddition/gatherProfileViews/fetchViews.js"));
app.use("/purchase/hiding/profile/visibility", require("./routes/profile/hideProfileView/hideMaskView.js"));
app.use("/submit/bachelorette/game/initalize", require("./routes/bacheloretteGame/createNewGame/createCompetition.js"));
app.use("/gather/competitions/bachelorette/games", require("./routes/bacheloretteGame/gatherListings/gatherRelevantCompetitions.js"));
app.use("/send/competition/request/invite", require("./routes/bacheloretteGame/joinCohort/join.js"));
app.use("/accept/respond/notification/competition/game/request", require("./routes/bacheloretteGame/respondNotification/accept/acceptRequest.js"));
app.use("/decline/respond/notification/competition/game/request", require("./routes/bacheloretteGame/respondNotification/deny/declineRequest.js"));
app.use("/gather/personal/active/competitions/bachelor/bachelorette", require("./routes/bacheloretteGame/gatherListings/personalActiveGames/gatherPersonal.js"));
app.use("/start/round/one/competition/game", require("./routes/bacheloretteGame/roundsOfGame/roundOne/startRoundOne.js"));
app.use("/submit/results/data/round/one/game/compeitition", require("./routes/bacheloretteGame/roundsOfGame/roundOne/SubmitResults/submitRoundOneQuestionare.js"));
app.use("/gather/individual/listing/bachelor/bachelorette/game", require("./routes/bacheloretteGame/gatherListings/gatherIndividual/gatherListingCompetition.js"));
app.use("/select/user/compeitition/second/round", require("./routes/bacheloretteGame/roundsOfGame/roundOne/selectRoundCompletion/selectForRoundTwo.js"));
app.use("/remove/expired/game/listings", require("./routes/bacheloretteGame/roundsOfGame/checkCronGames/swapSwitchExistingGamesExpired.js"));
app.use("/deny/user/competition/bachelor/round", require("./routes/bacheloretteGame/roundsOfGame/removeFromGame/removeUserFromGame.js"));
app.use("/check/already/purchased/permission/feature/profile/views", require("./routes/profile/hideProfileView/checkAlreadySubscribed.js"));
app.use("/call/other/user/competition/round", require("./routes/streaming/notify/notifyUserOfCalling.js"));
app.use("/select/user/continue/round/four", require("./routes/bacheloretteGame/roundsOfGame/roundThree/selectContinueRoundFour.js"));

app.get("/spotify/callback", async (req, resppppp) => {
    console.log("req.query callback spotify --- : ", req.query);

	const { code, state } = req.query;

	const collection = Connection.db.db("test").collection("users");

    const matchingResult = await collection.findOne({ uniqueId: state });

	const configurationCustom = {
		uniqueId: matchingResult.uniqueId,
		accountType: matchingResult.accountType,
		code
	};

	axios.post(`${config.get("baseURL")}/gather/latest/spotify/played/songs`, configurationCustom).then((res) => {
		if (res.data.message === "Successfully fetched the lastest tracks from this spotify profile!") {
			console.log(res.data);

			collection.findOneAndUpdate({ uniqueId: state }, { $set: {
				spotifyProfileTokenCode: encryptString(code)
			}}, { returnDocument: 'after' },  (err, data) => {
				if (err) {
					console.log(err.message);
		
					resppppp.json({
						message: "Successfully authenticated w/o logging related security details...",
						err
					})
				} else {
					resppppp.json({
						message: "We've successfully enabled your profile's spotify history of recently played 'tracks' or songs! These will now display on your profile for now on..."
					})
				}
			});
		} else {
			console.log("Err", res.data);
		}
	}).catch((err) => {
		console.log(err.message);
	});
});

app.get("/finished/authentication/stripe/onboarding/:id/:accountType", (req, resppppp) => {

	const userID = req.params.id;
	const accountType = req.params.accountType;

	const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

	collection.findOneAndUpdate({ uniqueId: userID }, { $set: {
        stripeAccountVerified: true
    }}, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err.message);

            resppppp.json({
                message: "Successfully authenticated w/o logging related security details...",
                err
            })
        } else {
            resppppp.json({
				message: "Success - completed verification flow!"
			})
        }
    });
});

Connection.open();

initializeApp();

io.on("connection", socket => {

	console.log("New client connected");

	socket.on("newStreamMessage", (streamData) => {
		console.log("New stream message recieved...", streamData);

		io.sockets.emit("newStreamMessage", streamData);
	});

	socket.on("newChatRandomMessage", (streamData) => {
		console.log("New chat message recieved...", streamData);

		io.sockets.emit("newChatRandomMessage", streamData);
	});

	socket.on("randomChatEndedSession", (chatData) => {
		console.log("randomChatEndedSession recieved...", chatData);

		io.sockets.emit("randomChatEndedSession", chatData);
	});

	socket.on("fetchAndJoinUserBoth", (userData) => {
		console.log("Join both users for chat...", userData);

		io.sockets.emit("fetchAndJoinUserBoth", userData);
	});

	socket.on("specificGroupChatChannel", (messageData) => {
		console.log("Group chat channel activation/msg...", messageData);

		io.sockets.emit("specificGroupChatChannel", messageData);
	});

	socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(PORT, () => {
	console.log(`app listening on port ${PORT}!`);
});