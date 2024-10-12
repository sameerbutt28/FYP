const { initiatePayment, handlePaymentSuccess } = require('./models/Order'); // Import payment logic
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { v4: uuidv4 } = require('uuid'); // To generate unique referral codes
const User = require('./models/User'); // Import user model

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey', // Use environment variable or default
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Passport Google OAuth configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            const referralCode = uuidv4(); // Generate unique referral code for new users
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePic: profile.photos[0].value,
                referralCode,
                referredBy: null,
                referredUsers: []
            });
            await user.save();
            console.log('New user created:', user);
        } else {
            console.log('Existing user found:', user);
        }
        cb(null, user); // Pass the user to the next middleware
    } catch (err) {
        console.error('Error in Google Strategy:', err);
        cb(err, null); // Pass the error to the callback
    }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err, null));
});

// Routes

// Home route
app.get('/', (req, res) => {
    const html = `
        <h1>Welcome to the Referral System</h1>
        <a href="/auth/google">Login with Google</a>
    `;
    res.send(html);
});

// Google login route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

// Dashboard route
app.get('/dashboard', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    const user = req.user;
    const referredUsers = await User.find({ referredBy: user.referralCode });

    const html = `
        <h1>Referral Dashboard</h1>
        <h2>Welcome, ${user.name}!</h2>
        <p>Your Referral Code: <b>${user.referralCode}</b></p>
        <p>Share your referral link: <a href="http://localhost:3000/auth/google?ref=${user.referralCode}">http://localhost:3000/auth/google?ref=${user.referralCode}</a></p>
        
        <h3>Enter Referral Code</h3>
        <form action="/referral/link" method="POST">
            <label for="referrerCode">Referral Code:</label>
            <input type="text" id="referrerCode" name="referrerCode" required>
            <button type="submit">Submit</button>
        </form>

        <h3>Your Referred Users (${referredUsers.length}):</h3>
        <ul>
            ${referredUsers.map(u => `<li>${u.name} (${u.email})</li>`).join('')}
        </ul>

        <br/><a href="/logout">Logout</a>
    `;
    res.send(html);
});

// Link referral route
app.post('/referral/link', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    const { referrerCode } = req.body;
    const user = req.user;

    if (user.referredBy) {
        return res.send('You have already been referred by someone.');
    }

    try {
        const referrer = await User.findOne({ referralCode: referrerCode });
        if (!referrer) {
            return res.send('Invalid referral code.');
        }

        user.referredBy = referrerCode;
        referrer.referredUsers.push(user.referralCode);

        await user.save();
        await referrer.save();

        console.log(`User ${user.name} referred by ${referrer.name} successfully.`);
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error linking referral:', err);
        res.send('An error occurred while linking the referral.');
    }
});

// Payment route
app.post('/pay', async (req, res) => {
    const { amount, phone, description, userId } = req.body;

    try {
        const paymentResponse = await initiatePayment(amount, userId, phone, description);
        res.json(paymentResponse);
    } catch (err) {
        res.status(500).json({ error: 'Payment failed' });
    }
});

// Payment success callback
app.post('/payment/success', async (req, res) => {
    await handlePaymentSuccess(req, res);
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

// Start the server
const PORT = process.env.PORT || 8080; // Change to 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
                // index.js 

                import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SectionTitle } from "../components";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../store";
import { loginUser, logoutUser } from "../features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (loginState) {
      localStorage.clear();
      store.dispatch(logoutUser());
    }
  }, []);

  // This will trigger the Google Sign-In process
  const handleGoogleSignIn = () => {
    window.open("http://localhost:3000/auth/google", "_self"); // Call the backend Google Auth route
  };

  return (
    <>
      <SectionTitle title="Login" path="Home | Login" />
      <div className="flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <div className="bg-dark border border-gray-600 shadow w-full rounded-lg divide-y divide-gray-200">
            <div className="px-5 py-7 text-center">
              {/* Google Sign-In Button */}
              <button
                onClick={handleGoogleSignIn}
                className="transition duration-200 bg-red-600 hover:bg-red-500 focus:bg-red-700 focus:shadow-sm focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Sign in with Google</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 inline-block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

//login.jsx


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
 //users.js   



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
//commission.js 





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
 //order.js