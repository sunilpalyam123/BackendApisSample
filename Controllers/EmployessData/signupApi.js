var joi = require('@hapi/joi');
var User_Model = require('../../app/Model/UserModel');
var bcrypt = require('bcrypt');
var { SendOtpMail } = require('../../Controllers/sendMail');

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports.SignUpApi = async function SignUpApi(req, res) {
    try {
        var params = req.body;
        var Validate_Data = joi.object({
            emailID: joi.string().strict().email().required(),
            password: joi.string().strict().min(6).required()
        });

        var result = await Validate_Data.validate(params);
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message });
        }
        var checking_User = await User_Model.findOne({
            Email: params.emailID
        });
        if (checking_User) {
            return res.json({ response: 0, message: "User Already Exists" })
        } else {
            var otp = generateOTP();
            var hasedPassword = await bcrypt.hash(params.password, 10)

            var create_new_User = await User_Model.insertMany([{
                EmployeeID: "EID@" + new Date().getTime().toString(),
                Email: params.emailID,
                Password: hasedPassword,
                otp: otp,
                otpExpiry: Date.now() + 5 * 60 * 1000,
                timeStamp: new Date().getTime().toString()
            }]);

            if (create_new_User.length > 0) {
                await SendOtpMail(params.emailID, otp)
                return res.json({ response: 3, message: "Signup Successfully,OTP sent to mail" })
            } else {
                return res.json({ response: 0, message: "signup Failed" })
            }

        }

    }
    catch (error) {
        console.log("try catch error", error);
        return res.json({ response: 0, message: "try catch error" })
    }
}