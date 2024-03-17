"use client";
import Layouts from "@/components/common/Layout";
import React, { useEffect, useState } from "react";
import service from "@/service/projects";
import { GrInProgress } from "react-icons/gr";
import { Empty } from "antd";
import CreateTask from "./CreateTask";
import TaskComponent from "@/components/common/Task";
import { ITask } from "@/interface/task";
import { IProjects } from "@/interface/projects";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  const [open, setopen] = useState<boolean>(false);
  const [selectedTask, setselectedTask] = useState<ITask>();
  const [project, setProject] = useState<IProjects>();

  const getProject = async () => {
    const res = await service.GetProject(id);

    if (res.status && res.data) {
      setProject(res.data);
    }
  };
  const onClose = () => {
    setopen(!open);
  };
  useEffect(() => {
    getProject();
  }, []);

  return (
    <Layouts>
      <CreateTask
        callback={getProject}
        onClose={onClose}
        open={open}
        task={selectedTask}
        projectId={id}
      />
      <div className="px-3 overflow-y-auto h-[98vh]">
        <div className="flex justify-between py-2 items-center">
          <p className="p-2 font-semibold text-xl">
            {project ? project.name : "Tasks"}
          </p>
          <button
            className="px-2 h-8 bg-blue-500 text-white rounded-md"
            onClick={() => {
              setselectedTask(undefined);
              onClose();
            }}
          >
            Create Task
          </button>
        </div>
        {project && (
          <div>
            <div className="my-2 flex gap-2 items-center text-lg">
              <GrInProgress className="text-yellow-400" />
              Tasks
            </div>
            <div className="h-80 overflow-y-auto bg-white p-2 rounded-lg shadow-md">
              {project.tasks.length > 0 ? (
                project.tasks.map((obj, i) => {
                  return (
                    <TaskComponent
                      key={`task-${i}`}
                      task={obj}
                      onClose={onClose}
                      onEdit={(task) => {
                        onClose();
                        setselectedTask(task);
                      }}
                      callback={getProject}
                    />
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center">
                  <Empty />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layouts>
  );
};

export default Page;
