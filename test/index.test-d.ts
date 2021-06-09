import { expectType } from 'tsd'
import markdown from '../index'

expectType<Promise<string>>(markdown('something'))
expectType<string>(await markdown('something'))

markdown('somethings', {
  runBefore: ['123546'],
  cmark: {
    extensions: {
      autolink: true,
      strikethrough: true,
    },
    fullInfoString: true,
    githubPreLang: false,
    unsafe: true,
  },
  highlight: {
    ignoreMissing: true,
    aliases: {
      plaintext: ['text'],
    },
  },
})
