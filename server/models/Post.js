const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  username: String,
  profileImage: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  username: String,
  profileImage: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  replies: [replySchema]
});

const postSchema = new mongoose.Schema({
  username: String,
  name: String,
  profileImage: String,
  isVideo: Boolean,
  media: [String],
  caption: String,
  likes: [String],
  favorites: [String],
  comments: [commentSchema],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
