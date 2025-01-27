import { configDotenv } from "dotenv";
import express from "express";
import parser from "body-parser";
configDotenv()
const port = process.env.PORT;
const appu = express();
appu.use(parser.json());

appu.get("/", (req, res) => {
  res.send("Welcome to Appu - Your Productivity Assistant!");
});

appu.listen(port, () => {
  console.log(`Appu server is running on http://localhost:${port}`);
});


