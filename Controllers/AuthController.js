const User=require('../Models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const signup= async (req,res)=>{
    const {fullname,email,password}=req.body;
    if(!fullname || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try{
        const existinguser=await User.findOne({email});
        if(existinguser){
            return res.status(400).json({message:"Email already exists"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password length must be atleast of 6 characters"});
        }
        const hashpassword=await bcrypt.hash(password,10);
        const newuser=new User({fullname,email,password:hashpassword});
        if(newuser){
            await newuser.save();
            return res.status(201).json({
                message:"User successfully resgistered",
                success:true,
                user:{
                    _id:newuser._id,
                    fullname,
                    email
                }
            });
        }
    }catch(err){
        return res.status(500)
        .json({
            message:"Internal Server Error",
            success:false
        })
    }
}

const login=async (req,res)=>{
    const {email,password}=req.body;
    if(!email || ! password){
        return res.status(400).json({message:"all fields are required"});
    }
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Please Register to continue"
            });
        }
        const hashedpassword=user.password;
        const success=await bcrypt.compare(password,hashedpassword);
        if(!success){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const payload={
            _id:user._id,
            email:user.email,
            fullname:user.fullname
        };
        const jwttoken=await jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );
        return res.status(200).json({
            message:"Login successful",
            success:true,
            jwttoken,
            email
        })
    }catch(err){
        return res.status(500)
        .json({
            message:"Internal Server Error",
            success:false
        })
    }
}

const updatePass=async (req,res)=>{
    const {_id}=req.user;
    const {password,newpassword,retypepassword}=req.body;
    if(!password || !newpassword || !retypepassword){
        return res.status(400).json({
            message:"All fields are required",
            success:false
        });
    }
    try{
        const user=await User.findById({_id});
        const success=await bcrypt.compare(password,user.password);
        if(!success){
            return res.status(400).json({
                message:"Password doesn't match"
            });
        }
        if(newpassword !== retypepassword){
            return res.status(400).json({
                message:"NewPassword and RetypePassword doesn't match",
                success:false
            });
        }
        const newhashpassword=await bcrypt.hash(newpassword,10);
        await User.updateOne({_id},{$set:{password:newhashpassword}});
        return res.status(200).json({
            message:"Password Updated Successfully",
            success:true
        });
    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        });
    }
}

module.exports={
    signup,
    login,
    updatePass
}