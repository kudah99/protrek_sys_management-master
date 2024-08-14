import React, { useEffect, useState } from "react";
import { Table, Space, Card, Row, Col, Button } from "antd";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import moment from 'moment';

const Projects = () => {
  const [projects, setProjects] = useState([]);
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
      render: (date) => new moment(date).format('MMMM Do YYYY')
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
   
        <Card title="Projects" bordered={false}>
          <Table columns={columns} dataSource={projects} rowKey="_id" />
        </Card>

  );
};

export default Projects;
