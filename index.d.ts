import * as cmark from 'cmark-gfm'

declare namespace markdown {
  // @deprecated Passing cmark options is moved to `options.cmark`
  interface IDeprecatedOptions extends Partial<cmark.IOptions> {}
  interface IOptions {
    runBefore?: Array<any>
    cmark?: Partial<cmark.IOptions>
  }
}

declare function markdown(
  markdownString: string,
  opts?: markdown.IOptions | markdown.IDeprecatedOptions
): Promise<string>

export = markdown
