require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { v4: uuidv4 } = require('uuid'); // Import the uuid package to generate unique referral codes

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
mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true })
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
    referralCode: { type: String, unique: true }, // Unique referral code
    referredBy: String, // Field to store the referral code of who referred this user
    referredUsers: [{ type: String }] // Field to store the referral codes of users referred by this user
});

const User = mongoose.model('User ', UserSchema);

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        // Check if user already exists in the database by Google ID
        let user = await User.findOne({ googleId: profile.id });

        // If user does not exist, treat them as a new user and create a new entry
        if (!user) {
            console.log('No existing user, creating new user...');

            // Generate a unique referral code using uuid
            const referralCode = uuidv4();
            let referredBy = null;  // Initialize referredBy as null

            // Retrieve the referral code passed in the session (from the query parameter during login)
            const referrerCode = profile.referrerCode || null;

            // If there is a referral code in the state, check if a referrer exists
            if (referrerCode) {
                const referrer = await User.findOne({ referralCode: referrerCode });
                if (referrer) {
                    referredBy = referrer.referralCode; // Set referredBy to the referrer's referralCode
                }
            }

            // Save the new user with referral information
            user = await new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePic: profile.photos[0].value, // Store profile picture URL
                referralCode,  // Store the generated unique referral code
                referredBy,     // Store who referred the user, if applicable
                referredUsers: [] // Initialize referred users array
            }).save();

            console.log('New user created with referral:', user);
        } else {
            console.log('Existing user found:', user);
        }

        cb(null, user); // Log the user in, whether they're new or existing
    } catch (err) {
        console.error('Error in Google Strategy:', err);
        cb(err, null);
    }
}));

// Serialize and deserialize user
passport.serializeUser ((user, done) => {
    done(null, user.id);
});

passport.deserializeUser ((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err, null));
});

// Routes
app.get('/auth/google', (req, res, next) => {
    const ref = req.query.ref;
    if (ref) {
        // Store referral code in session to access it after Google authentication
        req.session.referrerCode = ref;
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Clear referral code from session after use
        if (req.session.referrerCode) {
            delete req.session.referrerCode;
        }
        res.redirect('/dashboard');
    }
);

// Home route (to test if server is running)
app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1><a href="/auth/google">Login with Google</a>');
 });

// Logout route
app.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
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

        // Query how many users this person has referred
        const referredUsers = await User.find({ referredBy: referralCode });

        // Render a dashboard with user data (plain HTML instead of JSX)
        const html = `
            <h1>Referral Dashboard</h1>
            <h2>Welcome, ${name}!</h2>
            <p>Email: ${email}</p>
            <p>Your Referral Link: <a href="http://localhost:3000/auth/google?ref=${referralCode}">http://localhost:3000/auth/google?ref=${referralCode}</a></p>
            <p>You have referred ${referredUsers.length} user(s).</p>
            <table border="1" cellpadding="10">
                <tr>
                    <th>Profile Picture</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Referral Code</th>
                    <th>Referred Users</th>
                </tr>
                ${referredUsers.map(user => 
                    `<tr>
                        <td><img src="${user.profilePic}" alt="Profile Picture" style="width: 50px; height: 50px; border-radius: 25px;"/></td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.referralCode}</td>
                        <td>${user.referredBy || 'N/A'}</td>
                    </tr>`).join('')}
            </table>
            <br/>
            <a href="/logout">Logout</a>
        `;
        res.send(html);
    } else {  
        res.redirect('/');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});