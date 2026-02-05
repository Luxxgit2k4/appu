import { configDotenv } from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

configDotenv();

const appu = express();
appu.use(bodyParser.json());

const tasks = {
  allTasks: [],
  urgentImportant: [],
  notUrgentImportant: [],
  urgentNotImportant: [],
  notUrgentNotImportant: [],
};

function prioritizeTasks() {
  tasks.urgentImportant = [];
  tasks.notUrgentImportant = [];
  tasks.urgentNotImportant = [];
  tasks.notUrgentNotImportant = [];

  for (const task of tasks.allTasks) {
    if (task.urgent && task.important) {
      tasks.urgentImportant.push(task.name);
    } else if (!task.urgent && task.important) {
      tasks.notUrgentImportant.push(task.name);
    } else if (task.urgent && !task.important) {
      tasks.urgentNotImportant.push(task.name);
    } else {
      tasks.notUrgentNotImportant.push(task.name);
    }
  }
}

function validateTaskInput({ name, urgent, important }, { partial = false } = {}) {
  const errors = [];

  if (!partial || name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      errors.push("name must be a non-empty string");
    }
  }

  if (!partial || urgent !== undefined) {
    if (typeof urgent !== "boolean") {
      errors.push("urgent must be a boolean");
    }
  }

  if (!partial || important !== undefined) {
    if (typeof important !== "boolean") {
      errors.push("important must be a boolean");
    }
  }

  return errors;
}

appu.get("/", (req, res) => {
  res.send("Welcome to Appu - Your Productivity Assistant!");
});

appu.post("/tasks", (req, res) => {
  const { name, urgent, important } = req.body;
  const errors = validateTaskInput({ name, urgent, important });

  if (errors.length > 0) {
    return res.status(400).json({ error: "Invalid data", details: errors });
  }

  const newTask = { id: uuidv4(), name: name.trim(), urgent, important };
  tasks.allTasks.push(newTask);
  prioritizeTasks();

  return res.status(201).json({ message: "Task added successfully!", task: newTask, tasks });
});

appu.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { name, urgent, important } = req.body;

  const taskIndex = tasks.allTasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found!" });
  }

  const errors = validateTaskInput({ name, urgent, important }, { partial: true });
  if (errors.length > 0) {
    return res.status(400).json({ error: "Invalid data", details: errors });
  }

  if (name !== undefined) tasks.allTasks[taskIndex].name = name.trim();
  if (urgent !== undefined) tasks.allTasks[taskIndex].urgent = urgent;
  if (important !== undefined) tasks.allTasks[taskIndex].important = important;

  prioritizeTasks();
  return res.status(200).json({
    message: "Task updated successfully!",
    task: tasks.allTasks[taskIndex],
    tasks,
  });
});

appu.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.allTasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found!" });
  }

  const [deletedTask] = tasks.allTasks.splice(taskIndex, 1);
  prioritizeTasks();

  return res.status(200).json({
    message: "Task deleted successfully!",
    task: deletedTask,
    tasks,
  });
});

appu.delete("/tasks", (req, res) => {
  tasks.allTasks = [];
  prioritizeTasks();

  return res.status(200).json({ message: "All tasks cleared successfully!", tasks });
});

appu.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  appu.listen(port, () => {
    console.log(`Appu server is running on http://localhost:${port}`);
  });
}

export default appu;
