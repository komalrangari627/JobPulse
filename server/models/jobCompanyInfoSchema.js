import mongoose from "mongoose";

const jobCompanyInfoSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobs",
      required: true,
      unique: true // ✅ one info per job (unchanged)
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      required: true
    },

    // EXTRA INFO (Dribbble-style)
    companySize: String,
    foundedYear: Number,
    website: String,
    companyType: String,
    benefits: [String],
    techStack: [String],
    workingDays: String,
    officeType: String,
    aboutCompany: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


// ✅ COMPOUND INDEX (NO DATA CHANGE)
// Helps direct lookup using both ObjectIds
jobCompanyInfoSchema.index({ jobId: 1, companyId: 1 });


// ✅ OPTIONAL VIRTUAL POPULATES (SAFE)
jobCompanyInfoSchema.virtual("job", {
  ref: "jobs",
  localField: "jobId",
  foreignField: "_id",
  justOne: true
});

jobCompanyInfoSchema.virtual("company", {
  ref: "companies",
  localField: "companyId",
  foreignField: "_id",
  justOne: true
});

export const jobCompanyInfoModel =
  mongoose.model("jobCompanyInfo", jobCompanyInfoSchema);
