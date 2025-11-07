var mongoose = require('mongoose');
//var config = require('../ConfigFiles/config.json')
var dbconnections = {
    connection: function connectionDatabase() {
        mongoose.connect("mongodb+srv://sunilpalyam123:5B2U5IWOA7eu6X5T@cluster0.xkidd7b.mongodb.net/vinod?retryWrites=true&w=majority&appName=Cluster0",
             { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.set('strictQuery', true);
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function callback() {
            console.log("Mongodb is Connected successfully");
        });
    }
}
module.exports = dbconnections;

// var mongoose = require('mongoose');

// var dbconnections = {
//     connection: function connectionDatabase() {
//         mongoose.connect(process.env.MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });

//         mongoose.set('strictQuery', true);

//         var db = mongoose.connection;
//         db.on('error', console.error.bind(console, 'connection error:'));
//         db.once('open', function callback() {
//             console.log("Mongodb is Connected successfully");
//         });
//     }
// }

//module.exports = dbconnections;

