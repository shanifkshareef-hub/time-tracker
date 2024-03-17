import { Drawer, Form, Input, Select } from "antd";
import service from "@/service/projects";

import React, { useEffect } from "react";
import { IProjects, ProjectForm } from "@/interface/projects";
import TextArea from "antd/es/input/TextArea";

type CreateProject = {
  onClose: () => void;
  open: boolean;
  project: IProjects | undefined;
  callback: () => void;
};
const CreateProjects: React.FC<CreateProject> = ({
  onClose,
  open,
  project,
  callback,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description ? project.description : undefined,
        status: project.status ? project.status : undefined,
      });
    }
    return () => {
      form.resetFields();
    };
  }, [project]);

  const handleSubmit = async (values: ProjectForm.Submit) => {
    if (project) {
      const res = await service.Update(project.id, values);
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
        title={project ? "Update Project" : "Create Project"}
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
              label={"Name of Project"}
              name={"name"}
              rules={[
                { required: true, message: "Name Required " },
                {
                  min: 5,
                  message: "minimum of 5 charactors",
                },
                {
                  max: 25,
                  message: "maximum 30 charactors",
                },
              ]}
              validateFirst
            >
              <Input placeholder={"Project name"} />
            </Form.Item>
            <Form.Item
              className="form-label "
              label={"Description of Project"}
              name={"description"}
            >
              <TextArea placeholder="Description" rows={5} />
            </Form.Item>
            <Form.Item
              className="form-label "
              label={"Status of Project"}
              name={"status"}
              validateFirst
              initialValue={"active"}
            >
              <Select
                options={[
                  { value: "active", label: "Active" },
                  { value: "in active", label: "In Active" },
                  { value: "open", label: "open" },
                ]}
              />
            </Form.Item>
          </Form>
          <div className="flex justify-end mx-4">
            <button
              className="bg-blue-500 p-2 text-sm text-white rounded-md w-full"
              onClick={form.submit}
            >
              {project ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default CreateProjects;
