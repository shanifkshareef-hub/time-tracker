import { IProjects } from "@/interface/projects";
import { Resp } from "@/interface/common";
import { requestWithoutInterceptor, request } from "@/utiles/request";
import { ITask, TaskForm } from "@/interface/task";
const List = (): Promise<Resp<IProjects[]>> => {
  return requestWithoutInterceptor(
    "https://6463710e-6f11-479b-8c66-e92a265b81ee.mock.pstmn.io/projects",
    {
      method: "GET",
    }
  );
};
const Delete = (id: string): Promise<Resp<ITask>> => {
  return request(`v1/tasks/${id}`, {
    method: "DELETE",
  });
};
const Create = (data: TaskForm.Submit): Promise<Resp<ITask>> => {
  return request("v1/tasks", {
    method: "POST",
    data,
  });
};
const Update = (id: string, data: TaskForm.Submit): Promise<Resp<ITask>> => {
  return request(`v1/tasks/${id}`, {
    method: "PUT",
    data,
  });
};
const GetById = (id: string): Promise<Resp<IProjects>> => {
  return request(`v1/tasks/${id}`, {
    method: "GET",
  });
};

const updateTime = (
  id: string,
  data: { type: "start" | "pause" }
): Promise<Resp<ITask>> => {
  return request(`v1/tasks/track-time/${id}`, {
    method: "PATCH",
    data,
  });
};

export default {
  List,
  Delete,
  GetById,
  Create,
  Update,
  updateTime,
};
