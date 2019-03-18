const { resolve } = require('path')
const { globby } = require('@vuepress/shared-utils')
const { readFileSync, writeFileSync } = require('fs')

const contentOriginal = '<!--vue-ssr-outlet-->'
const contentBefore = '<!--before-vue-ssr-outlet-->'
const contentAfter = '<!--after-vue-ssr-outlet-->'
const contentWrapper = contentBefore + contentOriginal + contentAfter
const contentReplacer = [new RegExp(`${contentBefore}[\\s\\S]*${contentAfter}`), '<div id="app"></div>']

const resourceOriginal = '{{{ renderResourceHints() }}}'
const resourceBefore = '<!--before-resource-hints-->'
const resourceAfter = '<!--after-resource-hints-->'
const resourceWrapper = resourceBefore + resourceOriginal + resourceAfter
const resourceReplacer = [new RegExp(`${resourceBefore}[\\s\\S]*${resourceAfter}`)]

const scriptsOriginal = '{{{ renderScripts() }}}'
const scriptsBefore = '<!--before-scripts-->'
const scriptsAfter = '<!--after-scripts-->'
const scriptsWrapper = scriptsBefore + scriptsOriginal + scriptsAfter
const scriptsReplacer = [new RegExp(`${scriptsBefore}[\\s\\S]*${scriptsAfter}`)]

const serverRenderedReplacer = [' data-server-rendered="true"']
const emptyLineReplacer = [/^ *\r?\n/mg]
const wrapperReplacer = [new RegExp([
  contentBefore,
  contentAfter,
  resourceBefore,
  resourceAfter,
  scriptsBefore,
  scriptsAfter,
].join('|'), 'g')]

function replaceFileContent (file, ...replacers) {
  writeFileSync(file, replacers.reduce((prev, [search, replace = '']) => {
    return prev.replace(search, replace)
  }, readFileSync(file, 'utf8')))
}

module.exports = (options, context) => ({
  name: 'vuepress-plugin-dehydrate',

  ready () {
    // hack into current ssr template
    let template = readFileSync(context.ssrTemplate, 'utf8')
    if (template.search(contentWrapper) < 0) {
      template = template.replace(contentOriginal, contentWrapper)
    }
    if (template.search(resourceWrapper) < 0) {
      template = template.replace(resourceOriginal, resourceWrapper)
    }
    if (template.search(scriptsWrapper) < 0) {
      template = template.replace(scriptsOriginal, scriptsWrapper)
    }
    writeFileSync(context.ssrTemplate, template)
  },

  generated (pages) {
    // restore ssr template
    replaceFileContent(context.ssrTemplate, wrapperReplacer)

    const {
      noSSR = '404.html',
      noScript = [],
      noEmptyLine = true,
    } = options

    const globOptions = {
      cwd: context.outDir,
      transform: file => resolve(context.outDir, file),
      ...options.globOptions,
    }

    const defaultReplacers = noEmptyLine
      ? [wrapperReplacer, emptyLineReplacer]
      : [wrapperReplacer]

    pages = pages.slice()

    // fully disable ssr
    globby.sync(noSSR, globOptions).forEach((file) => {
      const index = pages.indexOf(file)
      if (index < 0) return
      pages.splice(index, 1)
      replaceFileContent(file, contentReplacer, ...defaultReplacers)
    })

    // fully disable script
    globby.sync(noScript, globOptions).forEach((file) => {
      const index = pages.indexOf(file)
      if (index < 0) return
      pages.splice(index, 1)
      replaceFileContent(file, resourceReplacer, scriptsReplacer, serverRenderedReplacer, ...defaultReplacers)
    })

    // clean up unhandled files
    pages.forEach(file => replaceFileContent(file, ...defaultReplacers))
  },
})
