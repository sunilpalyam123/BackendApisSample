var joi = require('@hapi/joi');
var User_Model = require('../../app/Model/UserModel');
const { response } = require('../../app');

module.exports.FetchData = async function FetchData(req, res) {
    try {
        var params = req.body;
        var Validate_Data = joi.object({
            emailID: joi.string().strict().email().required().allow("All"),
            page: joi.number().integer().min(1).default(1),
            limits: joi.number().integer().max(100).default(10)
        });
        var result = Validate_Data.validate(params);
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }

        var { emailID, page, limits } = result.value;
        var skip = (page - 1) * limits;

        var checking_User, totalRecords;





        if (emailID == "All") {
            totalRecords = await User_Model.countDocuments({});

            // ✅ Apply pagination
            checking_User = await User_Model.find(
                {}, { otp: 0, otpExpiry: 0, Password: 0 }
            )
                .skip(skip)
                .limit(limits);

            // var checking_User = await User_Model.find({},{otp:0,otpExpiry:0,Password:0});
        } else {
            checking_User = await User_Model.findOne(
                { Email: emailID },
                { otp: 0, otpExpiry: 0, Password: 0 }
            );

            totalRecords = checking_User ? 1 : 0;
            // var checking_User = await User_Model.findOne({
            //     Email: params.emailID
            // },{otp:0,otpExpiry:0,Password:0})
        }

        if (!checking_User) {
            return res.json({ response: 0, message: "User not found" })
        }
        else {
            return res.json({
                response: 3,
                message: "User Data Fetched Successfully",
                page: page,
                limits: limits,
                totalRecords: totalRecords,
                totalPages: Math.ceil(totalRecords / limits),
                UserData: checking_User
            })
        }



    }
    catch {

    }
}