const User= require("../models/user-model");
const bcryptjs= require("bcryptjs");
const jwt= require("jsonwebtoken");
const dotenv= require("dotenv");
dotenv.config();

const key=process.env.key||"secret";

exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({
                message: "User Already Exists",
                user: {
                    id: userExist._id,
                    name: userExist.name,
                    email: userExist.email,
                    password: userExist.password,
                },
            });
        }

        // Ensure the password is a string and the salt rounds is a number
        const hashedPassword = await bcryptjs.hash(password, 10);

        const userCreated = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: userCreated._id, email: userCreated.email, name: userCreated.name },
            key,
            { expiresIn: "1d" }
        );
        res.cookie("uid", token, {
            httpOnly: true,
            maxAge: 3600000,
            sameSite: "strict",
            secure: true,
        });

        res.status(200).json({
            message: "User Created Successfully",
            user: {
                id: userCreated._id,
                name: userCreated.name,
                email: userCreated.email,
                password: userCreated.password,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.logIn=async (req,res)=>{

    try{
        const {email,password}=req.body;
        const userExisted=await User.findOne({email});
        if(!userExisted)
        {
            return res.status(400).json({
                message:"User Does Not Exist"
            })
        }

        const isMatch=await bcryptjs.compare(password, userExisted.password);
        if(!isMatch)
        {
            return res.status(400).json({
                message:"Incorrect Password"
            })
        }

        const token=jwt.sign({id:userExisted._id,email:userExisted.email,name:userExisted.name},key);
        res.cookie("uid",token,{httpOnly:true,maxAge:3600000 ,sameSite:"strict",secure:true});

        res.status(200).json({
            message:"User Logged In Successfully",
            user:{
                id:userExisted._id,
                name:userExisted.name,
                email:userExisted.email,
                password:userExisted.password
            }
        })
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }
}

exports.logout=async(req,res,next)=>{
    try {
        res.clearCookie("uid");
        res.status(200).json({message:"Logout successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}