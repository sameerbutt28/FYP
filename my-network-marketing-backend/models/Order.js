// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     totalAmount: { type: Number, required: true },
//     orderDate: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Order', orderSchema);






const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { distributeCommission } = require('./Commission'); // Import commission logic

// EasyPaisa payment function
async function initiatePayment(amount, userId, phone, description) {
    const orderId = uuidv4();
    const payload = {
        amount: amount,
        orderId: orderId,
        phone: phone,
        description: description,
        // ... other required parameters
    };

    try {
        const response = await axios.post(process.env.EASYPAY_BASE_URL, payload, {
            headers: {
                'Authorization': `Bearer ${process.env.EASYPAY_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        await distributeCommission(userId, amount); // Distribute commission after payment initiation
        return response.data;
    } catch (error) {
        console.error('Error initiating payment:', error.response.data);
        throw new Error('Payment initiation failed');
    }
}

// Payment success handling
async function handlePaymentSuccess(req, res) {
    const { amount, userId } = req.body; // Adjust according to the success response
    // You might need to perform additional validation here based on your payment provider's response

    try {
        await distributeCommission(userId, amount); // Distribute commission upon successful payment
        res.status(200).json({ success: true, message: 'Payment was successful' });
    } catch (err) {
        console.error('Error handling payment success:', err);
        res.status(500).json({ success: false, message: 'Error handling payment success' });
    }
}

module.exports = { initiatePayment, handlePaymentSuccess };
