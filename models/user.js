// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePic: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: String,
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
