import { z } from "@hono/zod-openapi";

export const ErrorSchema = z.object({
  code: z.number().openapi({
    example: 400,
  }),
  message: z.string().openapi({
    example: "Bad Request",
  }),
});

export const getResponseSchema = (schema: z.ZodTypeAny) => {
  return z.object({
    status: z.boolean(),
    data: schema,
  });
};

export const unauthorizedErrorResponse = new Response("Unauthorized", {
  status: 401,
  statusText: "Unauthorised",
  headers: {
    Authenticate: 'error="invalid_token"',
  },
});
