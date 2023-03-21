const fetch = require('https')
const uaBrowser = require('../index.js')

fetch.get('https://www.useragents.me/api', (resp) => {
  let str = ''

  resp.on('data', (chunk) => {
    str += chunk
  })

  resp.on('end', () => {
    const result = JSON.parse(str)
    result.data.forEach((item) => {
      console.log('=====> start', item.ua)
      console.log(uaBrowser(item.ua))
      console.log('=====> end')
    })
  })
})