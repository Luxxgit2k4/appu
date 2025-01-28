import request from "supertest";
import appu from "./server.js";

describe("Appu server", () => {
test("Welcome message", async () => {
  const response = await request(appu).get("/");
  expect(response.status).toBe(200);
  expect(response.text).toBe("Welcome to Appu - Your Productivity Assistant!");
});

  test("Adding tasks and order it correctly", async () => {
    const task = { name: "Write tests", urgent: true, important: true};
    const response = await request(appu).post("/tasks").send(task);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Task added successfully!");
    expect(response.body.tasks.urgentImportant).toContain("Write tests");
});

  test("Fetching all tasks on GET /tasks", async () => {
    const response = await request(appu).get("/tasks")
    expect(response.body.urgentImportant).toContain("Write tests")
  });

test("Prioritizing tasks based on Eisenhower matrix", async () => {
  const kumar1 = { name: "Kumar 1", urgent: true, important: true };
const kumar2 = { name: "Kumar 2", urgent: false, important: true };
const kumar3 = { name: "Kumar 3", urgent: true, important: false };
const kumar4 = { name: "Kumar 4", urgent: false, important: false };

  await request(appu).post("/tasks").send(kumar1);
  await request(appu).post("/tasks").send(kumar2);
await request(appu).post("/tasks").send(kumar3);
await request(appu).post("/tasks").send(kumar4);

  const response = await request(appu).get("/tasks");
 expect(response.body.urgentImportant).toContain("Kumar 1");
 expect(response.body.notUrgentImportant).toContain("Kumar 2");
 expect(response.body.urgentNotImportant).toContain("Kumar 3");
 expect(response.body.notUrgentNotImportant).toContain("Kumar 4");
})
});
