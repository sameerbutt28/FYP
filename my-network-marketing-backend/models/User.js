// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referrer ID
// });

// module.exports = mongoose.model('User', userSchema);

// user.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    email: String,
    profilePic: String,
    referralCode: { type: String, unique: true },
    referredBy: String,
    referredUsers: [{ type: String }],
    balance: { type: Number, default: 0 },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
