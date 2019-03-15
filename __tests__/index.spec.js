const { resolve } = require('path')
const { readFileSync } = require('fs')
const { createApp } = require('@vuepress/core')

describe('dehydation', () => {
  const app = createApp({
    sourceDir: resolve(__dirname, 'docs'),
  })

  beforeAll(async () => {
    await app.process()
    await app.build()
  }, 60000)

  function testForFile (name, file = name) {
    test(name, () => {
      const html = readFileSync(resolve(app.outDir, file), 'utf8')
        .replace(/(src|href)="\/[\w./]+"/g, (_, $1) => $1 + '="/some/asset"')
      expect(html).toMatchSnapshot()
    })
  }

  testForFile('404.html')
  testForFile('index.html')
  testForFile('noscript.html')
})
