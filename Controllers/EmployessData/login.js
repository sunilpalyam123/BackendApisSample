var joi = require('@hapi/joi');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var User_Model = require('../../app/Model/UserModel');
const { response } = require('../../app');

const JWT_SECRET = "SunilPalyam";


module.exports.LoginApi = async function LoginApi(req, res) {
    try {
        var params = req.body;
        var Validate_Data = joi.object({
            emailID: joi.string().strict().email().required(),
            password: joi.string().strict().min(6).required()
        });
        var result = Validate_Data.validate(params);
        if (result.error) {
            res.statusCode = 400;
            return res.json({ resoonse: 0, message: result.error.details[0].message });
        }

        var checking_User = await User_Model.findOne({
            Email: params.emailID
        });

        if (!checking_User) {
            return res.json({ response: 0, message: "EmailId does not Exists" })
        }



        var match = await bcrypt.compare(params.password, checking_User.Password);
        if (!match) {
            return res.json({ response: 0, message: "Incorrect Password" })
        }
        var accessToken = jwt.sign({}, JWT_SECRET, { expiresIn: '1hr' });
        if (accessToken) {
            if (!checking_User.isVerified) {
                return res.json({ response: 0, message: "Please verify OTP before login" });
            } else {
                return res.json({ response: 3, message: "Login Success", accessToken })
            }

        }
        else {
            return res.json({ response: 0, message: "Login Failure" });
        }

    }
    catch (error) {
        console.log("try catch error", error);
        return res.json({ response: 0, message: "try catch error" })
    }
}