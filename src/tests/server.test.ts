import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

test("Server should initialize correctly", async () => {
  expect(app).toBeDefined();
});

test("Server should return 404 for unknown routes", async () => {
  const response = await request(app).get("/unknown-route");
  expect(response.statusCode).toBe(404);
});

test("Database connection should fail if DB_CONNECT is not defined", async () => {
    const originalEnv = process.env.DB_CONNECT;
    delete process.env.DB_CONNECT;
  
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  
    await expect(initApp()).rejects.toEqual("DB_CONNECT is not defined");
  
    process.env.DB_CONNECT = originalEnv;
    consoleErrorSpy.mockRestore();
  });
  