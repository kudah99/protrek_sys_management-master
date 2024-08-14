import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Space,
  Tag,
  Modal,
  Form,
  Card,
  DatePicker,
  Select,
  Spin,
} from "antd";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { PlusCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/tasks`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user.token]);

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
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
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
      filters: [
        { text: "Pending", value: "pending" },
        { text: "In Progress", value: "in progress" },
        { text: "Completed", value: "completed" },
      ],
      onFilter: (value, record) => record.status.includes(value),
      render: (status) => (
        <Tag
          color={
            status === "completed"
              ? "green"
              : status === "in progress"
              ? "orange"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
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

  return (
    <>
      <div className="layout-content">
        <Card title="All tasks" bordered={false} >
          <Table columns={taskColumns} dataSource={tasks} rowKey="_id" />
        </Card>
      </div>
    </>
  );
};

export default Tasks;
