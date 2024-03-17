import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db } from "../../drizzle";
import { user, User } from "../../drizzle/schema";
import config from "../utils/config";
import {
  generateLoginToken,
  hashpassword,
  RandomString,
} from "../utils/helpers";
import { forgetPassSchema, loginSchema } from "../utils/schemaValidation";
import { ErrorSchema } from "../utils/shared";
import { compare } from "bcryptjs";

export const authApi = new OpenAPIHono();

export const checkUser = async (email: string) => {
  const user = await db.query.user.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, email);
    },
  });

  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  return user;
};

const login = createRoute({
  method: "post",
  path: "/login",
  summary: "login",
  description: "login",
  request: {
    body: {
      description: "login",
      content: {
        "application/json": {
          schema: loginSchema,
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
            type: "object",
            items: {
              type: "object",
              properties: {
                token: { type: "string" },
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
const getpk = createRoute({
  method: "get",
  path: "/pk",
  summary: "pk",
  description: "pk",
  request: {
    body: {
      description: "pk",
      content: {
        "application/json": {
          schema: {},
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
            type: "object",
            items: {
              type: "object",
              properties: {
                pk: { type: "string" },
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
const forgetPass = createRoute({
  method: "post",
  path: "/forget-pass",
  summary: "fp",
  description: "fp",
  request: {
    body: {
      description: "fp",
      content: {
        "application/json": {
          schema: forgetPassSchema,
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

authApi.openapi(login, async (c) => {
  let data = c.req.valid("json");

  const user = await checkUser(data.email);

  let same = await compare(data.password, user.password);
  // let same = true;

  if (!same) {
    throw new HTTPException(400, { message: "Password or Email is not valid" });
  }

  let temp: Partial<User> = user;

  delete temp.password;

  let token = generateLoginToken(user);
  return c.json(
    {
      status: true,
      data: {
        token: token,
        user: user,
      },
    },
    200
  );
});

authApi.openapi(getpk, async (c) => {
  try {
    let key = config.keys.public;
    if (!key) {
      throw new HTTPException(404, { message: "public key not found" });
    }
    return c.json(
      {
        status: true,
        data: {
          pk: key.replace(/\\n/gm, "\n"),
        },
      },
      200
    );
  } catch (e) {
    throw new HTTPException(404, { message: "public key not found" });
  }
});

authApi.openapi(forgetPass, async (c) => {
  let data = c.req.valid("json");

  const existing = await checkUser(data.email);

  let pass = RandomString(8);
  let hashpass = await hashpassword(pass);
  console.log("FORGET PASSWORD--->", pass);

  await db
    .update(user)
    .set({ password: hashpass })
    .where(eq(user.id, existing.id))
    .returning();

  return c.json(
    {
      status: true,
      data: "The new password has been mailed.",
    },
    200
  );
});
