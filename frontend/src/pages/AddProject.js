import React, { useState } from "react";
import { Form, Input, Button, message, Card, Row, Col } from "antd";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

const AddProject = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState("horizontal");
  const { user } = useAuthContext();


  const onFinish = async (values) => {
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
      message.success("Project created successfully!");
      form.resetFields();
    } catch (error) {
      message.error("Failed to create project. Please try again");
    }
  };

  return (
    <Row justify="center" align="middle">
      <Col>
        <Card
          title="Create new project"
          bordered={false}
          style={{ width: 400 }}
        >
          <Form
            form={form}
            layout={formLayout}
            onFinish={onFinish}
            initialValues={{
              layout: formLayout,
            }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input the project name!" },
              ]}
            >
              <Input placeholder="Project Name" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input the project description!",
                },
              ]}
            >
              <Input.TextArea placeholder="Project Description" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default AddProject;
