import React, { useEffect, useState } from "react";
import { Table, Space, Card, Button, Modal, Form, Input, message } from "antd";
import { PlusCircleOutlined } from '@ant-design/icons';
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate(); // Hook for navigating to detail pages

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/projects`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [user.token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/projects/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setProjects(projects.filter((project) => project._id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleAddProject = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/projects`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setProjects((prevProjects) => [...prevProjects, response.data]);
      message.success("Project created successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to create project:", error);
      message.error("Failed to create project. Please try again.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <a onClick={() => navigate(`/projects/${record._id}`)}>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Added",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format('MMMM Do YYYY')
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/projects/edit/${record._id}`)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Projects"
        bordered={false}
        extra={
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add new project
          </Button>
        }
      >
        <Table columns={columns} dataSource={projects} rowKey="_id" />
      </Card>
      <Modal
        title="Create New Project"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleAddProject}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the project name!' }]}
          >
            <Input placeholder="Project Name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the project description!' }]}
          >
            <Input.TextArea placeholder="Project Description" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
