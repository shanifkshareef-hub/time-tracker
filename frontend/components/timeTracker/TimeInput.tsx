import { milliToHours } from "@/utiles/helpers";
import React, { useEffect, useState } from "react";

export interface TimeInput {
  onchange(time: number): void;
  value?: number;
}
const TimeInput: React.FC<TimeInput> = ({ onchange, value }) => {
  const [duration, setDuration] = useState<{
    hours: number;
    minutes: number;
  }>({ hours: 0, minutes: 0 });

  useEffect(() => {
    convertToMilli();
  }, [duration]);

  useEffect(() => {
    value && setDuration(milliToHours(value));
  }, [value]);

  const convertToMilli = () => {
    const hoursMilli = duration.hours * 60 * 60 * 1000;
    const minutesMilli = duration.minutes * 60 * 1000;
    onchange(hoursMilli + minutesMilli);
  };

  return (
    <div>
      <div className="grid grid-cols-2 pb-2">
        <p>Hours</p>
        <p>Minutes</p>
      </div>

      <div className="grid grid-cols-2 rounded-md border-gray-300 border px-4 py-1">
        <div>
          <input
            type="number"
            placeholder="hh"
            className="border-none outline-none"
            value={duration.hours}
            onChange={(e) => {
              setDuration({ ...duration, hours: Number(e.target.value) });
            }}
          />
        </div>
        <div className="col-span-1 flex items-center">
          :
          <div className="pl-2">
            <input
              maxLength={2}
              max={60}
              type="number"
              placeholder="mm"
              className="border-none outline-none"
              value={duration.minutes}
              onChange={(e) => {
                setDuration({ ...duration, minutes: Number(e.target.value) });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeInput;
