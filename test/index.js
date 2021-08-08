import fs from 'node:fs'
import path from 'node:path'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import cheerio from 'cheerio'
import markdownToHtml from '../index.js'

chai.use(chaiAsPromised)

const fixtures = {
  basic: fs.readFileSync(new URL('fixtures/basic.md', import.meta.url), 'utf8'),
  emoji: fs.readFileSync(new URL('fixtures/emoji.md', import.meta.url), 'utf8'),
  code: fs.readFileSync(new URL('fixtures/code.md', import.meta.url), 'utf8'),
  unsafe: fs.readFileSync(
    new URL('fixtures/unsafe.md', import.meta.url),
    'utf8'
  ),
  table: fs.readFileSync(new URL('fixtures/table.md', import.meta.url), 'utf8'),
  tasklist: fs.readFileSync(
    new URL('fixtures/tasklist.md', import.meta.url),
    'utf8'
  ),
  unknownLanguage: fs.readFileSync(
    new URL('fixtures/unknown-language.md', import.meta.url),
    'utf8'
  ),
}

describe('markdownToHtml', () => {
  let content, $

  before(async () => {
    content = await markdownToHtml(fixtures.basic)
    $ = cheerio.load(content)
  })

  it('adds DOM ids to headings', () => {
    expect($('h2#basic-fixture').length).to.eql(1)
  })

  it('turns headings into links', () => {
    expect($('h2#basic-fixture a[href="#basic-fixture"]').text()).to.equal(
      'Basic Fixture'
    )
  })

  it('handles markdown links', () => {
    expect(fixtures.basic).to.include('[link](https://link.com)')
    expect(content).to.include('<a href="https://link.com">link</a>')
  })

  it('handles emoji shortcodes', async () => {
    content = await markdownToHtml(fixtures.emoji)
    expect(fixtures.emoji).to.include(':tada:')
    expect(content).to.include('🎉')

    // does not mess with existing emoji
    expect(fixtures.emoji).to.include('✨')
    expect(content).to.include('✨')
  })

  it('handles syntax highlighting', async () => {
    content = await markdownToHtml(fixtures.code)
    $ = cheerio.load(content)
    expect($('pre code.hljs').length).to.eql(1)
  })

  describe('options', () => {
    describe('.runBefore', () => {
      it('runs custom plugins', async () => {
        let pluginDidRun = false
        const plugin = () => (tree) => {
          pluginDidRun = true
          return tree
        }
        await markdownToHtml(fixtures.basic, { runBefore: [plugin] })
        expect(pluginDidRun).to.eql(true)
      })
    })

    describe('.highlight.ignoreMissing', () => {
      it('should work be default (default is true)', async () => {
        const content = await markdownToHtml(fixtures.unknownLanguage)
        $ = cheerio.load(content)
        expect(fixtures.unknownLanguage).to.include('```some-unknown-language')
        expect(
          $('pre > code.hljs.language-some-unknown-language').length
        ).to.eq(1)
      })

      it('should throw an error when ignoreMissing is false', () => {
        return expect(
          markdownToHtml(fixtures.unknownLanguage, {
            highlight: { ignoreMissing: false },
          })
        ).to.be.rejectedWith(/Unknown language: `some-unknown-language`/)
      })
    })

    describe('.cmark', () => {
      it('allows additional cmark options', async () => {
        content = await markdownToHtml(fixtures.unsafe)
        expect(content).not.to.include('img')
        content = await markdownToHtml(fixtures.unsafe, {
          cmark: { unsafe: true },
        })
        expect(content).to.include('img')
      })

      it('allows removing extensions', async () => {
        content = await markdownToHtml(fixtures.table)
        expect(content).to.include('table')
        content = await markdownToHtml(fixtures.table, {
          cmark: { extensions: { table: false } },
        })
        expect(content).not.to.include('table')
      })

      it('allows adding extensions', async () => {
        content = await markdownToHtml(fixtures.tasklist)
        expect(content).not.to.include('checkbox')
        expect(content).to.include('href')
        content = await markdownToHtml(fixtures.tasklist, {
          cmark: { extensions: { tasklist: true, autolink: false } },
        })
        expect(content).to.include('checkbox')
        expect(content).not.to.include('href')
      })
    })
  })
})
