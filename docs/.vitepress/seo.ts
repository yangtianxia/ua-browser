import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { HeadConfig, TransformContext } from 'vitepress'

/**
 * Per-page SEO head tags: canonical URL, hreflang alternates for the
 * English/Chinese mirror, and the Open Graph tags VitePress does not emit.
 *
 * hreflang is the reason this exists. The two locales are complete mirrors, so
 * without alternates a search engine sees two copies of every page competing
 * with no declared relationship between them.
 */

const SITE_URL = 'https://ua-browser.yangtianxia.dev'
const DOCS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * The page's URL. Directory-index pages keep a trailing slash, because that is
 * the form VitePress puts in the sitemap (`/api/`, `/zh/`) — a canonical that
 * disagrees with the sitemap advertises two URLs for one page.
 */
function toPath(page: string): string {
  const clean = page.replace(/\.md$/, '')
  if (clean === 'index') return '/'
  if (clean.endsWith('/index')) return `/${clean.slice(0, -'/index'.length)}/`
  return `/${clean}`
}

/** The same page in the other locale, or null when that file does not exist. */
function counterpart(page: string): string | null {
  const other = page.startsWith('zh/') ? page.slice('zh/'.length) : `zh/${page}`
  return existsSync(path.join(DOCS_DIR, other)) ? other : null
}

export function transformHead({ page, title, description }: TransformContext): HeadConfig[] {
  const isZh = page.startsWith('zh/')
  const url = toPath(page)
  const canonical = `${SITE_URL}${url}`
  const other = counterpart(page)

  const english = isZh ? (other === null ? null : toPath(other)) : url
  const chinese = isZh ? url : other === null ? null : toPath(other)

  const tags: HeadConfig[] = [['link', { rel: 'canonical', href: canonical }]]

  if (english) {
    tags.push(['link', { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}${english}` }])
    // x-default marks the version to serve when no language matches.
    tags.push(['link', { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}${english}` }])
  }
  if (chinese) tags.push(['link', { rel: 'alternate', hreflang: 'zh-CN', href: `${SITE_URL}${chinese}` }])

  tags.push(
    ['meta', { property: 'og:url', content: canonical }],
    ['meta', { property: 'og:locale', content: isZh ? 'zh_CN' : 'en_US' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
  )
  if (english && chinese) {
    tags.push(['meta', { property: 'og:locale:alternate', content: isZh ? 'en_US' : 'zh_CN' }])
  }
  if (existsSync(path.join(DOCS_DIR, 'public', OG_IMAGE_PATH))) {
    tags.push(['meta', { property: 'og:image', content: `${SITE_URL}${OG_IMAGE_PATH}` }])
    tags.push(['meta', { property: 'og:image:width', content: '1200' }])
    tags.push(['meta', { property: 'og:image:height', content: '630' }])
  }

  return tags
}

const OG_IMAGE_PATH = '/og-image.png'
