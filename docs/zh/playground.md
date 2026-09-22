---
title: Playground — 在线试用 ua-browser
description: 在线试用 ua-browser——粘贴任意 User-Agent 字符串或选择预设，即时查看完整解析结果。
layout: page
---

<div class="pg-wrap">
<div class="pg-header">

# Playground

打开即自动识别你的浏览器、系统和设备。切换到「API 测试」，选择预设场景或粘贴任意 UA 字符串，即刻看到完整解析结果。

</div>

<Playground />
</div>

## Playground 能看到什么

Playground 完全在你的浏览器里运行 ua-browser，不会向任何服务器发送数据。粘贴任意 UA 字符串，或从下拉框选择一个预设场景，库解析出的每个字段都会并列展示：

- **浏览器、引擎、操作系统与设备类型** —— 含精确版本号和主版本号
- **CPU 架构与位数** —— 在 Client Hints 或硬件信号可获取时给出
- **无头与自动化标记** —— HeadlessChrome、Playwright、Puppeteer、Electron、jsdom、Selenium
- **AI 爬虫与链接预览 Bot 命中** —— GPTBot、ClaudeBot、PerplexityBot 等 40+ 条规则
- **原始环境信号** —— 由 `getEnvContext()` 在你的浏览器中实时采集

第一次使用？从[快速开始](/zh/guide/getting-started)入手，[内置支持列表](/zh/guide/support-list)列出了开箱即可识别的全部内容，完整签名见 [API 参考](/zh/api/)。

