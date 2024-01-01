const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
//const handlebars = require('handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const {selectOption} = require('./config/customFunctions');
const fileUpload = require('express-fileupload');
const passport = require('passport');

console.log(typeof hbs); // Check the type of handlebars


const app = express();
const port = 2010;
var globalVariables = (req, res, next) => {
  res.locals.success_message = req.flash('success-message');
  res.locals.error_message = req.flash('error-message');        
  
  next();
}


async function connectToDB() {
    mongoose.connect("mongodb://127.0.0.1:27017/CMS", { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log('Connected to MongoDB');
        // Your database operations here
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
      });
    }
connectToDB();


/* Configure express*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


//app.use(methodOverride('_method'));

// Flash and session
app.use(session({
  secret: 'anysecret',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());

/* Passport Initialize */
app.use(passport.initialize());
app.use(passport.session());

app.use(globalVariables);

/* File Upload Middleware*/
app.use(fileUpload());


//Setup View Engine To Use Handlebars 

app.engine('handlebars',  hbs.engine({defaultLayout: 'default', runtimeOptions:{allowedProtoPropertiesByDefault: true, allowProtoMethodsByDefault:true},  helpers: {select: selectOption}}));
app.set('view engine' , 'handlebars');

/* Method Override Middleware*/
app.use(methodOverride('newMethod'));


// routes
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);



app.listen(port, ()=> {
    console.log(`server is running on ${port}`);
});