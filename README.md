# uaBrowser - 浏览器检测

通过userAgent和浏览器环境变量检测浏览器、系统及设备类型的常用工具

## npm安装

```javascript
npm i ua-browser
```

## browser安装

```javascript
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/ua-browser/dist/browser.min.js"></script>
<script type="text/javascript">
  window.load = function() {
    var ua = uaBrowser()
  }
</script>
```

## method

```typescript
import { uaBrowser } from 'ua-browser'

/** 浏览器解析 */
uaBrowser(ua?: string): {
  version: string;
  osVersion: string;
  engine: string;
  browser: string;
  os: string;
  device: string;
  isWebview: boolean;
  language: string;
  platfrom: string;
}

/** 检查 `webview` 浏览环境，仅支持 `android` */
uaBrowser.isWebview(ua: string): boolean

/** 检查微信小程序 */
uaBrowser.isWechatMiniapp(): boolean

/** 浏览器语言 */
uaBrowser.getLanguage(): string

/** 当前版本 */
uaBrowser.VERSION: string
```

## 浏览器
```typescript
type browser =
  | 'Safari'
  | 'Chrome'
  | 'IE'
  | 'Edge'
  | 'Firefox'
  | 'Firefox Focus'
  | 'Chromium'
  | 'Opera'
  | 'Vivaldi'
  | 'Yandex'
  | 'Arora'
  | 'Lunascape'
  | 'QupZilla'
  | 'Coc Coc'
  | 'Kindle'
  | 'Iceweasel'
  | 'Konqueror'
  | 'Iceape'
  | 'SeaMonkey'
  | 'Epiphany'
  | '360'
  | '360EE'
  | '360SE'
  | 'UC'
  | 'QQBrowser'
  | 'QQ'
  | 'Baidu'
  | 'Maxthon'
  | 'Sogou'
  | 'Liebao'
  | '2345Explorer'
  | '115Browser'
  | 'TheWorld'
  | 'XiaoMi'
  | 'Quark'
  | 'Qiyu'
  | 'Wechat'
  | 'WechatWork'
  | 'Taobao'
  | 'Alipay'
  | 'Weibo'
  | 'Douban'
  | 'Suning'
  | 'iQiYi'
  | 'DingTalk'
  | 'Huawei'
  | 'Vivo'
  | 'Firefox Nightly'
  | 'Wechat Miniapp'
```

## 内核

```typescript
type engine =
  | 'Trident'
  | 'Presto'
  | 'WebKit'
  | 'Gecko'
  | 'KHTML'
  | 'Blink'
  | 'EdgeHTML'
```

## 系统或平台

```typescript
type os =
  | 'Windows'
  | 'Linux'
  | 'MacOS'
  | 'Android'
  | 'HarmonyOS'
  | 'Ubuntu'
  | 'FreeBSD'
  | 'Debian'
  | 'Windows Phone'
  | 'BlackBerry'
  | 'MeeGo'
  | 'Symbian'
  | 'iOS'
  | 'Chrome OS'
  | 'WebOS'
```

## 设备类型

```typescript
type device =
  | 'Mobile'
  | 'Tablet'
  | 'Pc'
```

## 浏览器支持

| 浏览器 | 标识 |
| :-- | :-- |
| 苹果系统默认浏览器 | `Safari` |
| 谷歌浏览器 | `Chrome` |
| 微软IE浏览器 | `IE` |
| 微软新一代浏览器 | `Edge` |
| 火狐浏览器 | `Firefox` |
| 火狐浏览器 | `Firefox Focus` |
| 谷歌浏览器开源版 | `Chromium` |
| Opera浏览器 | `Opera` |
| Opera联合创始人发布 | `Vivaldi` |
| 俄罗斯最大搜索引擎Yandex出品 | `Yandex` |
| 基于webkit和Qt的轻量级浏览器 | `Arora` |
| 来自日本的三引擎浏览器 | `Lunascape` |
| 轻量级跨平台浏览器 | `QupZilla` |
| 越南搜索引擎浏览器 | `Coc Coc` |
| 亚马逊电子书 | `Kindle` |
| Firefox浏览器的Debian再发布版 | `Iceweasel` |
| Konqueror | `Konqueror` |
| Iceape | `Iceape` |
| SeaMonkey | `SeaMonkey` |
| Epiphany | `Epiphany` |
| 360浏览器(手机版) | `360` |
| 360安全浏览器 | `360EE` |
| 360极速浏览器 | `360SE` |
| UC浏览器 | `UC` |
| QQ浏览器 | `QQBrowser` |
| QQ客户端 | `QQ` |
| 百度浏览器 | `Baidu` |
| 傲游浏览器 | `Maxthon` |
| 搜狗浏览器 | `Sogou` |
| 猎豹浏览器 | `Liebao` |
| 2345浏览器 | `2345Explorer` |
| 115浏览器 | `115Browser` |
| 世界之窗浏览器 | `TheWorld` |
| 小米浏览器 | `XiaoMi` |
| 夸克浏览器 | `Quark` |
| 旗鱼浏览器 | `Qiyu` |
| 微信手机客户端 | `Wechat` |
| 企业微信客户端 | `WechatWork` |
| 淘宝手机客户端 | `Taobao` |
| 支付宝手机客户端 | `Alipay` |
| 微博手机客户端 | `Weibo` |
| 豆瓣手机客户端 | `Douban` |
| 苏宁易购手机客户端 | `Suning` |
| 爱奇艺手机客户端 | `iQiYi` |
| 钉钉手机客户端 | `DingTalk` |
| 华为浏览器 | `Huawei` |
| Vivo浏览器 | `Vivo` |
| Firefox 下一代网络浏览器Nightly | `Firefox Nightly` |
| 微信小程序 | `Wechat Miniapp` |


