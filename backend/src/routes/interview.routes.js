const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const { upload } = require("../middlewares/file.middleware");

const interviewRouter = Router();

/**
 * @route POST /api/v1/interview
 * @description Generate an interview report based on the job description, self description and resume pdf
 * @access Private
 */
interviewRouter.post(
  "/",
  authMiddleware.authUserMW,
  upload.single("resume"),
  interviewController.generateInterviewReportController,
);

/**
 * @route GET /api/v1/interview/
 * @description Get all interview reports of the authenticated user
 * @access Private
 */
interviewRouter.get(
  "/",
  authMiddleware.authUserMW,
  interviewController.getAllInterviewReportsController,
);

/**
 * @route GET /api/v1/interview/:id
 * @description Get a specific interview report by its ID
 * @access Private
 */
interviewRouter.get(
  "/:id",
  authMiddleware.authUserMW,
  interviewController.getInterviewReportByIdController,
);

/**
 * @route POST /api/v1/interview/resume/pdf/:interviewReportId
 * @description Generate a resume PDF for a specific interview report
 * @access Private
 */
interviewRouter.get(
  "/resume/pdf/:interviewReportId",
  authMiddleware.authUserMW,
  interviewController.generateResumePdfController,
);

module.exports = interviewRouter;
