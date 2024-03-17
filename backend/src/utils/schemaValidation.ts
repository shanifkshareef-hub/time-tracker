import { z } from "@hono/zod-openapi";
import { taskPriority, taskStatus } from "../../drizzle/schema";

export const idParamsSchema = z.object({
  id: z.string().uuid(),
});

export const CreateUserSchema = z
  .object({
    firstName: z.string().min(1),
    mobile: z.string().min(5),
    email: z.string().email(),
    countryCode: z.string().min(2).optional(),
    password: z.string().min(8).optional(),
  })
  .openapi({
    required: ["firstName", "mobile", "email"],
  });

export const createProjectSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    status: z.enum(["open", "active", "in active"]),
  })
  .openapi({
    required: ["project"],
  });

export const emailSchema = z.string().email();
export const opt = z
  .object({
    email: emailSchema,
  })
  .openapi({
    required: ["email"],
  });
export const verifyotp = z
  .object({
    email: emailSchema,
    otp: z.number(),
  })
  .openapi({
    required: ["email", "otp"],
  });

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string(),
  })
  .openapi({
    required: ["email", "password"],
  });
export const forgetPassSchema = z
  .object({
    email: z.string().email(),
  })
  .openapi({
    required: ["email"],
  });

export const createTaskSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    projectId: z.string().uuid(),
    deadline: z.string().datetime().optional(),
    assignedToUserId: z.string().uuid().optional(),
    status: z.enum(taskStatus).optional(),
    priority: z.enum(taskPriority).optional(),
    trackedTime: z.number().optional(),
  })
  .openapi({
    required: ["name", "description", "projectId"],
  });

export const updateTimeSchema = z
  .object({
    type: z.enum(["start", "pause"]),
  })
  .openapi({
    required: ["type"],
  });
