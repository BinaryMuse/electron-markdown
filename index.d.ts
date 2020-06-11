import * as cmark from 'cmark-gfm'

declare namespace markdown {
  interface IOptions extends Partial<cmark.IOptions> {}
}

declare function markdown(
  markdownString: string,
  opts?: markdown.IOptions
): Promise<string>

export = markdown
