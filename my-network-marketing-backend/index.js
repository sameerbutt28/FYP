
//FINAL BACKEND CODE 



// const express = require('express');
// const mongoose = require('mongoose');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const session = require('express-session');
// const { v4: uuidv4 } = require('uuid');
// const User = require('./models/User');
// require('dotenv').config();
// const cors = require('cors'); // Import CORS for cross-origin requests

// const app = express();
        
// // Middleware setup
// app.use(cors({
//     origin: 'http://localhost:5173', // React app's URL
//     credentials: true // Allows cookies and authorization headers
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'yourSecretKey',
//     resave: false,
//     saveUninitialized: true,
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => {
//     console.log('Connected to MongoDB');
// })
// .catch(err => {
//     console.error('MongoDB connection error:', err);
// });

// // Passport Google OAuth configuration
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     scope: ['profile', 'email'],
// }, async (accessToken, refreshToken, profile, cb) => {
//     try {
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//             const referralCode = uuidv4();
//             user = new User({
//                 googleId: profile.id,
//                 name: profile.displayName,
//                 email: profile.emails[0].value,
//                 profilePic: profile.photos[0].value,
//                 referralCode,
//                 referredBy: null,
//                 referredUsers: []
//             });
//             await user.save();
//             console.log('New user created:', user);
//         } else {
//             console.log('Existing user found:', user);
//         }
//         cb(null, user);
//     } catch (err) {
//         console.error('Error in Google Strategy:', err);
//         cb(new InternalOAuthError('Failed to obtain access token', err), null);
//     }
// }));

// // Serialize and deserialize user
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id)
//         .then(user => done(null, user))
//         .catch(err => done(err, null));
// });

// // Routes
// app.get('/', (req, res) => {
//     res.send('<h1>Welcome to the Referral System</h1><a href="/auth/google">Login with Google</a>');
// });

// // Google login route
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// // Google callback route
// app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
//     const user = req.user;
//     res.redirect(`http://localhost:5173/user-profile?name=${user.name}&email=${user.email}&referralCode=${user.referralCode}`);
// });

// app.get('/api/referred-users', async (req, res) => {
//     const { referralCode } = req.query;
//     console.log("Fetching referred users for referral code:", referralCode);
//     try {
//         const referredUsers = await User.find({ referredBy: referralCode });
//         console.log("Referred Users:", referredUsers);
//         res.json({ referredUsers });
//     } catch (error) {
//         console.error("Error fetching referred users:", error);
//         res.status(500).json({ error: "An error occurred" });
//     }
// });

// // Referral link submission route
// app.post('/referral/link', async (req, res) => {
//     const { referrerCode } = req.body;
//     try {
//         // You can add logic to link the referral code to the current user here
//         // For example, find the user by their session and update their referredBy field
//         const user = req.user; // This assumes the user is authenticated
//         if (!user) {
//             return res.status(403).json("User not authenticated");
//         }

//         // Update the current user's referredBy field with the provided referrerCode
//         user.referredBy = referrerCode;
//         await user.save();
//         res.json("Referral code linked successfully!");
//     } catch (error) {
//         console.error("Error linking referral code:", error);
//         res.status(500).json({ error: "Error linking referral code" });
//     }
// });

// // Payment route
// app.post('/referral/link', async (req, res) => {
//     const { referrerCode } = req.body;
//     const user = req.user; // This assumes the user is authenticated through Passport.js

//     if (!user) {
//         return res.status(403).json("User not authenticated");
//     }
  
//     try {
//         // Update the current user's referredBy field with the provided referrerCode
//         user.referredBy = referrerCode;
//         await user.save();
//         res.json("Referral code linked successfully!");
//     } catch (error) {
//         console.error("Error linking referral code:", error);
//         res.status(500).json({ error: "Error linking referral code" });
//     }
// });

// app.use(cors({
//     origin: 'http://localhost:5173', // Your React app's URL
//     credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// }));

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


















//TEMP BACKEND CODE
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

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: "User not authenticated" });
};

// Admin middleware
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.email === process.env.ADMIN_EMAIL) {
        return next();
    }
    res.status(403).json({ error: "Access denied" });
};

// Routes
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Referral System</h1><a href="/auth/google">Login with Google</a>');
});

// Google login route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(`http://localhost:5173/dashboard`);
});

// Fetch referred users
app.get('/api/referred-users', isAuthenticated, async (req, res) => {
    try {
        const { referralCode } = req.query;

        if (!referralCode) {
            return res.status(400).json({ error: "Referral code is required" });
        }

        const user = await User.findOne({ referralCode }).populate('referredUsers').exec();

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ referredUsers: user.referredUsers });
    } catch (error) {
        console.error("Error fetching referred users:", error);
        res.status(500).json({ error: "Error fetching referred users" });
    }
});

// Admin dashboard
app.get('/api/admin/dashboard', isAdmin, async (req, res) => {
    try {
        const users = await User.find().populate('referredUsers').exec();
        const formattedUsers = users.map(user => ({
            name: user.name,
            email: user.email,
            referralCode: user.referralCode,
            referredBy: user.referredBy,
            referredUsersCount: user.referredUsers.length,
            referredUsersList: user.referredUsers,
        }));

        res.json({ users: formattedUsers });
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        res.status(500).json({ error: "An error occurred while fetching user data" });
    }
});

// Referral linking
app.post('/referral/link', isAuthenticated, async (req, res) => {
    const { referrerCode } = req.body;
    try {
        const referrer = await User.findOne({ referralCode: referrerCode });

        if (!referrer) {
            return res.status(404).json({ error: "Invalid referral code" });
        }

        const user = req.user;

        if (user.referredBy) {
            return res.status(400).json({ error: "Referral code already linked" });
        }

        user.referredBy = referrer._id;
        referrer.referredUsers.push(user._id);
        await user.save();
        await referrer.save();

        res.json({ message: "Referral code linked successfully!" });
    } catch (error) {
        console.error("Error linking referral code:", error);
        res.status(500).json({ error: "Error linking referral code" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
