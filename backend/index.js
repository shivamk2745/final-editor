const mongoose=require('mongoose');
const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const {app,server}=require('./Socket/server');
const cookieParser = require('cookie-parser');
const userRouter=require('./routes/user-routes');
const profileRouter=require('./routes/profile-routes');
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const url=process.env.url;
const port=process.env.port||5000;

try{
    mongoose.connect(url);
    console.log("Connected to mongodb");
}
catch(error){
    console.log(error);
}

app.use('/api/user',userRouter);
app.use('/api/profile',profileRouter);

server.listen(port,()=>{
    console.log("server is running on port "+port);
})

