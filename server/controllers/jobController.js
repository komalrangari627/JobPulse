import mongoose from "mongoose";
import { companyModel } from "../models/companySchema.js";
import { jobModel } from "../models/jobSchema.js";
import { userModel } from "../models/userSchema.js";
import { jobs } from "../database/jobsdata.js";
import { companies } from "../database/companiesData.js";

/* CREATE JOB */
const createJob = async (req, res) => {
  try {
    const company = req.company;
    if (!company) {
      return res.status(401).json({ message: "Please login as company!" });
    }

    const { title, jobRequirements } = req.body;
    if (!title || !jobRequirements) {
      return res.status(400).json({ message: "Missing job data!" });
    }

    const { type, category, exprience, location, postDate, offeredSalary, description } = jobRequirements;

    if (!type || !category || !exprience || !location || !postDate || !offeredSalary || !description) {
      return res.status(400).json({ message: "Invalid jobRequirements data!" });
    }

    const newJob = new jobModel({
      title,
      jobCreatedBy: company._id,
      jobRequirements,
    });

    const savedJob = await newJob.save();

    await companyModel.findByIdAndUpdate(company._id, {
      $push: { createdJobs: savedJob._id },
    });

    res.status(201).json({
      message: "Job created successfully!",
      jobId: savedJob._id,
    });
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({
      message: "Unable to create job!",
      error: err.message,
    });
  }
};

/* HANDLE JOB ACTION (DELETE / CLOSE) */
const handleJobAction = async (req, res) => {
  try {
    const company = req.company;
    if (!company) {
      return res.status(401).json({ message: "Unauthorized company access!" });
    }

    const { jobId, action } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID!" });
    }

    if (action === "delete") {
      const deletedJob = await jobModel.findByIdAndDelete(jobId);
      if (!deletedJob) {
        return res.status(404).json({ message: "Job not found!" });
      }

      await userModel.updateMany({ appliedJobs: jobId }, { $pull: { appliedJobs: jobId } });
      await companyModel.findByIdAndUpdate(company._id, { $pull: { createdJobs: jobId } });

      return res.status(200).json({ message: "Job deleted successfully!" });
    }

    if (action === "close") {
      const closedJob = await jobModel.findByIdAndUpdate(
        jobId,
        { $set: { closed: true } },
        { new: true }
      );

      if (!closedJob) {
        return res.status(404).json({ message: "Unable to close job!" });
      }

      return res.status(200).json({ message: "Job closed successfully!" });
    }

    return res.status(400).json({ message: "Invalid job action!" });
  } catch (err) {
    console.error("Job action error:", err);
    res.status(500).json({ message: "Unable to perform job action!", error: err.message });
  }
};

/* APPLY FOR JOB */
const handleJobApplication = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User not logged in!" });
    }

    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID!" });
    }

    const job = await jobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "This job no longer exists." });
    }

    if (job.closed) {
      return res.status(400).json({ message: `This job "${job.title}" is closed.` });
    }

    const alreadyApplied = await userModel.findOne({ _id: user._id, appliedJobs: jobId });
    if (alreadyApplied) {
      return res.status(400).json({ message: `You have already applied for "${job.title}".` });
    }

    await jobModel.findByIdAndUpdate(jobId, { $addToSet: { applications: user._id } });
    await userModel.findByIdAndUpdate(user._id, { $addToSet: { appliedJobs: jobId } });

    res.status(202).json({ message: `Applied successfully for "${job.title}"!` });
  } catch (err) {
    console.error("Apply job error:", err);
    res.status(500).json({ message: "Unable to apply for job!", error: err.message });
  }
};

/* GET ALL JOBS */
const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModel
      .find()
      .populate("jobCreatedBy", "name logo location website about"); // Fixed populate

    res.status(200).json({ jobs: jobs || [] });
  } catch (err) {
    console.error("getAllJobs error:", err);
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

/* GET JOB BY ID */
const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await jobModel
      .findById(jobId)
      .populate("jobCreatedBy");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    //  DIRECT MATCH USING ObjectIds
    const jobCompanyInfo = await jobCompanyInfoModel.findOne({
      jobId: job._id,
      companyId: job.jobCreatedBy._id
    });

    res.status(200).json({
      job,
      jobCompanyInfo
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getJobDetailWithCompany = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1️⃣ Try Mongo first
    if (mongoose.Types.ObjectId.isValid(jobId)) {
      const job = await jobModel.findById(jobId);
      if (job) {
        const company = await companyModel.findById(job.jobCreatedBy);
        return res.json({ job, company });
      }
    }

    // 2️⃣ Fallback to static data
    const job = jobs.find(j => j._id === jobId || j.id == jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const company = companies.find(c => c.companyName === job.company);

    res.json({ job, company });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching job detail",
      error: error.message
    });
  }
};

/* EXPORTS */
export {
  createJob,
  handleJobAction,
  handleJobApplication,
  getAllJobs,
  getJobById,
  getJobDetailWithCompany,
};
