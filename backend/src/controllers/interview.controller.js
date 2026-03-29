const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const InterviewReport = require("../models/interviewReport.model");

/**
 * @name generateInterviewReportController
 * @description generates an interview report, expects a jobDescription, selfDescription and resume, returns the interview report
 * @access Private
 */
async function generateInterviewReportController(req, res) {
  try {
    const resumeFile = req.file;
    const { jobDescription, selfDescription } = req.body;

    // basic validation
    if (!resumeFile) {
      return res.status(400).json({ message: "Resume file is required" });
    }
    if (!jobDescription || !selfDescription) {
      return res
        .status(400)
        .json({ message: "Job description and self description are required" });
    }

    // extract text from the resume PDF
    const resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(resumeFile.buffer),
    ).getText();

    // generate the interview report using the AI service
    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      jobDescription,
      selfDescription,
    });

    // save the interview report to the database
    const interviewReport = await InterviewReport.create({
      userId: req.user.id,
      resume: resumeContent.text,
      jobDescription,
      selfDescription,
      ...interviewReportByAi,
    });

    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
}

module.exports = {
  generateInterviewReportController,
};
