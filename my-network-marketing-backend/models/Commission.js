const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    upline1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    upline2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for second upline
    upline1Commission: { type: Number, required: true },
    upline2Commission: { type: Number, required: true },
    commissionDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Commission', commissionSchema);
