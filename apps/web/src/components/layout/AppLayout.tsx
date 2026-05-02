import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/auth-store';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'users-group',
    icon: <TeamOutlined />,
    label: 'Users & Roles',
    children: [
      { key: '/users', label: 'Users' },
      { key: '/roles', label: 'Roles & Permissions' },
    ],
  },
  {
    key: '/organizations',
    icon: <UserOutlined />,
    label: 'Organizations',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Settings',
  },
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/settings/profile'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: '#1E1B4B' }}
        width={240}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 24px',
            color: '#fff',
            fontSize: collapsed ? 18 : 16,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          {collapsed ? 'A' : 'App Name'}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['users-group']}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ background: '#1E1B4B', borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Avatar style={{ background: '#4F46E5' }} icon={<UserOutlined />} />
              <span style={{ fontSize: 13, color: '#333' }}>
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
