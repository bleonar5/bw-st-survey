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
}, {
}, {
  timestamps: {
    timestamps: true
  }
});

// Export setOfQuestions model. It's a schema but we treat it as a class
// Remember to rename the model. Whatever you end up putting in quotes will end up being the collection name
const FinalAnsSubmitted = mongoose.model("final-answers", FinalAnsSubmittedSchema);

module.exports = FinalAnsSubmitted;