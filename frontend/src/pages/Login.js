import React from "react";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";
import { Layout, Button, Row, Col, Typography, Form, Input, Alert } from "antd";
import { CloseSquareFilled } from "@ant-design/icons";

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, error, loading } = useLogin();

  const onFinish = async (values) => {
    await login(email, password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout className="layout-default layout-signin">
      <Content className="signin" style={{ margin: "0" }}>
        <Row
          gutter={[24, 0]}
          justify="center"
          align="middle"
          style={{ minHeight: "100vh" }}
        >
          <Col xs={{ span: 24, offset: 0 }} lg={{ span: 8 }} md={{ span: 12 }}>
            <Title className="mb-15">Sign In</Title>
            {error && <Alert message={error} type="warning" closable />}
            <Form
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              className="row-col"
            >
              <Form.Item
                className="username"
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                className="username"
                label="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input type="password" placeholder="Password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={loading}
                >
                  SIGN IN
                </Button>
              </Form.Item>
              <p className="font-semibold text-muted">
                Don't have an account?{" "}
                <Link to="/signup" className="text-dark font-bold">
                  Sign Up
                </Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Login;
