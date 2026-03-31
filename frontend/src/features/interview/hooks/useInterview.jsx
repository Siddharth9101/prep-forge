import {
  generateInterviewReport,
  getAllInterviewReports,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api.js";
import { InterviewContext } from "../interview.context.js";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

const useInterview = () => {
  const { loading, setLoading, report, setReport, reports, setReports } =
    useContext(InterviewContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    fetchAllReports();
  }, []);

  useEffect(() => {
    (async () => {
      if (id) {
        fetchReportById(id);
      }
    })();
  }, [id]);

  /**
   * @params {jobDescription, selfDescription, resumeFile}
   * @description Generates an interview report based on the provided job description, self description, and resume file. Updates the report state.
   */
  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setCustomMessage("Sit back and relax while we analyze your resume...");
    setLoading(true);
    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(response.interviewReport);
      navigate(`/interview/${response.interviewReport._id}`);
    } catch (err) {
      console.log(err);
      toast.error("Failed to generate interview report. Please try again.");
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
      toast.error("Failed to fetch interview reports. Please try again.");
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
      toast.error("Failed to fetch interview report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * @params {interviewReportId}
   * @description Generates a PDF of the resume associated with a specific interview report ID and triggers a download of the generated PDF file.
   */
  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    setCustomMessage("Sit back and relax while we generate your resume PDF...");
    try {
      const response = await generateResumePdf({ interviewReportId });
      if (!response) {
        toast.error("Failed to generate resume PDF. Please try again.");
        return;
      }
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      toast.error("Failed to generate resume PDF. Please try again.");
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
    getResumePdf,
    customMessage,
  };
};

export default useInterview;
