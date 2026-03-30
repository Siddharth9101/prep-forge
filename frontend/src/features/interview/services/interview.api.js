import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1/interview",
  withCredentials: true,
});

/**
 * @params {jobDescription, selfDescription, resumeFile}
 * @returns  interview report
 * @description generates an interview report based on the provided information
 */
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  try {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const response = await api.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

/**
 * @params {id}
 * @returns  interview report
 * @description retrieves an interview report by its ID
 */
export const getInterviewReportById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

/**
 * @returns  array of interview reports
 * @description retrieves all interview reports
 */
export const getAllInterviewReports = async () => {
  try {
    const response = await api.get(`/`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

/**
 * @params {interviewReportId}
 * @returns  PDF file
 * @description generates a PDF resume based on the interview report ID
 */
export const generateResumePdf = async ({ interviewReportId }) => {
  try {
    const response = await api.get(`/resume/pdf/${interviewReportId}`, {
      responseType: "blob",
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
