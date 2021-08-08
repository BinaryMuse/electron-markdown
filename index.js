import cmark from 'cmark-gfm'
import { rehype } from 'rehype'
import autolinkHeadings from 'rehype-autolink-headings'
import highlight from 'rehype-highlight'
import slug from 'rehype-slug'
import gemojiToEmoji from 'remark-gemoji-to-emoji'
import mixin from 'mixin-deep'

function createProcessor(processorOpts) {
  const { highlight: highlightOpts, runBefore } = processorOpts

  return rehype()
    .data('settings', { fragment: true })
    .use(runBefore)
    .use(gemojiToEmoji)
    .use(slug)
    .use(autolinkHeadings, { behavior: 'wrap' })
    .use(highlight, highlightOpts)
}

export default async function markdownToHtml(markdown, options = {}) {
  const defaults = {
    runBefore: [],
    highlight: {
      ignoreMissing: true,
      aliases: {
        plaintext: ['text'],
      },
    },
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

  const { value } = await createProcessor(options).process(html)

  return value
}
