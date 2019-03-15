# Configurations

## noSSR

- **type:** `string | string[]`
- **default:** `'404.html'`

A list of files to disable SSR, with [glob patterns](https://github.com/isaacs/minimatch#usage) supported.

## noScript

- **type:** `string | string[]`
- **default:** `[]`

A list of files to remove scripts, with [glob patterns](https://github.com/isaacs/minimatch#usage) supported.

## globOptions

- **type:** `object`
- **default:** `{}`

Options for [fast-glob](https://github.com/mrmlnc/fast-glob#options-1).

## noEmptyLine

- **type:** `boolean`
- **default:** `true`

Whether to delete extra blank lines in HTML.
