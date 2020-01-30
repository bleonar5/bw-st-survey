/*
There is an issue with capital letter with Heroku
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MTurkFeedbackSchema = new Schema({
    userId: String,
    answersObject: String,
    currentPage: Number,
    userEmail: String,
    questionsIdSaved: String,
    answersSaved: String,
    reqPath: String,
    reqRemoteAddress: String,
    createdAt: String,
}, {
}, {
  timestamps: {
    timestamps: true
  }
});

const MTurkFeedback = mongoose.model("mturkfeedback", MTurkFeedbackSchema);

module.exports = MTurkFeedback;
