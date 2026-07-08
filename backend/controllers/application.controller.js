import {Application} from '../models/applications.model.js';
import {Job} from '../models/job.model.js';
export const applyJob = async (req, res) =>{
    try{
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:'Job Id not found',
                success: false,
            })
        }
        //check if already applied
        const existingApplication = await Application.findOne({job: jobId , applicantId: userId});
        if(existingApplication){
            return res.status(400).json({
                message:'You have already applied for this job',
                success: false,
            })
        }
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message:'Job not found',
                success: false,
            })
        }
        // create application
        const newApplication = await Application.create({
            jobId,
            applicantId: userId,
        })
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:'Application submitted successfully',
            success: true,
            application: newApplication,
        })
    }
    catch(error){
        console.log("Something wrong", error);
        return res.status(500).json({
            message:'Internal server error',
            success: false,
        })
    }
}

export const getApplications = async (req, res) =>{
    try{
        const userId = req.id;  
        // const applications = await Application.find({applicantId:userId}).populate('jobId').sort({createdAt: -1}); //ascending order
        const applications = await Application.find({applicantId:userId}).sort({createdAt: -1}).populate({
            path: 'jobId',
            options: { sort: { createdAt: -1 } }, // Sort jobs by createdAt in descending order
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });
        if(!applications){
            return res.status(404).json({
                message:'No applications found',
                success: false,
            })
        }
        return res.status(200).json({
            message:'Applications fetched successfully',
            success: true,
            applications
        })
    }
    catch(error){
        console.log("Something wrong", error);
        return res.status(500).json({   
            message:'Internal server error',
            success: false,
        })
    }
}

export const getApplicationsByJobId = async (req, res) =>{
    try{
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:'Job Id not found',
                success: false,
            })
        }           
        const applications = await Application.find({ jobId }).populate({
            path:"applications",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicantId',
                options: { sort: { createdAt: -1 } }
            }
        }).sort({ createdAt: -1 });

        if (applications.length === 0) {
            return res.status(404).json({
                message: "No applications found",
                success: false,
            });
        }
        return res.status(200).json({
            message:'Applications fetched successfully',
            success: true,
            applications
        })
    }
    catch(error){
        console.log("Something wrong", error);
        return res.status(500).json({
            message:'Internal server error',
            success: false,
        })
    }
}

export const updateApplicationStatus = async (req, res) =>{
    try{
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'Status is required',
                success: false,
            })
        }
        // find the application by applicant id
        const application = await Application.findOne({ _id: applicationId });
        if(!application){
            return res.status(404).json({
                message:'Application not found',
                success: false,
            })
        }

        // update the status of the application
        application.status = status.toLowerCase() ;
        await application.save();
        return res.status(200).json({
            message:'Application status updated successfully',
            success: true,
            application
        })
    }
    catch(error){
        console.log("Something wrong", error);
        return res.status(500).json({
            message:'Internal server error',
            success: false,
        })
    }
}
export const createJob = async (req, res) =>{
    try{
        const {title , description, requirements, salary, location, jobType, positions,companyId} = req.body;
        if(!title || !description || !requirements || !positions){
            return res.status(401).json({
                message:"Fill all the required fields",
                success: false,
            })
        }
        const requirementsArray = requirements.split(',').map(require => require.trim());
        const job = await Job.create({
            title,
            description,
            requirements: requirementsArray,
            salary,
            location,
            jobType,
            positions,
            company: companyId,
            createdBy: req.id,
        })
        return res.status(201).json({
            message:"Job created successfully",
            success: true,
            job
        })
    }
    catch(error){
        console.log("Something wrong", error);
        return res.status(500).json({
            message:'Internal server error',
            success: false,
        })
    }
}

export const getJobs = async (req, res) =>{
    try{
        const jobs = await Job.find()
    }
    catch(error){
        console.log("Something wrong", error);
        return res.status(500).json({
            message:'Internal server error',
            success: false,
        })
      }

}