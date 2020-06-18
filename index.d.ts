import * as cmark from 'cmark-gfm'

declare namespace markdown {
  interface IHighlightOptions {
    readonly prefix?: string
    readonly subset?: boolean | Array<string>
    readonly ignoreMissing?: boolean
    readonly plainText?: Array<string>
    readonly aliases?: Record<string, Array<string>>
    readonly languages?: Record<string, Function>
  }

  interface IOptions {
    readonly runBefore?: Array<any>
    readonly cmark?: Partial<cmark.IOptions>
    readonly highlight?: IHighlightOptions
  }
}

declare function markdown(
  markdownString: string,
  opts?: markdown.IOptions
): Promise<string>

export = markdown
