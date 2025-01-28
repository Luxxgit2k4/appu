import { configDotenv } from "dotenv";
import express from "express";
import bodyParser from "body-parser";
configDotenv()

const appu = express();
appu.use(bodyParser.json());

const tasks = {
  urgentImportant: [],
  notUrgentImportant: [],
  urgentNotImportant: [],
  notUrgentNotImportant: [],
};

appu.get("/", (req, res) => {
  res.send("Welcome to Appu - Your Productivity Assistant!");
});

appu.post("/tasks", (req, res) => {
  const { name, urgent, important } = req.body;
  if (!name || typeof urgent !== "boolean" || typeof important !== "boolean") {
    return res.status(400).json({ error: "Invalid data!"});
  }

  if (urgent && important) {
    tasks.urgentImportant.push(name);
  } else if (!urgent && important) {
    tasks.notUrgentImportant.push(name);
  } else if(urgent && !important) {
    tasks.urgentNotImportant.push(name);
  } else {
    tasks.notUrgentNotImportant.push(name);
  }
  res.status(201).json({ message: "Task added successfully!", tasks})
});

appu.get("/tasks", (req, res) => {
  res.json(tasks);
});

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT;
appu.listen(port, () => {
  console.log(`Appu server is running on http://localhost:${port}`);
});
}

export default appu;

