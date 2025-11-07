var mongoose = require('mongoose');
var db = require('../../app/Model/databaseconnection');
const { required } = require('joi');
var schema = mongoose.Schema;

var EmployeeSchema = new schema({
    EmployeeID: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    EmployeeName: {
        type: String,
        required: false,
        default: ""
    },
    Role: {
        type: String,
        required: false,
        default: ""
    },
    Gender: {
        type: String,
        required: false,
        default: ""
    },
    Email: {
        type: String,
        required: false,
        default: ""
    },
    Password: {
        type: String,
        required: false,
        default: ""
    },
    PhoneNumber: {
        type: String,
        required: false,
        default: ""
    },
    Salary: {
        type: Number,
        required: false,
        default: 0
    },
    DepartMent: {
        type: String,
        required: false,
        default: ""
    },
    JoiningDate: {
        type: Date,
        required: false,
        default:new Date()
    },
    otp: {
        type: String,
        required: false,
        default: ""
    },
    otpExpiry: {
        type: String,
        required: false,
        default: ""
    },
    profilePic: {
        type: String,
        required: false,
        default: ""
    },
    timeStamp: {
        type: String,
        required: false,
        default: new Date().getTime().toString()
    },
    isVerified: {
        type: Boolean,
        required: false,
        default: false   
    }

})
db.connection();
module.exports = mongoose.model("data", EmployeeSchema)