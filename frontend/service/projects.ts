import { IProjects, ProjectForm } from "@/interface/projects";
import { Resp } from "@/interface/common";
import { requestWithoutInterceptor, request } from "@/utiles/request";
import { ITask } from "@/interface/task";
// const List = (): Promise<Resp<IProjects[]>> => {
//   return requestWithoutInterceptor(
//     "https://6463710e-6f11-479b-8c66-e92a265b81ee.mock.pstmn.io/projects",
//     {
//       method: "GET",
//     }
//   );
// };

const List = (): Promise<Resp<IProjects[]>> => {
  return request("v1/projects");
};
const GetProject = (id: string): Promise<Resp<IProjects>> => {
  return request(`v1/projects/${id}`);
};
const Delete = (id: string): Promise<Resp<IProjects>> => {
  return request(`v1/projects/${id}`, {
    method: "DELETE",
  });
};
const Create = (data: ProjectForm.Submit): Promise<Resp<IProjects>> => {
  return request("v1/projects", {
    method: "POST",
    data,
  });
};
const Update = (
  id: string,
  data: ProjectForm.Submit
): Promise<Resp<IProjects>> => {
  return request(`v1/projects/${id}`, {
    method: "PUT",
    data,
  });
};
const GetById = (id: string): Promise<Resp<ITask[]>> => {
  return request(`v1/tasks/${id}`);
};
export default {
  List,
  Delete,
  GetById,
  Create,
  Update,
  GetProject,
};
