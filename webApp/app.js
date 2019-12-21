// set server
const express = require('express');
const app = express();
app.set('port', process.env.PORT || 3000);

// specify root for serving static files (i.e. images, CSS, JS files)
//can have multiple static assets directories. this one's the customer directory
app.use(express.static(__dirname + '/client/customer'));

// require modules
const mongoose = require("mongoose");
const formidable = require("formidable");
const bcrypt = require('bcrypt');

// load User and UserProfile Models
const User = require("./models/User");
const UserInfo = require("./models/UserInfo");

// ========================================================================================================================================
// Database - move to another file if sufficiently large (i.e. spanning 20+ lines of code) 
// ========================================================================================================================================

//connecting to the database
mongoose.connect('mongodb://localhost/creaftdb', {useUnifiedTopology: true, useNewUrlParser:true});

//storing the connection in a variable
var db = mongoose.connection;
// log an error to the console if there is a database connection error
db.on('error', function (err) {
    console.log('connection error', err);
    });

// display all db content, once logged into the console
db.once('open', function(){
    console.log('Database connection established');

    User.find({}, function (error, documents){
        console.log(documents)
    })
});

// ========================================================================================================================================
// Route Handlers - Database - move to another file if sufficiently large (i.e. spanning 20+ lines of code) 
// ========================================================================================================================================

//homepage
app.get('/', function (req,res) {
    res.sendFile(__dirname + '/client/customer/index.html');
});

//dummySignup
app.get('/dummySignup', function (req,res) {
    res.sendFile(__dirname + '/client/customer/dummySignup.html');
});

//dummySignup submission, saves user to DB as admin by default, hashes password, then redirects to homepage
app.post('/signUpSubmission', function (req,res) {
    const form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {

        bcrypt.hash(fields.password, 10, function(err, hash) {
            const newUser = new User({ accountType: 'admin', username: fields.username, email: fields.email, password: hash});
            newUser.save(function (err) {if (err) return handleError(err);});
            console.log("User Saved to DB")
          });
    });
    res.redirect('/');
    
});
// ========================================================================================================================================
// Error Handling
// ========================================================================================================================================

app.use(function (req, res, next) {
    res.status(404);
    res.send('404 error')
});

//500 response
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.send('500 Error')
});

// setting up server
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port'));
});