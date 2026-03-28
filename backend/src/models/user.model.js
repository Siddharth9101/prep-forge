const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already exists. Please choose another one."],
    required: [true, "Username is required."],
    trim: true,
    min: [3, "Username must be at least 3 characters long."],
  },
  email: {
    type: String,
    unique: [true, "Email already exists. Please use another one."],
    required: [true, "Email is required."],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    min: [6, "Password must be at least 6 characters long."],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
