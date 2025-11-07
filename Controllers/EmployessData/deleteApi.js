var joi = require('@hapi/joi');
var User_Model = require('../../app/Model/UserModel');
var fs = require('fs')
const { response } = require('../../app');
const { error } = require('console');

module.exports.DeleteApi = async function DeleteApi(req, res) {
    try {
        var params = req.body;
        var Validate_Data = joi.object({
            emailID: joi.string().strict().email().required()
        });
        var result = Validate_Data.validate(params);
        if(result.error) {
            res.statusCode = 400;
            return res.json({response:0, message:result.error.details[0].message})
        }
        var checking_User = await User_Model.findOne({
            Email:params.emailID
        });
        var oldFile = checking_User.profilePic;

        if(checking_User) {
            var deleteUser = await User_Model.deleteOne({
                Email:params.emailID
            });
            if(deleteUser.deletedCount>0) {
                if(oldFile){
                    var filePath = "./public" + oldFile;
                    fs.unlink(filePath, (err) => {
                        if (err) {
                        console.error("Error deleting profile pic:", err.message);
                    } else {
                        console.log("Profile pic deleted:", filePath);
                    }

                    })
                }
                return res.json({response:3,message:"Deleted Account Successfully"})
            }
            else {
                return res.json({response:0, message:"Deleted Account Failure"})
            }
        }
        else {
            return res.json({response:0, message:"User not found"})
        }
    } catch(error) {
        console.log("try catch error",error);
        return res.json({response:0 , message:"try catch error"})

    }
}