require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'yourSecretKey', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/yourdbname', { // Replace 'yourdbname' with your actual database name
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// User schema and model
const UserSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    email: String,
    profilePic: String,
    referralCode: { type: String, unique: true }, // Unique referral code
    referredBy: String, // Field to store who referred this user
});

const User = mongoose.model('User', UserSchema);

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ['profile', 'email'], // Ensure this is included
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists in the database by Google ID
        let user = await User.findOne({ googleId: profile.id });

        // If user does not exist, treat them as a new user and create a new entry
        if (!user) {
            console.log('No existing user, creating new user...');

            const referralCode = profile.id;  // Use Google ID as the referral code
            let referredBy = null;  // Initialize referredBy as null

            // Check for referral code in the query parameters
            if (profile._json.sub) {
                const queryRef = profile._json.sub; // Extract referral code from profile

                // Check if a user exists with the given referral code
                const referrer = await User.findOne({ referralCode: queryRef });
                if (referrer) {
                    referredBy = referrer.referralCode; // Set referredBy to the referrer's Google ID
                }
            }

            user = await new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePic: profile.photos[0].value, // Store profile picture URL
                referralCode,  // Store referral code
                referredBy     // Store who referred the user, if applicable
            }).save();
            
            console.log('New user created:', user);
        } else {
            console.log('Existing user found:', user);
        }

        done(null, user); // Log the user in, whether they're new or existing
    } catch (err) {
        console.error('Error in Google Strategy:', err);
        done(err, null);
    }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

// Routes
app.get('/auth/google', (req, res, next) => {
    // Append the referral code to the Google authentication URL if it exists
    const ref = req.query.ref;
    if (ref) {
        return passport.authenticate('google', { scope: ['profile', 'email'], state: ref })(req, res, next);
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/auth/google/callback', 
    (req, res, next) => {
        // Retrieve the referral code from the state parameter
        const referrerCode = req.query.state;
        if (referrerCode) {
            req.referrerCode = referrerCode; // Store it for later use
        }
        next();
    },
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log('User Info:', req.user); // Log user info
        res.redirect('/dashboard'); // Redirect to dashboard after successful login
    }
);

// Home route (to test if server is running)
app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1><a href="/auth/google">Login with Google</a>');
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// Dashboard route to show users and referral stats
app.get('/dashboard', async (req, res) => {
    if (req.isAuthenticated()) {
        const { googleId, referralCode, name, email } = req.user;

        // Check how many users have been referred by this user
        const referredCount = await User.countDocuments({ referredBy: referralCode });

        // Render a dashboard with user data
        res.send(`
            <h1>Referral Dashboard</h1>
            <h2>Welcome, ${name}!</h2>
            <p>Email: ${email}</p>
            <p>Your Referral Link: <a href="http://localhost:3000/auth/google?ref=${referralCode}">http://localhost:3000/auth/google?ref=${referralCode}</a></p>
            <p>You have referred ${referredCount} user(s).</p>
            <table border="1" cellpadding="10">
                <tr>
                    <th>Profile Picture</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Referral Code</th>
                    <th>Referred Users</th>
                </tr>
                <tr>
                    <td><img src="${req.user.profilePic}" alt="Profile Picture" style="width: 50px; height: 50px; border-radius: 25px;"/></td>
                    <td>${name}</td>
                    <td>${email}</td>
                    <td>${referralCode}</td>
                    <td>${referredCount}</td>
                </tr>
            </table>
            <br/>
            <a href="/logout">Logout</a>
        `); 
    } else {
        res.redirect('/');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
