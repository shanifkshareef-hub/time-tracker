import { Drawer, Form, Input } from "antd";
import { IUsers } from "interface/user";
import service from "@/service/user";

import React, { useEffect } from "react";
type Createuser = {
  onClose: () => void;
  open: boolean;
  user: IUsers | undefined;
  callback: () => void;
};
const CreateUser: React.FC<Createuser> = ({
  onClose,
  open,
  user,
  callback,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName ? user.lastName : undefined,
        email: user.email ? user.email : undefined,
        mobile: user.mobile ? user.mobile : undefined,
      });
      form.setFieldsValue(user);
    }
    return () => {
      form.resetFields();
    };
  }, [user]);

  const handleSubmit = async (values: IUsers) => {
    if (user) {
      const res = await service.Update(user.id, values);
      if (res.status && res.data) {
        callback();
      }
    } else {
      const res = await service.Create(values);
      if (res.status && res.data) {
        callback();
      }
    }
    onClose();
  };

  return (
    <div>
      <Drawer
        title={user ? "Update User" : "Create User"}
        onClose={onClose}
        open={open}
        destroyOnClose={true}
        width={550}
      >
        <div className="flex flex-col h-full justify-between">
          <Form
            layout="vertical"
            form={form}
            id="user-form"
            onFinish={handleSubmit}
            className="w-full"
          >
            <Form.Item
              className="form-label "
              label={"First name"}
              name={"firstName"}
              rules={[
                { required: true, message: "First name Required" },
                {
                  min: 5,
                  message: "minimum of 5 charactors",
                },
                {
                  max: 25,
                  message: "maximum 25 charactors",
                },
              ]}
              validateFirst
            >
              <Input placeholder={"First Name"} />
            </Form.Item>
            <Form.Item
              className="form-label "
              label={"Last name"}
              name={"lastName"}
              validateFirst
            >
              <Input placeholder={"Last Name"} />
            </Form.Item>
            <Form.Item
              className="form-label "
              label={"Email address"}
              name={"email"}
              rules={[
                { required: true, message: "Email  Required " },
                {
                  validator(_, value: string) {
                    if (
                      !value.match(
                        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                      )
                    ) {
                      return Promise.reject(new Error("Enter vaild email"));
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
              validateFirst
            >
              <Input placeholder={"Email"} />
            </Form.Item>
            {/* {!user && (
              <Form.Item
                className="form-label "
                label={"Password"}
                name={"password"}
                rules={[
                  { required: true, message: "Password Required " },
                  {
                    min: 5,
                    message: "minimum of 5 charactors",
                  },
                  {
                    max: 16,
                    message: "maximum 16 charactors",
                  },
                ]}
                validateFirst
              >
                <Input placeholder={"Password"} />
              </Form.Item>
            )} */}
            <Form.Item
              className="form-label "
              label={"Phone number"}
              name={"mobile"}
              rules={[
                { required: true, message: "Number Required " },
                { len: 10, message: "Enter 10 digit mobile number" },
              ]}
              validateFirst
            >
              <Input placeholder={"Mobile number"} />
            </Form.Item>
          </Form>
          <div className="flex justify-end mx-4">
            <button
              className="bg-blue-500 p-2 text-sm text-white rounded-md"
              onClick={form.submit}
            >
              {user ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default CreateUser;
