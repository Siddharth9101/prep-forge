const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "The match score between the candidate and the job description, on a scale of 0 to 100",
    ),
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
  behavioralQuestion: z
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
  console.log(zodToJsonSchema(interviewReportSchema));
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

module.exports = { generateInterviewReport };
