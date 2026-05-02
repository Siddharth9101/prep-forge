const {extractTextFromPdf, generateAiSummary} = require("../services/analyse.service")

const analyseResume = async (req, res) => {
    try{
        const resumePdf = req.file;

        if(!resumePdf) return res.status(400).json({message: "Resume Pdf not provided"});

        const resumeText = await extractTextFromPdf(resumePdf);

        const aiResponse = await generateAiSummary(resumeText);

        return res.status(200).json({message: "Resume analysed successfully!", data: {aiResponse}})
    }catch(e){
        console.error(e)
        return res.status(500).json({message: "Something went wrong!"})
    }
}


module.exports = {analyseResume}