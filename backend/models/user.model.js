import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber:{
        type: Number,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['user', 'recruiter'],
        required: true,
        // default: 'user'
    },
    profile:{
        bio:{
            type:String,
        },
        skills:[{type: String}],
        resume : { type : String} ,//URL to the File
        resumeOriginalName : {type: String},
        company:{
            type: mongoose.Schema.Types.ObjectId , ref:'Company'
        } ,// company table id
        profilePicture : { 
            type : String ,//URL to the File
            default: ""
        },     

    }

},{timestamps: true});

export const User = mongoose.model('User' , userSchema);