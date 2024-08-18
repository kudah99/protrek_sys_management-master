import React, { useEffect, useState } from "react";
import { Table, Space, Card, Button, Modal, Form, Input, Upload, message } from "antd";
import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [form] = Form.useForm();

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
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    if (values.document) {
      formData.append('document', values.document.file);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/projects`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setProjects((prevProjects) => [...prevProjects, response.data]);
      message.success("Project created successfully!");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to create project:", error);
      message.error("Failed to create project. Please try again.");
    }
  };

  const handleEditProject = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    if (values.document) {
      formData.append('document', values.document.file.originFileObj);
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/projects/${currentProject._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === currentProject._id ? response.data : project
        )
      );
      message.success("Project updated successfully!");
      setIsModalVisible(false);
      setCurrentProject(null);
      setIsEditing(false);
      form.resetFields();
    } catch (error) {
      console.error("Failed to update project:", error);
      message.error("Failed to update project. Please try again.");
    }
  };

  const openEditModal = (project) => {
    setIsEditing(true);
    setCurrentProject(project);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: project.name,
      description: project.description,
    });
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
          <Button type="link" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleModalSubmit = (values) => {
    if (isEditing) {
      handleEditProject(values);
    } else {
      handleAddProject(values);
    }
  };

  return (
    <div>
      <Card
        title="Projects"
        bordered={false}
        extra={
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setIsEditing(false);
              setCurrentProject(null);
              setIsModalVisible(true);
              form.resetFields();
            }}
          >
            Add new project
          </Button>
        }
      >
        <Table columns={columns} dataSource={projects} rowKey="_id" />
      </Card>
      <Modal
        title={isEditing ? "Edit Project" : "Create New Project"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentProject(null);
          setIsEditing(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
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
          <Form.Item
            label="Document"
            name="document"
            valuePropName="file"
            getValueFromEvent={(e) => e.fileList[0]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
