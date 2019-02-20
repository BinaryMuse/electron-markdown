const cmark = require('cmark-gfm')
const rehype = require('rehype')
const autolinkHeadings = require('rehype-autolink-headings')
const highlight = require('rehype-highlight')
const slug = require('rehype-slug')
const gemojiToEmoji = require('remark-gemoji-to-emoji')

function callbackResolve (fn) {
  return new Promise((resolve, reject) => {
    const callback = (err, val) => {
      if (err) return reject(err)
      return resolve(val)
    }
    fn(callback)
  })
}

function addToArray (arr, value) {
  if (!arr.includes(value)) {
    arr.push(value)
  }
}

function removeFromArray (arr, value) {
  if (arr.includes(value)) {
    const index = arr.indexOf(value)
    arr.splice(index, 1)
  }
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
  const { includeExtensions, excludeExtensions, ...others } = options
  const extensions = ['table', 'strikethrough', 'autolink', 'tagfilter']

  if (includeExtensions) {
    includeExtensions.forEach(addToArray.bind(null, extensions))
  }

  if (excludeExtensions) {
    excludeExtensions.forEach(removeFromArray.bind(null, extensions))
  }

  const cmarkOpts = Object.assign({
    footnotes: true,
    extensions: extensions
  }, others)

  const html = await cmark.renderHtml(markdown, cmarkOpts)
  const { contents } = await callbackResolve(cb => createProcessor().process(html, cb))
  return contents
}
