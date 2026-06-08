import { companyModel } from "../models/companySchema.js";

/* GET ALL COMPANIES */
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await companyModel
      .find()
      .populate({
        path: "createdJobs",
        select: "title location salary type",
      })
      .lean();

    res.status(200).json({
      success: true,
      companies: companies || [],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch companies",
    });
  }
};

/* GET COMPANY BY ID */
export const getCompanyById = async (req, res) => {
  try {
    const company = await companyModel
      .findById(req.params.id)
      .populate("createdJobs");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};