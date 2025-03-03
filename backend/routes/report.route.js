import express from "express";
import Report from "../models/report.model.js";

const router = express.Router();

// Create a report
router.post("/", async (req, res) => {
  try {
    const { reportedBy, reportedPost, reason } = req.body;
    if (!reportedBy || !reason) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newReport = new Report({ reportedBy, reportedPost, reason });
    await newReport.save();

    res.status(201).json({ message: "Report submitted successfully" });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
