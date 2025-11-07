var joi = require('@hapi/joi');
var User_Model = require('../../app/Model/UserModel');


module.exports.VerifyOTP = async function VerifyOTP(req, res) {
    try {
        var params = req.body;
        var Validate_Data = joi.object({
            emailID: joi.string().strict().email().required(),
            otp: joi.string().strict().min(6).required()
        });
        var result = Validate_Data.validate(params);
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message });
        }
        var checking_User = await User_Model.findOne({
            Email: params.emailID
        })
        if (!checking_User) {
            return res.json({ response: 0, message: "User Not found" })
        }
        if (checking_User.otp !== params.otp) {
            return res.json({ response: 0, message: "Entered OTP is Wrong" })
        } else if (Date.now() > checking_User.otpExpiry) {
            return res.json({ response: 0, message: "OTP is timed out" })
        } else {
            checking_User.isVerified = true;
            await User_Model.updateOne(
                { Email: params.emailID },
                { $set: { isVerified: true } }
            );
            return res.json({ response: 3, message: "OTP Verified Successfully" })
        }

    }
    catch (error) {
        console.log("try catch error", error);
        return res.json({ response: 0, message: "try catch error" })

    }
}