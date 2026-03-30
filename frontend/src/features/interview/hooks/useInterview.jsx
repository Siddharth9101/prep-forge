import {
  generateInterviewReport,
  getAllInterviewReports,
  getInterviewReportById,
} from "../services/interview.api.js";
import { InterviewContext } from "../interview.context.js";
import { useContext } from "react";

const useInterview = () => {
  const { loading, setLoading, report, setReport, reports, setReports } =
    useContext(InterviewContext);

  /**
   * @params {jobDescription, selfDescription, resumeFile}
   * @description Generates an interview report based on the provided job description, self description, and resume file. Updates the report state.
   */
  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(response.interviewReport);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * @description Fetches all interview reports and updates the state with the retrieved reports.
   */
  const fetchAllReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * @params {reportId}
   * @description Fetches a specific interview report by its ID and updates the report state with the retrieved report.
   */
  const fetchReportById = async (reportId) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(reportId);
      setReport(response.interviewReport);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    report,
    reports,
    generateReport,
    fetchAllReports,
    fetchReportById,
  };
};

export default useInterview;
