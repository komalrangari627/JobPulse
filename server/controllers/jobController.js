import { companyModel } from "../models/companySchema.js";
import { jobModel } from "../models/jobSchema.js";
import { userModel } from "../models/userSchema.js";

/* CREATE JOB */
const createJob = async (req, res) => {
  try {
    const company = req.company;
    if (!company) throw "Invalid request. Please login/register first!";

    const { title, jobRequirements } = req.body;
    if (!title || !jobRequirements) throw "Missing required job data!";

    const { type, category, exprience, location, postDate, offeredSalary, description } = jobRequirements;
    if (!type || !category || !exprience || !location || !postDate || !offeredSalary || !description)
      throw "Invalid jobRequirements data!";

    const newJob = new jobModel({
      title,
      jobCreatedBy: company._id,
      jobRequirements,
    });

    const savedJob = await newJob.save();

    // add job reference in company document
    await companyModel.findByIdAndUpdate(company._id, {
      $push: { createdJobs: savedJob._id },
    });

    res.status(201).json({
      message: "Job created successfully!",
      jobId: savedJob._id,
    });
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(400).json({ message: "Unable to create job!", error: err });
  }
};

/* HANDLE JOB ACTION (DELETE / CLOSE) */
const handleJobAction = async (req, res) => {
  try {
    const company = req.company;
    if (!company) throw "Invalid request. Please login/register first!";

    const { jobId, action } = req.params;
    if (!jobId || !action) throw "Missing jobId or action!";

    // DELETE JOB
    if (action === "delete") {
      const deletedJob = await jobModel.findByIdAndDelete(jobId);
      if (!deletedJob) throw "Job not found or unable to delete!";

      // Remove job from all users who applied
      await userModel.updateMany(
        { appliedJobs: jobId },
        { $pull: { appliedJobs: jobId } }
      );

      // Remove job from company’s createdJobs list
      await companyModel.findByIdAndUpdate(company._id, {
        $pull: { createdJobs: jobId },
      });

      return res.status(200).json({ message: "Job deleted successfully!" });
    }

    // CLOSE JOB
    if (action === "close") {
      const updatedJob = await jobModel.findByIdAndUpdate(
        jobId,
        { $set: { closed: true } },
        { new: true }
      );

      if (!updatedJob) throw "Unable to close job!";
      return res.status(200).json({ message: "Job closed successfully!" });
    }

    throw "Invalid action type!";
  } catch (err) {
    console.error("Error handling job action:", err);
    res.status(400).json({ message: "Unable to perform job action!", error: err });
  }
};

/* HANDLE JOB APPLICATION */
const handleJobApplication = async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw "User not logged in!";

    const { jobId } = req.params;
    if (!jobId) throw "Invalid job ID!";

    // Find job
    const job = await jobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: `This job has been deleted or no longer exists.`,
        jobId,
      });
    }

    // If job closed
    if (job.closed) {
      return res.status(400).json({
        message: `This job "${job.title}" is closed and cannot accept new applications.`,
      });
    }

    // Check if user already applied
    const alreadyApplied = await userModel.findOne({
      _id: user._id,
      appliedJobs: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: `You have already applied for "${job.title}".`,
      });
    }

    // Apply for the job
    await jobModel.findByIdAndUpdate(jobId, {
      $addToSet: { applications: user._id },
    });

    await userModel.findByIdAndUpdate(user._id, {
      $addToSet: { appliedJobs: jobId },
    });

    res.status(202).json({
      message: `You have successfully applied for "${job.title}"!`,
    });
  } catch (err) {
    console.error("Error applying for job:", err);
    res.status(400).json({
      message: "Unable to apply for job!",
      error: err.message || err,
    });
  }
};

/* GET JOB DATA (ALL / FILTERED) */
const getJobData = async (req, res) => {
  try {
    const jobs = await jobModel.find({});
    res.status(200).json({ message: "Jobs retrieved successfully!", jobs });
  } catch (err) {
    console.error("Error getting job data:", err);
    res.status(500).json({ message: "Unable to fetch jobs!", error: err });
  }
};
//  Get a single job by ID
 const getSingleJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await jobModel.findById(jobId).populate(
      "jobCreatedBy",
      "companyDetails.name companyDetails.industry"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching job",
      error: error.message,
    });
  }
};

export { createJob, handleJobAction, handleJobApplication, getJobData, getSingleJob };
