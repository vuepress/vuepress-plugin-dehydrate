const name = 'vuepress-plugin-dehydrate'

module.exports = ({ isProd }) => ({
  base: `/${name}/`,

  theme: 'contrib',

  locales: {
    '/en/': {
      lang: 'en-US',
      title: name,
      description: 'A VuePress plugin to dehydrate generated HTML files',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: name,
      description: '一个用于修改生成的 HTML 文件的 VuePress 插件',
    },
  },

  themeConfig: {
    sidebar: [
      '',
      'config.html',
    ],
  },

  evergreen: !isProd,
})
