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

});
