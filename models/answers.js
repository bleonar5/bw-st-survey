const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    // radioques: String,
    userId: String,
    answersObject: Object,

    // questionId: String,
    // question: String,
    // response: String,
    // name: String,
    // value: String,
    // type: String
    createdAt: String,
}, {
}, {
  timestamps: {
    createdAt: "created_at",
    // Not sure if updatedAt is required
    updatedAt: "updated_at"
  }
});

// Export setOfQuestions model. It's a schema but we treat it as a class
// Remember to rename the model. Whatever you end up putting in quotes will end up being the collection name
const Answer = mongoose.model("survey-answers", questionSchema);

module.exports = Answer;