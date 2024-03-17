import { IUsers } from "@/interface/user";
import { Resp } from "@/interface/common";
import { request, requestWithoutInterceptor } from "@/utiles/request";

const List = (): Promise<Resp<IUsers[]>> => {
  return request("v1/users");
};
// const List = (): Promise<Resp<IUsers[]>> => {
//   return requestWithoutInterceptor(
//     "https://1ab3227f-0ec4-4524-9951-ee5375c47c9b.mock.pstmn.io/users",
//     {
//       method: "GET",
//     }
//   );
// };
const Create = (data: IUsers): Promise<Resp<IUsers>> => {
  return request("v1/users", {
    method: "POST",
    data,
  });
};
const Update = (id: string, data: IUsers): Promise<Resp<IUsers[]>> => {
  return request(`v1/users/${id}`, {
    method: "PUT",
    data,
  });
};
const Delete = (id: string): Promise<Resp<IUsers[]>> => {
  return request(`v1/users/${id}`, {
    method: "DELETE",
  });
};
export default {
  List,
  Delete,
  Update,
  Create,
};
