const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
//const handlebars = require('handlebars');
const flash = require('connect-flash');
const session = require('express-session');

console.log(typeof hbs); // Check the type of handlebars


const app = express();
const port = 2005;
var globalVariables = (req, res, next) => {
  res.locals.success_message = req.flash('success-message');
  res.locals.error_message = req.flash('error-message');        
  
  next();
}


async function connectToDB() {
    mongoose.connect("mongodb://127.0.0.1:27017/CMS/ContentFlow", { useNewUrlParser: true, useUnifiedTopology: true })
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

// Flash and session
app.use(session({
  secret: 'anysecret',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());
app.use(globalVariables);

//Setup View Engine To Use Handlebars 

app.engine('handlebars',  hbs.engine({defaultLayout: 'default'}));
app.set('view engine' , 'handlebars');


// routes
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);



app.listen(port, ()=> {
    console.log(`server is running on ${port}`);
});