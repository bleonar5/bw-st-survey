const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
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

// Export setOfQuestions model. It's a schema but we treat it as a class
// Remember to rename the model. Whatever you end up putting in quotes will end up being the collection name
const MTurkFeedback = mongoose.model("mturkfeedback", questionSchema);

module.exports = MTurkFeedback;
