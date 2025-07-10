const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  score: { type: Number, default: 0 },         // ✅ Add this
  timestamp: { type: Date, default: Date.now } // ✅ Rename 'lastAttempt' for clarity
}, {
  collection: 'quiz-attempts'
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
