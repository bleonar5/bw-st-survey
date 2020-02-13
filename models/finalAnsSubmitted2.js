/*
There is an issue with capital letter with Heroku
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FinalAnsSubmittedSchema = new Schema({
    // radioques: String,
    userId: String,
    userEmail: String,
    answersSaved: String,
    timesOfAnswers: String,
    totalPagesofAnswers: String,
    // Todo: change logic in study-conclusion so that this database is updated with the user's payment preference instead of sending it to a new collection
    paymentPreference: String,
    paymentPrefTime: String
}, {
}, {
  timestamps: {
    timestamps: true
  }
});

// Remember to rename the model. Whatever you end up putting in quotes will end up being the collection name
const FinalAnsSubmitted = mongoose.model("final-answers-v2", FinalAnsSubmittedSchema);

module.exports = FinalAnsSubmitted;