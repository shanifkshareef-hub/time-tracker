import { IUsers } from "./user";

export type TaskStatus = "open" | "completed" | "in progress" | "closed";
export type TaskPriority = "none" | "low" | "medium" | "high" | "urgent";
export interface ITask {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  assignedToUserId: string;
  projectId: string;
  trackedTime: number;
  startTime: string;
  timer: boolean;
  assignedTo: IUsers;
  createdAt: string;
  updatedAt: string;
}

export namespace TaskForm {
  export interface Submit {
    name: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    deadline?: string;
    assignedToUserId?: string;
    projectId: string;
    trackedTime?: number;
  }
}
