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
    let response = null;
    try {
      response = await generateInterviewReport({
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
    return response.interviewReport;
  };

  /**
   * @description Fetches all interview reports and updates the state with the retrieved reports.
   */
  const fetchAllReports = async () => {
    setLoading(true);
    let response = null;
    try {
      response = await getAllInterviewReports();
      setReports(response.interviewReports);
      return response.interviewReports;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    return response.interviewReports;
  };

  /**
   * @params {reportId}
   * @description Fetches a specific interview report by its ID and updates the report state with the retrieved report.
   */
  const fetchReportById = async (reportId) => {
    setLoading(true);
    let response = null;
    try {
      response = await getInterviewReportById(reportId);
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    return response.interviewReport;
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
