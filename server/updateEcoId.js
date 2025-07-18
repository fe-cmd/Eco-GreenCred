require("dotenv").config();
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path if needed


async function generateEcoIdFromUserId(userId) {
  const digits = (userId.match(/\d/g) || []).join('');
  let ecoId = '';
  for (let i = 0; i < 5; i++) {
    const index = (i * 3 + digits.charCodeAt(i % digits.length)) % digits.length;
    ecoId += digits[index];
  }
  return ecoId;
}

async function updateUsersWithEcoId() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const users = await User.find({});
  for (const user of users) {
    if (!user.ecoId) {
      user.ecoId = await generateEcoIdFromUserId(user._id.toString());
      await user.save();
      console.log(`Updated user ${user.username} with ecoId: ${user.ecoId}`);
    }
  }

  console.log('All users updated');
  mongoose.disconnect();
}

updateUsersWithEcoId().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
