import React, { useEffect, useState } from "react";
import { Table, Spin, Tag, Card, Button, Modal, Form, Input, Switch, message } from "antd";
import { PlusCircleOutlined } from '@ant-design/icons';
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/user/all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user.token]);

  const handleAddUser = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/user/signup`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
          admin: values.admin
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setUsers((prevUsers) => [...prevUsers, response.data]);
      message.success("User added successfully!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding user:", error);
      message.error("Failed to add user.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      key: "is_admin",
      dataIndex: "is_admin",
      render: (isAdmin) => (
        <Tag color={isAdmin ? "volcano" : "green"}>
          {isAdmin ? "Admin" : "User"}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return <Spin />;
  }

  return (
    <>
      <div className="layout-content">
        <Card
          title="My team"
          bordered={false}
          extra={
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              Add new member
            </Button>
          }
        >
          <Table columns={columns} dataSource={users} rowKey="_id" />
        </Card>
      </div>
      <Modal
        title="Add New User"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleAddUser}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter the email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter the password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Admin"
            name="admin"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UsersList;
