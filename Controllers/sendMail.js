var nodemailer = require('nodemailer');

module.exports.SendOtpMail = async function SendOtpMail(email,otp) {
//create Transporter
var transporter = nodemailer.createTransport({
    service:"gmail.com",
    secure:true,
    auth:{
        user:"sunilpalyam123@gmail.com",
       // pass:"yfwh lwiv fgae xcgq",
        pass:"oynr kybi egva rcst"
    }

});
//mail Options

var mailOptions = {
    from:"sunilpalyam123@gmail.com",
    to:email,
    subject:"Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes`
}
//send Mail

transporter.sendMail(mailOptions, function(error,info) {
    if(error) {
        console.log(error);
    } 
    else {
        console.log("Email Sent",info.response)
    }
});

}