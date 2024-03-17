import {
  InferModelFromColumns,
  InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";

import {
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  integer,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email").notNull(),
  password: text("password").notNull(),
  mobile: varchar("phone", { length: 256 }).notNull(),
  countryCode: varchar("country_code", { length: 5 }).notNull().default("+91"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(user);
export const selectUserSchema = createSelectSchema(user);
export type User = typeof user.$inferSelect; // return type when queried
export type NewUser = typeof user.$inferInsert; // insert type

export const usersRelations = relations(user, ({ many }) => ({
  assignedTasks: many(task),
}));

export const projectStatus: [string, ...string[]] = ["open", "active", "in active"];

export const project = pgTable("project", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  status: text("status", { enum: projectStatus }).notNull().default("open"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projectRelations = relations(project, ({ many }) => ({
  tasks: many(task),
}));

export const insertProjectSchema = createInsertSchema(project);
export type ProjectType = typeof project.$inferSelect;
export type Task = typeof task.$inferSelect;
export type Project = ProjectType & { tasks: Task[] };

export const taskStatus: [string, ...string[]] = [
  "open",
  "completed",
  "in progress",
  "closed",
];
export const taskPriority: [string, ...string[]] = [
  "none",
  "low",
  "medium",
  "high",
  "urgent",
];

export const task = pgTable("task", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status", {
    enum: taskStatus,
  })
    .notNull()
    .default("open"),
  priority: text("priority", {
    enum: taskPriority,
  })
    .default("none")
    .notNull(),
  deadline: text("deadline"),
  assignedToUserId: uuid("assigned_to_user_id"),
  projectId: uuid("project_id")
    .references(() => project.id, { onDelete: "cascade" })
    .notNull(),
  startTime: text("start_time"),
  timer: boolean("timer").default(false),
  trackedTime: integer("tracked_time").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const taskRelations = relations(task, ({ one }) => ({
  assignedTo: one(user, {
    fields: [task.assignedToUserId],
    references: [user.id],
  }),
  project: one(project, {
    fields: [task.projectId],
    references: [project.id],
  }),
}));
