const cmark = require('cmark-gfm')
const rehype = require('rehype')
const autolinkHeadings = require('rehype-autolink-headings')
const highlight = require('rehype-highlight')
const slug = require('rehype-slug')
const gemojiToEmoji = require('remark-gemoji-to-emoji')

function createProcessor () {
  return rehype()
    .data('settings', { fragment: true })
    .use(gemojiToEmoji)
    .use(slug)
    .use(autolinkHeadings, { behavior: 'wrap' })
    .use(highlight)
}

function callbackResolve (fn) {
  return new Promise((resolve, reject) => {
    const callback = (err, val) => {
      if (err) return reject(err)
      return resolve(val)
    }
    fn(callback)
  })
}

module.exports = async function markdownToHtml (markdown, cmarkOptions) {
  cmarkOptions = cmarkOptions || {}
  const extensions = ['table', 'strikethrough', 'autolink', 'tagfilter']

  if (cmarkOptions.includeExtensions) {
    cmarkOptions.includeExtensions.forEach(ext => {
      if (!extensions.includes(ext)) {
        extensions.push(ext)
      }
    })
  }

  if (cmarkOptions.excludeExtensions) {
    cmarkOptions.excludeExtensions.forEach(ext => {
      if (extensions.includes(ext)) {
        const index = extensions.indexOf(ext)
        extensions.splice(index, 1)
      }
    })
  }

  const opts = Object.assign({
    footnotes: true,
    extensions: extensions
  }, cmarkOptions)

  const html = await cmark.renderHtml(markdown, opts)
  const { contents } = await callbackResolve(cb => createProcessor().process(html, cb))
  return contents
}
