import request from "supertest";
import appu from "./server.js";

describe("Appu server", () => {
  beforeEach(async () => {
    await request(appu).delete("/tasks");
  });

  test("Welcome message", async () => {
    const response = await request(appu).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Welcome to Appu - Your Productivity Assistant!");
  });

  test("Adding tasks and ordering correctly", async () => {
    const task = { name: "Write tests", urgent: true, important: true };
    const response = await request(appu).post("/tasks").send(task);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Task added successfully!");
    expect(response.body.task.id).toBeDefined();
    expect(response.body.tasks.urgentImportant).toContain("Write tests");
  });

  test("Reject invalid task payload", async () => {
    const response = await request(appu).post("/tasks").send({ name: "", urgent: "yes" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid data");
    expect(response.body.details).toContain("name must be a non-empty string");
  });

  test("Fetching all tasks on GET /tasks", async () => {
    await request(appu).post("/tasks").send({ name: "Write tests", urgent: true, important: true });

    const response = await request(appu).get("/tasks");
    expect(response.body.urgentImportant).toContain("Write tests");
    expect(response.body.allTasks.length).toBe(1);
  });

  test("Prioritizes tasks based on Eisenhower matrix", async () => {
    await request(appu).post("/tasks").send({ name: "Kumar 1", urgent: true, important: true });
    await request(appu).post("/tasks").send({ name: "Kumar 2", urgent: false, important: true });
    await request(appu).post("/tasks").send({ name: "Kumar 3", urgent: true, important: false });
    await request(appu).post("/tasks").send({ name: "Kumar 4", urgent: false, important: false });

    const response = await request(appu).get("/tasks");
    expect(response.body.urgentImportant).toContain("Kumar 1");
    expect(response.body.notUrgentImportant).toContain("Kumar 2");
    expect(response.body.urgentNotImportant).toContain("Kumar 3");
    expect(response.body.notUrgentNotImportant).toContain("Kumar 4");
  });

  test("Updates task fields", async () => {
    const create = await request(appu)
      .post("/tasks")
      .send({ name: "Old title", urgent: true, important: false });

    const response = await request(appu)
      .patch(`/tasks/${create.body.task.id}`)
      .send({ name: "New title", important: true });

    expect(response.status).toBe(200);
    expect(response.body.task.name).toBe("New title");
    expect(response.body.task.important).toBe(true);
    expect(response.body.tasks.urgentImportant).toContain("New title");
  });

  test("Deletes a task", async () => {
    const create = await request(appu)
      .post("/tasks")
      .send({ name: "Delete me", urgent: true, important: false });

    const response = await request(appu).delete(`/tasks/${create.body.task.id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task deleted successfully!");

    const list = await request(appu).get("/tasks");
    expect(list.body.allTasks).toHaveLength(0);
  });
});
