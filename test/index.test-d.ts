import { expectType } from 'tsd'
import * as markdown from '../index'
import { pathToFileURL } from 'url'

expectType<Promise<string>>(markdown('something'))
expectType<string>(await markdown('something'))

markdown('something', {
  extensions: {
    autolink: true,
    strikethrough: true,
  },
  fullInfoString: true,
  githubPreLang: false,
  unsafe: true,
})

markdown('somethings', {
  cmark: {
    extensions: {
      autolink: true,
      strikethrough: true,
    },
    fullInfoString: true,
    githubPreLang: false,
    unsafe: true,
  },
})
