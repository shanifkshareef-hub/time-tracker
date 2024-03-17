import { DatePicker, Drawer, Form, Input, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import Userservice from "@/service/user";
import Taskervice from "@/service/task";

import React, { useEffect, useState } from "react";
import { IUsers } from "@/interface/user";
import { ITask, TaskForm } from "@/interface/task";
import { dayjs } from "@/utiles/helpers";
import { TimePicker } from "antd";
import TimeInput from "@/components/timeTracker/TimeInput";

type CreateTaskPros = {
  onClose: () => void;
  open: boolean;
  task?: ITask;
  callback: () => void;
  projectId: string;
};

const CreateTask: React.FC<CreateTaskPros> = ({
  callback,
  onClose,
  open,
  task,
  projectId,
}) => {
  const [form] = Form.useForm();
  const [users, setusers] = useState<IUsers[]>([]);
  const { RangePicker } = TimePicker;

  const getUsers = async () => {
    const res = await Userservice.List();
    if (res.status && res.data) {
      setusers(res.data);
    }
  };

  useEffect(() => {
    getUsers();
    if (task) {
      form.setFieldsValue({
        name: task.name,
        description: task.description ? task.description : undefined,
        deadline: task.deadline ? dayjs(task.deadline) : undefined,
        assignedToUserId: task.assignedToUserId
          ? task.assignedToUserId
          : undefined,
        status: task.status ? task.status : undefined,
        priority: task.priority ? task.priority : undefined,
        trackedTime: task.trackedTime,
      });
    }
    form.setFieldsValue({ projectId: projectId });
    return () => {
      form.resetFields();
    };
  }, [task]);

  const handleSubmit = async (values: TaskForm.Submit) => {
    if (task) {
      const resp = await Taskervice.Update(task.id, values);
      if (resp && resp.status && resp.data) {
        callback();
        onClose();
        message.success("Task updated");
      }
    } else {
      const resp = await Taskervice.Create(values);
      if (resp && resp.status && resp.data) {
        callback();
        onClose();
        message.success("Task created");
      }
    }
  };

  return (
    <Drawer
      title={task ? "Update Task" : "Create Task"}
      onClose={onClose}
      open={open}
      destroyOnClose={true}
      width={500}
      footer={
        <div className="flex justify-end flex-col">
          <button
            form="user-form"
            className="bg-blue-500 p-2 text-sm text-white rounded-md"
          >
            {task ? "Update" : "Create"}
          </button>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        id="user-form"
        onFinish={handleSubmit}
        className="w-full"
      >
        <Form.Item noStyle name="projectId" />
        <Form.Item
          className="form-label "
          label={"Name of the task"}
          name={"name"}
          rules={[
            { required: true, message: "Name Required " },
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
          <Input placeholder={" Name"} />
        </Form.Item>
        <Form.Item
          className="form-label "
          label={"Description of task"}
          name={"description"}
        >
          <TextArea placeholder="Description" rows={5} />
        </Form.Item>

        <Form.Item
          className="form-label "
          label={"Assign user"}
          name={"assignedToUserId"}
          validateFirst
        >
          <Select
            placeholder="Assign User"
            options={users.map((user) => {
              return {
                value: user.id,
                label: `${user.firstName}  ${user.lastName ?? ""}`,
              };
            })}
          />
        </Form.Item>

        <Form.Item
          className="form-label"
          label={"Deadline"}
          name={"deadline"}
          validateFirst
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item
            className="form-label "
            label={"Status of task"}
            name={"status"}
            rules={[{ required: true, message: "Status Required " }]}
            validateFirst
            initialValue={"open"}
          >
            <Select
              options={[
                { value: "open", label: "Open" },
                { value: "in progress", label: "In Progress" },
                { value: "closed", label: "Closed" },
                { value: "completed", label: "completed" },
              ]}
            />
          </Form.Item>
          <Form.Item
            className="form-label "
            label={"priority of task"}
            name={"priority"}
            rules={[{ required: true, message: "Status Required " }]}
            validateFirst
            initialValue={"none"}
          >
            <Select
              options={[
                { value: "none", label: "None" },
                { value: "low", label: "Low" },
                { value: "high", label: "High" },
                { value: "urgent", label: "Urgent" },
              ]}
            />
          </Form.Item>
        </div>

        <Form.Item name="trackedTime" noStyle />

        {task && (
          <TimeInput
            onchange={(time) => {
              form.setFieldsValue({ trackedTime: time });
            }}
            // value={form.getFieldValue("trackedTime")}
            value={task.trackedTime}
          />
        )}
      </Form>
    </Drawer>
  );
};

export default CreateTask;
