// server/seedQuiz.js
require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');

const quizData = require('./quiz.json'); // if you saved the JSON as quiz.json in same folder

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  await Quiz.deleteMany({});
  await Quiz.insertMany(quizData);
  console.log("✅ Quiz questions seeded successfully!");
  mongoose.disconnect();
})
.catch(err => {
  console.error("❌ Failed to seed quiz data:", err);
  mongoose.disconnect();
});
