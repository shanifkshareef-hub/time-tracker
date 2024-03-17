import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { env } from "process";
import { verifyToken } from "../utils/helpers";
import { unauthorizedErrorResponse } from "../utils/shared";

export const verifyRequest = async (c: Context, next: Next) => {
  var publicKey = env.PUBLIC_KEY ?? "";

  try {
    var access = c.req.header("Authorization");

    if (!access || !access?.startsWith("Bearer")) {
      throw new HTTPException(401, {
        res: unauthorizedErrorResponse,
        message: "Unauthorised",
      });
    }

    const tokenString = access.split(" ")[1];

    if (!tokenString) {
      throw new HTTPException(401, {
        res: unauthorizedErrorResponse,
        message: "Unauthorised",
      });
    }

    var payload = verifyToken(tokenString, publicKey);

    if (payload) {
      await next();
    } else {
      throw new HTTPException(401, {
        res: unauthorizedErrorResponse,
        message: "Unauthorised",
      });
    }
  } catch (e) {
    throw new HTTPException(401, {
      res: unauthorizedErrorResponse,
      message: "Unauthorised",
    });
  }
};
