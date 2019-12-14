const mongoose = require("mongoose");

// load User and UserProfile Models
const User = require("../models/User");
const UserInfo = require("../models/UserInfo");

mongoose.connect('mongodb://localhost:27017/creaftdb', {useNewUrlParser:true});

var db = mongoose.connection;

db.once('open', function(){
    console.log('Database connection established')
    var nicole = new User( {accountType: 'admin', username: 'nixramirez', email: 'nixramirez@gmail.com', password: 'y0urc@1L1234'});
   
    nicole.save(function(err,nicole){
        if (err) return console.error(err)
    })

    User.find({ username: 'nixramirez'}, function (error, documents){
        console.log(documents)
    })
}); 

