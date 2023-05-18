const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const NewMentorshipRequestSchema = new Schema({
    requestedBy: {
        type: String
    },
    requesterName: {
        type: String
    },
    requesterUsername: {
        type: String
    },
    initialMarkdownMessage: {
        type: String
    },
    selectedDate: {
        type: Date
    },
    selectedTime: {
        type: String
    },
    problemsText: {
        type: String
    },
    combinedDateTime: {
        type: String
    },
    hearts: {
        type: Array
    },
    whatYouExpectFromTherapist: {
        type: String
    },
    hourSet: {
        type: String
    },
    formattedDateFormatted: {
        type: String
    },
    id: {
        type: String
    },
    formattedDateRaw: {
        type: Date
    },
    postedOn: {
        type: Date
    },
    approaches: {
        type: Array
    },
    views: {
        type: Number
    }
});

module.exports = NewMentorshipRequest = mongoose.model("pendingmentorshiprequest", NewMentorshipRequestSchema);