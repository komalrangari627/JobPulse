import { jobModel } from "../models/jobSchema.js";
import { companyModel } from "../models/companySchema.js";

/* CREATE JOB */
export const createJob = async (req, res) => {
  try {
    const job = await jobModel.create(req.body);

    if (job.company) {
      await companyModel.findByIdAndUpdate(
        job.company,
        { $addToSet: { createdJobs: job._id } },
        { new: true }
      );
    }

    res.status(201).json({ success: true, job });

  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET ALL JOBS */
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await jobModel
      .find()
      .populate("company", "name logo location");

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching jobs",
      error: error.message,
    });
  }
};

/* GET JOB BY ID */
export const getJobById = async (req, res) => {
  try {
    const job = await jobModel.findById(req.params.id).populate({
      path: "company",
      select: "name logo location",
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({ success: true, job });

  } catch (error) {
    console.error("GET JOB BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};