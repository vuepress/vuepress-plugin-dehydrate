# 配置

## noSSR

- **类型:** `string | string[]`
- **默认值:** `'404.html'`

要禁用 SSR 的页面列表，支持 [glob patterns](https://github.com/isaacs/minimatch#usage)。

## noScript

- **类型:** `string | string[]`
- **默认值:** `[]`

要移除 script 的页面列表，支持 [glob patterns](https://github.com/isaacs/minimatch#usage)。

## globOptions

- **类型:** `object`
- **默认值:** `{}`

提供给 [fast-glob](https://github.com/mrmlnc/fast-glob#options-1) 的选项。

## noEmptyLine

- **类型:** `boolean`
- **默认值:** `true`

是否删除 HTML 中多余的空行。
