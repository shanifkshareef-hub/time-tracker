import dayJs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";

dayJs.extend(localizedFormat);
dayJs.extend(relativeTime);
dayJs.extend(weekday);
dayJs.extend(timezone);
dayJs.extend(utc);

export type dayJs = dayJs.Dayjs;
export const dayjs = dayJs;

export const milliToHours = (milli: number) => {
  const oneHour = 60 * 60 * 1000;
  const h = Math.floor(milli / oneHour);
  const balance = milli % oneHour;

  // var m = Math.floor(milli / 60000);
  // var s = ((milli % 60000) / 1000).toFixed(0);

  const m = Math.floor(balance / (60 * 1000));
  const s = Math.floor((balance % (60 * 1000)) / 1000);

  return { hours: h, minutes: m, seconds: s };
};
