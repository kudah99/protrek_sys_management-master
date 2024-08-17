import React, { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { Card, Space, Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';

const Profile = () => {
  const { user, setUser } = useAuthContext();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.put(
       `${process.env.REACT_APP_BASE_URL}/api/user/edit/`,values, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          }
          },
      );

      // Update the state with the updated user data
      setUser(response.data);
      message.success('Profile updated successfully');
      handleCancel();
    } catch (error) {
      if (error.response) {
        message.error(`Failed to update profile: ${error.response.data.error || error.message}`);
      } else {
        message.error('Failed to update profile: Network error');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Space direction="vertical" size={16}>
        <Card
          title="My Profile"
          extra={<a onClick={showModal}>EDIT</a>}
          style={{ width: 500 }}
        >
          <p>{user.name}</p>
          <p>{user.email}</p>
        </Card>

        <Modal
          title="Edit Profile"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            name="editProfile"
            initialValues={{ name: user.name, email: user.email }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }, { type: 'email' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  );
};

export default Profile;