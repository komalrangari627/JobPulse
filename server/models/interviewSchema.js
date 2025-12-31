// models/interviewSchema.js
import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jobs",
    required: true,
  },
  companyName: String,
  jobTitle: String,

  rounds: [
    {
      title: String,
      time: Number,
      questions: [
        {
          q: String,
          options: [String],
          answer: String,
        },
      ],
    },
  ],
});


export const Interview = mongoose.model("Interview", interviewSchema);
