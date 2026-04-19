const uaBrowser = require('../dist/index.cjs').default

const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const info = uaBrowser(ua)

console.log('UA:', ua)
console.log(info)
// {
//   browser:    'Chrome',
//   version:    '124.0.0.0',
//   engine:     'Blink',
//   os:         'Windows',
//   osVersion:  '10',
//   device:     'PC',
//   arch:       'x86_64',
//   isWebview:  false,
//   isHeadless: false,
//   isBot:      false,
//   botName:    'unknown',
//   language:   'unknown',
//   platform:   'unknown'
// }

const botUa = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
const botInfo = uaBrowser(botUa)

console.log('\nBot UA:', botUa)
console.log(botInfo)
// { isBot: true, botName: 'Googlebot', ... }

const headlessUa = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/124.0.0.0 Safari/537.36'
const headlessInfo = uaBrowser(headlessUa)

console.log('\nHeadless UA:', headlessUa)
console.log(headlessInfo)
// { isHeadless: true, ... }
