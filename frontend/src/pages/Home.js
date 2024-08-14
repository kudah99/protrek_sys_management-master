import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography, message, Progress } from "antd";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

function Home() {
  const { Title, Text } = Typography;
  const { user } = useAuthContext();

  const [stats, setStats] = useState({
    allTasks: 0,
    allProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/stats`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        message.error("Failed to fetch statistics. Please try again.");
      }
    };

    fetchStats();
  }, [user.token]);

  // Calculate percentages for completed and pending tasks
  const completedPercentage = (stats.completedTasks / stats.allTasks) * 100 || 0;
  const pendingPercentage = (stats.pendingTasks / stats.allTasks) * 100 || 0;

  return (
    <div className="layout-content">
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="All Tasks" value={stats.allTasks} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="All Projects" value={stats.allProjects} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={"Tasks"} bordered={false}>
            <Row justify="space-around" align="middle">
              <Col>
                <Progress
                  type="circle"
                  percent={completedPercentage}
                  format={(percent) => `${percent.toFixed(1)}% Completed`}
                />
              </Col>
              <Col>
                <Progress
                  type="circle"
                  percent={pendingPercentage}
                  format={(percent) => `${percent.toFixed(1)}% Pending`}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
