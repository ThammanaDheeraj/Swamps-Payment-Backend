const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const bcrypt=require('bcrypt');
const dotenv=require('dotenv');
const AuthRoutes=require('./Routes/AuthRoutes');
const PaymentRoutes=require('./Routes/PaymentRoutes');

dotenv.config();
const app=express();

mongoose.connect(process.env.DATABASE_URL)
.then(()=>console.log("DataBase Successfully Connected"))
.catch(()=>console.log("Error while connecting to database"));

app.use(express.json());
app.use(cors({origin:'*'}));
app.use(express.urlencoded({extended:true,limit:'5MB'}));

app.use('/auth',AuthRoutes);
app.use('/payment',PaymentRoutes);

app.listen(3000,(req,res)=>{
    console.log("Server is running at port 3000");
})