const Account=require('../Models/Account');

const EnsureAccount=async (req,res,next)=>{
    const id=req.user._id;
    try{
        const account=await Account.findOne({userId:id,primary:true});
        if(!account){
            return res.status(400).json({
                message:"User Dosen't have any account",
                success:false
            })
        }
        const accountdetails={
            fullname:account.fullname,
            userId:account.userId,
            accountNumber:account.accountNumber,
            branch:account.branch,
            balance:account.balance,
            phonenumber:account.phonenumber,
            primary:account.primary
        }
        req.account=accountdetails;
        next();
    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        });
    }
}

module.exports=EnsureAccount;