// this is the part where we connect to the mongo db database

const mongoose = require('mongoose');

const mongoURL="mongodb://127.0.0.1:27017/Notebook_app";

const connectToMOngo=()=>{
    mongoose.connect(mongoURL);
    console.log("Congratulations !! you are now connected to mongoDB");
}

module.exports=connectToMOngo;