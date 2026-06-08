import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company", // ⚠️ MUST MATCH MODEL NAME EXACTLY
  },

  location: String,
  salary: String,
});

export const jobModel = mongoose.model("Job", jobSchema);