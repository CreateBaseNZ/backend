// set server
const express = require('express');
const app = express();
app.set('port', process.env.PORT || 3000);

// specify root for serving static files (i.e. images, CSS, JS files)
//can have multiple static assets directories. this one's the customer directory
app.use(express.static('./client/customer'))

// require modules
const mongoose = require("mongoose");

// load User and UserProfile Models
const User = require("./models/User");
const UserInfo = require("./models/UserInfo");

//connecting to the database
mongoose.connect('mongodb://localhost/creaftdb', {useNewUrlParser:true});

//storing the connection in a variable
var db = mongoose.connection;

// ========================================================================================================================================
// Debugging the DB - delete later
// ========================================================================================================================================

// log an error to the console if there is a connection error
db.on('error', function (err) {
    console.log('connection error', err);
    });

// display users where name is nixramirez, once logged into the console
db.once('open', function(){
    console.log('Database connection established')

    User.find({ username: 'nixramirez'}, function (error, documents){
        console.log(documents)
    })
});

// ========================================================================================================================================
// Route Handlers
// ========================================================================================================================================

//homepage

app.get('/', function (req,res) {
    res.render('index');
});

// ========================================================================================================================================
// Error Handling
// ========================================================================================================================================

app.use(function (req, res, next) {
    res.status(404);
    res.render('404');
});

//500 response
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// setting up server
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port'));
});