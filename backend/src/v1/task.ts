import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import dayjs from "dayjs";
import { AnyColumn, eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db } from "../../drizzle";
import { task } from "../../drizzle/schema";
import { transformErrors } from "../utils/helpers";
import {
  createTaskSchema,
  idParamsSchema,
  updateTimeSchema,
} from "../utils/schemaValidation";
import { ErrorSchema } from "../utils/shared";
import { verifyRequest } from "./middlewares";

export const tasksApi = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (result.success) {
      return;
    }
    return c.json(
      {
        message: "Validation failed",
        cause: transformErrors(result.error.format()),
      },
      422
    );
  },
});

const getTasks = createRoute({
  method: "get",
  path: "/:projectId",
  summary: "Get all tasks",
  description: "Get all tasks",
  request: {
    params: z.object({
      projectId: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
                email: { type: "string" },
              },
            },
          },
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

const createTask = createRoute({
  method: "post",
  path: "/",
  summary: "create tasks",
  description: "create tasks",
  request: {
    body: {
      description: "The create a task",
      content: {
        "application/json": {
          schema: createTaskSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "string",
          },
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

const updateTask = createRoute({
  method: "put",
  path: "/:id",
  summary: "update tasks",
  description: "update tasks",
  request: {
    body: {
      description: "The update a task",
      content: {
        "application/json": {
          schema: createTaskSchema,
        },
      },
    },
    params: idParamsSchema,
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "string",
          },
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

const updateTime = createRoute({
  method: "patch",
  path: "track-time/:id",
  summary: "update tracked time",
  description: "update tracked time",
  request: {
    body: {
      description: "Update the tracked time",
      content: {
        "application/json": {
          schema: updateTimeSchema,
        },
      },
    },
    params: idParamsSchema,
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "string",
          },
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

const deleteProject = createRoute({
  method: "delete",
  path: "/:id",
  summary: "delete projects",
  description: "delete projects",
  request: {
    params: idParamsSchema,
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "string",
          },
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
    },
  },
});

tasksApi.use(getTasks.getRoutingPath(), verifyRequest);
tasksApi.use(createTask.getRoutingPath(), verifyRequest);
tasksApi.use(updateTask.getRoutingPath(), verifyRequest);
tasksApi.use(deleteProject.getRoutingPath(), verifyRequest);
tasksApi.use(updateTime.getRoutingPath(), verifyRequest);

tasksApi.openapi(getTasks, async (c) => {
  const { projectId } = c.req.valid("param");

  let tasks = await db.query.task.findMany({
    where(fields, { eq }) {
      return eq(fields.projectId, projectId);
    },
    orderBy(fields, { asc }) {
      return asc(fields.createdAt);
    },
    with: {
      assignedTo: true,
    },
  });

  console.log("tasks", tasks);

  return c.json(
    {
      status: true,
      data: tasks,
    },
    200
  );
});

tasksApi.openapi(createTask, async (c) => {
  let data = c.req.valid("json");

  const createdTask = await db.insert(task).values(data).returning();

  return c.json(
    {
      status: true,
      data: createdTask,
    },
    200
  );
});

tasksApi.openapi(updateTask, async (c) => {
  let data = c.req.valid("json");
  let { id } = c.req.valid("param");

  const existing = await db.query.task.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!existing) {
    throw new HTTPException(404, { message: "Task not found" });
  }

  const updatedProject = await db
    .update(task)
    .set(data)
    .where(eq(task.id, id))
    .returning();

  return c.json(
    {
      status: true,
      data: updatedProject,
    },
    200
  );
});

tasksApi.openapi(updateTime, async (c) => {
  let data = c.req.valid("json");
  let { id } = c.req.valid("param");

  const existing = await db.query.task.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!existing) {
    throw new HTTPException(404, { message: "Task not found" });
  }

  let diff = 0;
  if (data.type === "pause" && existing.startTime) {
    diff = dayjs().diff(dayjs(existing.startTime));
  }

  const increment = (column: AnyColumn, value: number) => {
    return sql`${column} + ${value}`;
  };

  const updatedProject = await db
    .update(task)
    .set({
      timer: data.type === "start" ? true : false,
      startTime: data.type === "start" ? dayjs().format() : existing.startTime,
      trackedTime: increment(task.trackedTime, diff),
    })
    .where(eq(task.id, id))
    .returning();

  return c.json(
    {
      status: true,
      data: updatedProject[0],
    },
    200
  );
});

tasksApi.openapi(deleteProject, async (c) => {
  let { id } = c.req.valid("param");

  const existing = await db.query.task.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!existing) {
    throw new HTTPException(404, { message: "Task not found" });
  }

  const deletedTask = await db.delete(task).where(eq(task.id, id)).returning();

  return c.json(
    {
      status: true,
      data: deletedTask[0],
    },
    200
  );
});
