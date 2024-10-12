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
                