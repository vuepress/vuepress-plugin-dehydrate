# vuepress-plugin-ssr-mismatch-workaround

[![npm](https://img.shields.io/npm/v/vuepress-plugin-ssr-mismatch-workaround.svg)](https://www.npmjs.com/package/vuepress-plugin-ssr-mismatch-workaround)

A VuePress plugin to workaround [SSR mismatches in redirects](https://github.com/vuejs/vuepress/issues/1382).

## Usage

```bash
npm install vuepress-plugin-ssr-mismatch-workaround
# OR
yarn add vuepress-plugin-ssr-mismatch-workaround
```

```js
// config.js
module.exports = {
  plugins: ['ssr-mismatch-workaround'] // simple!
}
```

## Purpose

VuePress will try to redirect unknown request `/foo` to `/foo.html` and `/foo/`. Other scenarios include redirecting `/` to `/zh/` or `/en/` based on navigator language.

VuePress will work fine for most of the conditions. But if the page needs redirecting before rendering starts, uses server-side rendering and the pages before and after redirecting do not share an identical structure, this will lead to the problem called **SSR Mismatch**.

### An example to explain the mismatch

You request `/foo` in the browser, but the server can't find a direct match (without certain config), so a `NotFound` page `/404.html` will be returned. The `beforeEach` hook registered in `handleRedirectForCleanUrls` will redirect the router to `/foo.html`. Note that the DOM remains unchanged but the VDOM is replaced with `/foo.html`'s. Normally, `/404.html` is a plain page without navbar and sidebar, but the new VDOM is a document page with such components. The DOM fails to match the VDOM, causing rendering error and the view will not be updated. This is an SSR Mismatch and its consequence.

### A reproduction repository

[@ulivz](https://github.com/ulivz) has created [a reproduction repository](https://github.com/ulivz/vuepress-ssr-mismatch-repro) for users to test this issue. Thanks!

## Workaround

This issue only appears on the first visit. And redirects generally occur on 404 pages, so a simple workaround is to disable SSR for `/404.html`. Since `/404.html` is usually simple and not so necessary to be SEO friendly, this solution is reasonable. 

## Contribution

Contribution Welcome!
