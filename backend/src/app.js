const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://prep-forge-one.vercel.app", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.static("dist"));

// route imports
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");
const analyseRouter = require("./routes/analyse.routes");

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/interview", interviewRouter);
app.use("/api/v1/analyse", analyseRouter);


module.exports = app;
