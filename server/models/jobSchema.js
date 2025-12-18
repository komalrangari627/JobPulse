import mongoose from "mongoose";

/* JOB REQUIREMENTS OBJECT */
const jobRequirementsSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companies",
    required: true
  },  
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  experience: {
    type: String, 
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  postDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  offeredSalary: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

/* JOB SCHEMA */
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  jobCreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies", // links to company model
    required: true,
  },
  jobRequirements: {
    type: jobRequirementsSchema,
    required: true,
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  closed: {
    type: Boolean,
    default: false,
  },
  maxApplications: {
    type: Number,
    default: 0,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});
const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

applicationSchema.index({ user: 1, job: 1 }, { unique: true });

/* EXPORT MODEL */
export const jobModel = mongoose.model("jobs", jobSchema);
