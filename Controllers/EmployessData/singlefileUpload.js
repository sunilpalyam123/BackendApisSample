var joi = require('@hapi/joi');
var User_Model = require('../../app/Model/UserModel');
var fs = require('fs');
var path = require('path');

module.exports.ProfileUpdate = async function ProfileUpdate(req, res) {
  try {
    // 1. Parse & validate body data
    var params = JSON.parse(req.body.updateData);

    if (!params.joiningDate || params.joiningDate === "") {
      delete params.joiningDate;
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
      return res.status(400).json({
        response: 0,
        message: result.error.details[0].message
      });
    }

    // 2. User exist check
    var checking_User = await User_Model.findOne({
      Email: params.emailID
    });

    if (!checking_User) {
      return res.json({ response: 0, message: "User Not Found" });
    }

    // 3. File check
    if (!req.file) {
      return res.json({ response: 0, message: "Please upload profile picture" });
    }

    // 4. Generate setpath & dbpath
    // Multer already saved file into ./public/uploads/
    var filename = req.file.filename; // multer generated filename
    var setpath = "./public/uploads/" + filename; // server path
    var dbpath = "/uploads/" + filename; // DB store path

    // 5. Update DB
    var oldFile = checking_User.profilePic;
    var updateData = await User_Model.updateOne(
      { Email: params.emailID },
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
      }
    );

    if (updateData.modifiedCount > 0) {
      // success → delete old file
      if (oldFile) {
        const oldFilePath = "./public" + oldFile;
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old profile:", err.message);
          } else {
            console.log("Old profile file deleted successfully");
          }
        });
      }
      return res.json({
        response: 3,
        message: "Profile Updated Successfully",
        filePath: dbpath
      });
    } else {
      // failed → remove new file also
      fs.unlink(setpath, (err) => {
        if (err) {
          console.error("Error deleting new file:", err.message);
        } else {
          console.log("New file deleted successfully");
        }
      });
      return res.json({ response: 0, message: "Profile Update Failed" });
    }

  } catch (error) {
    console.log("Try catch error", error);
    return res.json({ response: 0, message: "try catch error" });
  }
};


// var joi = require("@hapi/joi");
// var User_Model = require("../../app/Model/UserModel");

// module.exports.ProfileUpdate = async function (req, res) {
//   try {
//     var params = JSON.parse(req.body.updateData);

//     var Validate_Data = joi.object({
//       emailID: joi.string().email().required(),
//       employeeName: joi.string().required(),
//       role: joi.string().required(),
//       gender: joi.string().valid("Male", "Female"),
//       phoneNumber: joi.string().required(),
//       salary: joi.number().min(0).default(0),
//       DepartMent: joi.string().optional().allow(""),
//       joiningDate: joi.date().optional(),
//     });

//     var result = Validate_Data.validate(params);
//     if (result.error) {
//       return res
//         .status(400)
//         .json({ response: 0, message: result.error.details[0].message });
//     }

//     if (!req.file) {
//       return res.json({
//         response: 0,
//         message: "Please upload a profile picture",
//       });
//     }

//     // File paths (multer already saved file in ./public/images/profilePic/)
//     const filename = req.file.filename;
//     const setpath = "./public/images/profilePic/" + filename; // server side full path
//     const dbpath = "/images/profilePic/" + filename; // db & frontend path

//     await User_Model.updateOne(
//       { Email: params.emailID },
//       {
//         $set: {
//           EmployeeName: params.employeeName,
//           Role: params.role,
//           Gender: params.gender,
//           PhoneNumber: params.phoneNumber,
//           Salary: params.salary,
//           DepartMent: params.DepartMent,
//           JoiningDate: params.joiningDate,
//           profilePic: dbpath, // save dbpath in DB
//         },
//       }
//     );

//     return res.json({
//       response: 3,
//       message: "Profile Updated Successfully",
//       filePath: dbpath,
//     });
//   } catch (err) {
//     console.error("Error in ProfileUpdate:", err.message);
//     return res
//       .status(500)
//       .json({ response: 0, message: "Internal Server Error" });
//   }
// };


// var joi = require("@hapi/joi");
// var User_Model = require("../../app/Model/UserModel");

// module.exports.ProfileUpdate = async function (req, res) {
//   try {
//     var params = JSON.parse(req.body.updateData);

//     var Validate_Data = joi.object({
//       emailID: joi.string().email().required(),
//       employeeName: joi.string().required(),
//       role: joi.string().required(),
//       gender: joi.string().valid("Male", "Female"),
//       phoneNumber: joi.string().required(),
//       salary: joi.number().min(0).default(0),
//       DepartMent: joi.string().optional().allow(""),
//       joiningDate: joi.date().optional()
//     });

//     var result = Validate_Data.validate(params);
//     if (result.error) {
//       return res.status(400).json({ response: 0, message: result.error.details[0].message });
//     }

//     if (!req.file) {
//       return res.json({ response: 0, message: "Please upload a profile picture" });
//     }

//     // file path from multer
//     const dbpath = "/uploads/" + req.file.filename;

//     await User_Model.updateOne(
//       { Email: params.emailID },
//       { $set: { EmployeeName: params.employeeName, profilePic: dbpath } }
//     );

//     return res.json({ response: 3, message: "Profile Updated Successfully", filePath: dbpath });
//   } catch (err) {
//     console.error("Error in ProfileUpdate:", err.message);
//     return res.status(500).json({ response: 0, message: "Internal Server Error" });
//   }
// };
