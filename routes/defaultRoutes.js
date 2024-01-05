const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const flash = require('connect-flash');

router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'default';

    next();
})

router.use(flash());

router.route('/')
.get( defaultController.index);

/*
// Defining Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email: email}).then(user => {
        if (!user) {
            return done(null, false, req.flash('error-message', 'User not found with this email.'));
        }

        bcrypt.compare(password, user.password, (err, passwordMatched) => {
            if (err) {
                return err;
            }

            if (!passwordMatched) {
                return done(null, false, req.flash('error-message', 'Invalid Username or Password'));
            }

            return done(null, user, req.flash('success-message', 'Login Successful'));
        });

    });
}));  */


passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            req.authErrorMessage = 'User not found with this email.';
            return done(null, false);
        }

        const passwordMatched = await bcrypt.compare(password, user.password);

        if (!passwordMatched) {
            req.authErrorMessage = 'Invalid Username or Password';
            return done(null, false);
        }

        req.authSuccessMessage = 'Login Successful';
        return done(null, user);
    } catch (error) {
        console.error(error);
        return done(error);
    }
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

/*passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
*/
passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

router.route('/login')
    .get(defaultController.loginGet)
    .post((req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/login',
            failureFlash: true,   // Enable flash messages for failure
            successFlash: true,
            session: true
        })(req, res, (err) => {
            if (req.authSuccessMessage) {
//res.render('success_view', { successMessage: req.authSuccessMessage });
req.session.successMessage = req.authSuccessMessage;
            } else if (req.authErrorMessage) {
                req.session.errorMessage = req.authErrorMessage;
                //res.render('error_view', { errorMessage: req.authErrorMessage });
            } else {
                next(err);
            }
        });
    }, defaultController.loginPost);






router.route('/register')
    .get(defaultController.registerGet)
    .post(defaultController.registerPost);


    router.route('/post/:id')
    .get(defaultController.getSinglePost)
    .post(defaultController.submitComment);


   /* router.get('/logout', (req, res) => {
        req.logOut();
        req.flash('success-message', 'Logout was successful');
        res.redirect('/');
    });  */
    router.get('/logout', (req, res) => {
        req.logOut();
        req.flash('success', 'Logout was successful');
        res.redirect('/');
    });



module.exports = router;