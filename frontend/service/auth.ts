import { Resp } from "@/interface/common";
import { request } from "@/utiles/request";

const Login = (data: {
  email: string;
  password: string;
}): Promise<Resp<any>> => {
  return request("v1/auth/login", {
    method: "POST",
    data,
  });
};
export default {
  Login,
};
