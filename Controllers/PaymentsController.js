const User=require('../Models/User');
const Account = require('../Models/Account');
const TransactionHistory=require('../Models/TransactionHistory');
const mongoose=require('mongoose');

const CheckBalance=async (req,res)=>{
    const userId=req.user._id;
    try{
        const account=await Account.findOne({userId,primary:true});
        if(!account){
            return res.status(400).json({
                message:"Account Doesn't Exist",
                success:false
            });
        }
        const Details={
            fullname:account.fullname,
            accountNumber:account.accountNumber,
            balance:account.balance
        }
        return res.status(200).json({
            message:"Account Details are",
            Details
        });
    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
    }
}

const CreateAccount=async (req,res)=>{
    const id=req.user._id;
    const {fullname,accountNumber,balance,branch,phonenumber,primary}=req.body;
    if(!fullname || !accountNumber || !balance || !branch || !phonenumber || !primary){
        return res.status(400).json({
            message:"All fields are required",
            success:false
        })
    }
    try{
        const existNumber=await Account.findOne({accountNumber});
        if(existNumber){
            return res.status(400).json({
                message:"Account Already Exists",
                success:false
            })
        }
        const newaccount= new Account({fullname,userId:id,accountNumber,balance,branch,phonenumber,primary});
        await newaccount.save();
        return res.status(201).json({
            message:"Account Successfully Created",
            success:true
        })
    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        });
    }
}

const SendMoney=async(req,res)=>{
    const userAccount=req.account;
    const receiver=req.body.accountNumber;
    const money=Number(req.body.money);
    if(!money||money<=0){
        return res.status(400).json({message:"Invalid Amount"})
    } 
    try{
        if(receiver==userAccount.accountNumber){
            return res.status(400).json({
                message:"Money Can't be Trasferred",
                success:false
            })
        }
        console.log("Dheeraj");
        const receiveracc=await Account.findOne({accountNumber:receiver});
        if(!receiveracc){
            return res.status(400).json({
                message:"Receiver Account not exist",
                success:false
            })
        }
        if(money>userAccount.balance){
            const trans=new TransactionHistory({
                senderId:userAccount.accountNumber,
                receiverId:receiveracc.accountNumber,
                money:money,
                status:"Failed"
            })
            await trans.save();
            return res.status(400).json({message:"Insufficient Balance",success:false})
        }
        const session=await mongoose.startSession();
        session.startTransaction();
        try{
            await Account.updateOne(
                {accountNumber:userAccount.accountNumber},
                {$inc:{balance:-money}},{session}
            );
            await Account.updateOne(
                {accountNumber:receiveracc.accountNumber},
                {$inc:{balance:money}},{session}
            );
            const trans2=new TransactionHistory({
                senderId:userAccount.accountNumber,
                receiverId:receiveracc.accountNumber,
                money:money,status:"Success"}
            );
            await trans2.save({session});
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({
                message:"Money Sent Successfully",
                success:true
            });
        }catch(err){
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({
                message:"Transaction Failed",
                success:false
            });
        }
    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        });
    }
}

const Transhistory=async (req,res)=>{
    const id=req.account.accountNumber;
    try{
        const transactions=await TransactionHistory.find({$or:[{senderId:id},{receiverId:id}]});
        return res.status(200).json({
            message:"Transactions",
            transactions
        })
    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        });
    }
}

const UPI=async (req,res)=>{
    const userAccount=req.account;
    const userph=req.account.phonenumber;
    const {phonenumber,money}=req.body;
    if(!phonenumber || !money ){
        return res.status(400).json({
            message:"All fields are required",
            success:false
        })
    }
    try{
        const receiver=await Account.findOne({phonenumber:phonenumber,primary:true});
        if(!receiver){
            return res.status(400).json({
                message:"Receiver doesn't have UPI",
                success:false
            })
        }
        if(money<=0){
            return res.status(400).json({
                message:"Enter a Valid Amount to be transfered",
                success:false
            })
        }
         if(money>userAccount.balance){
            const trans=new TransactionHistory({
                senderId:userAccount.accountNumber,
                receiverId:receiver.accountNumber,
                money:money,
                status:"Failed"
            })
            await trans.save();
            return res.status(400).json({message:"Insufficient Balance",success:false})
        }
        const session=await mongoose.startSession();
        session.startTransaction();
        try{
            await Account.updateOne(
                {phonenumber:userph},
                {$inc:{balance:-money}},{session}
            );
            await Account.updateOne(
                {phonenumber},
                {$inc:{balance:money}},{session}
            );
            const trans2=new TransactionHistory({
                senderId:userAccount.phonenumber,
                receiverId:receiver.phonenumber,
                money:money,status:"Success"}
            );
            await trans2.save({session});
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({
                message:"Money Sent Successfully",
                success:true
            });
        }catch(err){
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({
                message:"Transaction Failed",
                success:false
            });
        }
    }catch(err){
        return res.status(500).json({
            message:"Internal Sever Error",
            success:false
        })
    }
}

module.exports={
    SendMoney,
    CheckBalance,
    CreateAccount,
    Transhistory,
    UPI
}