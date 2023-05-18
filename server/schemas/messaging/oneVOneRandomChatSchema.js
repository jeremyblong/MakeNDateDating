const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewRandomChat1v1Schema = new Schema({
    uniqueId: {
        type: String
    },
    firstName: {
        type: String
    },
    username: {
        type: String
    },
    ageBegin: {
        type: Number
    }, 
    ageEnd: {
        type: Number
    },
    seeking: {
        type: String
    },
    active: {
        type: Boolean
    },
    gender: {
        type: String
    },
    createdAt: { type: Date, expires: '1h', default: Date.now, index: true },
    birthdate: {
        type: Date
    }
});

NewRandomChat1v1Schema.index({ createdAt: 1 }, { expireAfterSeconds: '1h' });

module.exports = NewBoost = mongoose.model("random1v1chat", NewRandomChat1v1Schema);