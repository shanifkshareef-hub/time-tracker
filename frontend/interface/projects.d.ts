export type IProjects = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
};

export type ProjectStatus = "open" | "active" | "in active";
export enum Priority {
  none = "NONE",
  low = "LOW",
  medium = "MEDIUM",
  high = "HIGH",
  urgent = "URGENT",
}

export namespace ProjectForm {
  export interface Submit {
    name: string;
    description: string;
    status: ProjectStatus;
  }
}
