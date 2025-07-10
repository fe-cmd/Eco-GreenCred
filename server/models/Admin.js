const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  profileImage: { type: String, default: '' }
}, {
  collection: 'admin' // use singular if that's how you saved it
});

module.exports = mongoose.model('Admin', adminSchema);
