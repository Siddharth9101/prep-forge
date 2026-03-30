const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");
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

/**
 * @name getAllInterviewReportsController
 * @description gets all interview reports of the authenticated user, returns an array of interview reports
 * @access Private
 */
async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await InterviewReport.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select(
        "-resume -jobDescription -selfDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
      )
      .exec();

    if (interviewReports.length === 0) {
      return res.status(404).json({ message: "No interview reports found" });
    }

    res.status(200).json({ interviewReports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
}

/**
 * @name getInterviewReportByIdController
 * @description gets a specific interview report by its ID, returns the interview report
 * @access Private
 */
async function getInterviewReportByIdController(req, res) {
  try {
    const { id } = req.params;

    const interviewReport = await InterviewReport.findById(id);

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    res.status(200).json({ interviewReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
}

/**
 * @name generateResumePdfController
 * @description generates a resume PDF from the provided resume text, returns the PDF file
 * @access Private
 */
async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;

    const interviewReport = await InterviewReport.findById(interviewReportId);

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({
      resume,
      jobDescription,
      selfDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server error" });
  }
}

module.exports = {
  generateInterviewReportController,
  getAllInterviewReportsController,
  getInterviewReportByIdController,
  generateResumePdfController,
};
