import { configDotenv } from "dotenv";
import express from "express";
import bodyParser from "body-parser";
configDotenv()

const appu = express();
appu.use(bodyParser.json());

const tasks = {
  allTasks: [],
  urgentImportant: [],
  notUrgentImportant: [],
  urgentNotImportant: [],
  notUrgentNotImportant: [],
};

function prioritizetasks() {
  tasks.urgentImportant = [];
  tasks.notUrgentImportant = [];
  tasks.urgentNotImportant = [];
  tasks.notUrgentNotImportant = [];

  for (const task of tasks.allTasks) {
 if (task.urgent && task.important) {
    tasks.urgentImportant.push(task.name);
  } else if (!task.urgent && task.important) {
    tasks.notUrgentImportant.push(task.name);
  } else if(task.urgent && !task.important) {
    tasks.urgentNotImportant.push(task.name);
  } else {
    tasks.notUrgentNotImportant.push(task.name);
  }
  }
}

appu.get("/", (req, res) => {
  res.send("Welcome to Appu - Your Productivity Assistant!");
});

appu.post("/tasks", (req, res) => {
  const { name, urgent, important } = req.body;
  if (!name || typeof urgent !== "boolean" || typeof important !== "boolean") {
    return res.status(400).json({ error: "Invalid data!"});
  }

  const taskid = Date.now().toString();
  const newtask = { id: taskid, name, urgent, important };
  tasks.allTasks.push(newtask);
  prioritizetasks();

  res.status(201).json({ message: "Task added successfully!", tasks})
});

appu.patch("/tasks/:id", (req,res) => {
  const { id } = req.params;
  const { name, urgent, important } = req.body;

  const taskindex = tasks.allTasks.findIndex(task => task.id === id);
  if (taskindex === -1) {
    return res.status(404).json({ error: "Task not found!"});
  }
  if (name !== undefined) tasks.allTasks[taskindex].name = name;
 if (urgent !== undefined) tasks.allTasks[taskindex].urgent = urgent;
 if (important !== undefined) tasks.allTasks[taskindex].important = important;

  prioritizetasks();
res.status(200).json({
  message: "Task updated successfully!",
  task: tasks.allTasks[taskindex],
  tasks,
})
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

