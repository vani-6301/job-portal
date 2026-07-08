import {Company} from "../models/company.model.js";

export const registerCompany = async (req, res) => {
    try {
        const {companyName, description, website,logo,location}= req.body;
        if(!companyName){
            return res.status(400).json({
                message: "Company Name required",
                success: false,
            })
        }
        let company = await Company.findOne({name:companyName})
        if(company){
            return res.status(400).json({
                message:"Company already exists",
                success:false,
            })
        }
        
        company =await Company.create({
            companyName,
            description,
            website,
            location,
            logo,
            userId:req.id,
        })
        return res.status(201).json({
            message: "Company data saved",
            company,
            success: true,
        })
    }
    catch(error){
        console.log("Something wrong", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }
}

export const getCompany = async( req, res)=>{
    try{
        const userId = req.id; //loggesIn user Id
        const companies = await Company.find({userId});
        if(!companies){{
            return res.status(404).json({
                message: "No companies found",
                success: false,
            })
        }}
        else{
            return res.status(200).json({
                message: "Companies found",
                companies,
                success: true,
            })
        }
    
    }
    catch(error){
        console.log("Something wrong", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }
}

export const getCompanyById = async(req, res)=>{
    try{
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(404).json({
                message: "Company not found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Company found",
            company,
            success: true,
        })
    }
    catch(error){
        console.log("Something wrong", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }
}

export const updateCompany = async(req, res)=>{
    try{
        const {companyName, description, website,location}= req.body;
        const file = req.file;
        // cloudinary setup
        const updateData ={companyName, description, website,location }
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if(!company){
            return res.status(404).json({
                message: "Company not found",
                success: false,
            })
        }
        
        return res.status(200).json({
            message: "Company updated successfully",
            company,
            success: true,
        })
    }
    catch(error){
        console.log("Something wrong", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }
}
