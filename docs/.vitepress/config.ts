import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'uaBrowser',
  description: '通过 User Agent 检测浏览器、系统及设备类型，零依赖',
  lang: 'zh-CN',
  base: '/ua-browser/',

  head: [
    ['link', { rel: 'icon', href: '/ua-browser/favicon.ico' }],
    ['script', {}, `var _hmt = _hmt || [];(function() {var hm = document.createElement("script");hm.src = "https://hm.baidu.com/hm.js?039f7362d3cebddced40c9a853536a89";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm, s);})();`],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'uaBrowser',

    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'Playground', link: '/playground' },
      { text: '更新日志', link: '/changelog' },
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          {
            text: '快速开始',
            link: '/guide/getting-started',
            collapsed: false,
            items: [
              { text: '安装', link: '/guide/getting-started#安装' },
              { text: '基本用法', link: '/guide/getting-started#基本用法' },
              { text: '命名导出', link: '/guide/getting-started#命名导出-tree-shakeable' },
              { text: 'Node.js / SSR', link: '/guide/getting-started#nodejs--ssr-用法' },
              { text: 'CDN', link: '/guide/getting-started#浏览器-cdn-用法' },
              { text: '独立检测器', link: '/guide/getting-started#独立检测器' },
            ],
          },
          {
            text: '使用示例',
            link: '/guide/examples',
            collapsed: false,
            items: [
              { text: '设备跳转', link: '/guide/examples#设备跳转' },
              { text: '拦截爬虫请求', link: '/guide/examples#拦截爬虫请求' },
              { text: '拦截无头浏览器', link: '/guide/examples#拦截无头浏览器' },
              { text: '按浏览器加载兼容代码', link: '/guide/examples#按浏览器加载兼容代码' },
              { text: '微信环境检测', link: '/guide/examples#微信环境检测' },
              { text: 'SSR / Node.js', link: '/guide/examples#ssr--nodejs-中解析请求-ua' },
              { text: 'Windows 10 / 11', link: '/guide/examples#精确区分-windows-10--11' },
              { text: 'Vue 组合式函数', link: '/guide/examples#vue-组合式函数封装' },
              { text: 'React Hook', link: '/guide/examples#react-hook-封装' },
              { text: '独立检测器', link: '/guide/examples#按需使用独立检测器' },
              { text: '统计上报', link: '/guide/examples#统计上报' },
            ],
          },
          {
            text: '内置支持列表',
            link: '/guide/support-list',
            collapsed: false,
            items: [
              { text: '浏览器', link: '/guide/support-list#浏览器' },
              { text: '操作系统', link: '/guide/support-list#操作系统' },
              { text: '渲染内核', link: '/guide/support-list#渲染内核' },
              { text: '设备类型', link: '/guide/support-list#设备类型' },
              { text: 'CPU 架构', link: '/guide/support-list#cpu-架构' },
              { text: '爬虫 / 机器人', link: '/guide/support-list#爬虫--机器人' },
              { text: '无头 / 自动化浏览器', link: '/guide/support-list#无头--自动化浏览器' },
            ],
          },
        ],
      },
      {
        text: 'API 参考',
        items: [
          {
            text: '总览',
            link: '/api/',
            collapsed: false,
            items: [
              { text: '默认导出', link: '/api/#默认导出' },
              { text: '命名导出', link: '/api/#命名导出' },
            ],
          },
          {
            text: '类型定义',
            link: '/api/types',
            collapsed: false,
            items: [
              { text: 'EnvOption', link: '/api/types#envoption' },
              { text: 'BrowserName', link: '/api/types#browsername' },
              { text: 'EngineName', link: '/api/types#enginename' },
              { text: 'OsName', link: '/api/types#osname' },
              { text: 'DeviceName', link: '/api/types#devicename' },
              { text: 'ArchName', link: '/api/types#archname' },
              { text: 'BotName', link: '/api/types#botname' },
              { text: 'NavContext', link: '/api/types#navcontext' },
              { text: 'ParseOptions', link: '/api/types#parseoptions' },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yangtianxia/ua-browser' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/ua-browser' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 yangtianxia',
    },

    outline: { level: [2, 3], label: '本页目录' },

    search: {
      provider: 'local',
    },
  },
})
