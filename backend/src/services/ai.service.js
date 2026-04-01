const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "The match score between the candidate and the job description, on a scale of 0 to 100",
    ),
  title: z
    .string()
    .describe("The title of the job the candidate is applying for"),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The technical question that can be asked in the interview",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking that question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer that question, what points to cover, what approch to take, etc",
          ),
      }),
    )
    .describe(
      "List of technical questions that can be asked in the interview along with their intention and how to answer",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The behavioral question that can be asked in the interview",
          ),
        intention: z
          .string()
          .describe(
            "The intention of the interviewer behind asking that question",
          ),
        answer: z
          .string()
          .describe(
            "How to answer that question, what points to cover, what approch to take, etc",
          ),
      }),
    )
    .describe(
      "List of behavioral questions that can be asked in the interview along with their intention and how to answer",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e., how important it is to have this skill for the job",
          ),
      }),
    )
    .describe(
      "List of skill gaps that the candidate has along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day of the preparation plan, e.g., 1, 2, etc"),
        focus: z
          .string()
          .describe(
            "The focus of the preparation for that day, e.g., Data Structures, System Design, etc",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on that day for preparation, e.g., read a book, watch a video, solve problems, etc",
          ),
      }),
    )
    .describe(
      "The preparation plan for the candidate to prepare for the interview, broken down by day with a focus and list of tasks for each day",
    ),
});

/**
 * @params {resumes, jobDescription, selfDescription}
 * @returns interviewReport
 * @description This function takes the candidate's resume, the job description, and the candidate's self-description as input and generates an interview report using the Google GenAI API.
 */
async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription,
}) {
  const prompt = `Generate an interview report for the candidate with the following details:
    Resume: ${resume}
    Job Description: ${jobDescription}
    Self Description: ${selfDescription}
    `;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

/**
 * @params {htmlContent}
 * @returns pdfBuffer
 * @description This function takes the HTML content as input and generates a PDF buffer using the puppeteer library.
 */
async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: puppeteer.executablePath(),
  });
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
  });

  await browser.close();

  return pdfBuffer;
}

/**
 * @params {resume, jobDescription, selfDescription}
 * @returns pdfBuffer
 * @description This function takes the candidate's resume, the job description, and the candidate's self-description as input and generates a PDF buffer using the Google GenAI API.
 */
async function generateResumePdf({ resume, jobDescription, selfDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using libraries like puppeteer",
      ),
  });

  const prompt = `Generate html for the resume for the candidate with the following details:
    Resume: ${resume}
    Job Description: ${jobDescription}
    Self Description: ${selfDescription}
      The HTML should be well formatted and styled, and should include all the relevant information from the resume, job description, and self description. The HTML should be suitable for conversion to PDF using libraries like puppeteer.
      The format of the response should be a JSON object with a single field "html" which contains the HTML content of the resume. The  resume should be tailored to the job description and should highlight the candidate's strengths and relevant experience. The resume should not sound like it was generated by AI, but should sound natural and human-like. The resume should be concise and should not exceed 1 A4 page when converted to PDF. The A4 page also has 10mm padding from all sides so the content should now overflow. You can highlight the content using some colors but make sure the overall look of the resume is professional and suitable for job applications. The content should be ATS friendly, meaning it should be easily parsable by Applicant Tracking Systems, and should not include any complex formatting that might confuse the ATS. Try to use bullet points, short sentences, and clear section headings to make the resume easy to read and ATS friendly. Prefer single column layout over multi-column layout for better readability and ATS compatibility.
    `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
