const mongoose=require('mongoose')
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router()
// const mongoose=require('mongoose')
const {Schema}=mongoose
const User=require('../models/User');
const { response } = require('express');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const fetchuser=require('../middleware/fetchuser')
const JWT_SECRET='amalisagood$boy'



//ROUTE1:create a user using: POST "/api/auth/createuser".doesnt require login

router.post('/createuser',[
    body('email','Enter a valid email').isEmail(),
    body('name','Enter a valid name').isLength({min:3}),
    body('password','Enter a valid Password').isLength({min:5})
],async (req, res) => {
  console.log(req.body)
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    
    
  }
  try
  {
  let user=await User.findOne({email:req.body.email})
  if(user)
  {
    return res.status(400).json({error:"Email already exists"})
  }



  //generate hash


  const salt=await bcrypt.genSalt(10)
  secPass=await bcrypt.hash(req.body.password,salt)



  //create user
  user=await User.create({
    name: req.body.name,
    email: req.body.email,
    password: secPass
  })
//   .then(user => res.json(user))
//   .catch(err=>{console.log(err);
// res.json({error:"Email already exists",message:err.message})})
const data={
  user:{
    id:user.id
  }
}
const authtoken=jwt.sign(data,JWT_SECRET)
console.log(authtoken)
res.json({authtoken:authtoken})
  
}catch(error){
  console.error(error.message);
  res.status(500).send("Something went wrong")
}
})
//ROUTE2:Authenticate User using :POST "api/auth/login" no login required
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists()
],async (req, res) => {
  const errors=validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    
    
  }
  const {email,password}=req.body
  try
  {
    let user=await User.findOne({email})
    if(!user)
    {
      return res.status(400).json({error:"Please Login with correct credentials"})
    }
    const passwordCompare=await bcrypt.compare(password,user.password)
    if(!passwordCompare)
    {
      return res.status(400).json({error:"Please Login with correct credentials"})
    }
    const data={
      user:{
        id:user.id
      }
    }
    const authtoken=jwt.sign(data,JWT_SECRET)
    console.log(authtoken)
    res.json({authtoken:authtoken})

  }catch(error){
    console.error(error.message);
    res.status(500).send("Something went wrong")
  }

})


//ROUTE3:get logged in User details using :POST "api/auth/getuser"  login required

router.post('/getuser',fetchuser,async (req, res) => {
try {
  let  userid=req.user.id
  const user=await User.findById(userid).select("-password")
  res.send(user)
} catch (error) {
  console.error(error.message);
  res.status(500).send("Something went wrong")
}
})
module.exports =router;