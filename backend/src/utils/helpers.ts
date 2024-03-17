import { verify, sign } from "jsonwebtoken";
import { genSalt, hash } from "bcryptjs";
import config from "./config";
import dayJs, { extend, Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";

// extend(localizedFormat);
// extend(relativeTime);
// extend(weekday);
// extend(timezone);
// extend(utc);

export type dayJs = Dayjs;
export const dayjs = dayJs;

export function transformErrors(data: any) {
  const result: Record<string, string> = {};

  for (const key in data) {
    if (Array.isArray(data[key]._errors) && data[key]._errors.length > 0) {
      result[key] = data[key]._errors.join(", ");
    }
  }

  return result;
}
export const verifyToken = (token: string, publicKey: string) => {
  return verify(token, publicKey);
};

export const hashpassword = async (password: string) => {
  let salt = await genSalt(14);
  let hashedPass = await hash(password, salt);
  return hashedPass;
};

export const generateLoginToken = (user: any): string => {
  let key = config.keys.private;
  if (!key) {
    return "";
  }
  let privateKey = key.replace(/\\n/gm, "\n");
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    iat: Math.floor(Date.now() / 1000) - 60,
  };
  var token = sign(payload, privateKey, {
    expiresIn: "3d",
    algorithm: "RS256",
  });
  return token;
};
export function RandomString(length: number) {
  let result = "";
  const characters = "ABCDEFGHKMNOPQRSTUVWXYZabcdefghkmnopqrstuvwxyz023456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
