#!/usr/bin/env node
import { configDotenv } from "dotenv";
import axios from "axios";
import { Command } from "commander";

configDotenv();

const API_URL = process.env.APPU_API_URL || "http://localhost:3000";
const program = new Command();

function parseBoolean(value, fieldName) {
  if (typeof value === "boolean") return value;

  const normalized = String(value).toLowerCase().trim();
  if (["true", "1", "yes", "y"].includes(normalized)) return true;
  if (["false", "0", "no", "n"].includes(normalized)) return false;

  throw new Error(`Invalid ${fieldName} value: ${value}. Use true/false.`);
}

function printMatrix(tasks) {
  const sections = [
    ["Urgent & Important", tasks.urgentImportant],
    ["Not Urgent & Important", tasks.notUrgentImportant],
    ["Urgent & Not Important", tasks.urgentNotImportant],
    ["Not Urgent & Not Important", tasks.notUrgentNotImportant],
  ];

  for (const [title, items] of sections) {
    console.log(`\n${title}`);
    if (!items?.length) {
      console.log("  - none");
      continue;
    }

    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item}`);
    });
  }
}

function printTaskList(allTasks) {
  if (!allTasks?.length) {
    console.log("No tasks found.");
    return;
  }

  allTasks.forEach((task, index) => {
    console.log(
      `${index + 1}. [${task.id}] ${task.name} (urgent: ${task.urgent}, important: ${task.important})`,
    );
  });
}

async function run(action) {
  try {
    await action();
  } catch (error) {
    if (error.response?.data) {
      console.error("Error:", JSON.stringify(error.response.data));
    } else {
      console.error("Error:", error.message);
    }
    process.exitCode = 1;
  }
}

program.name("appu").description("APPU CLI - Task manager using Eisenhower Matrix");

program
  .command("list")
  .description("List all tasks and matrix buckets")
  .action(() =>
    run(async () => {
      const response = await axios.get(`${API_URL}/tasks`);
      console.log("\nAll Tasks:");
      printTaskList(response.data.allTasks);
      console.log("\nEisenhower Matrix:");
      printMatrix(response.data);
    }),
  );

program
  .command("add")
  .description("Add a new task")
  .requiredOption("-n, --name <name>", "Task name")
  .requiredOption("-u, --urgent <boolean>", "Task urgency (true/false)")
  .requiredOption("-i, --important <boolean>", "Task importance (true/false)")
  .action((options) =>
    run(async () => {
      const payload = {
        name: options.name,
        urgent: parseBoolean(options.urgent, "urgent"),
        important: parseBoolean(options.important, "important"),
      };

      const response = await axios.post(`${API_URL}/tasks`, payload);
      console.log(response.data.message);
      console.log(`Created task id: ${response.data.task.id}`);
    }),
  );

program
  .command("update")
  .description("Update an existing task")
  .argument("<id>", "Task id")
  .option("-n, --name <name>", "Task name")
  .option("-u, --urgent <boolean>", "Task urgency (true/false)")
  .option("-i, --important <boolean>", "Task importance (true/false)")
  .action((id, options) =>
    run(async () => {
      const payload = {};
      if (options.name !== undefined) payload.name = options.name;
      if (options.urgent !== undefined) payload.urgent = parseBoolean(options.urgent, "urgent");
      if (options.important !== undefined)
        payload.important = parseBoolean(options.important, "important");

      if (Object.keys(payload).length === 0) {
        throw new Error("Please provide at least one field to update.");
      }

      const response = await axios.patch(`${API_URL}/tasks/${id}`, payload);
      console.log(response.data.message);
      console.log(`Updated task: ${response.data.task.name}`);
    }),
  );

program
  .command("delete")
  .description("Delete a task by id")
  .argument("<id>", "Task id")
  .action((id) =>
    run(async () => {
      const response = await axios.delete(`${API_URL}/tasks/${id}`);
      console.log(response.data.message);
    }),
  );

program
  .command("clear")
  .description("Delete all tasks")
  .action(() =>
    run(async () => {
      const response = await axios.delete(`${API_URL}/tasks`);
      console.log(response.data.message);
    }),
  );

program.parseAsync(process.argv);
