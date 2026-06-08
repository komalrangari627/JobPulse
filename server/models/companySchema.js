import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: String,
  logo: String,
  location: String,

  createdJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});

export const companyModel = mongoose.model("Company", companySchema);