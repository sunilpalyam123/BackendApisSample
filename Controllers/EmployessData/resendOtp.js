var joi = require('@hapi/joi');
var User_Model = require('../../app/Model/UserModel');
var { SendOtpMail } = require('../../Controllers/sendMail');

const { response } = require('../../app');

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

module.exports.ResendOTP = async function ResendOTP(req, res) {
    try {
        var params = req.body;
        var Validate_Data = joi.object({
            emailID: joi.string().strict().email().required()
        });
        var result = Validate_Data.validate(params);
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message });
        }

        var checking_user = await User_Model.findOne({
            Email: params.emailID
        });

        if (!checking_user) {
            return res.json({ response: 0, message: "User Not found" })
        }
        else {
            var otp = generateOTP();
            var otpExpiry = Date.now() + 5 * 60 * 1000;

            var updateData = await User_Model.updateOne({
                Email: params.emailID
            }, {
                $set: {
                    otp: otp, otpExpiry: otpExpiry
                }
            }
            );
            if (updateData.modifiedCount > 0) {
                await SendOtpMail(params.emailID, otp)
                return res.json({ response: 3, message: "Otp Sent to email" })
            } else {
                return res.json({ response: 0, message: "Failed to update Otp" })
            }
        }

    }
    catch (error) {
        console.log("try catch error", error)
        return res.json({ response: 0, message: "try catch error " });
    }
}