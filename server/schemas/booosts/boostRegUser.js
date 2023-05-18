const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewBoostedUserSchema = new Schema({
    firstName: {
        type: String
    },
    accountType: {
        type: Object
    },
    lastName: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    rankedArr: {
        type: Array
    },
    tier: {
        type: Number
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
    reviews: {
        type: Array
    },
    totalUniqueViews: {
        type: Number
    },
    phoneNumber: {
        type: String
    },
    createdAt: { type: Date, expires: '1h', default: Date.now, index: true }
});

NewBoostedUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: '1h' });

module.exports = NewBoost = mongoose.model("boosteduser", NewBoostedUserSchema);