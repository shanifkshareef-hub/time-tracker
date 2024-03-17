import { OpenAPIHono } from "@hono/zod-openapi";
import { authApi } from "./auth";
import { projectsApi } from "./project";
import { tasksApi } from "./task";

import { usersApi } from "./users";

const api = new OpenAPIHono();
api.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Time Tracker API",
  },
});

api.route("/auth", authApi);
api.route("/users", usersApi);
api.route("/projects", projectsApi);
api.route("/tasks", tasksApi);

export default api;
