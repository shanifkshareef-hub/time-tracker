/**
 :: Request network request tool.
    More detailed api documentation: https://github.com/umijs/umi-request.
    Adapted from ant-design-pro
 */
import { notification } from "antd";
import { extend } from "umi-request";

export const HOST: string = process.env.NEXT_PUBLIC_API_HOST as string;

const codeMessage: Record<number, string> = {
  200: "The server successfully returned the requested data.",
  201: "The new or modified data was successful.",
  202: "A request has entered the background queue (asynchronous task).",
  204: "The deletion of data was successful.",
  400: "There was an error in the request and the server did not take action to create or modify the data.",
  401: "The user does not have permissions (token, user name, password error).",
  403: "Users are authorized, but access is prohibited.",
  404: "Requests are made for records that do not exist and the server does not operate.",
  406: "The format of the request is not available.",
  410: "The requested resource is permanently deleted and is no longer available.",
  422: "When an object is created, a validation error occurs.",
  500: "There is an error with the server, please check the server.",
  502: "Gateway error.",
  503: "The service is not available, the server is temporarily overloaded or maintained.",
  504: "The gateway timed out.",
};

/**
            :: Exception handler.
            */
export const errorHandler = async (error: {
  response: Response;
}): Promise<Response> => {
  const { response } = error;
  if (response && response.status) {
    const parsedResponse = await response.json();
    // const { status } = response;
    const message = parsedResponse.message || parsedResponse.error;
    if (response.status == 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    notification.error({
      message: message.charAt(0).toUpperCase().concat(message.substring(1)),
      // description: codeMessage[status]
    });
  } else if (!response) {
    notification.error({
      description:
        "Your network has an exception and cannot connect to the server",
      message: "Network anomaly",
    });
  }
  return response;
};

export const requestWithoutInterceptor = extend({
  errorHandler,
});

/**
         Configure the default parameters for request requests.
        */
export const request = extend({
  errorHandler, // Default error handling.
});

request.interceptors.request.use(
  (u, options) => {
    console.log("host", HOST.concat(u));

    return {
      url: HOST.concat(u),
      options: {
        ...options,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        interceptors: true,
      },
    };
  },
  { global: false }
);

export default request;
