import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Table, Space, Tag, Button, Modal, Form, Input, DatePicker, Select ,message} from "antd";
import { PlusCircleOutlined } from '@ant-design/icons';
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

const { Option } = Select;

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/projects/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setProject(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/tasks/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setTasks(response.data);
        setTasksLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasksLoading(false);
      }
    };

    fetchProject();
    fetchTasks();
  }, [id, user.token]);

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/tasks`,
        {
          ...values,
          project: id, // Set the project ID for the task
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setIsModalOpen(false);
      message.success("Added task created successfully!");
      form.resetFields();
    } catch (error) {
      message.error(`Error creating task: ${error}`);
      console.error("Error creating task:", error);
    }
  };

  const taskColumns = [
    {
      title: "Task Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <Spin />;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <Card
      title={project.name}
      extra={
        <div>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={handleAddTask}>
            Add new task
          </Button>
        </div>
      }
    >
      <p>
        <strong>{project.description}</strong>
      </p>

      {tasksLoading ? (
        <Spin />
      ) : (
        <Table columns={taskColumns} dataSource={tasks} rowKey="_id" />
      )}

      <Modal
        title="Add New Task"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: "Please enter the task title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="assignedToEmail"
            label="Assign to (Email)"
            rules={[{ required: true, message: "Please enter an email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            initialValue="pending"
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="in progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
          >
            <DatePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProjectDetail;
