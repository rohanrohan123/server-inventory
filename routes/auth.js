const router =require("express").Router();
const User=require("../models/User.js")
const bcrypt=require('bcrypt')
// import bcrypt from 'bcrypt';


//Register

router.post("/register",async(req,res)=>{
    try {
        const salt=await bcrypt.genSalt(10);
        const hashPass=await bcrypt.hash(req.body.password,salt)
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:hashPass,
        });
        const user=await newUser.save();
        res.send(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
})
//Login
router.post("/login",async(req,res)=>{
    try {
        const user=await User.findOne({username:req.body.username});//find user from database
        !user && res.status(400).json("wrong user check the usernm");

        const validated=await bcrypt.compare(req.body.password,user.password);//comparing password
        !validated && res.status(400).json("wrong password!")

        const {password,...others}=user._doc;

        res.status(200).json(others);

    } catch (error) {
       res.status(500).json(error) 
    }
})

module.exports = router
