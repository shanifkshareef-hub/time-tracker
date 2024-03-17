"use client";
import Layouts from "@/components/common/Layout";
import React, { useEffect, useState } from "react";
import CreateUser from "./CreateUser";
import { IUsers } from "interface/user";
import service from "@/service/user";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Table } from "antd";
const page = () => {
  const [open, setopen] = useState<boolean>(false);
  const [users, setusers] = useState<IUsers[]>();
  const [selecteduser, setselecteduser] = useState<IUsers>();
  const onClose = () => {
    setopen(!open);
  };
  const getUsers = async () => {
    const res = await service.List();
    if (res.status && res.data) {
      setusers(res.data);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  const deleteUser = async (id: string) => {
    const res = await service.Delete(id);
    if (res.status) {
      getUsers();
    }
  };
  const columns = [
    {
      title: <div className="tabelTitle">Name</div>,
      key: "name",
      width: "15%",
      align: "center" as const,
      render: ({ firstName }: IUsers) => {
        return <p className="m-0 text-sm lg:text-xs">{firstName}</p>;
      },
    },
    {
      title: <div className="tabelTitle">Mobile Number</div>,
      key: "phone",
      width: "18%",
      align: "center" as const,
      render: ({ mobile }: IUsers) => {
        return <p className="m-0  text-sm lg:text-xs">{mobile}</p>;
      },
    },
    {
      title: <div className="tabelTitle">Email ID</div>,
      key: "email",
      width: "27%",
      align: "center" as const,
      render: ({ email }: IUsers) => {
        return <p className="m-0  text-sm text-primary lg:text-xs">{email}</p>;
      },
    },

    {
      title: <div className=" tabelTitle">Actions</div>,
      key: "action",
      width: "15%",
      align: "center" as const,
      render: (user: IUsers) => {
        return (
          <div className="flex gap-5 justify-center">
            <EditOutlined
              className="cursor-pointer text-blue-400"
              onClick={() => {
                setselecteduser(user);
                onClose();
              }}
              style={{ color: "blue" }}
            />
            {/* <DeleteOutlined
              onClick={() => {
                deleteUser(user.id);
              }}
              style={{ color: "red" }}
            /> */}
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Layouts>
        <div className="flex justify-between my-4">
          <div className="text-xl font-semibold">Users</div>
          <button
            className="bg-blue-500 p-2 font-medium text-sm text-white rounded-md"
            onClick={() => onClose()}
          >
            Create User
          </button>
        </div>
        <Table
          dataSource={users?.map((e) => e)}
          columns={columns}
          loading={{ spinning: users ? false : true }}
        />

        <CreateUser
          onClose={() => {
            onClose();
            setselecteduser(undefined);
          }}
          open={open}
          user={selecteduser}
          callback={getUsers}
        />
      </Layouts>
    </div>
  );
};

export default page;
