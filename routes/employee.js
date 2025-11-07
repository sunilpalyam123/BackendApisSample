var express = require('express');
var router = express();
//var upload = require("../app/configFiles/multerConfig.js"); // 👈 multer config import

router.use(express.json());

var expressfileupload = require('express-fileupload')
router.use(
    expressfileupload({
        limits: { fileSize: 100 * 1024 * 1024 },
    })
);



//Signup Api
var SignUpApi = require('../Controllers/EmployessData/signupApi');
router.post('/signup',(req,res) =>{
    SignUpApi.SignUpApi(req,res);
});


//VerifyOTP
var VerifyOTP = require('../Controllers/EmployessData/verifyOtp');
router.post('/verifyOtp',(req,res) =>{
    VerifyOTP.VerifyOTP(req,res);
});

//Resend OTP
var ResendOTP = require('../Controllers/EmployessData/resendOtp');
router.post('/resendOtp',(req,res) =>{
    ResendOTP.ResendOTP(req,res);
});

//Login Api
var Login = require('../Controllers/EmployessData/login');
router.post('/login',(req,res) =>{
    Login.LoginApi(req,res);
});

//Update Profile
var updateProfile = require('../Controllers/EmployessData/profileUpdateApi');
router.put('/profileUpdate', (req, res) => {
    updateProfile.ProfileUpdate(req, res);
});

// var profileController = require('../Controllers/EmployessData/singlefileUpload.js');
// // Single file upload API
// router.put("/profileUpdate", upload.single("profilePic"), profileController.ProfileUpdate);

//Fetch Api
var fetchApi = require('../Controllers/EmployessData/fetchApi.js');
router.post('/fetch', (req, res) => {
    fetchApi.FetchData(req, res);
});

//Delete Api
var deleteApi = require('../Controllers/EmployessData/deleteApi.js');
router.delete('/delete', (req, res) => {
    deleteApi.DeleteApi(req, res);
});



module.exports = router;