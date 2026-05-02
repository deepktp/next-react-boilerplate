import { Card, Row, Col, Statistic, Typography } from 'antd';
import { UserOutlined, TeamOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../../store/auth-store';

const { Title, Text } = Typography;

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          Welcome back, {user?.firstName}!
        </Title>
        <Text type="secondary">Here's what's happening in your workspace.</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#4F46E5' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Organizations"
              value={0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Roles"
              value={0}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#F59E0B' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
