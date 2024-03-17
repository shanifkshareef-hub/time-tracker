"use client";
import Layouts from "@/components/common/Layout";
import { IProjects } from "@/interface/projects";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import service from "@/service/projects";
import CreateProjects from "./CreateProjects";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const page = () => {
  const [open, setopen] = useState<boolean>(false);
  const [projects, setprojects] = useState<IProjects[]>();
  const router = useRouter();
  const [selectedProjects, setselectedProjects] = useState<IProjects>();

  const getprojects = async () => {
    const res = await service.List();
    if (res.status && res.data) {
      setprojects(res.data);
    }
  };

  useEffect(() => {
    getprojects();
  }, []);

  const onClose = () => {
    setopen(!open);
  };

  const deleteProject = async (id: string) => {
    const res = await service.Delete(id);
    if (res.status) {
      getprojects();
    }
  };
  const columns = [
    {
      title: <div className="tabelTitle">Name</div>,
      key: "name",
      width: "15%",
      align: "center" as const,
      render: ({ name }: IProjects) => {
        return <p className="m-0 text-sm lg:text-xs">{name}</p>;
      },
    },
    {
      title: <div className="tabelTitle">Description</div>,
      key: "phone",
      width: "18%",
      align: "center" as const,
      render: ({ description }: IProjects) => {
        return <p className="m-0  text-sm lg:text-xs">{description}</p>;
      },
    },
    {
      title: <div className="tabelTitle">Status</div>,
      key: "email",
      width: "27%",
      align: "center" as const,
      render: ({ status }: IProjects) => {
        return <p className="m-0  text-sm text-primary lg:text-xs">{status}</p>;
      },
    },

    {
      title: <div className=" tabelTitle">Add task</div>,
      key: "action",
      width: "15%",
      align: "center" as const,
      render: (project: IProjects) => {
        return (
          <div className="flex gap-5 justify-center">
            <button
              className="bg-blue-500 rounded-md px-2 py-1 text-white text-xs"
              onClick={() => {
                router.push(`/projects/${project.id}`);
              }}
            >
              View Task
            </button>
          </div>
        );
      },
    },
    {
      title: <div className=" tabelTitle">Actions</div>,
      key: "action",
      width: "15%",
      align: "center" as const,
      render: (user: IProjects) => {
        return (
          <div className="flex gap-5 justify-center">
            <EditOutlined
              className="cursor-pointer text-blue-400 "
              onClick={() => {
                setselectedProjects(user);
                onClose();
              }}
              style={{ color: "blue" }}
            />
            <DeleteOutlined
              onClick={() => {
                deleteProject(user.id);
              }}
              style={{ color: "red" }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Layouts>
        <div className="flex justify-between my-4">
          <div className="text-xl font-semibold">Projects</div>

          <button
            className="bg-blue-500 p-2 text-sm text-white rounded-md"
            onClick={() => {
              onClose();
            }}
          >
            Create Project
          </button>
        </div>
        <Table
          dataSource={projects?.map((e) => e)}
          columns={columns}
          loading={{ spinning: projects ? false : true }}
        />
        <CreateProjects
          onClose={() => {
            onClose();
            setselectedProjects(undefined);
          }}
          open={open}
          project={selectedProjects}
          callback={getprojects}
        />
      </Layouts>
    </div>
  );
};

export default page;
