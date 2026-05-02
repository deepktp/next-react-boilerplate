import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'App Docs',
  description: 'Documentation for the fullstack boilerplate',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' },
          ],
        },
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/guide/architecture' },
            { text: 'Auth Flow', link: '/guide/auth-flow' },
            { text: 'Database', link: '/guide/database' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com' }],
  },
});
