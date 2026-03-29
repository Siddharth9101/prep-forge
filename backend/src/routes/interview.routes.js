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

module.exports = interviewRouter;
