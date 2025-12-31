import { Interview } from "../models/interviewSchema.js";

export const getInterviewByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    const interview = await Interview.findOne({ jobId });
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    /**
     * 🔹 PRIORITY ORDER
     * 1. interview.interview.sets (if exists)
     * 2. interview.rounds (fallback)
     */

    let rounds = [];

    // CASE 1: Use interview.sets (pick first set)
    if (interview.interview?.sets?.length) {
      rounds = interview.interview.sets[0].rounds;
    }

    // CASE 2: Use top-level rounds
    else if (interview.rounds?.length) {
      rounds = interview.rounds;
    }

    return res.json({
      success: true,
      interviewId: interview._id,
      jobId: interview.jobId,
      rounds,
    });

  } catch (error) {
    console.error("Interview fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

