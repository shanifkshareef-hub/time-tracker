import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db } from "../../drizzle";

import { user } from "../../drizzle/schema";
import { hashpassword, RandomString, transformErrors } from "../utils/helpers";
import { CreateUserSchema, idParamsSchema } from "../utils/schemaValidation";
import { ErrorSchema } from "../utils/shared";
import { verifyRequest } from "./middlewares";

export const usersApi = new OpenAPIHono({
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

const getUsers = createRoute({
  method: "get",
  path: "/",
  summary: "Get all users",
  description: "Get all users",
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

const createUser = createRoute({
  method: "post",
  path: "/",
  summary: "create users",
  description: "create users",
  request: {
    body: {
      description: "The create a user",
      content: {
        "application/json": {
          schema: CreateUserSchema,
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

const updateUser = createRoute({
  method: "put",
  path: "/:id",
  summary: "update users",
  description: "update users",
  request: {
    body: {
      description: "The update a user",
      content: {
        "application/json": {
          schema: CreateUserSchema,
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

usersApi.use(getUsers.getRoutingPath(), verifyRequest);

usersApi.openapi(getUsers, async (c) => {
  let users = await db.query.user.findMany({
    columns: {
      countryCode: true,
      createdAt: true,
      email: true,
      firstName: true,
      lastName: true,
      id: true,
      mobile: true,
      updatedAt: true,
    },
  });

  return c.json(
    {
      status: true,
      data: users,
    },
    200
  );
});

usersApi.openapi(createUser, async (c) => {
  let data = c.req.valid("json");

  let existing = await db.query.user.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, data.email ?? "");
    },
  });

  if (existing) {
    throw new HTTPException(400, { message: "Email already exists" });
  }

  let pass = RandomString(8);
  let hashedPass = await hashpassword(pass);

  const resp = await db
    .insert(user)
    .values({ ...data, password: hashedPass })
    .returning();

  const { password, ...rest } = resp[0];

  return c.json(
    {
      status: true,
      data: rest,
    },
    200
  );
});

usersApi.openapi(updateUser, async (c) => {
  let data = c.req.valid("json");
  let { id } = c.req.valid("param");

  let existing = await db.query.user.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!existing) {
    throw new HTTPException(400, { message: "User not found" });
  }

  const updatedUser = await db
    .update(user)
    .set(data)
    .where(eq(user.id, id))
    .returning();

  return c.json(
    {
      status: true,
      data: updatedUser,
    },
    200
  );
});
