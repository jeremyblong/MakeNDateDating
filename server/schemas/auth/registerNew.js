const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const Schema = mongoose.Schema;

const Session = new Schema({
    refreshToken: {
        type: String,
        default: ""
    }
})

const NewUserRegistered = new Schema({
    firstName: {
        type: String
    },
    accountType: {
        type: Object
    },
    lastName: {
        type: String
    },
    dummyAccount: {
        type: Boolean
    },
    addressRelated: {
        type: Object
    },
    timezone: {
        type: Object
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

NewUserRegistered.set("toJSON", {
    transform: (doc, ret, options) => {
        delete ret.refreshToken
        return ret
    }
});

NewUserRegistered.plugin(passportLocalMongoose)

module.exports = NewBetaUser = mongoose.model("user", NewUserRegistered);