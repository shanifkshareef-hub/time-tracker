import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db } from "../../drizzle";
import { project, task } from "../../drizzle/schema";
import { transformErrors } from "../utils/helpers";
import { createProjectSchema, idParamsSchema } from "../utils/schemaValidation";
import { ErrorSchema } from "../utils/shared";
import { verifyRequest } from "./middlewares";

export const projectsApi = new OpenAPIHono({
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

export const checkProject = async (id: string) => {
  const existingProject = await db.query.project.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
    with: {
      tasks: true,
    },
  });

  if (!existingProject) {
    throw new HTTPException(404, { message: "Project not found" });
  }

  return existingProject;
};

const getProjects = createRoute({
  method: "get",
  path: "/",
  summary: "Get all projects",
  description: "Get all projects",
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

const getProject = createRoute({
  method: "get",
  path: "/:id",
  summary: "Get all projects",
  description: "Get all projects",
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
  request: {
    params: idParamsSchema,
  },
});
const createProject = createRoute({
  method: "post",
  path: "/",
  summary: "create projects",
  description: "create projects",
  request: {
    body: {
      description: "The create a user",
      content: {
        "application/json": {
          schema: createProjectSchema,
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

const updateProject = createRoute({
  method: "put",
  path: "/:id",
  summary: "update projects",
  description: "update projects",
  request: {
    body: {
      description: "The update a project",
      content: {
        "application/json": {
          schema: createProjectSchema,
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

projectsApi.use(getProjects.getRoutingPath(), verifyRequest);
projectsApi.use(getProject.getRoutingPath(), verifyRequest);
projectsApi.use(createProject.getRoutingPath(), verifyRequest);
projectsApi.use(updateProject.getRoutingPath(), verifyRequest);
projectsApi.use(deleteProject.getRoutingPath(), verifyRequest);

projectsApi.openapi(getProjects, async (c) => {
  let projects = await db.query.project.findMany({
    with: { tasks: true },
  });

  return c.json(
    {
      status: true,
      data: projects,
    },
    200
  );
});

projectsApi.openapi(getProject, async (c) => {
  const { id } = c.req.valid("param");

  let project = await db.query.project.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, id);
    },
    with: {
      tasks: {
        with: { assignedTo: true },
        orderBy(fields, { asc }) {
          return asc(fields.createdAt);
        },
      },
    },
  });

  if (!project) {
    throw new HTTPException(404, { message: "Project not found" });
  }

  return c.json(
    {
      status: true,
      data: project,
    },
    200
  );
});

projectsApi.openapi(createProject, async (c) => {
  let data = c.req.valid("json");

  const createdProject = await db.insert(project).values(data).returning();

  return c.json(
    {
      status: true,
      data: createdProject[0],
    },
    200
  );
});

projectsApi.openapi(updateProject, async (c) => {
  let data = c.req.valid("json");
  let { id } = c.req.valid("param");

  await checkProject(id);

  const updatedProject = await db
    .update(project)
    .set(data)
    .where(eq(project.id, id))
    .returning();

  return c.json(
    {
      status: true,
      data: updatedProject,
    },
    200
  );
});

projectsApi.openapi(deleteProject, async (c) => {
  let { id } = c.req.valid("param");

  await checkProject(id);

  const existing = await db.query.project.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!existing) {
    throw new HTTPException(404, { message: "Project not found" });
  }

  const updatedProject = await db
    .delete(project)
    .where(eq(project.id, id))
    .returning();

  return c.json(
    {
      status: true,
      data: updatedProject[0],
    },
    200
  );
});
