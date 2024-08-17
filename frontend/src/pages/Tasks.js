import React, { useEffect, useState } from "react";
import { Table, Space, Tag, Form, Card, Spin, Button, Modal, Input, DatePicker, Select, message } from "antd";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import moment from "moment";

const { Option } = Select;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
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

  const openEditModal = (task) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
    form.setFieldsValue({
      title: task.title,
      description: task.description,
      assignedToEmail: task.assignedToEmail,
      status: task.status,
      dueDate: task.dueDate ? moment(task.dueDate) : null,
    });
  };

  const handleEditTask = async (values) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/tasks/${currentTask._id}`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setTasks(tasks.map((task) => (task._id === currentTask._id ? response.data : task)));
      setIsEditModalOpen(false);
      setCurrentTask(null);
      message.success("Task updated successfully!");
      form.resetFields();
    } catch (error) {
      message.error(`Error updating task: ${error}`);
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/tasks/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setTasks(tasks.filter((task) => task._id !== id));
      message.success("Task deleted successfully!");
    } catch (error) {
      message.error(`Error deleting task: ${error}`);
      console.error("Error deleting task:", error);
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
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
          <Button type="link" onClick={() => openEditModal(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDeleteTask(record._id)}>Delete</Button>
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

      {/* Edit Task Modal */}
      <Modal
        title="Edit Task"
        open={isEditModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleEditTask}>
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
              Update Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Tasks;
