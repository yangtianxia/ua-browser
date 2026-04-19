const https = require('https')
const uaBrowser = require('../dist/index.cjs').default

https.get('https://www.useragents.me/api', (resp) => {
  let str = ''

  resp.on('data', (chunk) => {
    str += chunk
  })

  resp.on('end', () => {
    const result = JSON.parse(str)
    result.data.forEach((item) => {
      console.log('=====> start', item.ua)
      const info = uaBrowser(item.ua)
      console.log({
        browser: info.browser,
        version: info.version,
        engine: info.engine,
        os: `${info.os} ${info.osVersion}`,
        device: info.device,
        arch: info.arch,
        isHeadless: info.isHeadless,
        isBot: info.isBot,
        botName: info.botName,
      })
      console.log('=====> end')
    })
  })
})
