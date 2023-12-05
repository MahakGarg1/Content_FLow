const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
//const handlebars = require('handlebars');

console.log(typeof hbs); // Check the type of handlebars


const app = express();
const port = 2005;


async function connectToDB() {
    mongoose.connect("mongodb://127.0.0.1:27017/local/ContentFlow", { useNewUrlParser: true, useUnifiedTopology: true })
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

/* Setup View Engine To Use Handlebars 
app.engine('handlebars', handlebars({defaultLayout: 'default'}));
app.set('view engine' , 'handlebars'); */
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