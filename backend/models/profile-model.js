const mongoose=require('mongoose');

const profileSchema=new mongoose.Schema({
    loginId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    pronoun:{
        type:String,
        required:true
    },
    college:{
        type:String,
        required:true
    },
    linkdin:{
        type:String,
        required:true
    },
    github:{
        type:String,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    bio:{
        type:String,
        required:true
    },
    languages:{
        type:[String],
        required:true
    }

})

const Profile=mongoose.model("Profile",profileSchema);

module.exports=Profile;