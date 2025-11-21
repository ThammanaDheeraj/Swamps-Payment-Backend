const Joi=require('joi');

const signupSchema=async (req,res,next)=>{
    const schema=Joi.object({
        fullname:Joi.string().min(10).max(50).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(6).max(15)
    });
    const { error } = schema.validate(req.body);
    if (error) { 
        return res.status(400).json({
            message: "Bad Request",
            error: error.details[0].message 
        })
    }
    next();
}

const loginSchema=async (req,res,next)=>{
    const schema=Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(6).max(15)
    })
    const { error } = schema.validate(req.body);
    if (error) { 
        return res.status(400).json({
            message: "Bad Request",
            error: error.details[0].message 
        })
    }
    next();
}

const updatePassSchema=async (req,res,next)=>{
    const schema=Joi.object({
        password:Joi.string().min(6).max(15),
        newpassword:Joi.string().min(6).max(15),
        retypepassword:Joi.string().min(6).max(15)
    })
    const { error } = schema.validate(req.body);
    if (error) { 
        return res.status(400).json({
            message: "Bad Request",
            error: error.details[0].message 
        })
    }
    next();
}


module.exports={
    signupSchema,
    loginSchema,
    updatePassSchema
}