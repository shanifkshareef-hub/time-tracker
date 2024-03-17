"use client";
import { Button, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import service from "@/service/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const res = await service.Login(values);
    if (res.status && res.data) {
      localStorage.setItem("token", res.data.token);
      router.push("/user");
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-[100vh]">
      <Form
        layout="vertical"
        form={form}
        id="user-form"
        onFinish={handleSubmit}
        className="w-1/3 h-fit"
      >
        <p className="text-2xl text-center my-2">Login User </p>
        <Form.Item
          label="User Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button bg-blue-500"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
