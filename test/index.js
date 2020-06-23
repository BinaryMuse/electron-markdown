const fs = require('fs')
const path = require('path')
const { before, describe, it } = require('mocha')
const { expect } = require('chai')
const cheerio = require('cheerio')
const markdownToHtml = require('..')

const fixtures = {
  basic: fs.readFileSync(path.join(__dirname, 'fixtures', 'basic.md'), 'utf8'),
  emoji: fs.readFileSync(path.join(__dirname, 'fixtures', 'emoji.md'), 'utf8'),
  code: fs.readFileSync(path.join(__dirname, 'fixtures', 'code.md'), 'utf8'),
  unsafe: fs.readFileSync(
    path.join(__dirname, 'fixtures', 'unsafe.md'),
    'utf8'
  ),
  table: fs.readFileSync(path.join(__dirname, 'fixtures', 'table.md'), 'utf8'),
  tasklist: fs.readFileSync(
    path.join(__dirname, 'fixtures', 'tasklist.md'),
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

  describe('options.runBefore', () => {
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

  describe('options.cmark', () => {
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

    it('allows use deprecated options object', async () => {
      content = await markdownToHtml(fixtures.unsafe)
      expect(content).not.to.include('img')
      content = await markdownToHtml(fixtures.unsafe, { unsafe: true })
      expect(content).to.include('img')
    })
  })
})
