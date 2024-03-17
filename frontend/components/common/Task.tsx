import React from "react";
import { FaCircle } from "react-icons/fa";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ITask } from "@/interface/task";
import { dayjs } from "@/utiles/helpers";
import TaskService from "@/service/task";
import { message } from "antd";
import Timer from "../timeTracker/Timer";

type TaskProps = {
  task: ITask;
  onClose: () => void;
  onEdit: (task: ITask) => void;
  callback(): void;
};

const TaskComponent: React.FC<TaskProps> = ({ task, onEdit, callback }) => {
  const handleDelete = async () => {
    const resp = await TaskService.Delete(task.id);
    if (resp && resp.status && resp.data) {
      callback();
      message.success("Task deleted");
    }
  };

  return (
    <div
      key={task.id}
      className="text-sm font-normal flex  justify-between bg-gray-100 rounded-md px-2 my-1 shadow-sm"
    >
      <div>
        <p className="pl-5 text-sm text-gray-400 py-2">Name</p>
        <p className="flex gap-3 items-center text-xs">
          <FaCircle size={10} />
          {task.name}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-400 py-2 ">Description</p>
        <p className="w-48 h-16 overflow-y-auto text-wrap text-xs ">
          {task.description ?? "-"}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-400 py-2 ">Priority</p>
        <p className=" text-wrap text-xs">{task.priority}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400 py-2 ">User to assign</p>
        <p className=" text-wrap text-xs">
          {task.assignedTo
            ? `${task.assignedTo.firstName} ${task.assignedTo.lastName ?? ""}`
            : "-"}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-400 py-2 ">Tracked Time</p>
        <p className=" text-wrap text-xs">
          <Timer task={task} callback={callback} />
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-400 py-2 ">created At</p>
        <p className=" text-wrap text-xs">
          {dayjs(task.createdAt).format("lll")}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-400 py-2 ">Deadline</p>
        <p className=" text-wrap text-xs">
          {task.deadline ? dayjs(task.deadline).format("lll") : "-"}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-400 py-2 ">Edit</p>
        <div className=" text-wrap text-xs">
          <div className="flex gap-5 justify-center">
            <EditOutlined
              className="cursor-pointer text-blue-400"
              onClick={() => onEdit(task)}
              style={{ color: "blue" }}
            />
            <DeleteOutlined onClick={handleDelete} style={{ color: "red" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskComponent;
