// /buisness logic
import {User} from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const register = async (req, res) =>{
    try{
        const {fullName , email, phoneNumber, password , role} = req.body;
        if(!fullName || !email || !phoneNumber || !password || !role){
            return res.status(400).json({message: "Something is missing" ,
                success: false
            })
        }
        // check if user exixting
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:'User Already Exists',
             success : false,
            })
        }
        // hash password
        const hashedpassword = await bcrypt.hash(password, 10); // 10 is salt rounds how long the hash length 

        await User.create({
            fullName , 
            email, 
            phoneNumber, 
            password : hashedpassword, 
            role,
        })
        return res.status(200).json({message: "User Created Successfully",
        success: true,
        })
    }
    catch (error){
            console.log("Something wrong", error);
    }
}

export const login = async( req, res) => {
    try{
        const {email, password, role} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Something is missing" ,
                success: false
            })
        }
        // check if user exixting
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'Incorrect email or password',
             success : false,
            })
        }
        // check password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({message:'Incorrect email or password',
             success : false,
            })
        }
        // if role match
        console.log("user.role", user, req.body);
        if(role !== user.role){
            return res.status(400).json({message:'No user in this role exixts',
            success: false
            })
        }

        const tokenData = {
            userId: user._id,

        }
        const token = await  jwt.sign(tokenData, process.env.SECRET_KEY,{expiresIn:'1d'})
// secret key used to verify token has not ben tampered 
      const  userData={
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }
        
        return res.status(200).cookie("token", token, {maxAge: 24 * 60 * 60 * 1000, httpOnly: true,sameSite: 'strict'}).json({
            message: `Welcome back ${user.fullName}`,
            userData,
            success: true,
            token,
        })
    }
    catch(error){
        console.log("Something wrong", error);
    }
}

export const logout = async ( req, res) =>{
    try{
        return res.status(200).cookies("token", "", {maxAge: 0, httpOnly: true,sameSite: 'strict'}).json({
            message: "Logout Successfully",
            success: true,
        })
    }
    catch(error){

    }
}

export const updateProfile = async (req, res) => {
    try{
        const {fullName,email, phoneNumber, bio, skills} = req.body; 
        const file = req.file;
        if(!fullName || !email || !phoneNumber || !bio || !skills){
            return res.status(400).json({message: "Something is missing" ,
                success: false
            })
        }
    // cloudinary setup
        const skillsArray = skills?.split(",").map(skill => skill.trim());
        const userId = req.id;//middlewear
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User not found" ,
                success: false
            })
        }

        //updating data
        user.fullName = fullName;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.profile.bio = bio;
        user.profile.skills = skillsArray;
        //resumes comes later here

        await user.save();

         user={
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        return res.status(200).json({message: "Profile Updated Successfully",
        success: true,
        })

    }
    catch(error){
        console.log("Something wrong", error);
          return res.status(500).json({
        message: error.message,
        success: false,
    });
    }
}