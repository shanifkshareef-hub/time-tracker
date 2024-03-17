import api from ".";
import { projectStatus } from "../../drizzle/schema";
import { headers, loginToken } from "./auth.test";

export const taskCase = {
  id: expect.any(String),
  name: expect.any(String),
  description: expect.toBeOneOf([expect.any(String), null]),
  status: expect.toBeOneOf(["open", "in progress", "completed"]),
  priority: expect.any(String),
  deadline: expect.toBeOneOf([expect.any(String), null]),
  assignedToUserId: expect.toBeOneOf([expect.any(String), null]),
  projectId: expect.any(String),
  startTime: expect.toBeOneOf([expect.any(String), null]),
  timer: expect.any(Boolean),
  trackedTime: expect.any(Number),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
};

export const projectCase = {
  id: expect.any(String),
  name: expect.any(String),
  status: expect.toBeOneOf(projectStatus),
  description: expect.toBeOneOf([expect.any(String), null]),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
};

export const projectWithTasksCase = {
  ...projectCase,
  tasks: expect.arrayContaining([
    expect.toBeOneOf([expect.objectContaining(taskCase), expect.toBeEmpty()]),
  ]),
};

export const taskWithProjectCase = {
  ...taskCase,
  project: expect.objectContaining(projectCase),
};

describe("GET /list projects", () => {
  test("List all projects", async () => {
    const res = await api.request("projects", {
      method: "GET",
      headers: { ...headers, Authorization: `Bearer ${loginToken}` },
    });

    const response = await res.json();

    expect(res.status).toBe(200);

    expect(response).toEqual(
      expect.objectContaining({
        status: expect.any(Boolean),
        data: expect.arrayContaining([
          expect.objectContaining(projectWithTasksCase),
        ]),
      })
    );
  });
});

const projectCreateData = {
  name: "test project",
  status: "open",
};

describe("GET /create projects", () => {
  test("Create a projects", async () => {
    const res = await api.request("projects", {
      method: "POST",
      headers: { ...headers, Authorization: `Bearer ${loginToken}` },
      body: JSON.stringify(projectCreateData),
    });

    const response = await res.json();

    expect(res.status).toBe(200);

    expect(response).toEqual(
      expect.objectContaining({
        status: expect.any(Boolean),
        data: expect.objectContaining(projectCase),
      })
    );
  });
});
