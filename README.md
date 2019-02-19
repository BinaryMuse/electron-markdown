# electron-markdown

electron-markdown is a Node.js module to convert Markdown to HTML. It uses [cmark-gfm](https://www.npmjs.com/package/cmark-gfm) for HTML generation, and a series of [unified](https://github.com/unifiedjs/unified) plugins to process the resulting HTML.

## Installation

Supports Node.js v8 or higher.

```bash
npm install electron-markdown
```

## Usage

electron-markdown exports a single function, which takes Markdown as its only argument and returns a Promise that resolves to the resulting HTML.

```javascript
const markdownToHtml = require('electron-markdown')

markdownToHtml(someMarkdown)
  .then(function (html) {
    console.log(html)
  }, function (err) {
    console.error(err)
  })
```
