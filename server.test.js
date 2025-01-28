import request from "supertest";
import express from "express";
const appu = express();
appu.get("/", (req, res) => res.send("Welcome to Appu - Your Productivity Assistant!"));

describe("Server Tests", () => {
  it("should return the welcome message", async () => {
    const response = await request(appu).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Welcome to Appu - Your Productivity Assistant!");
  });
});
