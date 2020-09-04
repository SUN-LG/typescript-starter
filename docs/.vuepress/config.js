const packageJson = require('../../package.json')

const path = require('path')

module.exports = {
  // 配置网站标题
  title: packageJson.name,
  // 配置站点描述
  description: packageJson.description,
  // 配置基本路径
  base: '/',
  // 配置端口
  port: '8080',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      {
        text: 'Languages',
        ariaLabel: 'Language Menu',
        items: [
          { text: 'Chinese', link: '/language/chinese/' },
          { text: 'Japanese', link: '/language/japanese/' }
        ]
      }
    ],
    sidebar: [
      {
        title: '首页',   // 必要的
        path: '/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1,    // 可选的, 默认值是 1
        children: [
          // '/'
          {
            title: '关于',
            path: '/about',
            children: [ /* ... */ ]
          },
        ]
      },
      {
        title: 'API',
        children: [
          {
            title: 'test',
            path: '/test',
            children: [ /* ... */ ]
          }
        ]
      },
      {
        title: '指导',
        path: '/guide',
      }
    ]
  },

  plugins: [
    "vuepress-plugin-cat",
    [
      "mathjax",
      {
        target: "svg",
        macros: {
          "*": "\\times",
        },
      },
    ],
    // 增加 Markdown 文档对于 TypeScript 语法的支持
    [
      "vuepress-plugin-typescript",
      {
        tsLoaderOptions: {
          // ts-loader 的所有配置项
        },
      },
    ],
  ],

  chainWebpack: (config) => {
    config.resolve.alias.set("image", path.resolve(__dirname, "public"));

    // 在文档中模拟库包的引入方式
    // 例如发布了 xxxLib 库包之后，
    // import greet from 'xxxLib/greet.ts' 在 Vuepress 演示文档中等同于
    // import greet from '~/src/greet.ts',
    // 其中 ~ 在这里只是表示项目根目录
    config.resolve.alias.set(
      "xxxLib",
      path.resolve(__dirname, "../../src")
    );
  },
}