const express = require('express');
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
// for making password to hash value +salt + paper
const bcrypt = require('bcryptjs');
// for json web token authentication
var jwt = require('jsonwebtoken');
// importing fetchUser middleware
const fetchUser=require("../middleware/fetchUser");

// for accessing the env file 
require('dotenv').config({path: '.env'})

// const jwt_secret = process.env.JWT_SECURITY;
const jwt_secret = "secret@password#p$9a$7r$3i$5c$6h$9a$2y$626";

const router = express.Router();

// ROUTE 1 :  create a user using POST "/api/auth/createUser".Doesn't  reqire login
router.post("/createUser", [
  // setting all the validations 
  body('name', "enter a valid name").isLength({ min: 3 }),
  body('email', "enter a valid email").isEmail(),
  body('password', "password must be atlist 8 character").isLength({ min: 8 })
], async (req, res) => {
  let success=false;

  // coppied from the express-validation documentation // if there are any errors return bad request.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success,  errors: errors.array() });
  }

  // checking if there exhists same email user
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({success,  error: " Sorry The User Is Already Exhists" })
  }

  // for exception handeling errors
  try {
    
    // generating bcript salt
    const salt=await bcrypt.genSalt(10);
    // storing the (password with the salt) and making the hash value password with the help of bcrypt
    Secured_password=await bcrypt.hash( req.body.password , salt);

    // for saving the given data to the mongoDB collections
    user = await User.create({
      name: req.body.name,
      password: Secured_password,
      email: req.body.email
    })

    // making the id of an user as a unique value for generating unique token 
    const data={
      user :{
        id:user.id
      }
    }
    // jwtData will return a token for that particular data for authentication
    const authentication_token= await jwt.sign(data , jwt_secret);
    success=true;
    res.json({success, authentication_token});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

// ROUTE 2 :   Authenticate an user using POST "/api/auth/login".Doesn't  reqire login

router.post("/login", [
  // setting all the validations 
  body('email', "enter a valid email").isEmail(),
  body('password', "password can't be blank and must have at list 8 charecters ").isLength({ min: 8 }).exists()
], async (req, res) => {
  let success=false;
  // coppied from the express-validation documentation // if there are any errors return bad request.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email , password}=req.body;
  try {
    // finding the requested email to the database
    let user=await User.findOne({email});
    // if requested email doesn't exists
    if(!user) return res.status(400).json({success , error:"Please Try To LogIn With Correct Credentials"});

    // comparing the requested password to the database password
    const password_compare=await bcrypt.compare(password,user.password);
    // if requested password is not matched to the DB password the password_compare returns false
    if(!password_compare)return res.status(400).json({success , error:"Please Try To LogIn With Correct Credentials"});

     // making the id of an user as a unique value for generating unique token 
     const data={
      user :{
        id:user.id
      }
    }
    // jwtData will return a token for that particular data for authentication
    const authentication_token= await jwt.sign(data , jwt_secret);
    success=true;
    res.json({success,authentication_token});
    

  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }

});

// ROUTE 3 : get logged in user detail endpoint using POST "/api/auth/getUser". reqired login..
router.post("/getUser", fetchUser , async (req, res) => {
try {
  
  userID=req.user.id;
  // finding the user details except password (  .select("-password")  ) by using the user id 
  const user=await User.findById(userID).select("-password");
  res.send(user);  

} catch (error) {
  console.error(error.message);
  res.status(500).send("internal server error");
}

});

module.exports = router;