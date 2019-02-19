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
    expect($('h2#basic-fixture a[href="#basic-fixture"]').text()).to.equal('Basic Fixture')
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
})
