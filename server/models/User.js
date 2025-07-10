const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  id: Number,
  activityType: String,
  description: String,
  filePath: String,
  fileType: String,
  status: String,
  points: Number,
  timestamp: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  phone: String,
  occupation: String,
  points: { type: Number, default: 0 },
  profileImage: { type: String, default: '' },
  uploads: [uploadSchema]
}, {
  collection: 'users' // match your actual collection name
});

module.exports = mongoose.model('User', userSchema);
