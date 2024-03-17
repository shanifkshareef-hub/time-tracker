import { ITask } from "@/interface/task";
import { dayjs, milliToHours } from "@/utiles/helpers";
import React, { useEffect, useRef, useState } from "react";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import TaskService from "@/service/task";

const Timer = ({ task, callback }: { task: ITask; callback(): void }) => {
  const [milliSeconds, setMilliSeconds] = useState(
    task.trackedTime +
      (task.timer && task.startTime ? dayjs().diff(dayjs(task.startTime)) : 0)
  );

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (task.timer) {
      handleTimer("start");
    } else {
      setMilliSeconds(task.trackedTime);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [task]);

  const handleTimer = async (type: "start" | "pause") => {
    if (type === "start") {
      intervalRef.current = setInterval(() => {
        setMilliSeconds((values) => {
          const temp = values + 1000;
          return temp;
        });
      }, 1000);
    } else if (type === "pause" && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const { hours, minutes, seconds } = milliToHours(milliSeconds);

  const submitTime = async (type: "start" | "pause") => {
    handleTimer(type);
    const resp = await TaskService.updateTime(task.id, { type });
    if (resp && resp.status && resp.data) {
      callback();
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div className="flex items-center space-x-1">
        {milliSeconds > 0 && (
          <div>{`${hours} h ${minutes} m ${seconds} s`}</div>
        )}
        {task.timer ? (
          <PauseCircleOutlined
            className="cursor-pointer text-base !text-green-400"
            onClick={() => {
              submitTime("pause");
            }}
          />
        ) : (
          <PlayCircleOutlined
            className="text-base !text-gray-400 cursor-pointer"
            onClick={() => {
              submitTime("start");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Timer;
