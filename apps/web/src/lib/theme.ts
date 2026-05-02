import type { ThemeConfig } from 'antd';

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: '#4F46E5',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    borderRadius: 6,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  components: {
    Layout: {
      siderBg: '#1E1B4B',
    },
    Menu: {
      darkItemBg: '#1E1B4B',
      darkItemSelectedBg: '#4F46E5',
      darkItemHoverBg: '#312E81',
    },
    Button: {
      primaryShadow: 'none',
    },
    Card: {
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    },
  },
};
