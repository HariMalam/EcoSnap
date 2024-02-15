const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const User = require('./models/user');
const Form = require('./models/form');

const app = express();

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecosnap';
mongoose.connect(mongoURI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB!');
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));

const secretKey = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: false,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

require('./passport-setup');


app.get('/', (req, res) => {
    if (req.session.email != null) {
        console.log(req.session.name + " - view dashboard");
        res.render('index', { pic: req.session.pic });
    } else {
        res.render('login');
    }
});

app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    console.log(req.session.name + " - view profile");
    res.render('profile', { name: req.session.name, email: req.session.email, pic: req.session.pic, userId: req.session.userId });

});


app.get('/history', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/');
        }

        req.session.history = await Form.find({ userId: req.session.userId }).sort({ createdAt: 'desc' });;
        console.log(req.session.name + " - view history");
        res.render('history', { history: req.session.history, pic: req.session.pic });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).send('Error fetching history');
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'views/uploads/')
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname.split('.')[0] + '-' + uniqueSuffix + path.extname(file.originalname)); // Original filename with timestamp and extension
    }
});


app.get('/upload', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    console.log(req.session.name + " - view upload");
    res.render('upload', { pic: req.session.pic });
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    req.session.form = new Form({
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        district: req.body.district,
        state: req.body.state,
        path: req.file.filename,
        userId: req.user.id
    });

    try {
        await req.session.form.save();
        console.log(req.session.userId + ' - data uploaded successfully');
        res.redirect('/');
    } catch (error) {
        console.error('Error saving image path:', error);
        res.status(500).send('Error saving image path');
    }
});

app.get('/editprofile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('editprofile', { pic: req.session.pic, name: req.session.name });
});

app.use(express.urlencoded({ extended: true }));

app.post('/editprofile', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    try {
        req.session.existingUser = await User.findOne({ userId: req.user.id });
        if (!req.session.existingUser) {
            return res.status(404).send('User not found');
        }
        if (req.body.name !== req.session.existingUser.displayName) {
            await User.findOneAndUpdate({ userId: req.session.userId }, { displayName: req.body.name });
            req.session.newname = req.body.name;
            console.log(req.session.name + " is changed name to " + req.session.newname);
            req.session.name = req.session.newname;
        }
        res.redirect("/profile");
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Error updating user profile');
    }
});


app.post('/delete', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    try {
        req.session.existingEntry = await Form.findOne({ _id: req.body.entry });
        if (!req.session.existingEntry) {
            return res.status(404).send('Entry not found');
        }
        await Form.deleteOne({ _id: req.body.entry });
        console.log(req.session.name + " - data deleted \n" + req.body.entry) ;
        res.redirect("/history");
    } catch (error) {
        console.error('Error deleting entry:', error);
        res.status(500).send('Error deleting entry');
    }
});


app.get('/success', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    console.log(req.user.displayName + " - Login Successfully");
    req.session.existingUser = await User.findOne({ userId: req.user.id });

    if (req.session.existingUser) {
        req.session.name = req.session.existingUser.displayName;
        req.session.email = req.session.existingUser.email;
        req.session.pic = req.session.existingUser.profilePic;
        req.session.userId = req.user.id;
        return res.redirect('/');
    }

    req.session.newUser = new User({
        displayName: req.user.displayName,
        email: req.user.emails[0].value,
        profilePic: req.user.photos[0].value,
        userId: req.user.id
    });

    try {
        await req.session.newUser.save();
        req.session.name = req.user.displayName;
        req.session.email = req.user.emails[0].value;
        req.session.pic = req.user.photos[0].value;
        req.session.userId = req.user.id;
        return res.redirect('/');
    } catch (error) {
        console.error('Error saving user to database:', error);
        res.status(500).send('Something went wrong!');
    }
});

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }), (req, res) => {
    res.redirect('/success');
});
app.get('/logout', (req, res) => {
    console.log(req.session.name + " - Logout successfully");
    req.logout(function (err) {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Error during logout');
        }
        req.session.name = null;
        req.session.email = null;
        req.session.pic = null;
        req.session.destroy();
        res.redirect('/');
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});