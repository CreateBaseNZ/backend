//set server to localhost:3000
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);

// use bodyparser to read form data
var bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({extended: true}));

var db = require()
