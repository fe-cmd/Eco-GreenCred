const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String
}, {
  collection: 'quiz'
});

module.exports = mongoose.model('Quiz', quizSchema);
