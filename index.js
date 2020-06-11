const cmark = require('cmark-gfm')
const rehype = require('rehype')
const autolinkHeadings = require('rehype-autolink-headings')
const highlight = require('rehype-highlight')
const slug = require('rehype-slug')
const gemojiToEmoji = require('remark-gemoji-to-emoji')
const mixin = require('mixin-deep')
const { isBigIntLiteral } = require('tsd/libraries/typescript')

function createProcessor () {
  return rehype()
    .data('settings', { fragment: true })
    .use(gemojiToEmoji)
    .use(slug)
    .use(autolinkHeadings, { behavior: 'wrap' })
    .use(highlight, {
      ignoreMissing: true,
      aliases: {
        'plaintext': ['text']
      }
    })
}

module.exports = async function markdownToHtml (markdown, options = {}) {
  if (Object.keys(options).length !== 0 && !options.cmark) {
    console.warn('[electron-markdown] Passing cmark options is moved to options.cmark.')
    options.cmark = options
  }

  const cmarkDefaultOpts = {
    footnotes: true,
    extensions: {
      table: true,
      strikethrough: true,
      autolink: true,
      tagfilter: true
    }
  }

  const html = await cmark.renderHtml(markdown, mixin(cmarkDefaultOpts, options.cmark))
  const { contents } = await createProcessor().process(html)
  return contents
}
