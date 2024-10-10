require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { v4: uuidv4 } = require('uuid'); // To generate unique referral codes

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
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// User schema and model
const UserSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    email: String,
    profilePic: String,
    referralCode: { type: String, unique: true },
    referredBy: String, // Stores the referrer's referral code
    referredUsers: [{ type: String }] // Stores the referral codes of users referred by this user
});

const User = mongoose.model('User', UserSchema);

// Passport Google OAuth configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        // Check if user exists in the database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // Generate a unique referral code for new users
            const referralCode = uuidv4();

            // Create a new user instance
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePic: profile.photos[0].value,
                referralCode,
                referredBy: null, // Initially no referrer
                referredUsers: [] // No referred users at this time
            });

            // Save the new user to the database
            await user.save();
            console.log('New user created:', user);
        } else {
            console.log('Existing user found:', user); // Log existing user for debugging
        }
        
        cb(null, user); // Pass the user to the next middleware
    } catch (err) {
        console.error('Error in Google Strategy:', err); // Log any errors
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

// Home route (display Google login)
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

// Dashboard route (shows referral code and input to link referral)
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

    // Prevent adding another referrer if already referred
    if (user.referredBy) {
        return res.send('You have already been referred by someone.');
    }

    try {
        // Find the referrer by referral code
        const referrer = await User.findOne({ referralCode: referrerCode });
        if (!referrer) {
            return res.send('Invalid referral code.');
        }

        // Link the user to the referrer
        user.referredBy = referrerCode;
        referrer.referredUsers.push(user.referralCode);

        // Save both user and referrer data
        await user.save();
        await referrer.save();

        console.log(`User ${user.name} referred by ${referrer.name} successfully.`);
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error linking referral:', err);
        res.send('An error occurred while linking the referral.');
    }
});  

// Logout route
app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
