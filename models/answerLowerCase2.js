/*
There is an issue with capital letter with Heroku
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    // radioques: String,
    userId: String,
    answersObject: String,
    currentPage: Number,
    userEmail: String,
    questionsIdSaved: String,
    answersSaved: String,
    reqPath: String,
    reqRemoteAddress: String,
    createdAt: String,
    capitalLetterBugInHeroku: String,
}, {
}, {
  timestamps: {
    timestamps: true
  }
});

// Remember to rename the model. Whatever you end up putting in quotes will end up being the collection name
const Answer = mongoose.model("survey-answers-v2", questionSchema);

module.exports = Answer;