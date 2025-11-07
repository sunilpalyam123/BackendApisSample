var joi = require('@hapi/joi');
var User_Model = require('../../app/Model/UserModel');
var fs = require('fs');
var path = require('path');
var RandomGenerate_password = require('generate-password');

module.exports.ProfileUpdate = async function ProfileUpdate(req, res) {
    try {
        // var params = req.body;

        var params = JSON.parse(req.body.updateData);
        if (!params.joiningDate || params.joiningDate === "") {
            delete params.joiningDate; // default Date.now() use avuthundi
        }
        var Validate_Data = joi.object({
            emailID: joi.string().strict().email().required(),
            employeeName: joi.string().strict().required(),
            role: joi.string().strict().required(),
            gender: joi.string().valid("Male", "Female"),
            phoneNumber: joi.string().strict().required(),
            salary: joi.number().strict().min(0).default(0),
            DepartMent: joi.string().strict().optional().allow(""),
            joiningDate: joi.date().optional()


        });

        var result = Validate_Data.validate(params);
        if (result.error) {
            res.statusCode = 400;
            return res.json({ response: 0, message: result.error.details[0].message })
        }

        var checking_User = await User_Model.findOne({
            Email: params.emailID
        });

        if (!checking_User) {
            return res.json({ response: 0, message: "User Not Found" });
        }


        console.log(req.files);
        if (req.files && req.files.profilePic) {
            var file = req.files.profilePic;
            //Unique file name Generarte
            var date = new Date();

            var randomid = RandomGenerate_password.generate({
                length: 5,
                lowercase: true,
                uppercase: true,
                symbols: false,
                numbers: true,
                excludeSimilarCharacters: true
            });

            var ext = path.extname(file.name);
            var uniqueName = "CLT@" + "_" + date.getTime() + randomid + ext;

            var setpath = "./public/images/profilePic/" + uniqueName;
            var dbpath = "/images/profilePic/" + uniqueName;

            file.mv(setpath, async (err) => {
                if (err) {
                    return res.json({ response: 0, message: "Something Went Wrong While Uploading" })
                } else {
                    var oldFile = checking_User.profilePic;
                    var updateData = await User_Model.updateOne({
                        Email: params.emailID
                    },
                        {
                            $set: {
                                EmployeeName: params.employeeName,
                                Role: params.role,
                                Gender: params.gender,
                                PhoneNumber: params.phoneNumber,
                                Salary: params.salary,
                                DepartMent: params.DepartMent,
                                JoiningDate: params.joiningDate,
                                profilePic: dbpath
                            }
                        });

                    if (updateData.modifiedCount > 0) {
                        //Update Success-Remove Old File
                        const filePath = "./public" + oldFile;
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error("Error deleting old profile:", err.message);
                            } else {
                                console.log("Old profile file deleted successfully");
                            }
                        });
                        return res.json({ response: 3, message: "Profile Update Successfully" })
                    }
                    else {
                        //Update Failed - remove Newly Updated file.
                        fs.unlink(setpath, (err) => {
                            if (err) {
                                console.error("Error deleting new file:", err.message);
                            } else {
                                console.log("New file deleted successfully");
                            }
                        });
                        return res.json({ response: 0, message: "Profile Update Failed" })

                    }
                }
            });
        } else {
            return res.json({ resonse: 0, message: "Please Pass Profile Pic" })
        }


    }
    catch (error) {
        console.log("Try catch error", error);
        return res.json({ response: 0, message: "try catch error" })
    }
}