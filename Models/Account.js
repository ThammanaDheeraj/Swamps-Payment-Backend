const User=require('../Models/User');
const mongoose=require('mongoose');

const accountSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    accountNumber:{
        type:String,
        required:true,
        unique:true
    },
    balance:{
        type:Number,
        required:true
    },
    branch:{
        type:String,
        required:true,
    },
    phonenumber:{
        type:String
    },
    primary:{
        type:Boolean
    }
},{timestamps:true});

const Account=mongoose.model("Account",accountSchema);
module.exports=Account;