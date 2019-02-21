const cmark = require('cmark-gfm')
const rehype = require('rehype')
const autolinkHeadings = require('rehype-autolink-headings')
const highlight = require('rehype-highlight')
const slug = require('rehype-slug')
const gemojiToEmoji = require('remark-gemoji-to-emoji')
const mixin = require('mixin-deep')

function callbackResolve (fn) {
  return new Promise((resolve, reject) => {
    const callback = (err, val) => {
      if (err) return reject(err)
      return resolve(val)
    }
    fn(callback)
  })
}

function createProcessor () {
  return rehype()
    .data('settings', { fragment: true })
    .use(gemojiToEmoji)
    .use(slug)
    .use(autolinkHeadings, { behavior: 'wrap' })
    .use(highlight)
}

module.exports = async function markdownToHtml (markdown, options = {}) {
  const defaultOpts = {
    footnotes: true,
    extensions: {
      table: true,
      strikethrough: true,
      autolink: true,
      tagfilter: true
    }
  }

  const html = await cmark.renderHtml(markdown, mixin(defaultOpts, options))
  const { contents } = await callbackResolve(cb => createProcessor().process(html, cb))
  return contents
}
