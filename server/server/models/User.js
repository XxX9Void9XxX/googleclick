const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  clicks: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", UserSchema);
