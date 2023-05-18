const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const Schema = mongoose.Schema;

const Session = new Schema({
    refreshToken: {
        type: String,
        default: ""
    }
})

const NewUserMentorshipRegister = new Schema({
    firstName: {
        type: String
    },
    coreMentorshipAccountInfo: {
        type: Object
    },
    accountType: {
        type: Object
    },
    lastName: {
        type: String
    },
    password: {
        type: String
    },
    blockchainData: {
        type: Object
    },
    username: {
        type: String
    },
    stripeAccountData: {
        type: Object
    },
    email: {
        type: String
    },
    rankedArr: {
        type: Array
    },
    rank: {
        type: Number
    },
    profilePictures: {
        type: Array
    },
    uniqueId: {
        type: String
    },
    verficationCompleted: {
        type: Boolean
    },
    registrationDate: {
        type: Date
    },
    securityAuthenticationLogs: {
        type: Array
    },
    hearts: {
        type: Array
    },
    registrationDateString: {
        type: String
    },
    birthdateRaw: {
        type: Date
    },
    gender: {
        type: Object
    }, 
    interestedIn: {
        type: String
    },
    enrolled: {
        type: Boolean
    },
    birthdate: {
         type: String
    },
    salt: {
        type: String
    },
    hash: {
        type: String
    },
    reviews: {
        type: Array
    },
    authStrategy: {
        type: String
    },
    refreshToken: {
        type: Array
    },
    paymentMethods: {
        type: Array
    },
    authyId: {
        type: Number
    },
    stripeAccountVerified: {
        type: Boolean
    },
    stripeAccountDetails: {
        type: Object
    },
    totalUniqueViews: {
        type: Number
    },
    phoneNumber: {
        type: String
    },
    inAppTokenCurrency: {
        type: Number
    }
});

NewUserMentorshipRegister.set("toJSON", {
    transform: (doc, ret, options) => {
        delete ret.refreshToken
        return ret
    }
});

NewUserMentorshipRegister.plugin(passportLocalMongoose)

module.exports = NewBetaUser = mongoose.model("mentor", NewUserMentorshipRegister);