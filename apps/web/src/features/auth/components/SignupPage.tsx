import { Form, Input, Button, Card, Typography, message } from 'antd';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/use-auth';

const { Title, Text } = Typography;

export default function SignupPage() {
  const { mutate: register, isPending } = useRegister();

  const handleSubmit = (values: any) => {
    register(values, {
      onError: (err: any) => {
        message.error(err?.response?.data?.error?.message || 'Registration failed');
      },
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f5f5f5',
      }}
    >
      <Card style={{ width: 440, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={3} style={{ margin: 0 }}>
            Create account
          </Title>
          <Text type="secondary">Join an existing workspace</Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="tenantSlug"
            label="Workspace"
            rules={[{ required: true, message: 'Workspace is required' }]}
          >
            <Input placeholder="your-workspace" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 12 }}>
            <Form.Item
              name="firstName"
              label="First name"
              style={{ flex: 1 }}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last name"
              style={{ flex: 1 }}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, min: 8, message: 'At least 8 characters' }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={isPending}>
            Create account
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">
            Already have an account? <Link to="/login">Sign in</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}
