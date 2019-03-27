/**
 * @jest-environment node
 */

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
      expect(html).toMatchSnapshot()
    })
  }

  testForFile('404.html')
  testForFile('index.html')
  testForFile('noscript.html')
})
