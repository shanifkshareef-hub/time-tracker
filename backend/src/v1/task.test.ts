import api from ".";
import { headers, loginToken } from "./auth.test";
import { projectCase } from "./project.test";

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

export const taskWithProjectCase = {
  ...taskCase,
  project: expect.objectContaining(projectCase),
};

describe("GET /list tasks", () => {
  test("List all projects", async () => {
    const res = await api.request("tasks", {
      method: "GET",
      headers: { ...headers, Authorization: `Bearer ${loginToken}` },
    });

    const response = await res.json();

    expect(res.status).toBe(200);

    expect(response).toEqual(
      expect.objectContaining({
        status: expect.any(Boolean),
        data: expect.arrayContaining([
          expect.objectContaining(taskWithProjectCase),
        ]),
      })
    );
  });
});
