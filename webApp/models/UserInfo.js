const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Database Configuration
const mongoURI = require("../config/database").mongoURI;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Creating User Info Schema
const UserInfoSchema = new Schema ({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    firstName: {
        type: String
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String
    },
    shippingAddress: {
        streetNumber: {
            type: String
        },
        streetName: {
            type: String
        },
        suburb: {
            type: String
        },
        city: {
            type: String
        },
        postcode: {
            type: String
        },
        country: {
            type: String
        }
    }
});

// Exporting Schema

module.exports = UserInfo = conn.model("userInfo", UserInfoSchema)
