import { Form, Input, Button, Card, Typography, message } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { useLogin } from '../hooks/use-auth';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  tenantSlug?: string;
}

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const [searchParams] = useSearchParams();

  const handleSubmit = (values: LoginFormValues) => {
    login(values, {
      onError: (err: any) => {
        message.error(err?.response?.data?.error?.message || 'Login failed');
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
      <Card style={{ width: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={3} style={{ margin: 0 }}>
            Sign in
          </Title>
          <Text type="secondary">Enter your credentials to continue</Text>
        </div>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ tenantSlug: searchParams.get('tenant') || '' }}
        >
          <Form.Item name="tenantSlug" label="Workspace">
            <Input placeholder="your-workspace" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <Button type="primary" htmlType="submit" block loading={isPending}>
            Sign in
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}
