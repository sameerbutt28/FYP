// const mongoose = require('mongoose');

// const commissionSchema = new mongoose.Schema({
//     orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
//     upline1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     upline2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for second upline
//     upline1Commission: { type: Number, required: true },
//     upline2Commission: { type: Number, required: true },
//     commissionDate: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Commission', commissionSchema);
const User = require('./User'); // Import user model

// Commission calculation and distribution
async function distributeCommission(userId, amount) {
    try {
        const user = await User.findById(userId);

        if (user && user.referredBy) {
            const referrerB = await User.findOne({ referralCode: user.referredBy });

            if (referrerB) {
                const commissionB = amount * 0.20; // 20% commission for direct referrer
                referrerB.balance = (referrerB.balance || 0) + commissionB;
                await referrerB.save();

                if (referrerB.referredBy) {
                    const referrerA = await User.findOne({ referralCode: referrerB.referredBy });

                    if (referrerA) {
                        const commissionA = amount * 0.10; // 10% commission for second-level referrer
                        referrerA.balance = (referrerA.balance || 0) + commissionA;
                        await referrerA.save();
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error in distributing commission:', err);
        throw new Error('Commission distribution failed');
    }
}

module.exports = { distributeCommission };

