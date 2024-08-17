import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Avatar,
  message,
} from "antd";
import {
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import BgProfile from "../assets/images/bg-profile.jpg";
import profilavatar from "../assets/images/user-circle.svg";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import axios from "axios";

function Profile() {
  const [projects, setProjects] = useState([]);
  const [imageURL, setImageURL] = useState(false);
  const [, setLoading] = useState(false);
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        setImageURL(imageUrl);
      });
    }
  };

  return (
    <div>
      <Space direction="vertical" size={16}>
        <Card
          title="My Profile"
          extra={<a onClick={showModal}>EDIT</a>}
          style={{ width: 300 }}
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
}

export default Profile;
