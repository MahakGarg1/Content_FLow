const Post = require('../models/PostModel');
const Category = require('../models/CategoryModel');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');

module.exports = {

    index: async (req, res) => {

        const posts = await Post.find().lean();
        const categories = await Category.find().lean();

        res.render('default/index', { posts: posts, categories: categories });
    },
    loginGet: (req, res) => {
        res.render('default/login');
    },
    loginPost: (req, res) => {
        res.send("Login successfully");
    },
    registerGet: (req, res) => {
        res.render('default/register');
    },

    registerPost: (req, res) => {
        let errors = [];

        // Your validation logic

        if (!req.body.firstName) {
            errors.push({ message: 'First name is mandatory' });
        }
        if (!req.body.lastName) {
            errors.push({ message: 'Last name is mandatory' });
        }
        if (!req.body.email) {
            errors.push({ message: 'Email field is mandatory' });
        }
        if (req.body.password !== req.body.passwordConfirm) {
            errors.push({ message: 'Passwords do not match' });
        }

        if (errors.length > 0) {
            res.render('default/register', {
                errors: errors,
                errorMessage: 'Validation failed. Please check the form.',
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            });
        } else {
            User.findOne({ email: req.body.email }).then(user => {
                if (user) {
                    res.render('default/register', {
                        errors: errors,
                        errorMessage: 'Email already exists, try to login.',
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email
                    });
                } else {
                    const newUser = new User(req.body);
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                res.render('default/register', {
                                    successRedirect: '/login',
                                    successMessage: 'You are now registered.',
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    email: req.body.email
                                });
                            });
                        });
                    });
                }
            });
        }
    }

};