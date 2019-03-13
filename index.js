const { resolve } = require('path')
const { readFileSync, writeFileSync } = require('fs')

const contentPlaceholder = '<!--vue-ssr-outlet-->'
const contentWrapper = '<!--before-vue-ssr-outlet--><!--vue-ssr-outlet--><!--after-vue-ssr-outlet-->'
const contentWrapperRegex = /<!--before-vue-ssr-outlet-->[\s\S]*<!--after-vue-ssr-outlet-->/

function replaceFileContent(file, search, replace) {
  writeFileSync(file, readFileSync(file, 'utf8').replace(search, replace))
}

module.exports = (options, context) => ({
  name: 'vuepress-plugin-ssr-mismatch-workaround',

  ready () {
    // hack into current ssr template
    const template = readFileSync(context.ssrTemplate, 'utf8')
    if (template.search(contentWrapper) >= 0) return
    writeFileSync(
      context.ssrTemplate,
      template.replace(contentPlaceholder, contentWrapper),
    )
  },

  generated () {
    // restore ssr template
    replaceFileContent(context.ssrTemplate, contentWrapper, contentPlaceholder)

    // disable ssr in 404.html
    const _404Path = resolve(context.outDir, '404.html')
    replaceFileContent(_404Path, contentWrapperRegex, '<div id="app"></div>')
  },
})
