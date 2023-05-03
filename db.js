// this is the part where we connect to the mongo db database

const mongoose = require('mongoose');
require('dotenv').config()

// const mongoURL="mongodb://127.0.0.1:27017/Notebook_app";
const mongoURL=process.env.ATLUS_URL;
// if the mongodb atlus connection string's password contains any special charecter then the password should converted into percent encoding
 
// console.log(mongoURL)

const connectToMOngo=()=>{
   mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
   }).then(()=>console.log("connection success with cloud")).catch(err=>console.error('not connected',err))
}

module.exports=connectToMOngo;