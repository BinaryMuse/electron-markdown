# electron-markdown

electron-markdown is a Node.js module to convert Markdown to HTML. It uses [cmark-gfm](https://www.npmjs.com/package/cmark-gfm) for HTML generation, and a series of [unified](https://github.com/unifiedjs/unified) plugins to process the resulting HTML.

## Installation

Supports Node.js v8 or higher.

```bash
npm install electron-markdown
```

## Usage

electron-markdown exports a single function, which takes a Markdown string as its first argument and an options object as its second argument, and returns a Promise that resolves to the resulting HTML.

`resultPromise = electronMarkdown(markdown[, options])`

* `result: Promise<String>` - a Promise resolving to the resulting HTML if parsing and rendering succeeds
* `markdown: String` - a string of Markdown to render to HTML
* `options: Object`
  * `includeExtensions: Array<String>` - an array of additional [cmark extension names](https://github.com/BinaryMuse/node-cmark-gfm#extensions) to load while rendering.
  * `excludeExtensions: Array<String>` - an array of cmark extension names to *exclude* while rendering
  * anything else: any other option will be passed directly to [`cmark-gfm`'s options](https://github.com/BinaryMuse/node-cmark-gfm#options)

By default, electron-markdown enables cmark-gfm's [footnotes](https://github.com/BinaryMuse/node-cmark-gfm#footnotes) option and the `table`, `strikethrough`, `autolink`, and `tagfilter` extensions. **If you pass an options argument that includes an `extensions` key, it will overwrite the default list of extensions.** To remove an extension from the default list, use the `excludeExtensions` option. If an extension is listed in both `includeExtensions` and `excludeExtensions`, it will not be loaded.

```javascript
const markdownToHtml = require('electron-markdown')

markdownToHtml(someMarkdown)
  .then(function (html) {
    console.log(html)
  }, function (err) {
    console.error(err)
  })
```
