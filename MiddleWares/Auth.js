const jwt=require('jsonwebtoken');

const Auth=async (req,res,next)=>{
    const auth=req.headers['authorization'];
    if(!auth || !auth.startsWith('Bearer ')){
        return res.status(400).json({
            message:"User is not Authorized"
        });
    }
    const token=auth.split(' ')[1];
    try{
        const decoded=await jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(400).json("Invalid Token");
        }
        req.user=decoded;
        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
    }
}

module.exports=Auth;