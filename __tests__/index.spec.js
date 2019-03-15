const { resolve } = require('path')
const { fs } = require('@vuepress/shared-utils')
const { createApp } = require('@vuepress/core')

describe('dehydation', () => {
  const app = createApp(resolve(__dirname, 'docs'))

  beforeAll(async () => {
    await app.process()
    await app.build()
  }, 60000)

  test('app', () => {
    expect(app.base).toBe('/')
  })
})
