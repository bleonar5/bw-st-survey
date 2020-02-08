
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserPaymentPrefSchema = new Schema({
    userId: String,
    userEmail: String,
    userPaymentPref: String,
    redemCode: String,
    createdAt: String,
}, {
}, {
  timestamps: {
    timestamps: true
  }
});

const UserPaymentPref = mongoose.model("userpaymentpreference", UserPaymentPrefSchema);

module.exports = UserPaymentPref;