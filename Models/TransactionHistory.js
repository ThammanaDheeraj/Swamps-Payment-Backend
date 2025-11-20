const Account=require('../Models/Account');
const mongoose=require('mongoose');

const TransactionhistorySchema=new mongoose.Schema({
    senderId:{
        type:String,
        required:true,
    },
    receiverId:{
        type:String,
        required:true,
    },
    money:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true
    }
},{timestamps:true});

const Transactionhistory=mongoose.model("TransactionHistory",TransactionhistorySchema);
module.exports=Transactionhistory;