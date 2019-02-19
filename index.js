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

module.exports = function markdownToHtml (markdown) {
  return cmark.renderHtml(markdown, {
    footnotes: true,
    extensions: ['table', 'strikethrough', 'tagfilter', 'autolink']
  }).then(function (html) {
    return new Promise((resolve, reject) => {
      createProcessor().process(html, function (err, file) {
        if (err) {
          return reject(err)
        }

        resolve(file.contents)
      })
    })
  })
}
