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
        // Check if user already exists in the database
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            done(null, user); // User found, log them in
        } else {
            // If not, create a new user
            const referralCode = profile.id; // Use Google ID as referral code
            let referredBy = null;

            // Check if there's a referral code in the query parameters
            if (this.req.query.ref) {
                const referrer = await User.findOne({ referralCode: this.req.query.ref });
                if (referrer) {
                    referredBy = referrer.referralCode; // Set the referredBy to the referrer’s referral code
                }
            }

            user = await new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePic: profile.photos[0].value,
                referralCode, // Store referral code
                referredBy, // Store who referred the user
            }).save();
            done(null, user); // New user created and logged in
        }
    } catch (err) {
        console.error(err);
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
app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/callback', 
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
        // Fetch all users and their referral stats
        const users = await User.find({});
        const dashboardData = await Promise.all(users.map(async user => {
            const referredCount = await User.countDocuments({ referredBy: user.referralCode });
            return {
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                referralCode: user.referralCode,
                referredCount,
            };
        }));

        // Render a dashboard with user data
        res.send(`
            <h1>Referral Dashboard</h1>
            <table border="1" cellpadding="10">
                <tr>
                    <th>Profile Picture</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Referral Code</th>
                    <th>Referred Users</th>
                </tr>
                ${dashboardData.map(user => `
                    <tr>
                        <td><img src="${user.profilePic}" alt="Profile Picture" style="width: 50px; height: 50px; border-radius: 25px;"/></td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.referralCode}</td>
                        <td>${user.referredCount}</td>
                    </tr>
                `).join('')}
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
