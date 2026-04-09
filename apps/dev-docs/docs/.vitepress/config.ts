import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Manyumba Dev Docs',
  description: 'Developer documentation for Manyumba',
  markdown: {
    imageSizes: true
  },
  vite: {
    server: {
      port: 5173
    }
  },
  sitemap: {
    hostname: 'https://dev.manyumba.com'
  },
  ignoreDeadLinks: [
    '/guide/getting-started',
    '/guide/introduction',
    '/apps/web/README',
    '/packages/README'
  ],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Getting Started', link: '/guide/getting-started' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/manyumba/manyumba' }
    ]
  }
})
