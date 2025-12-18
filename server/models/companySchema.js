import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Sub-documents
const addressSchema = new mongoose.Schema({
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  country: { type: String, default: "" },
  pincode: { type: String, default: "" },
});

const emailSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

const contactPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
});

const companyDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  est_year: { type: String, required: true },
  address: { type: addressSchema, default: {} },
  bio: { type: String, required: true },
  website: { type: String },
  industryType: { type: String, required: true },
  founders: { type: Array, default: [] },
  hrEmail: { type: String, required: true },
});

// Main Schema
const companySchema = new mongoose.Schema({
  companyDetails: {
    type: companyDetailsSchema,
    required: true,
  },
  contact_person: {
    type: contactPersonSchema,
    required: true,
  },
  email: {
    type: emailSchema,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  companyLogo: {
     type: String, 
     default: "" 
  },
  documents: {
    type: Array,
    default: [],
  },

  // FIXED: Proper job references
  createdJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobs", // must match job model name
    },
  ],

  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving
companySchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

export const companyModel = mongoose.model("companies", companySchema);
