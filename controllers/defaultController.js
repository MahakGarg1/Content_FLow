const Post = require('../models/PostModel');
const Category = require('../models/CategoryModel');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');

module.exports = {

    index:  async (req, res) => {
        
        const posts = await Post.find().lean();
        const categories = await Category.find().lean();
        
        res.render('default/index', {posts: posts, categories: categories});
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
    
    registerPost: (req, res ) => {
       // res.send("Registered Successfully");
       let errors = [];

       if (!req.body.firstName){
        errors.push({message: 'First name is mandatory'});
       }
       if (!req.body.lastName){
        errors.push({message: 'Last name is mandatory'});
       }
       if (!req.body.email){
        errors.push({message: 'Email field is mandatory'});
       }
       if (req.body.password != req.body.passwordConfirm){
        errors.push({message: ' Password do not match'});
       }

       if(errors.length > 0){
        res.render('default/register',{
         errors : errors,
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         email: req.body.email
});
       }
       else {
        User.findOne({ email: req.body.email}).then( user =>{
            if(user){
                req.flash('error-message','Email already exists, try to login');
                res.redirect('/login');
            }
            else{
                const newUser = new User(req.body);
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        newUser.password = hash;
                        newUser.save().then(user => {
                            req.flash('success-message', 'You are now registered');
                            res.redirect('/login')
                        });
                    });
                });
            }
        })
       }
    }
};