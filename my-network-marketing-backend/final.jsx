//TEMP BACKEND CODE WITH ADMIN DASHBOARD WORKING 
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const User = require('./models/User');
require('dotenv').config();
const cors = require('cors'); // Import CORS for cross-origin requests

const app = express();
        
// Middleware setup
app.use(cors({
    origin: 'http://localhost:5173', // React app's URL
    credentials: true // Allows cookies and authorization headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Ensure this is false for development (set to true for HTTPS in production)
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
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // Generate a referral code for the new user
            const referralCode = uuidv4();
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

        cb(null, user);
    } catch (err) {
        console.error('Error in Google Strategy:', err);
        cb(new InternalOAuthError('Failed to obtain access token', err), null);
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
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Referral System</h1><a href="/auth/google">Login with Google</a>');
});

// Google login route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const user = req.user;

    // Ensure that user data is available after authentication
    if (!user) {
        return res.status(401).send('User not authenticated');
    }

    // Check if the logged-in user's email matches the admin email
    if (user.email === process.env.ADMIN_EMAIL) {
        // Set a session flag to mark the user as admin
        req.session.isAdmin = true;
        // Redirect to admin dashboard
        res.redirect(`http://localhost:5173/admin-dashboard`);
    } else {
        // Regular user flow, redirect to user profile
        res.redirect(`http://localhost:5173/user-profile?name=${user.name}&email=${user.email}&referralCode=${user.referralCode}`);
    }
});

// Route to fetch all users and their downline (referred users) and upline (referredBy)
app.get('/api/admin/dashboard', async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find().populate('referredUsers').exec();

        // Format the data to show users with their upline and downline
        const formattedUsers = users.map(user => {
            return {
                name: user.name,
                email: user.email,
                referralCode: user.referralCode,
                referredBy: user.referredBy, // Upline
                referredUsers: user.referredUsers.length, // Number of referred users (downline)
                referredUsersList: user.referredUsers, // List of referred users
            };
        });

        // Send the formatted data to the admin dashboard
        res.json({ users: formattedUsers });
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        res.status(500).json({ error: "An error occurred while fetching user data" });
    }
});

// Referral link submission route (assumes user is authenticated)
app.post('/referral/link', async (req, res) => {
    const { referrerCode } = req.body;
    try {
        // Check if the user is authenticated
        const user = req.user; 
        if (!user) {
            return res.status(403).json("User not authenticated");
        }

        // Update the current user's referredBy field with the provided referrerCode
        user.referredBy = referrerCode;
        await user.save();
        res.json("Referral code linked successfully!");
    } catch (error) {
        console.error("Error linking referral code:", error);
        res.status(500).json({ error: "Error linking referral code" });
    }
});

// Payment route (example, modify as needed for your payment integration)
app.post('/payment', async (req, res) => {
    const { amount, paymentMethod } = req.body;
    try {
        // Handle payment logic (integration with Stripe, PayPal, etc.)
        res.json({ success: true, message: "Payment processed successfully" });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ error: "Error processing payment" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});