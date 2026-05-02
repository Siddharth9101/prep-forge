const pdfParse = require("pdf-parse");
const {ai} = require("./ai.service");
const {z} = require("zod")

const extractTextFromPdf = async(resumeFile) => {
    const resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(resumeFile.buffer),
    ).getText();
    return resumeContent.text;
}

const generateAiSummary = async (resumeText) => {
  const prompt = `Analyse this resume and return json with: score (0-100), strengths, weaknesses, suggestions`;
  const aiResponseSchema = z.object({
    score: z
    .number()
    .describe(
      "The overall score of the resume, on a scale of 0 to 100",
    ),
  strengths: z
    .array(z.string())
    .describe(
      "List of strengths of the candidate according to his resume",
    ),
    weaknesses: z.array(z.string()).describe("List of weaknesses of the candidate according to his resume"),
    suggestions: z.array(z.string()).describe("List of suggestions for the candidate to improve his resume")
  })
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(aiResponseSchema),
    },
  });

  return JSON.parse(response.text);
}

module.exports = {extractTextFromPdf, generateAiSummary}