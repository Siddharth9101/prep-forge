const {Router} = require("express")
const { upload } = require("../middlewares/file.middleware");
const {analyseResume} = require("../controllers/analyse.controller")

const router = Router()

router.post("/", upload.single("resumePdf"), analyseResume);

module.exports = router;