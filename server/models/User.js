const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// Database Configuration
const mongoURI = require("../config/database").mongoURI;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Create Schema

const UserSchema = new Schema({
    accountType: {
        type: String,
        required: [true, 'User type input required'],
        enum: ['Admin', 'User']
    },
    username: {
        type: String,
        required: [true, 'Username input required'],
        maxlength: 15
    },
    email: {
        type: String,
        required: [true, 'Email input required']
    },
    password: {
        type: String,
        required: [true, 'Password input required']
    }
});

// Hashing and Validating Passwords
UserSchema.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
;}

// Exporting into a model
module.exports = User = conn.model("users", UserSchema)