import { Form, Input, Button, Card, Typography, message, Result } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useForgotPassword } from '../hooks/use-auth';

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();
  const [sent, setSent] = useState(false);

  const handleSubmit = ({ email }: { email: string }) => {
    forgotPassword(email, {
      onSuccess: () => setSent(true),
      onError: () => setSent(true), // Never reveal existence
    });
  };

  if (sent) {
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
        <Result
          status="success"
          title="Check your email"
          subTitle="If that email exists, a password reset link has been sent."
          extra={<Link to="/login">Back to login</Link>}
        />
      </div>
    );
  }

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
            Forgot password
          </Title>
          <Text type="secondary">Enter your email to receive a reset link</Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={isPending}>
            Send reset link
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/login">Back to login</Link>
        </div>
      </Card>
    </div>
  );
}
