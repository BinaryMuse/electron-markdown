const cmark = require('cmark-gfm')
const rehype = require('rehype')
const autolinkHeadings = require('rehype-autolink-headings')
const highlight = require('rehype-highlight')
const slug = require('rehype-slug')
const gemojiToEmoji = require('remark-gemoji-to-emoji')
const mixin = require('mixin-deep')

function createProcessor(processorOpts) {
<<<<<<< HEAD
  const { runBefore } = processorOpts
=======
  const { highlight: highlightOpts } = processorOpts
>>>>>>> 43a8702... feat: add ability to pass rehype-highlight options

  return rehype()
    .data('settings', { fragment: true })
    .use(runBefore)
    .use(gemojiToEmoji)
    .use(slug)
    .use(autolinkHeadings, { behavior: 'wrap' })
    .use(highlight, highlightOpts)
}

module.exports = async function markdownToHtml(markdown, options = {}) {
  if (
    Object.keys(options).length !== 0 &&
    !options.runBefore &&
    !options.cmark
  ) {
    console.warn(
      '[electron-markdown] Passing cmark options is moved to options.cmark.'
    )
    options.cmark = options
  }

  const defaults = {
<<<<<<< HEAD
    runBefore: [],
=======
    highlight: {
      ignoreMissing: true,
      aliases: {
        plaintext: ['text'],
      },
    },
>>>>>>> 43a8702... feat: add ability to pass rehype-highlight options
  }

  const cmarkDefaultOpts = {
    footnotes: true,
    extensions: {
      table: true,
      strikethrough: true,
      autolink: true,
      tagfilter: true,
    },
  }
  options = Object.assign(defaults, options)

  const html = await cmark.renderHtml(
    markdown,
    mixin(cmarkDefaultOpts, options.cmark)
  )
  const { contents } = await createProcessor(options).process(html)
  return contents
}
