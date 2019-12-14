// requiring the necessary modules
const http = require('http');
const bcrypt = require('bcrypt');

const mongoose = require("mongoose");

const hostname = '192.168.1.202';
const port = 3000;

const server = http.createServer((req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// load User and UserProfile Models
const User = require("./models/User");
const UserInfo = require("./models/UserInfo");

mongoose.connect('mongodb://localhost:27017/creaftdb', {useNewUrlParser:true});

var db = mongoose.connection;

db.once('open', function(){
    console.log('Database connection established')

    User.find({ username: 'nixramirez'}, function (error, documents){
        console.log(documents)
    })
}); 