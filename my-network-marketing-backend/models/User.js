// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referrer ID
// });

// module.exports = mongoose.model('User', userSchema);








// user.js
// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     googleId: String,
//     name: String,
//     email: String,
//     profilePic: String,
//     referralCode: { type: String, unique: true },
//     referredBy: String,
//     referredUsers: [{ type: String }],
//     balance: { type: Number, default: 0 },
// });

// const User = mongoose.model('User', UserSchema);

// module.exports = User;





//temppp
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },  // Ensure googleId is required and unique
    name: { type: String, required: true },  // Make name required
    email: { type: String, required: true, unique: true },  // Ensure email is required and unique
    profilePic: String,  // Profile picture is optional
    referralCode: { type: String, unique: true },  // Ensure referralCode is unique
    referredBy: { type: String, default: null },  // Referred by is optional (default null)
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Use ObjectId for referred users, referring to the User model
    balance: { type: Number, default: 0 },  // Default balance is 0
}, { timestamps: true });  // Optionally, add timestamps for record creation and update time

const User = mongoose.model('User', UserSchema);

module.exports = User;

