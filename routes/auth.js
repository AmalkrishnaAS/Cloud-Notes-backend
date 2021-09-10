const mongoose=require('mongoose')
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router()
// const mongoose=require('mongoose')
const {Schema}=mongoose
const User=require('../models/User');
const { response } = require('express');
//create a user using: POST "/api/auth/createuser".doesnt require login
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
  let user=await User.findOne({email:req.body.email})
  if(user)
  {
    return res.status(400).json({error:"Email already exists"})
  }
  user=await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })
//   .then(user => res.json(user))
//   .catch(err=>{console.log(err);
// res.json({error:"Email already exists",message:err.message})})
res.json(user)
  

})
module.exports =router;